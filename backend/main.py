# -*- coding: utf-8 -*-
import os
import sys

# 환경 변수 설정으로 인코딩 문제 해결
os.environ['PYTHONIOENCODING'] = 'utf-8'
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
from dotenv import load_dotenv
import json
import re
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO, encoding='utf-8')
logger = logging.getLogger(__name__)

load_dotenv()

# OpenRouter API 키 설정
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "sk-or-v1-f6b0a4b0d3e8c9a7b2f1e4d3c6a9b8e5f2d1c7a4b9e8f3d6c2a5b1e7f4d8c3a6b9")

app = FastAPI(title="AI Counseling API", version="1.0.0")

# CORS 설정 - 배포 환경 고려
allowed_origins = [
    "http://localhost:3000",  # 로컬 개발
    "https://your-username.github.io",  # GitHub Pages (실제 URL로 변경 필요)
]

# 환경변수에서 추가 origin 허용
if os.getenv("ALLOWED_ORIGINS"):
    additional_origins = os.getenv("ALLOWED_ORIGINS").split(",")
    allowed_origins.extend(additional_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 모델들
class EmotionCheck(BaseModel):
    emotions: List[str]
    intensity: int  # 1-5 스케일

class CounselingRequest(BaseModel):
    concern: str
    emotions: List[str]
    intensity: int

class CounselingResponse(BaseModel):
    response: str
    emotion_analysis: dict
    crisis_detected: bool
    crisis_level: str
    recommendations: List[str]

class ChatSession(BaseModel):
    session_id: str
    messages: List[dict]
    emotion_history: List[dict]
    crisis_alerts: List[dict]

# 위기 키워드 목록
CRISIS_KEYWORDS = [
    "자살", "죽고싶다", "자해", "죽음", "끝내고싶다", 
    "살기싫다", "괴롭다", "혼자", "절망", "포기",
    "상처", "아프다", "견딜수없다", "힘들다"
]

# 자살 위험 고위험 키워드
SUICIDE_KEYWORDS = [
    "자살", "죽고싶다", "자해", "죽음", "끝내고싶다",
    "살기싫다", "목매달", "뛰어내리", "자살하고싶", "죽어버리고싶"
]

# 감정 분석 함수
def analyze_emotion(text: str) -> dict:
    """텍스트에서 감정을 분석합니다."""
    emotions = {
        "sadness": 0,
        "anger": 0,
        "anxiety": 0,
        "happiness": 0,
        "fear": 0,
        "stress": 0
    }
    
    # 간단한 키워드 기반 감정 분석
    sad_keywords = ["슬프", "우울", "눈물", "마음아프", "쓸쓸", "외로"]
    anger_keywords = ["화나", "짜증", "분노", "억울", "약오르", "열받"]
    anxiety_keywords = ["불안", "걱정", "긴장", "두려", "떨림", "초조"]
    happy_keywords = ["행복", "기쁘", "즐거", "웃음", "사랑", "감사"]
    fear_keywords = ["무서", "두려", "공포", "겁", "놀라", "위험"]
    stress_keywords = ["스트레스", "압박", "부담", "피곤", "지침", "힘들"]
    
    for keyword in sad_keywords:
        if keyword in text:
            emotions["sadness"] += 1
    for keyword in anger_keywords:
        if keyword in text:
            emotions["anger"] += 1
    for keyword in anxiety_keywords:
        if keyword in text:
            emotions["anxiety"] += 1
    for keyword in happy_keywords:
        if keyword in text:
            emotions["happiness"] += 1
    for keyword in fear_keywords:
        if keyword in text:
            emotions["fear"] += 1
    for keyword in stress_keywords:
        if keyword in text:
            emotions["stress"] += 1
    
    # 정규화
    total_emotions = sum(emotions.values())
    if total_emotions > 0:
        for emotion in emotions:
            emotions[emotion] = emotions[emotion] / total_emotions
    
    return emotions

# 위기 감지 함수
def detect_crisis(text: str) -> tuple[bool, str, bool]:
    """위기 상황을 감지합니다. 반환값: (위기감지여부, 위기레벨, 자살위험여부)"""
    crisis_count = 0
    detected_keywords = []
    suicide_risk = False
    
    # 자살 위험 키워드 확인
    for keyword in SUICIDE_KEYWORDS:
        if keyword in text:
            suicide_risk = True
            break
    
    # 일반 위기 키워드 확인
    for keyword in CRISIS_KEYWORDS:
        if keyword in text:
            crisis_count += 1
            detected_keywords.append(keyword)
    
    if suicide_risk:
        return True, "critical", True
    elif crisis_count >= 3:
        return True, "high", False
    elif crisis_count >= 1:
        return True, "medium", False
    else:
        return False, "low", False

# OpenRouter API 호출
async def call_openrouter_api(messages: List[dict]) -> str:
    """OpenRouter API 호출"""
    try:
        url = "https://openrouter.ai/api/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json; charset=utf-8",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Counseling App",
        }
        
        # 데이터를 먼저 딕셔너리로 구성하고 로깅
        data = {
            "model": "openai/gpt-3.5-turbo",  # 무료 모델 변경
            "messages": messages,
            "max_tokens": 200,
            "temperature": 0.7,
            "stream": False
        }
        
        logger.info(f"OpenRouter 요청 데이터: {data}")
        
        # httpx 클라이언트로 UTF-8 인코딩 명시
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=headers,
                json=data,  # json 파라미터 사용
                timeout=30.0
            )
            
            logger.info(f"OpenRouter 응답 상태: {response.status_code}")
            logger.info(f"OpenRouter 응답 헤더: {dict(response.headers)}")
            
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"OpenRouter API 오류 응답: {error_text}")
                raise HTTPException(status_code=response.status_code, detail=f"OpenRouter API 오류: {error_text}")
            
            result = response.json()
            logger.info(f"OpenRouter 응답 JSON: {result}")
            
            if 'choices' not in result or not result['choices']:
                logger.error("OpenRouter 응답에 choices가 없음")
                raise HTTPException(status_code=500, detail="OpenRouter 응답 형식 오류")
                
            return result['choices'][0]['message']['content'].strip()
            
    except httpx.TimeoutException:
        logger.error("OpenRouter API 타임아웃")
        raise HTTPException(status_code=504, detail="API 응답 시간 초과")
    except Exception as e:
        logger.error(f"OpenRouter API 호출 실패: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"AI 응답 생성 실패: {str(e)}")

# API 엔드포인트들
@app.get("/")
async def root():
    return {"message": "AI Counseling API is running"}

@app.post("/api/counseling/chat", response_model=CounselingResponse)
async def chat_counseling(request: CounselingRequest):
    """심리상담 채팅 API"""
    try:
        # 사용자 메시지 구성
        user_message = f"현재 감정: {', '.join(request.emotions)} (강도: {request.intensity}/5)\n고민: {request.concern}"
        
        messages = [
            {"role": "user", "content": user_message}
        ]
        
        # AI 응답 생성
        ai_response = await call_openrouter_api(messages)
        
        # 감정 분석
        emotion_analysis = analyze_emotion(request.concern)
        
        # 위기 감지
        crisis_detected, crisis_level = detect_crisis(request.concern)
        
        # 추천 사항 생성
        recommendations = []
        if crisis_detected:
            recommendations.extend([
                "전문 상담사와의 상담을 권합니다",
                "가까운 정신건강센터에 연락해보세요",
                "생명의전화 (1393)로 연락하세요"
            ])
        else:
            recommendations.extend([
                "규칙적인 운동을 해보세요",
                "충분한 수면을 취하세요",
                "신뢰할 수 있는 사람과 대화해보세요"
            ])
        
        return CounselingResponse(
            response=ai_response,
            emotion_analysis=emotion_analysis,
            crisis_detected=crisis_detected,
            crisis_level=crisis_level,
            recommendations=recommendations
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []
    emotion: Optional[str] = None  # 선택된 감정 ID

class ChatResponse(BaseModel):
    response: str
    crisis_detected: bool = False
    suicide_risk: bool = False  # 자살 위험 플래그 추가

@app.post("/api/chat", response_model=ChatResponse)
async def chat_realtime(request: ChatMessage):
    """실시간 채팅 API - 프론트엔드에서 직접 호출"""
    try:
        logger.info(f"채팅 요청 받음: {request.message[:50]}...")
        if request.emotion:
            logger.info(f"선택된 감정: {request.emotion}")
        
        # OpenRouter API 호출 시도
        try:
            # 감정 정보를 포함한 상황별 프롬프트 구성
            emotion_context = ""
            if request.emotion:
                emotion_names = {
                    'happy': '기쁨', 'sad': '슬픔', 'angry': '화남', 'anxious': '불안',
                    'stressed': '스트레스', 'tired': '피곤', 'confused': '혼란', 'lonely': '외로움'
                }
                emotion_name = emotion_names.get(request.emotion, request.emotion)
                emotion_context = f"User is currently feeling {emotion_name}. "
            
            # 영어로 간단하게 변환된 메시지 구성
            simple_messages = [
                {"role": "user", "content": f"{emotion_context}User is expressing concerns and needs emotional support. Please respond warmly and empathetically in Korean."}
            ]
            
            logger.info("OpenRouter API 호출 시도 중...")
            ai_response = await call_openrouter_api(simple_messages)
            logger.info(f"OpenRouter 응답 성공: {ai_response[:50]}...")
            
        except Exception as api_error:
            logger.error(f"OpenRouter API 오류: {api_error}")
            # API 실패시 감정별 폴백 응답
            emotion_responses = {
                'sad': [
                    "마음이 많이 아프시겠어요. 슬픈 마음을 혼자 견디기 어려우셨을 거예요.",
                    "힘든 감정을 표현해주셔서 고맙습니다. 천천히 이야기해주세요."
                ],
                'angry': [
                    "화가 나는 상황이셨군요. 그런 기분이 충분히 이해됩니다.",
                    "분노는 자연스러운 감정이에요. 무엇이 가장 속상하셨나요?"
                ],
                'anxious': [
                    "불안한 마음이 많이 힘드시겠어요. 어떤 것이 가장 걱정되시나요?",
                    "불안감을 느끼고 계시는군요. 함께 차근차근 이야기해봐요."
                ],
                'stressed': [
                    "스트레스가 많이 쌓이셨나봐요. 어떤 일들이 부담되시나요?",
                    "힘든 시간을 보내고 계시는군요. 무엇이 가장 스트레스가 되시나요?"
                ],
                'lonely': [
                    "외로운 마음이 많이 힘드시겠어요. 혼자라는 느낌이 든다는 게 얼마나 어려운지 알아요.",
                    "외로움을 느끼고 계시는군요. 지금 어떤 기분인지 더 들려주세요."
                ]
            }
            
            default_responses = [
                "안녕하세요! 힘든 마음을 표현해주셔서 고맙습니다. 좀 더 자세히 들려주세요.",
                "그런 기분이 드시는군요. 언제부터 그런 느낌이 있으셨나요?",
                "충분히 이해할 수 있는 마음이에요. 혼자 견디기 어려우셨을 거예요.",
                "지금 마음이 많이 힘드시겠어요. 어떤 것이 가장 걱정되시나요?",
                "천천히 말씀해주세요. 제가 들어드리겠습니다."
            ]
            
            import random
            if request.emotion and request.emotion in emotion_responses:
                ai_response = random.choice(emotion_responses[request.emotion])
            else:
                ai_response = random.choice(default_responses)
            logger.info(f"감정별 폴백 응답 사용: {ai_response}")
        
        # 위기 상황 감지
        crisis_detected, crisis_level, suicide_risk = detect_crisis(request.message)
        logger.info(f"위기 감지: {crisis_detected}, 레벨: {crisis_level}, 자살위험: {suicide_risk}")
        
        return ChatResponse(
            response=ai_response,
            crisis_detected=crisis_detected,
            suicide_risk=suicide_risk
        )
        
    except HTTPException as e:
        logger.error(f"HTTP 예외: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"채팅 처리 중 예외 발생: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"채팅 처리 중 오류가 발생했습니다: {str(e)}")

@app.get("/api/emotions")
async def get_emotions():
    """사용 가능한 감정 목록을 반환합니다."""
    emotions = [
        {"emoji": "😢", "name": "슬픔", "value": "sad"},
        {"emoji": "😡", "name": "화남", "value": "angry"},
        {"emoji": "😰", "name": "불안", "value": "anxious"},
        {"emoji": "😊", "name": "기쁨", "value": "happy"},
        {"emoji": "😨", "name": "두려움", "value": "fearful"},
        {"emoji": "😩", "name": "스트레스", "value": "stressed"},
        {"emoji": "😴", "name": "피곤함", "value": "tired"},
        {"emoji": "😕", "name": "혼란", "value": "confused"},
        {"emoji": "🤗", "name": "따뜻함", "value": "warm"},
        {"emoji": "😔", "name": "우울함", "value": "depressed"}
    ]
    return emotions

@app.get("/api/crisis-resources")
async def get_crisis_resources():
    """위기 상황 도움 리소스를 반환합니다."""
    resources = [
        {
            "name": "생명의전화",
            "phone": "1393",
            "description": "24시간 자살예방 상담"
        },
        {
            "name": "정신건강위기상담전화",
            "phone": "1577-0199",
            "description": "24시간 정신건강 위기상담"
        },
        {
            "name": "청소년전화",
            "phone": "1388",
            "description": "청소년 상담 전화"
        },
        {
            "name": "한국자살예방협회",
            "phone": "02-413-0892",
            "description": "자살예방 상담 및 교육"
        }
    ]
    return resources

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
