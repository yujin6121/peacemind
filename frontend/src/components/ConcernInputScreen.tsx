import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../services/api';

// ChatGPT 스타일 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background: #f7f7f8;
`;

// 헤더
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #666;
  transition: background-color 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
`;

const Status = styled.div`
  color: #10a37f;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '●';
    color: #10a37f;
  }
`;

// 감정 선택 영역
const EmotionSection = styled.div`
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
`;

const EmotionTitle = styled.h3`
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 12px 0;
  font-weight: 500;
`;

const EmotionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const EmotionChip = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.$selected ? '#10a37f' : '#e5e5e5'};
  background: ${props => props.$selected ? '#10a37f' : 'white'};
  color: ${props => props.$selected ? 'white' : '#2d3748'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #10a37f;
    ${props => !props.$selected && 'background: #f8f9fa;'}
  }
`;

// 메시지 영역
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Message = styled.div<{ $isUser?: boolean }>`
  display: flex;
  gap: 12px;
  ${props => props.$isUser ? 'flex-direction: row-reverse;' : ''}
`;

const Avatar = styled.div<{ $isUser?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  ${props => props.$isUser ? 
    'background: #10a37f; color: white;' : 
    'background: #f7f7f8; color: #2d3748; border: 1px solid #e5e5e5;'
  }
`;

const MessageContent = styled.div<{ $isUser?: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.5;
  ${props => props.$isUser ? 
    'background: #10a37f; color: white; border-bottom-right-radius: 4px;' : 
    'background: white; color: #2d3748; border: 1px solid #e5e5e5; border-bottom-left-radius: 4px;'
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 12px;
  font-weight: 600;
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
`;

const SuggestionChip = styled.button`
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.875rem;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    border-color: #d1d1d1;
  }
`;

// 입력 영역
const InputContainer = styled.div`
  padding: 20px;
  background: white;
  border-top: 1px solid #e5e5e5;
`;

const InputWrapper = styled.div`
  position: relative;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  padding: 12px 50px 12px 16px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #10a37f;
    box-shadow: 0 0 0 3px rgba(16, 163, 127, 0.1);
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
  background: transparent;
  max-height: 120px;
  min-height: 24px;

  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${props => props.disabled ? '#e5e5e5' : '#10a37f'};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #0d8968;
  }

  &:disabled {
    background: #e5e5e5;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  max-width: 70%;
  font-size: 0.95rem;
  color: #666;

  .dots {
    display: flex;
    gap: 4px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10a37f;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }

  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;

// 긴급 상담 버튼 스타일
const EmergencyAlert = styled.div`
  background: #ff4757;
  color: white;
  padding: 16px 20px;
  margin: 16px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
`;

const EmergencyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const EmergencyText = styled.p`
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const EmergencyButton = styled.a`
  display: inline-block;
  background: white;
  color: #ff4757;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
  }
