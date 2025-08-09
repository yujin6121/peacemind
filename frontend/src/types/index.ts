export interface Emotion {
  emoji: string;
  name: string;
  value: string;
}

export interface EmotionCheck {
  emotions: string[];
  intensity: number;
}

export interface CounselingRequest {
  concern: string;
  emotions: string[];
  intensity: number;
}

export interface CounselingResponse {
  response: string;
  emotion_analysis: {
    [key: string]: number;
  };
  crisis_detected: boolean;
  crisis_level: string;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  emotions?: string[];
}

export interface CrisisResource {
  name: string;
  phone: string;
  description: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  startTime: Date;
  endTime?: Date;
  emotionHistory: EmotionCheck[];
  crisisAlerts: any[];
}
