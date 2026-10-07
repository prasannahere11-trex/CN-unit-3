import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeOverview } from './pages/HomeOverview';
import { CityRequirements } from './pages/CityRequirements';
import { SuitabilityAssessment } from './pages/SuitabilityAssessment';
import { AddressingPlanBuilder } from './pages/AddressingPlanBuilder';
import { Ipv4Ipv6Comparison } from './pages/Ipv4Ipv6Comparison';
import { ScalabilitySimulator } from './pages/ScalabilitySimulator';
import { EmergencyDeepDive } from './pages/EmergencyDeepDive';
import { MigrationRoadmap } from './pages/MigrationRoadmap';
import { ReportExport } from './pages/ReportExport';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar />

      <div className="flex-1 flex">
        {/* Collapsible Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomeOverview />} />
            <Route path="/requirements" element={<CityRequirements />} />
            <Route path="/suitability" element={<SuitabilityAssessment />} />
            <Route path="/plan-builder" element={<AddressingPlanBuilder />} />
            <Route path="/comparison" element={<Ipv4Ipv6Comparison />} />
            <Route path="/scalability" element={<ScalabilitySimulator />} />
            <Route path="/emergency-dive" element={<EmergencyDeepDive />} />
            <Route path="/migration" element={<MigrationRoadmap />} />
            <Route path="/report" element={<ReportExport />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
