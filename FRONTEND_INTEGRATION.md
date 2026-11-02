# Campus Pulse — Frontend Integration Documentation
**Project:** Campus Pulse (Smart Campus Event Discovery Platform)  
**Team:** chaos.exe — DevCampus 2026 Hackathon  
**Frontend & UI Lead:** Vatsa (Member 1)  
**Branch:** `feature/frontend-ui`

---

## 1. Executive Summary

The complete, production-quality frontend for **Campus Pulse** has been autonomously architected, implemented, styled, and verified. The frontend implements all required views—Landing Page, Explore Events, Campus Map integration boundary, External & National Hackathons, Student My Events hub, and Organizer Dashboard & Login portal—with high visual polish, standard CSS variables, full responsiveness, accessible interactions, and clean architectural separation.

All integration boundaries with backend lead **Hammad Qubah** (Firebase Auth, Cloud Firestore) and interactive mapping lead **Chandrashekhar** (Google Maps JavaScript API) are modularized and ready for plug-and-play connection.

---

## 2. Directory & Component Architecture

```
GDG DevCampus/
├── public/
│   └── favicon.svg                    # Custom brand vector icon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx              # Reusable category, type, status & points badges
│   │   │   ├── Badge.css
│   │   │   ├── Navbar.jsx             # Responsive navigation bar & mobile drawer
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx             # Comprehensive university footer & team credits
│   │   │   ├── Footer.css
│   │   │   ├── Toast.jsx              # Status notifications for save/register actions
│   │   │   └── Toast.css
│   │   ├── events/
│   │   │   ├── EventCard.jsx          # Uniform event card with image, badges, venue, date
│   │   │   ├── EventCard.css
│   │   │   ├── EventDetailsModal.jsx  # Full event inspection modal with external URL & benefits
│   │   │   ├── EventDetailsModal.css
│   │   │   ├── EventFilterBar.jsx     # Search bar, category pills, type switch & filters
│   │   │   └── EventFilterBar.css
│   │   ├── map/
│   │   │   ├── CampusMap.jsx          # Google Maps API component placeholder & marker state sync
│   │   │   └── CampusMap.css
│   │   └── dashboard/
│   │       ├── EventFormModal.jsx     # Create & Edit Event modal with complete validation
│   │       └── EventFormModal.css
│   ├── context/
│   │   └── EventContext.jsx           # Global state (selectedEventId, modal, bookmarks, auth demo)
│   ├── data/
│   │   └── mockEvents.js              # Comprehensive demo dataset with campus coordinates & optional fields
│   ├── pages/
│   │   ├── LandingPage.jsx            # Hero, categories, featured events, map teaser, value props, CTA
│   │   ├── LandingPage.css
│   │   ├── ExploreEventsPage.jsx      # Multi-faceted search & filter discovery interface
│   │   ├── ExploreEventsPage.css
│   │   ├── CampusMapPage.jsx          # Interactive split view (Map + Event sync list)
│   │   ├── CampusMapPage.css
│   │   ├── ExternalEventsPage.jsx     # External hackathons, inter-collegiate summits & direct registration
│   │   ├── ExternalEventsPage.css
│   │   ├── MyEventsPage.jsx           # Registered, Saved, and Upcoming student timetable
│   │   ├── MyEventsPage.css
│   │   ├── OrganizerDashboardPage.jsx # Metrics overview, event management table, create/edit actions
│   │   ├── OrganizerDashboardPage.css
│   │   ├── OrganizerLoginPage.jsx     # Organizer sign-in with validation and presets
│   │   └── OrganizerLoginPage.css
│   ├── services/
│   │   └── eventService.js            # Independent data-access service layer
│   ├── styles/
│   │   ├── variables.css              # Design tokens (lavender bg, navy typography, purple & electric blue)
│   │   └── index.css                  # Modern reset, typography, and button styles
│   ├── App.jsx                        # View routing and modal provider root
│   └── main.jsx                       # Application entrypoint
├── index.html                         # HTML template with Google Fonts (Plus Jakarta Sans & Inter)
├── vite.config.js                     # Vite build configuration
├── package.json                       # Dependencies & scripts
└── FRONTEND_INTEGRATION.md            # This integration document
```

---

## 3. Visual Identity & Design System

The visual identity follows modern SaaS product design principles:
- **Backgrounds:** Clean white (`#FFFFFF`) with light lavender tints (`#F8F9FE`, `#EEF2FF`, `#F1F4FD`).
- **Typography:** Deep navy palette (`#0F172A`, `#1E293B`, `#334155`) utilizing Google Fonts *Plus Jakarta Sans* for headings and *Inter* for body text.
- **Accents:** Electric indigo-purple (`#6366F1`, `#4F46E5`, `#7C3AED`) and vibrant electric blue (`#2563EB`, `#3B82F6`).
- **Badges & Categories:** Distinct semantic color coding for Technology, Hackathons, Cultural, Sports, Workshops, Academic talks, and Social events.
- **Components:** Card border radius `12px` to `16px`, soft layered elevation shadows, responsive grid layouts, and zero horizontal overflow on mobile screens.

