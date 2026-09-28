import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { GPSProvider } from './context/GPSContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { InnovexaLogo } from './components/InnovexaLogo.tsx';
import { InnovexaLoginModal } from './components/InnovexaLoginModal.tsx';
import { FirstTimeAdminSetup } from './components/FirstTimeAdminSetup.tsx';
import { Home } from './pages/Home.tsx';
import { ReportIssue } from './pages/ReportIssue.tsx';
import { PublicMap } from './pages/PublicMap.tsx';
import { TrackComplaint } from './pages/TrackComplaint.tsx';
import { TransparencyDashboard } from './pages/TransparencyDashboard.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { WorkerDashboard } from './pages/WorkerDashboard.tsx';
import { CitizenProfile } from './pages/CitizenProfile.tsx';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { setupStatus, checkingSetup, isLoginModalOpen, closeLoginModal } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
  };

  // 1. Loading Initial Setup State
  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <InnovexaLogo size="lg" animated={true} showText={true} />
        <div className="flex items-center gap-2 mt-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Initializing INNOVEXA Civic Platform...</span>
        </div>
      </div>
    );
  }

  // 2. Mandatory First-Time Administrator Setup Gate (Section 4 & 5)
  if (setupStatus && !setupStatus.isConfigured) {
    return <FirstTimeAdminSetup />;
  }

  // Parse track id if in query or url
  const searchParams = new URLSearchParams(window.location.search);
  const initialTrackId =
    searchParams.get('id') ||
    (currentPath.startsWith('/complaint/') ? currentPath.replace('/complaint/', '') : '');

  // 3. Main Application Routing
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <Navbar currentPath={currentPath} navigate={navigate} />

      <main className="flex-1">
        {currentPath === '/' && <Home navigate={navigate} />}
        {currentPath === '/login' && (
          <InnovexaLoginModal isStandalonePage={true} onSuccessNavigate={() => navigate('/')} />
        )}
        {currentPath === '/report' && <ReportIssue navigate={navigate} />}
        {currentPath === '/map' && <PublicMap navigate={navigate} />}
        {(currentPath === '/track' || currentPath.startsWith('/complaint/')) && (
          <TrackComplaint navigate={navigate} initialComplaintNumber={initialTrackId} />
        )}
        {currentPath === '/transparency' && <TransparencyDashboard navigate={navigate} />}
        {currentPath === '/admin' && <AdminDashboard navigate={navigate} />}
        {currentPath === '/worker' && <WorkerDashboard navigate={navigate} />}
        {currentPath === '/profile' && <CitizenProfile navigate={navigate} />}
      </main>

      {/* Global INNOVEXA Login Modal (invoked from anywhere in app) */}
      <InnovexaLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSuccessNavigate={() => {}}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GPSProvider>
        <AppContent />
      </GPSProvider>
    </AuthProvider>
  );
}
