import styled from 'styled-components';

import { linePath } from '../lib/chart';

const ChartSvg = styled.svg`
  width: 100%;
  height: 380px;
  display: block;
  background: linear-gradient(#f6faf8 1px, transparent 1px),
    linear-gradient(90deg, #f6faf8 1px, transparent 1px);
  background-size: 22px 22px;
  border: 1px solid #dfe8e4;
  border-radius: 8px;
`;

const Legend = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  color: #52655f;
  font-size: 13px;
  margin-top: 12px;
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
`;

const Swatch = styled.span<{ $color: string }>`
  width: 22px;
  height: 3px;
  background: ${(props) => props.$color};
  display: inline-block;
`;

type EcgChartProps = {
  signal: number[];
  normal: number[] | null;
  reference?: {
    name: string;
    dataset?: string;
    kind?: 'normal' | 'abnormal';
    signal: number[];
  } | null;
  peakIndexes: number[];
};

export function EcgChart({ signal, normal, reference, peakIndexes }: EcgChartProps) {
  const width = 1000;
  const height = 320;
  const patientPath = linePath(signal, width, height);
  const normalPath = normal
    ? linePath(normal.slice(0, signal.length), width, height)
    : '';
  const referencePath = reference
    ? linePath(reference.signal.slice(0, signal.length), width, height)
    : '';
  const referenceColor = reference?.kind === 'normal' ? '#2d82c7' : '#d8872f';
  const min = Math.min(...signal);
  const max = Math.max(...signal);
  const range = max - min || 1;

  return (
    <>
      <ChartSvg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="ECG waveform">
        {normalPath ? (
          <path d={normalPath} fill="none" stroke="#8d9b97" strokeWidth="3" opacity="0.65" />
        ) : null}
        {referencePath ? (
          <path d={referencePath} fill="none" stroke={referenceColor} strokeWidth="3" opacity="0.78" />
        ) : null}
        <path d={patientPath} fill="none" stroke="#0f7464" strokeWidth="4" />
        {peakIndexes.slice(0, 12).map((index) => {
          const x = (index / Math.max(1, signal.length - 1)) * width;
          const y = height - ((signal[index] - min) / range) * height;
          return <circle key={index} cx={x} cy={y} r="7" fill="#d94f3d" />;
        })}
      </ChartSvg>
      <Legend>
        <LegendItem>
          <Swatch $color="#0f7464" /> Patient ECG
        </LegendItem>
        {normal ? (
          <LegendItem>
            <Swatch $color="#8d9b97" /> Normal baseline mean
          </LegendItem>
        ) : null}
        {reference ? (
          <LegendItem>
            <Swatch $color={referenceColor} /> {reference.dataset ? `${reference.dataset} ` : ''}
            {reference.name}
          </LegendItem>
        ) : null}
        <LegendItem>
          <Swatch $color="#d94f3d" /> Detected R peaks
        </LegendItem>
      </Legend>
    </>
  );
}
