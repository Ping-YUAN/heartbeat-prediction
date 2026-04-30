import styled from 'styled-components';

import { patientLabel } from '../lib/labels';
import type { PatientSummary } from '../types';
import { Panel, PanelHeader, PanelTitle } from './ui';

const SearchInput = styled.input`
  width: 100%;
  border: 1px solid #ccd7d3;
  border-radius: 6px;
  padding: 10px 11px;
  font: inherit;
  background: #ffffff;
  color: #17211f;
`;

const PatientList = styled.div`
  max-height: 660px;
  overflow: auto;
`;

const PatientButton = styled.button<{ $active: boolean }>`
  width: 100%;
  border: 0;
  border-bottom: 1px solid #edf1ef;
  background: ${(props) => (props.$active ? '#dcefe7' : '#ffffff')};
  color: #17211f;
  text-align: left;
  padding: 12px 14px;
  display: grid;
  gap: 5px;
  cursor: pointer;

  &:hover {
    background: #eef6f2;
  }
`;

const PatientMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  color: #60746e;
  font-size: 12px;
`;

type PatientSidebarProps = {
  patients: PatientSummary[];
  query: string;
  selectedId: string;
  onQueryChange: (query: string) => void;
  onSelectPatient: (patientId: string) => void;
};

export function PatientSidebar({
  patients,
  query,
  selectedId,
  onQueryChange,
  onSelectPatient,
}: PatientSidebarProps) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Patient Samples</PanelTitle>
      </PanelHeader>
      <div style={{ padding: 12 }}>
        <SearchInput
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Filter samples"
          aria-label="Filter patient samples"
        />
      </div>
      <PatientList>
        {patients.map((patient) => (
          <PatientButton
            key={patient.id}
            $active={patient.id === selectedId}
            onClick={() => onSelectPatient(patient.id)}
          >
            <strong>{patient.id}</strong>
            <PatientMeta>
              <span>{patientLabel(patient.label)}</span>
              <span>{patient.source}</span>
              <span>{patient.sample_count} points</span>
            </PatientMeta>
          </PatientButton>
        ))}
      </PatientList>
    </Panel>
  );
}
