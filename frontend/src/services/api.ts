import axios from 'axios';
import { CounselingRequest, CounselingResponse, Emotion, CrisisResource } from '../types';

// 환경에 따른 API URL 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://s3.yujin6121.xyz'  // 실제 홈서버 도메인으로 변경 필요
    : 'http://localhost:8000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
