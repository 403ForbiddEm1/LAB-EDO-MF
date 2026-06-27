import { useState } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { getMalwareById } from '../data/malwares';
import { getInfrastructureById } from '../data/infrastructures';

import Header from '../components/Header';
import Footer from '../components/Footer';
import MalwareLibrary from '../components/MalwareLibrary';
import InfrastructureLibrary from '../components/InfrastructureLibrary';
import SelectedSummary from '../components/SelectedSummary';
import NetworkTopology from '../components/NetworkTopology';
import MathAnalysis from '../components/MathAnalysis';
import AnalyticsMetrics from '../components/AnalyticsMetrics';
import SIRChart from '../components/SIRChart';
import InfrastructureStatus from '../components/InfrastructureStatus';
import MitigationControls from '../components/MitigationControls';
import EventLog from '../components/EventLog';
import EncyclopediaModal from '../components/EncyclopediaModal';
import HelpModal from '../components/HelpModal';

import '../App.css';

export default function Home() {
  const {
    state,
    start,
    pause,
    stop,
    reset,
    updateParam,
    toggleMitigation,
    selectMalware,
    selectInfrastructure,
    setMode,
    setSolver,
    isolateNode,
    patchNode,
    scanNode,
    triggerBackupOnNode,
  } = useSimulation();

  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isoCountdown, setIsoCountdown] = useState(0);

  const malware = getMalwareById(state.malwareId);
  const infra = getInfrastructureById(state.infrastructureId);
  const selectionLocked = state.isRunning;

  const trojanDetected = state.trojanDetected || false;
  const trojanNodeId = state.trojanNodeId;
  const rootkitFoundId = state.rootkitFoundId;
  const scanActive = state.scanActive || false;

  return (
    <div className="dashboard-container">
      <Header
        mode={state.mode}
        status={state.status}
        currentTime={state.currentTime}
        onModeChange={setMode}
        onStart={start}
        onPause={pause}
        onStop={stop}
        onReset={reset}
        onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isRunning={state.isRunning}
        isPaused={state.isPaused}
        N={state.N}
        I={state.I}
        beta={state.beta}
        gamma={state.gamma}
        dt={state.dt}
        solver={state.solver}
        onUpdate={updateParam}
        onSolverChange={setSolver}
      />

      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="dashboard-left">
            <MalwareLibrary
              selectedId={state.malwareId}
              onSelect={selectMalware}
              disabled={selectionLocked}
            />
            <InfrastructureLibrary
              selectedId={state.infrastructureId}
              onSelect={selectInfrastructure}
              disabled={selectionLocked}
            />
            <SelectedSummary
              malwareId={state.malwareId}
              infrastructureId={state.infrastructureId}
              beta={state.beta}
              gamma={state.gamma}
              isRunning={state.isRunning}
            />
          </div>

          <div className="dashboard-center">
            <NetworkTopology
              nodes={state.networkNodes}
              totalNodes={state.N}
              infrastructureName={infra.name}
              mode={state.mode}
              onIsolationActive={(_active: boolean, countdown: number) => setIsoCountdown(countdown)}
              onIsolateNode={isolateNode}
              onPatchNode={patchNode}
              onScanNode={scanNode}
              onBackupNode={triggerBackupOnNode}
              trojanDetected={trojanDetected}
              trojanNodeId={trojanNodeId}
              rootkitFoundId={rootkitFoundId}
              scanActive={scanActive}
            />
            <div style={{ display: 'flex', gap: 5, height: 170, flexShrink: 0 }}>
              <div style={{ flex: 0.9, minWidth: 0 }}>
                <MathAnalysis
                  S={state.S}
                  I={state.I}
                  R={state.R}
                  N={state.N}
                  beta={state.beta}
                  gamma={state.gamma}
                  R0={state.R0}
                  solver={state.solver}
                />
              </div>
              <div style={{ flex: 1.9, minWidth: 0 }}>
                <MitigationControls
                  mitigations={state.mitigations}
                  onToggle={toggleMitigation}
                  mode={state.mode}
                  malwareId={state.malwareId}
                  infrastructureId={state.infrastructureId}
                  isolationCountdown={isoCountdown}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-right">
            <AnalyticsMetrics
              S={state.S}
              I={state.I}
              R={state.R}
              N={state.N}
              R0={state.R0}
              peakInfection={state.peakInfection}
              peakTime={state.peakTime}
              trafficDegradation={state.trafficDegradation}
            />
            <SIRChart history={state.history} N={state.N} />
            <InfrastructureStatus
              healthScore={state.healthScore}
              totalNodes={state.N}
              infectedNodes={state.I}
              recoveredNodes={state.R}
              deadNodes={state.deadNodeIds?.length || 0}
            />
            <EventLog logs={state.logs} />
          </div>
        </div>
      </div>

      <Footer
        version="2.0.0"
        model={`SIR · ${malware.name} @ ${infra.name}`}
        solver={state.solver}
        dt={state.dt}
        precision={state.solver === 'rk4' ? 'Alta' : 'Media'}
      />

      {isEncyclopediaOpen && <EncyclopediaModal onClose={() => setIsEncyclopediaOpen(false)} />}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}