import type { Metrics } from '../types';
import { Metric, MetricLabel, MetricsGrid, MetricValue } from './ui';

export function MetricDashboard({ metrics }: { metrics?: Metrics }) {
  return (
    <MetricsGrid>
      <Metric>
        <MetricLabel>Estimated pulse</MetricLabel>
        <MetricValue>{metrics?.estimated_bpm ?? '--'} bpm</MetricValue>
      </Metric>
      <Metric>
        <MetricLabel>Detected beats</MetricLabel>
        <MetricValue>{metrics?.peak_count ?? '--'}</MetricValue>
      </Metric>
      <Metric>
        <MetricLabel>Mean RR</MetricLabel>
        <MetricValue>{metrics?.mean_rr_ms ?? '--'} ms</MetricValue>
      </Metric>
      <Metric>
        <MetricLabel>Amplitude range</MetricLabel>
        <MetricValue>{metrics?.amplitude_range ?? '--'}</MetricValue>
      </Metric>
    </MetricsGrid>
  );
}
