import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 1.2rem;
  margin-bottom: 3rem;
  max-width: 600px;
  line-height: 1.6;
`;

const StartButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: 2px solid white;
  color: white;
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
`;

const FeatureList = styled.ul`
  color: rgba(255,255,255,0.8);
  text-align: left;
  margin: 2rem 0;
  list-style: none;
  padding: 0;

  li {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #4CAF50;
      font-weight: bold;
    }
  }
`;

const Privacy = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  
  h3 {
    color: white;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: rgba(255,255,255,0.8);
    font-size: 0.9rem;
    margin: 0;
  }
`;

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/concern-input');
  };

  return (
    <Container>
      <Title>🤗 마음돌봄</Title>
      <Subtitle>
        익명으로 안전하게 마음을 나누세요.<br />
        AI 상담사가 당신의 이야기를 들어드립니다.
      </Subtitle>
      
      <FeatureList>
        <li>완전 익명 상담 (로그인 불필요)</li>
        <li>24시간 언제든지 이용 가능</li>
        <li>감정 분석 및 맞춤 조언</li>
        <li>위기 상황 감지 및 전문가 연결</li>
        <li>상담 기록 저장 및 관리</li>
      </FeatureList>

      <StartButton onClick={handleStart}>
        상담 시작하기
      </StartButton>

      <Privacy>
        <h3>🔒 개인정보 보호</h3>
        <p>
          모든 대화는 익명으로 처리되며, 개인 식별 정보는 수집하지 않습니다.<br />
          상담 내용은 안전하게 보호되며, 사용자가 원할 때만 저장됩니다.
        </p>
      </Privacy>
    </Container>
  );
};

export default HomeScreen;
