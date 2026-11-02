/**
 * Campus Pulse - Mock Event Data (Temporary Demo Dataset)
 * 
 * Note for team:
 * This file serves as independent mock data for frontend development and testing
 * until Hammad Qubah integrates Cloud Firestore and shared event services.
 * 
 * Schema guidelines:
 * - Includes both university-hosted and external inter-campus events.
 * - Missing optional fields (e.g. activityPoints, certificateAvailable) are present in some records
 *   to ensure resilient frontend handling.
 * - Coordinates (lat, lng) are provided to match Chandrashekhar's Google Maps component contract.
 */

export const MOCK_EVENTS = [
  {
    id: "evt-001",
    title: "AI & Neural Frontiers Symposium 2026",
    shortDescription: "A flagship summit on generative AI, autonomous agent design, and machine intelligence breakthroughs.",
    description: "Join leading university faculty and top AI industry researchers for a full-day immersive symposium covering large language models, agentic workflows, and quantum machine learning. Includes live demos, keynotes, and breakout Q&A sessions.",
    category: "Technology",
    interests: ["AI & Machine Learning", "Robotics", "Web Dev"],
    eventType: "university", // 'university' | 'external'
    status: "published", // 'published' | 'draft' | 'cancelled'
    startDate: "2026-11-15T09:30:00",
    endDate: "2026-11-15T17:30:00",
    venue: "Main Auditorium, Vikram Sarabhai Hall",
    coordinates: {
      lat: 12.9716,
      lng: 77.5946
    },
    organizer: {
      name: "Dept. of Computer Science & Engineering",
      email: "cs-events@campus.edu",
      contactPhone: "+91 98765 43210",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Open to all undergraduate & postgraduate engineering students",
    registrationRequirements: "College ID card and prior online registration required. Laptops recommended for afternoon workshops.",
    registrationUrl: "https://campus-pulse.edu/register/ai-summit-2026",
    isRegistrationOpen: true,
    capacity: 350,
    registeredCount: 284,
    certificateAvailable: true,
    activityPoints: 20,
    attendanceBenefits: "Official university activity points, lunch & refreshments provided, participation e-certificate signed by HOD.",
    featured: true
  },
  {
    id: "evt-002",
    title: "HackCampus 2026: 36-Hour National Hackathon",
    shortDescription: "Build real-world solutions across FinTech, HealthTech, and Smart Cities with $15,000 in prizes.",
    description: "The biggest student hackathon in the region! Bring your team of up to 4, spend 36 intense hours coding, prototyping, and pitching before esteemed venture capitalists and tech leaders. Cloud credits, mentors, and all meals provided.",
    category: "Hackathon",
    interests: ["Web Dev", "AI & Machine Learning", "Entrepreneurship"],
    eventType: "external",
    status: "published",
    startDate: "2026-11-20T18:00:00",
    endDate: "2026-11-22T08:00:00",
    venue: "Innovation & Incubation Hub, Block 4",
    coordinates: {
      lat: 12.9725,
      lng: 77.5970
    },
    organizer: {
      name: "DevCampus Club & Google Developer Group",
      email: "team@devcampus.io",
      contactPhone: "+91 91234 56789",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80",
    eligibility: "All university students with valid student status nationwide",
    registrationRequirements: "Submit team proposal along with GitHub profiles on Devfolio.",
    registrationUrl: "https://devfolio.co/hackcampus-2026",
    isRegistrationOpen: true,
    capacity: 500,
    registeredCount: 462,
    certificateAvailable: true,
    activityPoints: 30,
    attendanceBenefits: "Cash prizes, internship interviews for top 5 teams, swag kits, DevCampus medal.",
    featured: true
  },
  {
    id: "evt-003",
    title: "Dhwani 2026: Inter-Collegiate Cultural Fiesta",
    shortDescription: "Three days of music, dance, theatrical drama, battle of the bands, and celebrity pro-nights.",
    description: "Celebrate the rich cultural diversity of our campus! Features 25+ competitive events including Eastern & Western Classical singing, Street Play, Choreonite, Fine Arts exhibitions, and an electrifying live concert on the final night.",
    category: "Cultural",
    interests: ["Music", "Dance", "Fine Arts"],
    eventType: "university",
    status: "published",
    startDate: "2026-11-28T10:00:00",
    endDate: "2026-11-30T22:00:00",
    venue: "Open Air Amphitheatre & Student Plaza",
    coordinates: {
      lat: 12.9698,
      lng: 77.5932
    },
    organizer: {
      name: "Student Cultural Committee (SCC)",
      email: "cultural@campus.edu",
      contactPhone: "+91 99887 76655",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Open to all students, alumni, and faculty",
    registrationRequirements: "Free entry with valid University Digital ID. Competition slot registration via student portal.",
    registrationUrl: "https://dhwani.campus.edu",
    isRegistrationOpen: true,
    capacity: 2500,
    registeredCount: 1890,
    certificateAvailable: true,
    // Note: Activity points intentionally omitted to verify graceful optional UI rendering
    attendanceBenefits: "Winner trophies, cultural club recognition, performance certificates.",
    featured: true
  },
  {
    id: "evt-004",
    title: "Inter-Campus Football Championship: Gold Cup",
    shortDescription: "Annual varsity football tournament featuring 16 top university squads battling for the title.",
    description: "High-octane collegiate soccer action under the floodlights. Come cheer your departmental and university teams as they compete in group stages through to the thrilling grand finale.",
    category: "Sports",
    interests: ["Sports & Fitness"],
    eventType: "university",
    status: "published",
    startDate: "2026-11-18T16:00:00",
    endDate: "2026-11-24T20:00:00",
    venue: "Main University Sports Complex - Football Field",
    coordinates: {
      lat: 12.9740,
      lng: 77.5910
    },
    organizer: {
      name: "University Athletic Directorate",
      email: "sports@campus.edu",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Registered team players for field play; spectator seating open to all",
    registrationRequirements: "Team captains must submit medical clearance and squad roster.",
    registrationUrl: "https://campus-pulse.edu/sports/gold-cup-2026",
    isRegistrationOpen: false,
    capacity: 1200,
    registeredCount: 1200,
    certificateAvailable: false,
    activityPoints: 15,
    attendanceBenefits: "Medals, University sports credits for players.",
    featured: false
  },
  {
    id: "evt-005",
    title: "Hands-on Workshop: Cloud Native Architecture with Kubernetes",
    shortDescription: "Practical masterclass on container orchestration, microservices, and automated CI/CD pipelines.",
    description: "Take your backend deployment knowledge to production standards. In this 4-hour hands-on lab, attendees will deploy microservices onto a managed Kubernetes cluster, set up ingress controllers, configure Prometheus monitoring, and secure secrets.",
    category: "Workshop",
    interests: ["Web Dev", "Cybersecurity", "Cloud"],
    eventType: "university",
    status: "published",
    startDate: "2026-11-12T14:00:00",
    endDate: "2026-11-12T18:00:00",
    venue: "Turing Lab 304, CS Academic Wing",
    coordinates: {
      lat: 12.9712,
      lng: 77.5955
    },
    organizer: {
      name: "Cloud Computing Student Chapter",
      email: "cloudclub@campus.edu",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Intermediate programmers with basic Docker and Linux familiarity",
    registrationRequirements: "BYOD (Bring Your Own Device) with Docker Desktop pre-installed.",
    registrationUrl: "https://campus-pulse.edu/workshops/k8s-cloud",
    isRegistrationOpen: true,
    capacity: 60,
    registeredCount: 54,
    certificateAvailable: true,
    activityPoints: 10,
    attendanceBenefits: "Free GCP cloud credits voucher ($50 value), digital verifiable certificate.",
    featured: false
  },
  {
    id: "evt-006",
    title: "Global Tech Leaders Lecture: Future of Autonomous Mobility",
    shortDescription: "Distinguished keynote by Dr. Elena Vance on perception algorithms and LiDAR systems in EV automation.",
    description: "The Dean's Distinguished Lecture Series welcomes global pioneer Dr. Elena Vance, VP of Autonomous Systems at Luminar Tech. Discussing level 4 self-driving vehicle perception, sensor fusion, safety verification, and ethical dilemmas.",
    category: "Academic",
    interests: ["AI & Machine Learning", "Robotics"],
    eventType: "university",
    status: "published",
    startDate: "2026-11-16T11:00:00",
    endDate: "2026-11-16T13:00:00",
    venue: "Sir C.V. Raman Auditorium",
    coordinates: {
      lat: 12.9730,
      lng: 77.5938
    },
    organizer: {
      name: "Office of Academic Affairs & Dean of Research",
      email: "dean.research@campus.edu",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Open to all faculty, research scholars, and students",
    registrationRequirements: "Free seating on first-come-first-served basis.",
    registrationUrl: "https://campus-pulse.edu/lectures/vance-mobility",
    isRegistrationOpen: true,
    capacity: 400,
    registeredCount: 310,
    certificateAvailable: false,
    activityPoints: 5,
    attendanceBenefits: "Networking high tea with research faculty.",
    featured: false
  },
  {
    id: "evt-007",
    title: "Metro City Youth Entrepreneurship Summit",
    shortDescription: "Meet 40+ angel investors, founders, and venture accelerators. Pitch your startup for seed funding.",
    description: "An external inter-college summit bringing student founders face-to-face with active early-stage investors. Features founder teardowns, legal clinic for startups, and a live pitch competition with $25k non-dilutive grant prizes.",
    category: "Social",
    interests: ["Entrepreneurship", "Career"],
    eventType: "external",
    status: "published",
    startDate: "2026-12-05T09:00:00",
    endDate: "2026-12-05T19:00:00",
    venue: "World Trade Center Conference Hall, Downtown Metro",
    coordinates: {
      lat: 12.9850,
      lng: 77.6050
    },
    organizer: {
      name: "Metro Innovation Council & Startup India",
      email: "summit@metroentrepreneurs.org",
      contactPhone: "+91 80 4455 6677",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Open to any student or early-stage team under 30 years old",
    registrationRequirements: "Requires ticket purchase or scholarship application.",
    registrationUrl: "https://metroentrepreneurs.org/summit2026",
    isRegistrationOpen: true,
    capacity: 600,
    registeredCount: 480,
    certificateAvailable: true,
    // activityPoints omitted deliberately for external event
    attendanceBenefits: "Investor pitch opportunities, 1-on-1 mentor speed dating, co-working day passes.",
    featured: false
  },
  {
    id: "evt-008",
    title: "Capture The Flag: CyberDefend 2026",
    shortDescription: "Solve jeopardy-style security challenges across reverse engineering, binary exploitation, and cryptography.",
    description: "Test your offensive and defensive cybersecurity prowess! 8-hour live CTF with beginner through advanced tracks. Organized in partnership with leading infosec industry partners.",
    category: "Hackathon",
    interests: ["Cybersecurity", "Web Dev"],
    eventType: "university",
    status: "published",
    startDate: "2026-11-25T10:00:00",
    endDate: "2026-11-25T18:00:00",
    venue: "Advanced Cybersecurity Lab, Cyber Block 2nd Floor",
    coordinates: {
      lat: 12.9705,
      lng: 77.5960
    },
    organizer: {
      name: "Campus Cybersecurity & Ethical Hacking Guild",
      email: "security-guild@campus.edu",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Enrolled university students with basic networking and Linux knowledge",
    registrationRequirements: "Individual or duo participation. Laptop with Kali / Parrot OS VM.",
    registrationUrl: "https://ctf.campuspulse.org/register",
    isRegistrationOpen: true,
    capacity: 120,
    registeredCount: 98,
    certificateAvailable: true,
    activityPoints: 25,
    attendanceBenefits: "Security vouchers, top 3 cash awards, direct interview referral to SOC team.",
    featured: false
  },
  {
    id: "evt-009",
    title: "Campus Battle of the Bands: SoundWave 2026",
    shortDescription: "Independent college acoustic and rock bands battle live for the recording contract.",
    description: "Raw talent, original compositions, and thunderous applause. Come experience the finest student bands performing indie rock, classical fusion, and acoustic sets.",
    category: "Cultural",
    interests: ["Music"],
    eventType: "university",
    status: "published",
    startDate: "2026-12-02T17:30:00",
    endDate: "2026-12-02T22:00:00",
    venue: "Student Activity Center Amphitheatre",
    coordinates: {
      lat: 12.9719,
      lng: 77.5925
    },
    organizer: {
      name: "SoundWave Music Guild",
      email: "soundwave@campus.edu",
      isVerified: false
    },
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Open to all students and music enthusiasts",
    registrationRequirements: "Walk-in entry for audience; band registration closed.",
    registrationUrl: "https://campus-pulse.edu/soundwave",
    isRegistrationOpen: true,
    capacity: 800,
    registeredCount: 650,
    certificateAvailable: false,
    activityPoints: 5,
    attendanceBenefits: "Audience choice voting badge, festival sticker pack.",
    featured: false
  },
  {
    id: "evt-010",
    title: "National Clean Energy & Climate Hack (External)",
    shortDescription: "A virtual nationwide competition to formulate scalable carbon-neutral tech initiatives.",
    description: "Partnering with the Ministry of Environment and clean-tech incubators. Work on renewable grid optimization, EV charging routing algorithms, and localized carbon footprint reduction.",
    category: "Hackathon",
    interests: ["AI & Machine Learning", "Robotics", "Career"],
    eventType: "external",
    status: "published",
    startDate: "2026-12-10T09:00:00",
    endDate: "2026-12-13T20:00:00",
    venue: "Online / Virtual Livestream (Host: Tech University of Delhi)",
    coordinates: {
      lat: 28.6139,
      lng: 77.2090
    },
    organizer: {
      name: "GreenTech Foundation India",
      email: "climate@greentech.org",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Open to all university students across India",
    registrationRequirements: "Submit team abstract on official portal.",
    registrationUrl: "https://greentech.org/hack2026",
    isRegistrationOpen: true,
    capacity: 1000,
    registeredCount: 740,
    certificateAvailable: true,
    // activityPoints not specified
    attendanceBenefits: "Grant funding for top 3 teams, incubation support.",
    featured: false
  },
  {
    id: "evt-011",
    title: "Annual Sports Meet & Track and Field Day (Draft)",
    shortDescription: "Track events, relay, shot put, long jump, and intra-hostel athletic competitions.",
    description: "Annual multi-discipline sports meet bringing together all hostels and departments. Scheduled for university sports week.",
    category: "Sports",
    interests: ["Sports & Fitness"],
    eventType: "university",
    status: "draft", // Draft event to test organizer dashboard
    startDate: "2026-12-18T08:00:00",
    endDate: "2026-12-19T18:00:00",
    venue: "University Central Track & Field Stadium",
    coordinates: {
      lat: 12.9745,
      lng: 77.5915
    },
    organizer: {
      name: "Sports Council Committee",
      email: "sports.council@campus.edu",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Hostel residents and departmental teams",
    registrationRequirements: "Internal sports roster registration pending approval.",
    registrationUrl: "https://campus-pulse.edu/sports/draft-roster",
    isRegistrationOpen: false,
    capacity: 800,
    registeredCount: 0,
    certificateAvailable: true,
    activityPoints: 20,
    attendanceBenefits: "Medals, track shields, sports scholarship points.",
    featured: false
  },
  {
    id: "evt-012",
    title: "UI/UX Design Sprint: Mobile Micro-Interactions (Cancelled)",
    shortDescription: "A hands-on Figma workshop focusing on delightful micro-interactions and motion design.",
    description: "Cancelled due to speaker travel scheduling conflict. Rescheduling will be announced soon.",
    category: "Workshop",
    interests: ["Web Dev", "Fine Arts"],
    eventType: "university",
    status: "cancelled", // Cancelled event to test organizer dashboard
    startDate: "2026-11-10T14:00:00",
    endDate: "2026-11-10T17:00:00",
    venue: "Design Studio, Architecture Wing Room 102",
    coordinates: {
      lat: 12.9690,
      lng: 77.5940
    },
    organizer: {
      name: "Campus Design Guild",
      email: "design-guild@campus.edu",
      isVerified: true
    },
    image: "https://images.unsplash.com/photo-1581291518655-9523c93269c4?auto=format&fit=crop&w=1000&q=80",
    eligibility: "Open to all students interested in product design",
    registrationRequirements: "Figma account and laptop.",
    registrationUrl: "https://campus-pulse.edu/design/cancelled",
    isRegistrationOpen: false,
    capacity: 40,
    registeredCount: 40,
    certificateAvailable: false,
    activityPoints: 0,
    attendanceBenefits: "None (Event Cancelled)",
    featured: false
  }
];

export const CATEGORIES = [
  "All",
  "Technology",
  "Hackathon",
  "Cultural",
  "Sports",
  "Workshop",
  "Academic",
  "Social"
];

export const INTEREST_TAGS = [
  "AI & Machine Learning",
  "Web Dev",
  "Robotics",
  "Cybersecurity",
  "Music",
  "Dance",
  "Fine Arts",
  "Sports & Fitness",
  "Entrepreneurship",
  "Career",
  "Cloud"
];
