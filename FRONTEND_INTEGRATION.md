# Campus Pulse — Frontend Integration Documentation
**Project:** Campus Pulse (Smart Campus Event Discovery Platform)  
**Team:** chaos.exe — DevCampus 2026 Hackathon  
**Frontend & UI Lead:** Vatsa (Member 1)  
**Branch:** `feature/frontend-ui`  
**Specification:** Technical Contract V1 Aligned

---

## 1. Technical Contract V1 Alignment Summary

The Campus Pulse frontend has been reviewed and aligned with **Hammad's Technical Contract V1**:

1. **Service File Conflict Resolved:**
   - The mock implementation is located exclusively at [`src/services/mockEventService.js`](file:///c:/Users/sriva/OneDrive/Desktop/GDG%20DevCampus/src/services/mockEventService.js).
   - The filename `src/services/eventService.js` is preserved and reserved exclusively for Hammad's Cloud Firestore service.
   - All service functions adhere to the approved result format: `{ data, error }`.
2. **Event Schema Match:**
   - Every normalized event object matches Hammad's schema fields:
     - `id`: string
     - `title`: string
     - `description`: string
     - `category`: approved enum string (`guest_lecture`, `technical_workshop`, `hackathon`, `club_activity`, `competition`, `cultural_program`, `sports_event`, `seminar`, `department_event`, `other`)
     - `interestArea`: array of approved enum strings (`cloud_computing`, `cybersecurity`, `artificial_intelligence`, `machine_learning`, `web_development`, `app_development`, `data_science`, `robotics`, `entrepreneurship`, `design`, `cultural_activities`, `sports`)
     - `eventType`: `'internal'` or `'external'`
     - `startDateTime`: JavaScript Date instance
     - `endDateTime`: JavaScript Date instance
     - `venueName`: string
     - `venueAddress`: string
     - `latitude`: number | null
     - `longitude`: number | null
     - `organizer`: string
     - `eligibility`: string | null
     - `registrationRequired`: boolean
     - `registrationUrl`: string | null
     - `certificateAvailable`: boolean | null
     - `attendanceBenefit`: string | null
     - `activityPoints`: number | null
     - `benefitsVerificationStatus`: `'verified'` | `'unverified'` | `'not_applicable'`
     - `imageUrl`: string | null
     - `status`: `'draft'` | `'published'` | `'cancelled'` | `'completed'`
     - `createdBy`: string
     - `createdAt`: Date
     - `updatedAt`: Date
3. **Map Ownership (Chandrashekhar):**
   - The `<CampusMap />` component is an integration placeholder that renders `#campus-pulse-google-map-container`.
   - Controlled `selectedEventId` from parent and callback `onSelectEvent(id)`.
   - No fake map markers, no dummy campus landmarks, no invented coordinates.
   - Events with `null` coordinates are safely supported.
4. **Organizer Scope V1:**
   - Organizers can create events (saved strictly as `draft` with `unverified` benefits).
   - Organizers list only their own events (`createdBy === currentOrgId`).
   - Organizers can edit only their own `draft` events.
   - Organizers can cancel their own events.
   - Removed publishing from ordinary organizers (publishing and benefit verification are admin-only).
   - Removed fake quick logins from login UI.
5. **Student Scope V1:**
   - Removed fake student registration counters, capacity counters, and fake earned activity-point tallies.
   - Event registration links directly to external portal via `event.registrationUrl`.
   - Bookmarking is clearly identified as a local browser feature not synced to Firebase.

---

## 2. Directory Structure

```
GDG DevCampus/
├── public/
│   └── favicon.svg                    # Vector brand identity mark
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx & Badge.css  # Categories, event types, verification badges
│   │   │   ├── Navbar.jsx & Navbar.css# Header with navigation & bookmark pill
│   │   │   ├── Footer.jsx & Footer.css# Platform footer & team attribution
│   │   │   └── Toast.jsx & Toast.css  # User action toasts
│   │   ├── events/
│   │   │   ├── EventCard.jsx & EventCard.css
│   │   │   ├── EventDetailsModal.jsx & EventDetailsModal.css
│   │   │   └── EventFilterBar.jsx & EventFilterBar.css
│   │   ├── map/
│   │   │   ├── CampusMap.jsx & CampusMap.css # Clean Google Maps boundary
│   │   └── dashboard/
│   │       ├── EventFormModal.jsx & EventFormModal.css # Draft creator/editor
│   ├── context/
│   │   └── EventContext.jsx           # Global state (selection, modal, bookmarks)
│   ├── data/
│   │   └── mockEvents.js              # Contract V1 mock data & approved enums
│   ├── pages/
│   │   ├── LandingPage.jsx & LandingPage.css
│   │   ├── ExploreEventsPage.jsx & ExploreEventsPage.css
│   │   ├── CampusMapPage.jsx & CampusMapPage.css
│   │   ├── ExternalEventsPage.jsx & ExternalEventsPage.css
│   │   ├── MyEventsPage.jsx & MyEventsPage.css
│   │   ├── OrganizerDashboardPage.jsx & OrganizerDashboardPage.css
│   │   └── OrganizerLoginPage.jsx & OrganizerLoginPage.css
│   ├── services/
│   │   └── mockEventService.js        # Mock data layer returning { data, error }
│   ├── styles/
│   │   ├── variables.css              # Design tokens (lavender bg, navy text)
│   │   └── index.css                  # Modern reset and utility classes
│   ├── App.jsx                        # View routing and modal provider root
│   └── main.jsx                       # Entry point
├── FRONTEND_INTEGRATION.md
├── index.html
├── package.json
└── vite.config.js
```

---

## 3. Approved Category & Interest Enums

### Categories (`category`):
| Enum Value | Friendly UI Label |
|---|---|
| `guest_lecture` | Guest Lecture |
| `technical_workshop` | Technical Workshop |
| `hackathon` | Hackathon |
| `club_activity` | Club Activity |
| `competition` | Competition |
| `cultural_program` | Cultural Program |
| `sports_event` | Sports Event |
| `seminar` | Seminar |
| `department_event` | Department Event |
| `other` | Other |

### Interest Areas (`interestArea`):
| Enum Value | Friendly UI Label |
|---|---|
| `cloud_computing` | Cloud Computing |
| `cybersecurity` | Cybersecurity |
| `artificial_intelligence` | Artificial Intelligence |
| `machine_learning` | Machine Learning |
| `web_development` | Web Development |
| `app_development` | App Development |
| `data_science` | Data Science |
| `robotics` | Robotics |
| `entrepreneurship` | Entrepreneurship |
| `design` | Design |
| `cultural_activities` | Cultural Activities |
| `sports` | Sports |

---

## 4. Google Maps Integration Interface

Chandrashekhar will mount the Google Maps instance directly into `#campus-pulse-google-map-container` provided by:

```jsx
<CampusMap
  events={events}
  selectedEventId={selectedEventId}
  onSelectEvent={handleSelectEvent}
/>
```

---

## 5. Development Commands

```bash
# Production build check
npm run build

# Start local development server
npm run dev
```
