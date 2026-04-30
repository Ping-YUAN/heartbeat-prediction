import { AnalysisPanel } from './components/analysis-panel';
import { AppHeader } from './components/app-header';
import { EcgPanel } from './components/ecg-panel';
import { MetricDashboard } from './components/metric-dashboard';
import { PatientSidebar } from './components/patient-sidebar';
import { Content, ErrorText, Layout, Page, Sidebar } from './components/ui';
import { useHeartbeatWorkbench } from './hooks/use-heartbeat-workbench';

export function App() {
  const workbench = useHeartbeatWorkbench();

  return (
    <Page>
      <AppHeader modelStatus={workbench.modelStatus} />

      <Layout>
        <Sidebar>
          <PatientSidebar
            patients={workbench.filteredPatients}
            query={workbench.query}
            selectedId={workbench.selectedId}
            onQueryChange={workbench.setQuery}
            onSelectPatient={workbench.setSelectedId}
          />
        </Sidebar>

        <Content>
          {workbench.error ? <ErrorText>{workbench.error}</ErrorText> : null}

          <MetricDashboard metrics={workbench.metrics} />

          <EcgPanel
            detail={workbench.detail}
            loading={workbench.loading}
            metrics={workbench.metrics}
            referenceSignals={workbench.referenceSignals}
            selectedReference={workbench.selectedReference}
            selectedReferenceId={workbench.selectedReferenceId}
            onSelectReference={workbench.setSelectedReferenceId}
          />

          <AnalysisPanel
            analysis={workbench.analysis}
            analyzing={workbench.analyzing}
            hasPatient={Boolean(workbench.detail)}
            metrics={workbench.metrics}
            onRunAnalysis={workbench.runAnalysis}
          />
        </Content>
      </Layout>
    </Page>
  );
}

export default App;
