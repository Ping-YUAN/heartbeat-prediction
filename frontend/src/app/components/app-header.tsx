import styled from 'styled-components';

const Header = styled.header`
  border-bottom: 1px solid #d9e1de;
  background: #ffffff;
`;

const HeaderInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 4px;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  color: #5b6f69;
  text-transform: uppercase;
  letter-spacing: 0;
  font-weight: 700;
`;

const H1 = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
`;

const StatusPill = styled.div<{ $tone: 'ok' | 'warn' }>`
  border: 1px solid
    ${(props) => (props.$tone === 'ok' ? '#6fbf8f' : '#d9a441')};
  color: ${(props) => (props.$tone === 'ok' ? '#22663f' : '#715018')};
  background: ${(props) => (props.$tone === 'ok' ? '#e8f6ed' : '#fff6df')};
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 700;
`;

export function AppHeader({ modelStatus }: { modelStatus: string }) {
  return (
    <Header>
      <HeaderInner>
        <TitleBlock>
          <Eyebrow>Research Prototype</Eyebrow>
          <H1>Experimental ECG Signal Explorer</H1>
        </TitleBlock>
        <StatusPill $tone={modelStatus === 'ready' ? 'ok' : 'warn'}>
          Model: {modelStatus}
        </StatusPill>
      </HeaderInner>
    </Header>
  );
}