---

## 4. Event Selection Architecture & Map Boundary

### Proposed Google Maps Component Interface
The interactive map placeholder component (`src/components/map/CampusMap.jsx`) adheres strictly to the contract expected by **Chandrashekhar**:

```jsx
<CampusMap
  events={visibleEvents}
  selectedEventId={selectedEventId}
  onSelectEvent={handleSelectEvent}
/>
```

### State Synchronization Flow:
1. **Frontend Ownership:** `selectedEventId` is owned in `EventContext.jsx` and passed to `<CampusMap />`.
2. **Card -> Map Sync:** Clicking any event card in the Explore or Map view updates `selectedEventId`, triggering the corresponding map pin to enlarge, highlight in red, and display an active popup card.
3. **Map -> Card Sync:** Clicking any marker pin on the map calls `onSelectEvent(eventId)`, highlighting the card in the sidebar list and displaying quick actions.
4. **Geo-Coordinates Included:** Every mock event contains GPS coordinates (e.g. `{ lat: 12.9716, lng: 77.5946 }`) ready for Google Maps markers.
5. **DOM Container:** The map container reserves `#campus-pulse-google-map-container` for Chandrashekhar to attach `new google.maps.Map(...)`.

---

## 5. Mock Data & Service Layer

### Location:
- `src/data/mockEvents.js`
- `src/services/eventService.js`

### Schema Fields:
```typescript
interface CampusEvent {
  id: string;                         // e.g. "evt-001"
  title: string;
  shortDescription: string;
  description: string;
  category: "Technology" | "Hackathon" | "Cultural" | "Sports" | "Workshop" | "Academic" | "Social";
  interests: string[];                // e.g. ["AI & Machine Learning", "Robotics"]
  eventType: "university" | "external";
  status: "published" | "draft" | "cancelled";
  startDate: string;                  // ISO 8601
  endDate: string;                    // ISO 8601
  venue: string;
  coordinates: { lat: number; lng: number };
  organizer: {
    name: string;
    email: string;
    contactPhone?: string;
    isVerified: boolean;
  };
  image: string;
  eligibility?: string;
  registrationRequirements?: string;
  registrationUrl: string;
  isRegistrationOpen: boolean;
  capacity?: number;
  registeredCount: number;
  certificateAvailable?: boolean;    // Gracefully handles missing/false values
  activityPoints?: number;          // Gracefully handles undefined
  attendanceBenefits?: string;
  featured?: boolean;
}
```

---

## 6. Firebase Service Integration Points (For Hammad Qubah)

The frontend's data layer in `src/services/eventService.js` was specifically built to decouple UI components from backend implementation. When Hammad connects Firebase:

1. **Firestore Event Collection (`events`):**
   - Replace `fetchEvents()` in `src/services/eventService.js` with `getDocs(query(collection(db, 'events'), ...))`.
   - Replace `createEventMock()` with `addDoc(collection(db, 'events'), eventData)`.
   - Replace `updateEventMock()` with `updateDoc(doc(db, 'events', eventId), updatedFields)`.
2. **Firestore User Registrations (`users/{uid}/registrations`):**
   - In `registerForEvent()` and `cancelRegistration()`, replace `localStorage` writes with subcollection doc mutations (`setDoc` / `deleteDoc`).
3. **Firebase Authentication (`auth`):**
   - In `src/pages/OrganizerLoginPage.jsx` and `src/context/EventContext.jsx`, connect `signInWithEmailAndPassword(auth, email, password)` inside `handleSubmit`.
   - Use `onAuthStateChanged(auth, user => ...)` to set `organizerUser`.

---

## 7. Development & Build Commands

```bash
# Install dependencies
npm install

# Start local development server (Vite on http://localhost:5173/)
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Team Dependencies Summary

| Team Member | Domain | Status / Action Needed |
|-------------|--------|------------------------|
| **Vatsa** (Member 1) | Frontend & UI | **COMPLETED** — All pages, components, CSS design system, responsive layouts, search & filters verified. |
| **Hammad Qubah** | Firebase Lead | Ready for Firebase SDK initialization (`firebase.js`), Cloud Firestore collection mapping, and Firebase Auth rules. |
| **Chandrashekhar** | Google Maps Lead | Ready to inject Google Maps JavaScript API script loader and marker renderer into `<CampusMap />` at `#campus-pulse-google-map-container`. |
| **Kanishka** | QA & Creative Design | Ready for end-to-end review of event discovery, mobile UX flows, and documentation review. |
