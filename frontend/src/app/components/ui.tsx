import styled from 'styled-components';

export const Page = styled.main`
  min-height: 100vh;
  background: #f4f7f6;
  color: #17211f;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
`;

export const Layout = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 28px 36px;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 20px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  display: grid;
  gap: 12px;
  align-content: start;
`;

export const Content = styled.div`
  display: grid;
  gap: 20px;
`;

export const Panel = styled.section`
  background: #ffffff;
  border: 1px solid #d9e1de;
  border-radius: 8px;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #e6ece9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  line-height: 1.25;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 12px;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const Metric = styled.div`
  border: 1px solid #e1e8e5;
  border-radius: 8px;
  padding: 14px;
  background: #ffffff;
`;

export const MetricLabel = styled.div`
  color: #63766f;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
`;

export const MetricValue = styled.div`
  margin-top: 8px;
  font-size: 26px;
  line-height: 1.1;
  font-weight: 800;
`;

export const Muted = styled.p`
  color: #61756e;
  margin: 0;
  line-height: 1.5;
`;

export const ErrorText = styled.div`
  color: #9f2f25;
  font-weight: 700;
  padding: 12px 16px;
`;

export const ActionButton = styled.button`
  border: 0;
  border-radius: 6px;
  background: #1f6f5b;
  color: #ffffff;
  padding: 11px 14px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    background: #95aaa4;
  }
`;
