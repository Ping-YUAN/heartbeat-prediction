import styled from 'styled-components';

import type { AnalysisResult, Metrics } from '../types';
import {
  ActionButton,
  Metric,
  MetricLabel,
  MetricsGrid,
  MetricValue,
  Muted,
  Panel,
  PanelHeader,
  PanelTitle,
} from './ui';

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 16px;
  padding: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const ResultBox = styled.div<{ $label?: 'normal' | 'abnormal' }>`
  border-radius: 8px;
  border: 1px solid
    ${(props) => (props.$label === 'abnormal' ? '#e2a09a' : '#8bcaa2')};
  background: ${(props) =>
    props.$label === 'abnormal' ? '#fff0ee' : '#ecf8f0'};
  padding: 16px;
`;

const ResultLabel = styled.div`
  font-size: 34px;
  line-height: 1;
  font-weight: 900;
  text-transform: capitalize;
`;

type AnalysisPanelProps = {
  analysis: AnalysisResult | null;
  analyzing: boolean;
  hasPatient: boolean;
  metrics?: Metrics;
  onRunAnalysis: () => void;
};

export function AnalysisPanel({
  analysis,
  analyzing,
  hasPatient,
  metrics,
  onRunAnalysis,
}: AnalysisPanelProps) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Model Analysis</PanelTitle>
        <ActionButton onClick={onRunAnalysis} disabled={!hasPatient || analyzing}>
          {analyzing ? 'Analyzing...' : 'Run analysis'}
        </ActionButton>
      </PanelHeader>
      <AnalysisGrid>
        <ResultBox $label={analysis?.prediction.label}>
          <Muted>Binary classification</Muted>
          <ResultLabel>{analysis?.prediction.label ?? 'Pending'}</ResultLabel>
          <Muted>
            Confidence:{' '}
            {analysis ? `${Math.round(analysis.prediction.confidence * 100)}%` : '--'}
          </Muted>
        </ResultBox>
        <div>
          <MetricsGrid>
            <Metric>
              <MetricLabel>Abnormal probability</MetricLabel>
              <MetricValue>
                {analysis
                  ? `${Math.round(analysis.prediction.abnormal_probability * 100)}%`
                  : '--'}
              </MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Model method</MetricLabel>
              <MetricValue style={{ fontSize: 18 }}>
                {analysis?.prediction.method ?? '--'}
              </MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Samples</MetricLabel>
              <MetricValue>{metrics?.sample_count ?? '--'}</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Duration</MetricLabel>
              <MetricValue>{metrics?.duration_seconds ?? '--'} s</MetricValue>
            </Metric>
          </MetricsGrid>
        </div>
      </AnalysisGrid>
    </Panel>
  );
}
