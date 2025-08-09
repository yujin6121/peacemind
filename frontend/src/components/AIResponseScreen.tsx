import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { CounselingResponse } from '../types';
import { apiService } from '../services/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const LoadingSubtext = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ResponseContainer = styled.div`
  animation: ${fadeIn} 0.8s ease-out;
`;

const AIResponseBox = styled.div`
  background: rgba(255,255,255,0.95);
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 2rem;
  color: #333;
  line-height: 1.8;
  font-size: 1.1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const AIAvatar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  .avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #74b9ff, #0984e3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  
  .name {
    font-weight: bold;
    color: #333;
  }
`;

const CrisisAlert = styled.div`
  background: #ff6b6b;
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 2rem;
  animation: ${pulse} 2s infinite;
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
  }
  
  p {
    margin: 0.5rem 0;
    line-height: 1.6;
  }
`;

const AnalysisSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AnalysisBox = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  color: white;
`;

const AnalysisTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const EmotionBar = styled.div<{ emotion: string; value: number }>`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  
  .emotion-name {
    width: 80px;
    font-size: 0.9rem;
  }
  
  .bar-container {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.3);
    border-radius: 4px;
    margin: 0 10px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    width: ${props => props.value * 100}%;
    background: ${props => getEmotionColor(props.emotion)};
    border-radius: 4px;
    transition: width 0.8s ease-out;
  }
  
  .percentage {
    width: 40px;
    text-align: right;
    font-size: 0.8rem;
  }
`;

const getEmotionColor = (emotion: string) => {
  const colors: { [key: string]: string } = {
    sadness: '#74b9ff',
    anger: '#fd79a8',
    anxiety: '#fdcb6e',
    happiness: '#55efc4',
    fear: '#e17055',
    stress: '#a29bfe'
  };
  return colors[emotion] || '#ddd';
};

const getEmotionName = (emotion: string) => {
  const names: { [key: string]: string } = {
    sadness: '슬픔',
    anger: '분노',
    anxiety: '불안',
    happiness: '기쁨',
    fear: '두려움',
    stress: '스트레스'
  };
  return names[emotion] || emotion;
};

const RecommendationList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 25px;
  border-radius: 25px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background: #4CAF50;
          color: white;
          &:hover { background: #45a049; }
        `;
      case 'danger':
        return `
          background: #ff6b6b;
          color: white;
          &:hover { background: #ff5252; }
        `;
      default:
        return `
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.5);
          &:hover { background: rgba(255,255,255,0.3); }
        `;
    }
  }}
`;

const AIResponseScreen: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<CounselingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleAIResponse();
  }, []);

  const handleAIResponse = async () => {
    try {
      // 로컬 스토리지에서 데이터 가져오기
      const emotions = JSON.parse(localStorage.getItem('currentEmotions') || '[]');
      const intensity = parseInt(localStorage.getItem('currentIntensity') || '3');
      const concern = localStorage.getItem('currentConcern') || '';

      if (!concern || emotions.length === 0) {
        throw new Error('필요한 정보가 누락되었습니다.');
      }

      const counselingResponse = await apiService.sendCounselingMessage({
        concern,
        emotions,
        intensity
      });

      setResponse(counselingResponse);
      
      // 응답을 로컬 스토리지에 저장
      localStorage.setItem('lastResponse', JSON.stringify(counselingResponse));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = () => {
    // 세션 저장 로직
    const sessionData = {
      id: Date.now().toString(),
      startTime: new Date(),
      emotions: JSON.parse(localStorage.getItem('currentEmotions') || '[]'),
      intensity: parseInt(localStorage.getItem('currentIntensity') || '3'),
      concern: localStorage.getItem('currentConcern') || '',
      response: response
    };
    
    const savedSessions = JSON.parse(localStorage.getItem('counselingSessions') || '[]');
    savedSessions.push(sessionData);
    localStorage.setItem('counselingSessions', JSON.stringify(savedSessions));
    
    alert('상담 내용이 저장되었습니다.');
  };

  const handleViewCrisisResources = () => {
    navigate('/crisis-resources');
  };

  const handleStartNew = () => {
    // 현재 세션 데이터 클리어
    localStorage.removeItem('currentEmotions');
    localStorage.removeItem('currentIntensity');
    localStorage.removeItem('currentConcern');
    localStorage.removeItem('lastResponse');
    
    navigate('/');
  };

  const handleViewSessions = () => {
    navigate('/sessions');
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>🤖 AI 상담사</Title>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>AI 상담사가 응답을 준비하고 있습니다...</LoadingText>
          <LoadingSubtext>조금만 기다려주세요. 곧 따뜻한 답변을 들려드릴게요.</LoadingSubtext>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>😔 오류 발생</Title>
        </Header>
        <AIResponseBox>
          <p>죄송합니다. 오류가 발생했습니다: {error}</p>
          <p>잠시 후 다시 시도해주세요.</p>
        </AIResponseBox>
        <ButtonContainer>
          <Button onClick={() => navigate('/')}>처음으로</Button>
        </ButtonContainer>
      </Container>
    );
  }

  if (!response) return null;

  return (
    <Container>
      <Header>
        <Title>🤖 AI 상담사</Title>
      </Header>

      <ResponseContainer>
        {response.crisis_detected && (
          <CrisisAlert>
            <h3>⚠️ 중요한 알림</h3>
            <p>
              지금 많이 힘드신 것 같습니다. 혼자서 감당하기 어려운 상황일 때는 
              전문가의 도움을 받는 것이 중요합니다.
            </p>
            <p>
              아래 위기상황 지원 버튼을 클릭하여 즉시 도움을 받을 수 있는 
              연락처를 확인하세요.
            </p>
          </CrisisAlert>
        )}

        <AIResponseBox>
          <AIAvatar>
            <div className="avatar">🤗</div>
            <div className="name">마음돌봄 AI 상담사</div>
          </AIAvatar>
          <div>{response.response}</div>
        </AIResponseBox>

        <AnalysisSection>
          <AnalysisBox>
            <AnalysisTitle>📊 감정 분석</AnalysisTitle>
            {Object.entries(response.emotion_analysis).map(([emotion, value]) => (
              <EmotionBar key={emotion} emotion={emotion} value={value as number}>
                <span className="emotion-name">{getEmotionName(emotion)}</span>
                <div className="bar-container">
                  <div className="bar-fill"></div>
                </div>
                <span className="percentage">{Math.round((value as number) * 100)}%</span>
              </EmotionBar>
            ))}
          </AnalysisBox>

          <AnalysisBox>
            <AnalysisTitle>💡 추천 사항</AnalysisTitle>
            <RecommendationList>
              {response.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </RecommendationList>
          </AnalysisBox>
        </AnalysisSection>

        <ButtonContainer>
          {response.crisis_detected && (
            <Button variant="danger" onClick={handleViewCrisisResources}>
              위기상황 지원
            </Button>
          )}
          <Button onClick={handleSaveSession}>
            상담 내용 저장
          </Button>
          <Button onClick={handleViewSessions}>
            이전 상담 보기
          </Button>
          <Button variant="primary" onClick={handleStartNew}>
            새로운 상담
          </Button>
        </ButtonContainer>
      </ResponseContainer>
    </Container>
  );
};

export default AIResponseScreen;
