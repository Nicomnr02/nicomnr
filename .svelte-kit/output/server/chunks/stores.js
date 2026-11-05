import { w as writable } from "./index2.js";
const PERSON = {
  shortName: "Nicolas Manurung",
  initials: "NM",
  title: "Software Engineer",
  locationShort: "Jakarta, ID",
  status: "Open to work",
  lede: "I design, build and ship reliable and scalable product. Here is my biodata as a schema. Drag the tables around."
};
const NAV_LINKS = [
  { href: "#me", label: "Me" },
  { href: "#lab", label: "Lab" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" }
];
const DB_TABLES = [
  {
    id: "t-person",
    label: "person",
    color: "#3b6ea8",
    x: 30,
    y: 30,
    wide: true,
    rows: [
      { id: "person.id", key: "id", value: "integer", tag: "pk" },
      { key: "full_name", value: "Nicolas Raja Oloan Manurung" },
      { key: "title", value: "Software Engineer" },
      { key: "location", value: "Jakarta, Indonesia" },
      { key: "email", value: "manurungnico02@gmail.com", isEmail: true },
      { key: "profile", value: "nicomnr.site", isLink: true, href: "https://nicomnr.site" }
    ],
    note: "Note: A software engineer who designs, builds and ships reliable software products. Has helped 3+ running businesses operate more effectively and efficiently."
  },
  {
    id: "t-skill",
    label: "skill",
    color: "#2f8f83",
    x: 640,
    y: 30,
    rows: [
      { key: "id", value: "integer", tag: "pk" },
      { id: "skill.fk", key: "person_id", value: "integer", tag: "fk" },
      { key: "Go", value: "language" },
      { key: "Javascript", value: "language" },
      { key: "PHP", value: "language" },
      { key: "Dart", value: "language" },
      { key: "SQL", value: "database" },
      { key: "NoSQL", value: "database" },
      { key: "Event-driven tools", value: "broker, cdc" },
      { key: "GCP", value: "cloud" },
      { key: "DSA", value: "core" },
      { key: "Problem solving", value: "core" },
      { key: "Design system architecture", value: "core" },
      { key: "Communication", value: "core" }
    ]
  },
  {
    id: "t-exp",
    label: "experience",
    color: "#8a5a9e",
    x: 30,
    y: 400,
    rows: [
      { key: "id", value: "integer", tag: "pk" },
      { id: "exp.fk", key: "person_id", value: "integer", tag: "fk" },
      { key: "universal_biller", value: "2025 to now" },
      { key: "los_credit_card", value: "2025" },
      { key: "madhani_one", value: "2024 to 2025" },
      { key: "kokarmina", value: "2023 to 2024" },
      { key: "remote_attendance", value: "2023" }
    ]
  },
  {
    id: "t-edu",
    label: "education",
    color: "#b0703a",
    x: 350,
    y: 430,
    rows: [
      { key: "id", value: "integer", tag: "pk" },
      { id: "edu.fk", key: "person_id", value: "integer", tag: "fk" },
      { key: "universitas_advent", value: "2020 to 2023" },
      { key: "ruangguru", value: "2022" },
      { key: "bangkit", value: "2023" }
    ]
  }
];
const EXPERIENCES = [
  {
    h: 210,
    ab: "UBS",
    t: "Universal Biller System",
    tag: "Backend",
    now: true,
    when: "Jan 2025 to present",
    role: "Backend Engineer, PT. Bank Rakyat Indonesia (Persero) Tbk.",
    loc: "Jakarta",
    pts: [
      "Built a multi-channel notification pipeline with dynamic template parameterization and batch actor dispatch.",
      "Built a secure session termination flow backed by a JWT blocker, plus custom rate limiting modules that protect MFA, OTP and password reset endpoints.",
      "Developed a full partner lifecycle and product management system with internal APIs and cross-service integration."
    ],
    st: ["Go", "PostgreSQL", "Redis cache-queue", "Kafka"]
  },
  {
    h: 150,
    ab: "LOS",
    t: "Loan Origination System, credit card program",
    tag: "Fullstack",
    when: "8 Sep to 31 Dec 2025",
    role: "Fullstack Engineer, PT. Bank Rakyat Indonesia (Persero) Tbk.",
    loc: "Jakarta",
    pts: [
      "Cached frequently accessed validation parameter lists exchanged between LOS and BRISPOT to speed up data retrieval.",
      "Tuned and sanitized 4+ frequently used queries, using proper casting and direct parameter binding to improve execution across the builder, driver and database engine.",
      "Refactored centralized response mapping, logging and caching for readability and maintainability.",
      "Resolved 2+ critical production issues in LOS Web and LOSBRICC stored procedures.",
      "Documented key system components and workflows for LOS and BRISPOT."
    ],
    st: ["JavaScript", "TypeScript", "Node.js", "Express.js", "ASP.NET", "MSSQL", "MySQL", "Redis cache-queue", "VM", "pm2"]
  },
  {
    h: 30,
    ab: "ONE",
    t: "Madhani One Superapp",
    tag: "Backend",
    when: "20 May 2024 to 31 Aug 2025",
    role: "Backend Engineer, PT. Synapsis Sinergi Digital, for PT. Madhani Talatah Nusantara",
    loc: "Jakarta",
    pts: [
      "Developed Business Travel Request (BTR): a schema covering curation, staff approval, reschedule and refund, non place of hire request revision, and ticketing.",
      "Maintained the Time Off service, improved creation and fetch performance, and made breaking changes to its core approval process.",
      "Improved the notification interval configuration service for courses, classes, tests and evaluations of Health, Safety and Environment (HSE).",
      "Worked in a CI/CD and agile flow with BA, QA, FE and DevOps."
    ],
    st: ["Go", "Fiber", "PostgreSQL", "QuestDB", "MongoDB", "Redis", "Confluent Kafka", "WebSocket", "Docker", "CI/CD", "Cloud management"]
  },
  {
    h: 280,
    ab: "KKM",
    t: "Kokarmina, Rumah Sakit Hermina",
    tag: "Backend",
    when: "20 Dec 2023 to 20 May 2024",
    role: "Backend Engineer, PT. Dimy Teknologi Indonesia",
    loc: "Bandung",
    pts: [
      "Built a disbursement and payouts service with loan terms, and a savings service integrated with a payment connector.",
      "Worked in a CI/CD and agile flow with QA, FE and DevOps."
    ],
    st: ["Go", "Echo", "MySQL", "Jenkins", "CI/CD"]
  },
  {
    h: 330,
    ab: "RAA",
    t: "Remote Attendance App",
    tag: "Intern",
    when: "18 May to 18 Aug 2023",
    role: "Backend Engineer intern, PT. Synapsis Sinergi Digital, for PT. Madhani Talatah Nusantara",
    loc: "Yogyakarta",
    pts: [
      "Developed roster scheduling, user management, role permission and system settings services using Fiber (Go), gRPC and Kafka.",
      "Worked in a CI/CD and agile flow with QA, FE and DevOps."
    ],
    st: ["Go", "Fiber", "gRPC", "PostgreSQL", "QuestDB", "MongoDB", "Redis", "Confluent Kafka", "WebSocket", "Docker", "CI/CD"]
  }
];
const EDUCATION = [
  {
    abbr: "UAI",
    name: "Universitas Advent Indonesia",
    degree: "Bachelor of Information Technology",
    score: "GPA 3.58",
    period: "Aug 2020 to Dec 2023",
    year: "2023",
    url: "https://www.unai.edu",
    title: "August 2020 to December 2023"
  },
  {
    abbr: "RG",
    name: "Ruangguru, Kampus Merdeka",
    degree: "Backend Engineering",
    score: "GPA 3.85",
    period: "Aug to Dec 2022",
    year: "2022",
    url: "https://www.ruangguru.com",
    title: "18 August to 28 December 2022"
  },
  {
    abbr: "BKT",
    name: "Bangkit by Google, GoTo, Traveloka",
    degree: "Cloud Computing",
    score: "Score 81.64 / 100",
    period: "Feb to Jul 2023",
    year: "2023",
    url: "https://bangkit.academy",
    title: "16 February to 31 July 2023"
  }
];
const CONTACT = {
  greeting: "Dear Nico,",
  topics: ["New business", "A collaboration", "Just a hello"],
  defaultTopic: "New business",
  fromPlaceholder: "Your name and email",
  msgPlaceholder: "Write your note here",
  signLabel: "SIGN HERE WITH YOUR FINGER, MOUSE OR PEN",
  statusUnsigned: "ONE REPLY, NO NEWSLETTER. NOT YET SIGNED",
  ticketHeader: "NICOLAS MANURUNG :: INTAKE",
  // Email delivery
  email: "manurungnico02@gmail.com"
};
const activeSection = writable("me");
export {
  CONTACT as C,
  DB_TABLES as D,
  EXPERIENCES as E,
  NAV_LINKS as N,
  PERSON as P,
  activeSection as a,
  EDUCATION as b
};
