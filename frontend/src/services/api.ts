import axios from 'axios';
import { CounselingRequest, CounselingResponse, Emotion, CrisisResource } from '../types';

// 환경에 따른 API URL 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://s3.yujin6121.xyz'  // 실제 백엔드 서버 URL (포트 4000이면 :4000 추가 필요)
    : 'http://localhost:4000');  // 로컬에서도 4000 포트 사용

// 백엔드 사용 가능 여부 확인
const USE_BACKEND = process.env.REACT_APP_USE_BACKEND === 'true';  // 명시적으로 true일 때만 백엔드 사용

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,  // 10초 타임아웃 추가
});

// 모킹 응답 함수
const getMockResponse = (message: string, emotion?: string): {response: string, suicide_risk?: boolean} => {
  const responses = [
    "안녕하세요. 오늘 어떤 일로 힘들어하고 계신지 들려주세요. 함께 이야기해보아요.",
    "그런 감정을 느끼는 것은 자연스러운 일이에요. 자세히 말씀해주시겠어요?",
    "정말 힘드셨겠어요. 그런 상황에서 이렇게 용기 내어 이야기해주셔서 고마워요.",
    "지금 말씀해주신 것들을 정리해보면서, 어떤 부분이 가장 마음에 걸리시는지 함께 생각해볼까요?",
    "스스로를 너무 비난하지 마세요. 완벽한 사람은 없으니까요. 작은 걸음부터 시작해보면 어떨까요?"
  ];
  
  // 감정에 따른 응답 조정
  if (emotion === '화남' || emotion === '분노') {
    return {
      response: "화가 나는 마음, 충분히 이해해요. 그 분노의 뒤에는 어떤 상처나 실망이 있을 것 같아요. 천천히 말씀해주세요.",
      suicide_risk: false
    };
  }
  
  if (emotion === '슬픔' || emotion === '우울') {
    return {
      response: "마음이 많이 아프시겠어요. 슬픈 감정도 소중한 감정이에요. 지금 가장 힘든 부분이 무엇인지 이야기해주실 수 있나요?",
      suicide_risk: false
    };
  }

  // 위험 키워드 감지
  const dangerKeywords = ['죽고', '자살', '죽음', '끝내고', '사라지고', '없어지고'];
  const hasDangerKeyword = dangerKeywords.some(keyword => message.includes(keyword));
  
  if (hasDangerKeyword) {
    return {
      response: "지금 많이 힘드신 것 같아요. 혼자서 감당하기 어려운 마음이 드실 수 있어요. 전문가의 도움을 받아보시는 것은 어떨까요? 생명의전화 1588-9191이나 청소년전화 1388에서 24시간 상담을 받을 수 있어요.",
      suicide_risk: true
    };
  }
  
  return {
    response: responses[Math.floor(Math.random() * responses.length)],
    suicide_risk: false
  };
};

export const apiService = {
  // 백엔드를 통한 실시간 채팅
  sendChatMessage: async (message: string, conversationHistory: any[] = [], emotion?: string): Promise<{response: string, suicide_risk?: boolean}> => {
    // 백엔드를 사용하지 않는 경우 모킹 응답 반환
    if (!USE_BACKEND) {
      console.log('백엔드 비활성화 모드: 모킹 응답 사용');
      // 실제 서버 응답처럼 약간의 지연 추가
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getMockResponse(message, emotion);
    }

    try {
      const requestData: any = {
        message: message,
        conversation_history: conversationHistory
      };

      if (emotion) {
        requestData.emotion = emotion;
      }

      const response = await api.post('/api/chat', requestData);

      return {
        response: response.data.response,
        suicide_risk: response.data.suicide_risk
      };
    } catch (error: any) {
      console.error('백엔드 API 호출 오류:', error);
      
      // 구체적인 오류 메시지
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.detail || '알 수 없는 오류';
        
        if (status === 401) {
          return { response: '⚠️ API 키 설정에 문제가 있어요.\n\n현재 AI 상담사와 연결할 수 없지만, 언제든지 아래 전문 상담 기관으로 연락주세요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199' };
        } else if (status === 429) {
          return { response: '⚠️ 현재 많은 분들이 상담을 요청하고 있어요.\n\n잠시 후 다시 시도해주시거나, 급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199' };
        } else if (status === 504) {
          return { response: '⚠️ AI 응답 시간이 초과되었어요.\n\n잠시 후 다시 시도해주시거나, 급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199' };
        } else {
          return { response: `⚠️ 서버 오류가 발생했어요: ${message}\n\n급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199` };
        }
      } else if (error.request) {
        // CORS 오류나 네트워크 오류
        console.log('CORS 또는 네트워크 오류:', error);
        return { 
          response: '⚠️ 서버 연결에 문제가 있어요.\n\nCORS 정책 또는 네트워크 문제로 백엔드 서버에 연결할 수 없습니다.\n\n잠시 후 다시 시도해주시거나, 급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199' 
        };
      } else {
        // 기타 오류
        console.log('요청 설정 오류:', error);
        return { 
          response: '⚠️ 일시적인 오류가 발생했어요.\n\n잠시 후 다시 시도해주시거나, 급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199' 
        };
      }
    }
  },

  // 기존 API들
  sendCounselingMessage: async (request: CounselingRequest): Promise<CounselingResponse> => {
    const response = await api.post('/api/counseling/chat', request);
    return response.data;
  },

  getEmotions: async (): Promise<Emotion[]> => {
    const response = await api.get('/api/emotions');
    return response.data;
  },

  getCrisisResources: async (): Promise<CrisisResource[]> => {
    const response = await api.get('/api/crisis-resources');
    return response.data;
  },
};

export default apiService;
