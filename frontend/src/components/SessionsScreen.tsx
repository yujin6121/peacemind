import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface SavedSession {
  id: string;
  startTime: string;
  emotions: string[];
  intensity: number;
  concern: string;
  response: any;
}

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #00cec9 0%, #55a3ff 100%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const SessionGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 2rem;
`;

const SessionCard = styled.div`
  background: rgba(255,255,255,0.9);
  padding: 25px;
  border-radius: 15px;
  color: #333;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.2);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const SessionDate = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
`;

const SessionEmotions = styled.div`
  display: flex;
  gap: 5px;
  
  .emotion {
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 15px;
    font-size: 0.8rem;
    color: #666;
  }
`;

const SessionContent = styled.div`
  margin-bottom: 1rem;
`;

const SessionConcern = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 1rem;
  line-height: 1.6;
  max-height: 100px;
  overflow: hidden;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(transparent, #f8f9fa);
  }
`;

const SessionResponse = styled.div`
  background: #e3f2fd;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #2196f3;
  line-height: 1.6;
  max-height: 100px;
  overflow: hidden;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(transparent, #e3f2fd);
  }
`;

const SessionActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'danger' ? `
    background: #ff6b6b;
    color: white;
    &:hover { background: #ff5252; }
  ` : `
    background: #4CAF50;
    color: white;
    &:hover { background: #45a049; }
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: white;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 25px;
  border-radius: 25px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background: white;
    color: #00cec9;
    &:hover { 
      background: #f1f2f6; 
      transform: translateY(-2px);
    }
  ` : `
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.5);
    &:hover { 
      background: rgba(255,255,255,0.3); 
      transform: translateY(-2px);
    }
  `}
`;

const SessionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const savedSessions = JSON.parse(localStorage.getItem('counselingSessions') || '[]');
    // 날짜순으로 정렬 (최신순)
    const sortedSessions = savedSessions.sort((a: SavedSession, b: SavedSession) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    setSessions(sortedSessions);
  };

  const deleteSession = (sessionId: string) => {
    if (window.confirm('이 상담 기록을 삭제하시겠습니까?')) {
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      setSessions(updatedSessions);
      localStorage.setItem('counselingSessions', JSON.stringify(updatedSessions));
    }
  };

  const viewSessionDetail = (session: SavedSession) => {
    // 세션 상세 보기 (모달이나 새 페이지)
    alert(`상세 보기 기능은 추후 구현될 예정입니다.\n\n날짜: ${new Date(session.startTime).toLocaleString()}\n감정: ${session.emotions.join(', ')}\n강도: ${session.intensity}/5`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      sad: '😢',
      angry: '😡',
      anxious: '😰',
      happy: '😊',
      fearful: '😨',
      stressed: '😩',
      tired: '😴',
      confused: '😕',
      warm: '🤗',
      depressed: '😔'
    };
    return emojiMap[emotion] || '😐';
  };

  const clearAllSessions = () => {
    if (window.confirm('모든 상담 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setSessions([]);
      localStorage.removeItem('counselingSessions');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  if (sessions.length === 0) {
    return (
      <Container>
        <Header>
          <Title>📚 상담 기록</Title>
          <Subtitle>저장된 상담 내용을 확인할 수 있습니다</Subtitle>
        </Header>

        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyText>아직 저장된 상담 기록이 없습니다.</EmptyText>
          <p>상담을 완료한 후 '상담 내용 저장' 버튼을 눌러<br />소중한 대화를 기록해보세요.</p>
        </EmptyState>

        <ButtonContainer>
          <Button variant="secondary" onClick={handleBack}>
            이전으로
          </Button>
          <Button variant="primary" onClick={handleHome}>
            상담 시작하기
          </Button>
        </ButtonContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📚 상담 기록</Title>
        <Subtitle>총 {sessions.length}개의 상담 기록이 있습니다</Subtitle>
      </Header>

      <SessionGrid>
        {sessions.map((session) => (
          <SessionCard key={session.id}>
            <SessionHeader>
              <SessionDate>{formatDate(session.startTime)}</SessionDate>
              <SessionEmotions>
                {session.emotions.map((emotion, index) => (
                  <span key={index} className="emotion">
                    {getEmotionEmoji(emotion)} {emotion}
                  </span>
                ))}
              </SessionEmotions>
            </SessionHeader>

            <SessionContent>
              <h4>고민 내용:</h4>
              <SessionConcern>
                {session.concern}
              </SessionConcern>

              <h4>AI 상담사 응답:</h4>
              <SessionResponse>
                {session.response?.response || '응답 없음'}
              </SessionResponse>
            </SessionContent>

            <SessionActions>
              <ActionButton onClick={() => viewSessionDetail(session)}>
                상세보기
              </ActionButton>
              <ActionButton 
                variant="danger" 
                onClick={() => deleteSession(session.id)}
              >
                삭제
              </ActionButton>
            </SessionActions>
          </SessionCard>
        ))}
      </SessionGrid>

      <ButtonContainer>
        <Button variant="secondary" onClick={handleBack}>
          이전으로
        </Button>
        <Button variant="secondary" onClick={clearAllSessions}>
          모든 기록 삭제
        </Button>
        <Button variant="primary" onClick={handleHome}>
          새 상담 시작
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default SessionsScreen;
