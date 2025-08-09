import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Emotion } from '../types';
import { apiService } from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
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
  margin-bottom: 2rem;
`;

const EmotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 2rem;
`;

const EmotionButton = styled.button<{ selected: boolean }>`
  background: ${props => props.selected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'};
  border: 2px solid ${props => props.selected ? '#4CAF50' : 'rgba(255,255,255,0.5)'};
  color: ${props => props.selected ? '#333' : 'white'};
  padding: 15px 10px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  .emoji {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .name {
    font-size: 0.9rem;
    font-weight: 500;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;

const IntensitySection = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
`;

const IntensityTitle = styled.h3`
  color: white;
  text-align: center;
  margin-bottom: 1rem;
`;

const IntensitySlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: rgba(255,255,255,0.3);
  outline: none;
  margin-bottom: 1rem;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
`;

const IntensityLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255,255,255,0.8);
  font-size: 0.8rem;
`;

const IntensityValue = styled.div`
  text-align: center;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 30px;
  border-radius: 25px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background: #4CAF50;
    color: white;
    &:hover { background: #45a049; }
  ` : `
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.5);
    &:hover { background: rgba(255,255,255,0.3); }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmotionCheckScreen: React.FC = () => {
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number>(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      const emotionList = await apiService.getEmotions();
      setEmotions(emotionList);
    } catch (error) {
      console.error('감정 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmotion = (emotionValue: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionValue)
        ? prev.filter(e => e !== emotionValue)
        : [...prev, emotionValue]
    );
  };

  const handleNext = () => {
    if (selectedEmotions.length === 0) {
      alert('최소 하나의 감정을 선택해주세요.');
      return;
    }
    
    // 선택된 감정과 강도를 로컬 스토리지에 저장
    localStorage.setItem('currentEmotions', JSON.stringify(selectedEmotions));
    localStorage.setItem('currentIntensity', intensity.toString());
    
    navigate('/concern-input');
  };

  const handleBack = () => {
    navigate('/');
  };

  const getIntensityText = (value: number) => {
    const texts = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
    return texts[value - 1];
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>로딩중...</Title>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>😊 감정 체크</Title>
        <Subtitle>
          지금 느끼고 있는 감정을 선택해주세요.<br />
          여러 개를 선택하실 수 있습니다.
        </Subtitle>
      </Header>

      <EmotionGrid>
        {emotions.map((emotion) => (
          <EmotionButton
            key={emotion.value}
            selected={selectedEmotions.includes(emotion.value)}
            onClick={() => toggleEmotion(emotion.value)}
          >
            <span className="emoji">{emotion.emoji}</span>
            <span className="name">{emotion.name}</span>
          </EmotionButton>
        ))}
      </EmotionGrid>

      <IntensitySection>
        <IntensityTitle>감정의 강도를 알려주세요</IntensityTitle>
        <IntensitySlider
          type="range"
          min="1"
          max="5"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
        />
        <IntensityLabels>
          <span>매우 약함</span>
          <span>약함</span>
          <span>보통</span>
          <span>강함</span>
          <span>매우 강함</span>
        </IntensityLabels>
        <IntensityValue>
          {intensity}/5 - {getIntensityText(intensity)}
        </IntensityValue>
      </IntensitySection>

      <ButtonContainer>
        <Button variant="secondary" onClick={handleBack}>
          이전
        </Button>
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={selectedEmotions.length === 0}
        >
          다음
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default EmotionCheckScreen;
