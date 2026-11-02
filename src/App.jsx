import React from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { EventDetailsModal } from './components/events/EventDetailsModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ExploreEventsPage } from './pages/ExploreEventsPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { ExternalEventsPage } from './pages/ExternalEventsPage';
import { MyEventsPage } from './pages/MyEventsPage';
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage';
import { OrganizerLoginPage } from './pages/OrganizerLoginPage';

function AppContent() {
  const { currentView } = useEvents();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'explore':
        return <ExploreEventsPage />;
      case 'map':
        return <CampusMapPage />;
      case 'external':
        return <ExternalEventsPage />;
      case 'my-events':
        return <MyEventsPage />;
      case 'organizer-dashboard':
        return <OrganizerDashboardPage />;
      case 'organizer-login':
        return <OrganizerLoginPage />;
      case 'landing':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="cp-app-root">
      <Navbar />
      <main className="cp-main-content">
        {renderCurrentView()}
      </main>
      <Footer />
      
      {/* Global Event Details Modal */}
      <EventDetailsModal />

      {/* Global Toast Notification */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}
