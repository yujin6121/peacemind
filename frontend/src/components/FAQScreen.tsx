import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #81ecec 0%, #74b9ff 100%);
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

const SearchBox = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  background: rgba(255,255,255,0.9);
  color: #333;
  outline: none;

  &::placeholder {
    color: #666;
  }

  &:focus {
    background: white;
    box-shadow: 0 0 20px rgba(255,255,255,0.3);
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.active ? `
    background: white;
    color: #74b9ff;
  ` : `
    background: rgba(255,255,255,0.2);
    color: white;
    &:hover { background: rgba(255,255,255,0.3); }
  `}
`;

const FAQList = styled.div`
  margin-bottom: 2rem;
`;

const FAQItem = styled.div`
  background: rgba(255,255,255,0.9);
  margin-bottom: 15px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
`;

const FAQQuestion = styled.div<{ isOpen: boolean }>`
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.isOpen ? '#f8f9fa' : 'transparent'};
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    flex: 1;
  }
  
  .icon {
    font-size: 1.2rem;
    color: #74b9ff;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.3s ease;
  }
`;

const FAQAnswer = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  .content {
    padding: 0 20px 20px 20px;
    color: #555;
    line-height: 1.6;
    border-top: 1px solid #eee;
  }
`;

const CategoryTag = styled.span`
  background: #74b9ff;
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  margin-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
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
    color: #74b9ff;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: white;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const FAQScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "이 서비스는 완전히 익명인가요?",
      answer: "네, 완전히 익명입니다. 로그인이나 개인정보 입력 없이 사용할 수 있으며, 대화 내용은 개인을 식별할 수 없는 방식으로 처리됩니다. IP 주소나 기타 식별 정보는 수집하지 않습니다.",
      category: "개인정보"
    },
    {
      id: 2,
      question: "AI 상담사는 실제 상담사를 대체할 수 있나요?",
      answer: "AI 상담사는 즉시 이용 가능한 지원을 제공하지만, 심각한 정신건강 문제나 위기 상황에서는 전문 상담사나 의료진의 도움을 받으시길 권합니다. AI는 보완적인 역할을 하며, 전문적인 치료를 대체하지 않습니다.",
      category: "상담"
    },
    {
      id: 3,
      question: "위기 상황이 감지되면 어떻게 되나요?",
      answer: "위기 키워드가 감지되면 즉시 경고가 표시되고, 전문 상담 기관의 연락처가 제공됩니다. 생명의전화(1393), 정신건강위기상담전화(1577-0199) 등 24시간 이용 가능한 서비스를 안내합니다.",
      category: "위기지원"
    },
    {
      id: 4,
      question: "상담 내용이 저장되나요?",
      answer: "상담 내용은 사용자가 원할 때만 브라우저 로컬 스토리지에 저장됩니다. 서버에는 저장되지 않으며, 브라우저를 삭제하거나 사용자가 직접 삭제할 수 있습니다.",
      category: "개인정보"
    },
    {
      id: 5,
      question: "감정 분석은 어떻게 이루어지나요?",
      answer: "사용자가 입력한 텍스트를 분석하여 슬픔, 분노, 불안, 기쁨, 두려움, 스트레스 등의 감정을 수치화합니다. 키워드 기반 분석과 자연어 처리 기술을 사용하여 감정 상태를 파악합니다.",
      category: "기능"
    },
    {
      id: 6,
      question: "이 서비스는 무료인가요?",
      answer: "네, 완전 무료로 제공됩니다. 회원가입이나 결제 없이 언제든지 이용하실 수 있습니다. 24시간 언제든지 접근 가능합니다.",
      category: "서비스"
    },
    {
      id: 7,
      question: "AI가 부정확한 답변을 하면 어떻게 하나요?",
      answer: "AI는 일반적인 조언을 제공하지만 완벽하지 않을 수 있습니다. 의학적 진단이나 구체적인 치료 방법은 제공하지 않으며, 항상 전문가의 의견을 우선시하시기 바랍니다.",
      category: "상담"
    },
    {
      id: 8,
      question: "모바일에서도 사용할 수 있나요?",
      answer: "네, 반응형 웹 디자인으로 제작되어 스마트폰, 태블릿, 데스크톱 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다.",
      category: "기능"
    },
    {
      id: 9,
      question: "상담 시간에 제한이 있나요?",
      answer: "특별한 시간 제한은 없습니다. 필요한 만큼 대화를 나누실 수 있으며, 여러 세션으로 나누어 이용하셔도 됩니다.",
      category: "서비스"
    },
    {
      id: 10,
      question: "다른 사람과 상담 내용을 공유할 수 있나요?",
      answer: "상담 내용은 개인적인 것이므로 타인과 공유하지 않는 것을 권장합니다. 필요하다면 저장된 내용을 직접 복사하여 신뢰할 수 있는 전문가와 상의하실 수 있습니다.",
      category: "개인정보"
    }
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: '개인정보', label: '개인정보' },
    { value: '상담', label: '상담' },
    { value: '위기지원', label: '위기지원' },
    { value: '기능', label: '기능' },
    { value: '서비스', label: '서비스' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <Header>
        <Title>❓ 자주 묻는 질문</Title>
        <Subtitle>궁금한 점이 있으시면 아래에서 답을 찾아보세요</Subtitle>
      </Header>

      <SearchBox>
        <SearchInput
          type="text"
          placeholder="궁금한 내용을 검색해보세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CategoryFilter>
          {categories.map(category => (
            <CategoryButton
              key={category.value}
              active={selectedCategory === category.value}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </CategoryButton>
          ))}
        </CategoryFilter>
      </SearchBox>

      <FAQList>
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map(faq => (
            <FAQItem key={faq.id}>
              <FAQQuestion 
                isOpen={openItems.includes(faq.id)}
                onClick={() => toggleFAQ(faq.id)}
              >
                <h3>
                  {faq.question}
                  <CategoryTag>{faq.category}</CategoryTag>
                </h3>
                <span className="icon">▼</span>
              </FAQQuestion>
              <FAQAnswer isOpen={openItems.includes(faq.id)}>
                <div className="content">
                  {faq.answer}
                </div>
              </FAQAnswer>
            </FAQItem>
          ))
        ) : (
          <EmptyState>
            <div className="icon">🔍</div>
            <p>검색 결과가 없습니다.</p>
            <p>다른 키워드로 검색해보세요.</p>
          </EmptyState>
        )}
      </FAQList>

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
};

export default FAQScreen;
