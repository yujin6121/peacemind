import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CrisisResource } from '../types';
import { apiService } from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
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
  line-height: 1.6;
`;

const EmergencyBox = styled.div`
  background: rgba(255,255,255,0.95);
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const EmergencyTitle = styled.h2`
  color: #ff4757;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const EmergencyText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const EmergencyNumber = styled.a`
  display: inline-block;
  background: #ff4757;
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 10px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff3742;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(255,71,87,0.3);
  }
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 3rem;
`;

const ResourceCard = styled.div`
  background: rgba(255,255,255,0.9);
  padding: 25px;
  border-radius: 15px;
  color: #333;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ResourceName = styled.h3`
  color: #ff4757;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const ResourcePhone = styled.a`
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 1rem;
  padding: 10px;
  background: #f1f2f6;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: #ff4757;
    color: white;
  }
`;

const ResourceDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  color: #555;
`;

const SupportSection = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  color: white;
`;

const SupportTitle = styled.h3`
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  text-align: center;
`;

const SupportList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    margin-bottom: 1rem;
    padding: 15px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    line-height: 1.6;
    
    &:before {
      content: '💙';
      margin-right: 10px;
    }
  }
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
    color: #ff4757;
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

const CrisisResourcesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<CrisisResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrisisResources();
  }, []);

  const loadCrisisResources = async () => {
    try {
      const resourceList = await apiService.getCrisisResources();
      setResources(resourceList);
    } catch (error) {
      console.error('위기 지원 리소스 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
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
        <Title>🆘 위기상황 지원</Title>
        <Subtitle>
          지금 당장 도움이 필요하다면, 혼자 견디려 하지 마세요.<br />
          전문가들이 24시간 당신을 기다리고 있습니다.
        </Subtitle>
      </Header>

      <EmergencyBox>
        <EmergencyTitle>🚨 응급 상황</EmergencyTitle>
        <EmergencyText>
          생명이 위험하거나 즉시 도움이 필요한 상황이라면<br />
          망설이지 말고 아래 번호로 연락하세요.
        </EmergencyText>
        <div>
          <EmergencyNumber href="tel:119">119</EmergencyNumber>
          <EmergencyNumber href="tel:1393">1393</EmergencyNumber>
        </div>
      </EmergencyBox>

      <ResourceGrid>
        {resources.map((resource, index) => (
          <ResourceCard key={index}>
            <ResourceName>{resource.name}</ResourceName>
            <ResourcePhone href={`tel:${resource.phone}`}>
              📞 {resource.phone}
            </ResourcePhone>
            <ResourceDescription>{resource.description}</ResourceDescription>
          </ResourceCard>
        ))}
      </ResourceGrid>

      <SupportSection>
        <SupportTitle>💝 당신은 혼자가 아닙니다</SupportTitle>
        <SupportList>
          <li>
            어떤 상황이든 해결할 수 있는 방법이 있습니다. 
            전문가와 함께라면 더 나은 해답을 찾을 수 있어요.
          </li>
          <li>
            지금 느끼는 고통은 일시적입니다. 
            시간이 지나면서 분명히 나아질 거예요.
          </li>
          <li>
            당신의 존재 자체가 소중합니다. 
            당신을 사랑하고 걱정하는 사람들이 있어요.
          </li>
          <li>
            도움을 요청하는 것은 용기 있는 행동입니다. 
            부끄러워하지 마세요.
          </li>
          <li>
            작은 발걸음부터 시작해도 괜찮습니다. 
            천천히, 하나씩 해나가면 돼요.
          </li>
        </SupportList>
      </SupportSection>

      <ButtonContainer>
        <Button variant="secondary" onClick={handleBack}>
          이전으로
        </Button>
        <Button variant="primary" onClick={handleHome}>
          새로운 상담 시작
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default CrisisResourcesScreen;
