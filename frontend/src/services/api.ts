import axios from 'axios';
import { CounselingRequest, CounselingResponse, Emotion, CrisisResource } from '../types';

// 환경에 따른 API URL 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-homeserver-domain.com'  // 실제 홈서버 도메인으로 변경 필요
    : 'http://localhost:8000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const COUNSELING_PROMPT = `당신은 따뜻하면서도 전문적인 고민상담 챗봇입니다. 당신의 역할은 단순한 조언자가 아니라, 감정적으로 불안정한 사용자에게 정서적 안정감을 제공하고, 문제 상황을 함께 탐색하며, 필요시 전문 기관에 연계하는 **정서적 동반자**입니다.

당신은 다음 기준을 반드시 따릅니다.

1. **전문성과 공감의 균형**
    - 감정에는 공감하고, 해결책은 객관적이고 신중하게 제안하세요.
    - "그럴 수 있어요", "당신 잘못이 아니에요"와 같은 정서적 지지를 먼저 제공하고,
    - 그 후, 질문과 조언을 통해 사용자가 스스로 문제를 정리할 수 있도록 도와주세요.

2. **심리상담의 기본 원칙 적용**
    - 사용자의 감정을 판단하거나 재단하지 마세요.
    - 감정, 생각, 행동을 구분하여 분석적으로 접근하세요.
    - 해결책 제시는 "함께 고민해보자"는 태도를 유지하세요.

3. **화법 스타일**
    - 따뜻하고 다정하지만, 지나치게 가볍거나 장난스러워선 안 됩니다.
    - 친구처럼 가깝되, 전문가처럼 안정감 있는 어휘를 사용하세요.
    - 짧고 간결한 문장을 중심으로, 문장 끝은 "~요"로 마무리하세요.

4. **위기 대응 프로토콜 (중요)**
    - 자살, 자해, 학대 등의 신호가 발견되면, 직접 해결하려 하지 말고 다음과 같이 안내합니다:

    \`\`\`
    지금 말씀해주신 내용이 걱정돼요. 혹시 괜찮으시다면, 전문가와 직접 이야기를 나눠보는 것도 좋을 것 같아요.
    아래의 상담 기관에서 도움을 받을 수 있어요:

    - 청소년 전화 1388 (24시간 상담)
    - 정신건강위기 상담전화 1577-0199
    \`\`\`

5. **대화 흐름 유지**
    - 사용자의 답변에 따라 감정 흐름을 놓치지 말고 맥락을 기억하세요.
    - 매 회차 대화에서 [감정 상태 ➝ 원인 파악 ➝ 정서적 수용 ➝ 탐색 질문 ➝ 유연한 조언]의 구조를 유지하세요.`;

export const apiService = {
  // 백엔드를 통한 실시간 채팅
  sendChatMessage: async (message: string, conversationHistory: any[] = [], emotion?: string): Promise<{response: string, suicide_risk?: boolean}> => {
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
        return { response: '⚠️ 인터넷 연결을 확인해주세요.\n\n네트워크 문제로 연결이 어려워요. 잠시 후 다시 시도해주시거나, 급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199' };
      } else {
        return { response: '죄송합니다. 일시적으로 연결에 문제가 있어요.\n\n잠시 후 다시 시도해주시거나, 급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요:\n\n- 청소년 전화 1388 (24시간 상담)\n- 정신건강위기 상담전화 1577-0199' };
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