`;

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Emotion {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

const emotions: Emotion[] = [
  { id: 'happy', name: '기쁨', emoji: '😊', color: '#FFD700' },
  { id: 'sad', name: '슬픔', emoji: '😢', color: '#6495ED' },
  { id: 'angry', name: '화남', emoji: '😡', color: '#FF6B6B' },
  { id: 'anxious', name: '불안', emoji: '😰', color: '#FFA500' },
  { id: 'stressed', name: '스트레스', emoji: '😫', color: '#8B4513' },
  { id: 'tired', name: '피곤', emoji: '😴', color: '#808080' },
  { id: 'confused', name: '혼란', emoji: '😵', color: '#9932CC' },
  { id: 'lonely', name: '외로움', emoji: '😔', color: '#4682B4' }
];

const ConcernInputScreen: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [showSuicideAlert, setShowSuicideAlert] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "최근에 스트레스를 받는 일이 있어요",
    "누군가와의 관계에서 고민이 있어요",
    "진로나 미래에 대해 걱정돼요",
    "기분이 계속 우울해요",
    "잠을 잘 못 자겠어요",
    "작은 일로도 불안해져요"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // 자동 높이 조절
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const selectedEmotionData = emotions.find(e => e.id === selectedEmotion);
    const emotionContext = selectedEmotionData 
      ? `현재 기분: ${selectedEmotionData.name} ${selectedEmotionData.emoji}\n\n` 
      : '';

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = emotionContext + input.trim();
    setInput('');
    setIsLoading(true);
    
    // 텍스트 영역 높이 리셋
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // 대화 히스토리 구성 (OpenRouter API 형식에 맞게)
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      // OpenRouter API 호출
      const apiResult = await apiService.sendChatMessage(
        currentInput, 
        conversationHistory, 
        selectedEmotion
      );
      
      // 자살 위험 감지 확인
      if (apiResult.suicide_risk) {
        setShowSuicideAlert(true);
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: apiResult.response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI 응답 오류:', error);
      
      // 오류 발생시 폴백 메시지
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "죄송합니다. 일시적으로 연결에 문제가 있어요. 잠시 후 다시 시도해주세요. 급한 상황이시라면 아래 전화번호로 직접 상담받으실 수 있어요.\n\n- 청소년 전화 1388\n- 정신건강위기 상담전화 1577-0199",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            ←
          </BackButton>
          <Title>🤗 마음돌봄 AI</Title>
        </HeaderLeft>
        <Status>온라인</Status>
      </Header>

      <EmotionSection>
        <EmotionTitle>지금 기분이 어떠신가요?</EmotionTitle>
        <EmotionGrid>
          {emotions.map((emotion) => (
            <EmotionChip
              key={emotion.id}
              $selected={selectedEmotion === emotion.id}
              onClick={() => setSelectedEmotion(emotion.id)}
            >
              <span>{emotion.emoji}</span>
              <span>{emotion.name}</span>
            </EmotionChip>
          ))}
        </EmotionGrid>
      </EmotionSection>

      {showSuicideAlert && (
        <EmergencyAlert>
          <EmergencyTitle>🚨 즉시 전문가의 도움이 필요해요</EmergencyTitle>
          <EmergencyText>
            지금 당신이 느끼는 고통이 얼마나 힘든지 알아요. 
            하지만 혼자 견디지 마세요. 전문가가 24시간 기다리고 있어요.
          </EmergencyText>
          <EmergencyButton href="tel:109">
            📞 자살예방상담전화 109에 전화걸기
          </EmergencyButton>
        </EmergencyAlert>
      )}

      <MessagesContainer>
        {messages.length === 0 ? (
          <WelcomeMessage>
            <WelcomeTitle>안녕하세요! 🤗</WelcomeTitle>
            <WelcomeText>
              저는 여러분의 마음을 돌보는 AI 상담사입니다.<br />
              어떤 이야기든 편하게 들려주세요.
            </WelcomeText>
            <SuggestionChips>
              {suggestions.map((suggestion, index) => (
                <SuggestionChip 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </SuggestionChip>
              ))}
            </SuggestionChips>
          </WelcomeMessage>
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message.id} $isUser={message.isUser}>
                <Avatar $isUser={message.isUser}>
                  {message.isUser ? '👤' : '🤗'}
                </Avatar>
                <MessageContent $isUser={message.isUser}>
                  {message.content}
                </MessageContent>
              </Message>
            ))}
            {isLoading && (
              <Message $isUser={false}>
                <Avatar $isUser={false}>🤗</Avatar>
                <TypingIndicator>
                  <span>상담사가 답변 중</span>
                  <div className="dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </TypingIndicator>
              </Message>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <TextInput
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            rows={1}
          />
          <SendButton 
            disabled={!input.trim() || isLoading}
            onClick={handleSend}
          >
            {isLoading ? '⋯' : '↑'}
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </Container>
  );
};

export default ConcernInputScreen;