import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// 컴포넌트 임포트
import HomeScreen from './components/HomeScreen';
import EmotionCheckScreen from './components/EmotionCheckScreen';
import ConcernInputScreen from './components/ConcernInputScreen';
import AIResponseScreen from './components/AIResponseScreen';
import CrisisResourcesScreen from './components/CrisisResourcesScreen';
import SessionsScreen from './components/SessionsScreen';
import FAQScreen from './components/FAQScreen';

// 글로벌 스타일
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f5f6fa;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  html, body, #root {
    height: 100%;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const FloatingMenu = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FloatingButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(116, 185, 255, 0.9);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(116, 185, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

function App() {
  const goToFAQ = () => {
    window.location.hash = '/faq';
  };

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/emotion-check" element={<EmotionCheckScreen />} />
          <Route path="/concern-input" element={<ConcernInputScreen />} />
          <Route path="/ai-response" element={<AIResponseScreen />} />
          <Route path="/crisis-resources" element={<CrisisResourcesScreen />} />
          <Route path="/sessions" element={<SessionsScreen />} />
          <Route path="/faq" element={<FAQScreen />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>

        <FloatingMenu>
          <FloatingButton onClick={goToFAQ} title="자주 묻는 질문">
            ❓
          </FloatingButton>
        </FloatingMenu>
      </AppContainer>
    </Router>
  );
}

export default App;
