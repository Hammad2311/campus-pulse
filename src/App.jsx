import React from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { EventDetailsModal } from './components/events/EventDetailsModal';

// Pages
import { CampusMapPage } from './pages/CampusMapPage';
import { ExploreEventsPage } from './pages/ExploreEventsPage';
import { ExternalEventsPage } from './pages/ExternalEventsPage';
import { MyEventsPage } from './pages/MyEventsPage';
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage';
import { OrganizerLoginPage } from './pages/OrganizerLoginPage';

function AppContent() {
  const { currentView } = useEvents();

  const isMapHomepage = currentView === 'map';

  const renderCurrentView = () => {
    switch (currentView) {
      case 'explore':
        return <ExploreEventsPage />;
      case 'external':
        return <ExternalEventsPage />;
      case 'my-events':
        return <MyEventsPage />;
      case 'organizer-dashboard':
        return <OrganizerDashboardPage />;
      case 'organizer-login':
        return <OrganizerLoginPage />;
      case 'map':
      default:
        // Root homepage is the interactive campus map
        return <CampusMapPage />;
    }
  };

  return (
    <div className={`cp-app-root ${isMapHomepage ? 'cp-root-map-homepage' : ''}`}>
      <Navbar />
      <main className={`cp-main-content ${isMapHomepage ? 'cp-main-map-homepage' : ''}`}>
        {renderCurrentView()}
      </main>
      
      {/* Promotional footer omitted on map homepage per Section 2 */}
      {!isMapHomepage && <Footer />}
      
      {/* Global Event Details Modal (Opens on marker click per Section 4 & 6) */}
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
