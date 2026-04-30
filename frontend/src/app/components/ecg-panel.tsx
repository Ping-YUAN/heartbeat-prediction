import styled from 'styled-components';

import { patientLabel } from '../lib/labels';
import type { Metrics, PatientDetail, ReferenceSignal } from '../types';
import { EcgChart } from './ecg-chart';
import { Muted, Panel, PanelHeader, PanelTitle } from './ui';

const ChartWrap = styled.div`
  padding: 14px;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ReferenceSelect = styled.select`
  border: 1px solid #ccd7d3;
  border-radius: 6px;
  background: #ffffff;
  color: #17211f;
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
  min-width: 230px;
`;

type EcgPanelProps = {
  detail: PatientDetail | null;
  loading: boolean;
  metrics?: Metrics;
  referenceSignals: ReferenceSignal[];
  selectedReference: ReferenceSignal | null;
  selectedReferenceId: string;
  onSelectReference: (referenceId: string) => void;
};

export function EcgPanel({
  detail,
  loading,
  metrics,
  referenceSignals,
  selectedReference,
  selectedReferenceId,
  onSelectReference,
}: EcgPanelProps) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>{detail ? `ECG Trace: ${detail.id}` : 'ECG Trace'}</PanelTitle>
        <HeaderControls>
          <ReferenceSelect
            value={selectedReferenceId}
            onChange={(event) => onSelectReference(event.target.value)}
            aria-label="Select reference signal"
          >
            <option value="">No reference signal</option>
            {referenceSignals.map((reference) => (
              <option key={reference.id} value={reference.id}>
                {reference.dataset} · {reference.name} ({reference.source_count})
              </option>
            ))}
          </ReferenceSelect>
          <Muted>{detail ? patientLabel(detail.label) : loading ? 'Loading' : 'No sample'}</Muted>
        </HeaderControls>
      </PanelHeader>
      <ChartWrap>
        {detail ? (
          <EcgChart
            signal={detail.signal}
            normal={detail.normal_template}
            reference={selectedReference}
            peakIndexes={metrics?.peak_indexes ?? []}
          />
        ) : (
          <Muted>Select a patient sample to inspect the ECG waveform.</Muted>
        )}
      </ChartWrap>
    </Panel>
  );
}
