var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appStore: () => appStore
});
import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";
var appStore = pgTable("app_store", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  // e.g. 'main_database'
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// src/db/index.ts
var createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15e3
    });
    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};
var pool = createPool();
var db = drizzle(pool, { schema: schema_exports });

// server.ts
import { eq } from "drizzle-orm";

// src/lib/initialData.ts
var DEFAULT_SCHOOL_SETTINGS = {
  schoolName: "ST. MICHAEL GREAT ACADEMY",
  established: 2023,
  portalTitle: "OFFICIAL RESULT PORTAL",
  motto: "Learning is fun",
  logoUrl: "/logo.png",
  activeBackgroundId: "bg-classic-parchment",
  pinLength: 5,
  customPinLength: 5,
  maxScores: {
    ca1: 20,
    ca2: 20,
    exam: 60
  },
  defaultRemarks: {
    teacherRemark: "Demonstrated commendable dedication, disciplined study habits, and consistent academic progress.",
    principalRemark: "An exceptional performance. Promoted with pride to the next academic level.",
    signedBy: "Mrs Mary"
  },
  currentSession: "2026/2027",
  currentTerm: "First Term"
};
var DEFAULT_GRADE_SCALES = [
  { id: "gr-1", gradeLetter: "A", minScore: 75, maxScore: 100, remark: "Distinction" },
  { id: "gr-2", gradeLetter: "B", minScore: 65, maxScore: 74, remark: "Very Good" },
  { id: "gr-3", gradeLetter: "C", minScore: 50, maxScore: 64, remark: "Credit" },
  { id: "gr-4", gradeLetter: "D", minScore: 45, maxScore: 49, remark: "Pass" },
  { id: "gr-5", gradeLetter: "E", minScore: 40, maxScore: 44, remark: "Fair" },
  { id: "gr-6", gradeLetter: "F", minScore: 0, maxScore: 39, remark: "Fail" }
];
var INITIAL_ACADEMIC_SESSIONS = [
  { id: "sess-1", session: "2026/2027", isCurrent: true },
  { id: "sess-2", session: "2027/2028", isCurrent: false },
  { id: "sess-3", session: "2028/2029", isCurrent: false },
  { id: "sess-4", session: "2029/2030", isCurrent: false },
  { id: "sess-5", session: "2030/2031", isCurrent: false },
  { id: "sess-6", session: "2031/2032", isCurrent: false }
];
var BUILTIN_RESULT_BACKGROUNDS = [
  {
    id: "bg-classic-parchment",
    name: "Classic Academic Parchment",
    type: "builtin",
    themeStyle: "parchment",
    isProtected: true
  },
  {
    id: "bg-royal-navy",
    name: "Royal Navy & 24K Gold",
    type: "builtin",
    themeStyle: "royal-navy",
    isProtected: true
  },
  {
    id: "bg-ivory-crest",
    name: "Ivory Crest Watermark",
    type: "builtin",
    themeStyle: "ivory-crest",
    isProtected: true
  },
  {
    id: "bg-golden-academic",
    name: "Golden Guilloche Security",
    type: "builtin",
    themeStyle: "golden-academic",
    isProtected: true
  },
  {
    id: "bg-vintage-diploma",
    name: "Vintage Master Diploma",
    type: "builtin",
    themeStyle: "vintage-diploma",
    isProtected: true
  },
  {
    id: "bg-renaissance-scroll",
    name: "Renaissance Heraldic Scroll",
    type: "builtin",
    themeStyle: "renaissance-scroll",
    isProtected: true
  },
  {
    id: "bg-modern-minimalist",
    name: "Modern Academic Minimalist",
    type: "builtin",
    themeStyle: "modern-minimalist",
    isProtected: true
  },
  {
    id: "bg-regal-damask",
    name: "Regal Gold Damask Weave",
    type: "builtin",
    themeStyle: "regal-damask",
    isProtected: true
  },
  {
    id: "bg-emerald-academic",
    name: "Teal & Gold Laureate",
    type: "builtin",
    themeStyle: "emerald-academic",
    isProtected: true
  },
  {
    id: "bg-celestial-stars",
    name: "Academy Constellation Stars",
    type: "builtin",
    themeStyle: "celestial-stars",
    isProtected: true
  },
  {
    id: "bg-classic-monogram",
    name: "Security Microline Monogram",
    type: "builtin",
    themeStyle: "classic-monogram",
    isProtected: true
  },
  {
    id: "bg-honors-ribbon",
    name: "Presidential Honors Ribbon",
    type: "builtin",
    themeStyle: "honors-ribbon",
    isProtected: true
  }
];
function calculateGrade(totalScore, scales) {
  for (const scale of scales) {
    if (totalScore >= scale.minScore && totalScore <= scale.maxScore) {
      return { grade: scale.gradeLetter, remark: scale.remark };
    }
  }
  return { grade: "F", remark: "Fail" };
}

// src/lib/supabaseSync.ts
import https from "https";
var DEFAULT_SUPABASE_URL = "https://aznwqnfvljtqqbijxvbg.supabase.co";
var DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bndxbmZ2bGp0cXFiaWp4dmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjYwMTUsImV4cCI6MjEwNDMwMjAxNX0.7ybbnCFAqCA6NKw4FNYsI2bQO2CiDOXuM6DGkSTE9sU";
function getSupabaseConfig() {
  const envUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const url = envUrl && typeof envUrl === "string" && envUrl.trim().startsWith("http") ? envUrl.trim() : DEFAULT_SUPABASE_URL;
  const key = envKey && typeof envKey === "string" && envKey.trim().startsWith("eyJ") ? envKey.trim() : DEFAULT_SUPABASE_KEY;
  return { url, key };
}
var { url: SUPABASE_URL, key: SUPABASE_KEY } = getSupabaseConfig();
function supabaseRequest(path2, method = "GET", body = null) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(path2.startsWith("http") ? path2 : `${SUPABASE_URL}/rest/v1/${path2}`);
      const headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation"
      };
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method,
        headers
      };
      const req = https.request(options, (res) => {
        let raw = "";
        res.on("data", (chunk) => raw += chunk);
        res.on("end", () => {
          try {
            const data = raw ? JSON.parse(raw) : null;
            resolve({ status: res.statusCode || 200, data });
          } catch {
            resolve({ status: res.statusCode || 200, data: raw });
          }
        });
      });
      req.on("error", (err) => {
        console.error("[Supabase Sync Error]:", err.message);
        resolve({ status: 500, data: null });
      });
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    } catch (err) {
      console.error("[Supabase Exception]:", err?.message);
      resolve({ status: 500, data: null });
    }
  });
}
async function syncDatabaseToSupabase(dbData) {
  if (!dbData) return;
  try {
    if (dbData.settings) {
      await supabaseRequest("school_settings?id=eq.current", "PATCH", {
        id: "current",
        school_name: dbData.settings.schoolName || dbData.settings.name || "ST. MICHAEL GREAT ACADEMY",
        school_motto: dbData.settings.motto || "Learning is fun",
        portal_title: dbData.settings.portalTitle || "OFFICIAL RESULT PORTAL",
        first_ca_max: dbData.settings.maxScores?.ca1 ?? dbData.settings.firstCaMax ?? 20,
        second_ca_max: dbData.settings.maxScores?.ca2 ?? dbData.settings.secondCaMax ?? 20,
        exam_max: dbData.settings.maxScores?.exam ?? dbData.settings.examMax ?? 60,
        overall_max: (dbData.settings.maxScores?.ca1 ?? 20) + (dbData.settings.maxScores?.ca2 ?? 20) + (dbData.settings.maxScores?.exam ?? 60),
        class_teacher_remark_default: dbData.settings.defaultRemarks?.teacherRemark || null,
        head_teacher_remark_default: dbData.settings.defaultRemarks?.principalRemark || null,
        result_signed_by: dbData.settings.defaultRemarks?.signedBy || null,
        pin_length: dbData.settings.pinLength || 5,
        current_session: dbData.settings.currentSession || "2026/2027",
        current_term: dbData.settings.currentTerm || "First Term",
        active_background_id: dbData.settings.activeBackgroundId || "bg-classic-parchment",
        grade_scales: dbData.gradeScales || [],
        sessions: dbData.sessions || [],
        terms: ["First Term", "Second Term", "Third Term"],
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (Array.isArray(dbData.students)) {
      for (const s of dbData.students) {
        await supabaseRequest("students?on_conflict=student_number", "POST", {
          id: s.id,
          student_number: s.studentNumber,
          full_name: s.fullName,
          current_class: s.className,
          gender: s.gender || "Not Specified",
          guardian_phone: s.guardianContact || s.guardianPhone || null,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    if (Array.isArray(dbData.results)) {
      for (const r of dbData.results) {
        await supabaseRequest("results?on_conflict=student_id,session,term", "POST", {
          id: r.id,
          student_id: r.studentId,
          student_number: r.studentNumber,
          student_full_name: r.studentFullName,
          session: r.academicSession || "2026/2027",
          term: r.term || "First Term",
          class: r.className,
          subjects: r.subjects || [],
          total_score: r.totalScore,
          percentage: r.averageScore,
          overall_grade: r.overallGrade,
          class_teacher_remark: r.teacherRemark,
          head_teacher_remark: r.principalRemark,
          result_signed_by: r.signedBy || dbData.settings?.defaultRemarks?.signedBy || "Mrs Mary",
          is_published: r.isPublished !== false,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    if (Array.isArray(dbData.pins)) {
      for (const p of dbData.pins) {
        await supabaseRequest("pins?on_conflict=pin", "POST", {
          id: p.id,
          pin: p.pin,
          student_id: p.studentId,
          student_number: p.studentNumber,
          student_full_name: p.studentFullName,
          session: p.academicSession || "2026/2027",
          term: p.term || "First Term",
          status: p.status || "UNUSED",
          used_at: p.usedAt || null,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
  } catch (err) {
    console.error("[Supabase Full Sync Exception]:", err?.message);
  }
}
async function loadDatabaseFromSupabase() {
  try {
    const [studentsRes, resultsRes, pinsRes, settingsRes] = await Promise.all([
      supabaseRequest("students?select=*"),
      supabaseRequest("results?select=*"),
      supabaseRequest("pins?select=*"),
      supabaseRequest("school_settings?id=eq.current&limit=1")
    ]);
    if (studentsRes.status !== 200 || !Array.isArray(studentsRes.data)) {
      return null;
    }
    const students = (studentsRes.data || []).map((s) => ({
      id: s.id,
      studentNumber: s.student_number,
      fullName: s.full_name,
      className: s.current_class || "JSS 1",
      gender: s.gender || "Not Specified",
      guardianContact: s.guardian_phone || "",
      createdAt: s.created_at || (/* @__PURE__ */ new Date()).toISOString()
    }));
    const pins = (pinsRes.data || []).map((p) => ({
      id: p.id,
      pin: p.pin,
      studentId: p.student_id,
      studentNumber: p.student_number,
      studentFullName: p.student_full_name,
      resultId: "",
      academicSession: p.session || "2026/2027",
      term: p.term || "First Term",
      status: p.status || "UNUSED",
      usedAt: p.used_at || null,
      createdAt: p.created_at || (/* @__PURE__ */ new Date()).toISOString()
    }));
    const results = (resultsRes.data || []).map((r) => {
      const matchingPin = pins.find((p) => p.studentNumber === r.student_number && p.term === r.term);
      const pinCode = matchingPin ? matchingPin.pin : "";
      if (matchingPin) {
        matchingPin.resultId = r.id;
      }
      return {
        id: r.id,
        studentId: r.student_id,
        studentNumber: r.student_number,
        studentFullName: r.student_full_name,
        className: r.class,
        academicSession: r.session || "2026/2027",
        term: r.term || "First Term",
        pin: pinCode,
        isPublished: r.is_published !== false,
        subjects: Array.isArray(r.subjects) ? r.subjects : [],
        totalScore: Number(r.total_score) || 0,
        averageScore: Number(r.percentage) || 0,
        overallGrade: r.overall_grade || "A",
        teacherRemark: r.class_teacher_remark || "Distinction",
        principalRemark: r.head_teacher_remark || "Promoted",
        signedBy: r.result_signed_by || "Mrs Mary",
        createdAt: r.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: r.updated_at || (/* @__PURE__ */ new Date()).toISOString()
      };
    });
    let settings = null;
    let gradeScales = void 0;
    let sessions = void 0;
    if (settingsRes.status === 200 && Array.isArray(settingsRes.data) && settingsRes.data.length > 0) {
      const s = settingsRes.data[0];
      settings = {
        schoolName: s.school_name || "ST. MICHAEL GREAT ACADEMY",
        portalTitle: s.portal_title || "OFFICIAL RESULT PORTAL",
        motto: s.school_motto || "Learning is fun",
        maxScores: {
          ca1: s.first_ca_max ?? 20,
          ca2: s.second_ca_max ?? 20,
          exam: s.exam_max ?? 60
        },
        defaultRemarks: {
          teacherRemark: s.class_teacher_remark_default || "Hardworking and focused. Maintain this momentum.",
          principalRemark: s.head_teacher_remark_default || "A wonderful academic display. Promoted with distinction.",
          signedBy: s.result_signed_by || "Rev. Fr. Michael / Administrator"
        },
        pinLength: s.pin_length || 5,
        activeBackgroundId: s.active_background_id || "bg-classic-parchment",
        currentSession: s.current_session || "2026/2027",
        currentTerm: s.current_term || "First Term"
      };
      if (Array.isArray(s.grade_scales) && s.grade_scales.length > 0) {
        gradeScales = s.grade_scales;
      }
      if (Array.isArray(s.sessions) && s.sessions.length > 0) {
        sessions = s.sessions;
      }
    }
    return { students, results, pins, settings, gradeScales, sessions };
  } catch (err) {
    console.error("[Supabase Load Exception]:", err?.message);
    return null;
  }
}

// server.ts
var app = express();
var PORT = 3e3;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
var DATA_DIR = process.env.VERCEL ? "/tmp/data" : path.join(process.cwd(), "data");
var UPLOADS_DIR = process.env.VERCEL ? "/tmp/uploads" : path.join(process.cwd(), "public", "uploads");
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
}
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
}
app.use("/uploads", express.static(UPLOADS_DIR));
var DB_FILE = path.join(DATA_DIR, "db.json");
function hashPassword(password) {
  return crypto.createHash("sha256").update(password.trim()).digest("hex");
}
function generateNumericPin(length, existingPins) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  let attempts = 0;
  while (attempts < 1e3) {
    const pin = Math.floor(min + Math.random() * (max - min + 1)).toString();
    if (!existingPins.has(pin)) {
      return pin;
    }
    attempts++;
  }
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}
var activeSessions = /* @__PURE__ */ new Set();
function loadDatabase() {
  const starterStudents = [
    {
      id: "std-sma-0001",
      studentNumber: "SMA-0001",
      fullName: "Chukwuemeka David Emmanuel",
      className: "JSS 1 Gold",
      gender: "Male",
      guardianContact: "+234 803 123 4567",
      createdAt: "2026-09-01T08:00:00.000Z"
    },
    {
      id: "std-sma-0002",
      studentNumber: "SMA-0002",
      fullName: "Fatima Zahra Mohammed",
      className: "JSS 2 Diamond",
      gender: "Female",
      guardianContact: "+234 802 987 6543",
      createdAt: "2026-09-01T08:30:00.000Z"
    },
    {
      id: "std-sma-0003",
      studentNumber: "SMA-0003",
      fullName: "Divine Favour Olumide",
      className: "SSS 1 Science",
      gender: "Female",
      guardianContact: "+234 809 555 1212",
      createdAt: "2026-09-01T09:00:00.000Z"
    }
  ];
  const starterResults = [
    {
      id: "res-sma-0001-1",
      studentId: "std-sma-0001",
      studentNumber: "SMA-0001",
      studentFullName: "Chukwuemeka David Emmanuel",
      className: "JSS 1 Gold",
      academicSession: "2026/2027",
      term: "First Term",
      pin: "54821",
      isPublished: true,
      subjects: [
        { id: "sub-1", subject: "Mathematics", ca1: 18, ca2: 19, exam: 54, total: 91, grade: "A", remark: "Distinction" },
        { id: "sub-2", subject: "English Language", ca1: 17, ca2: 18, exam: 50, total: 85, grade: "A", remark: "Distinction" },
        { id: "sub-3", subject: "Basic Science & Technology", ca1: 19, ca2: 18, exam: 51, total: 88, grade: "A", remark: "Distinction" },
        { id: "sub-4", subject: "Social Studies", ca1: 16, ca2: 17, exam: 47, total: 80, grade: "A", remark: "Distinction" },
        { id: "sub-5", subject: "Civic Education", ca1: 18, ca2: 18, exam: 52, total: 88, grade: "A", remark: "Distinction" },
        { id: "sub-6", subject: "Agricultural Science", ca1: 17, ca2: 16, exam: 48, total: 81, grade: "A", remark: "Distinction" },
        { id: "sub-7", subject: "Computer Studies / ICT", ca1: 20, ca2: 20, exam: 56, total: 96, grade: "A", remark: "Distinction" },
        { id: "sub-8", subject: "Business Studies", ca1: 16, ca2: 17, exam: 45, total: 78, grade: "A", remark: "Distinction" },
        { id: "sub-9", subject: "Christian Religious Studies", ca1: 19, ca2: 19, exam: 53, total: 91, grade: "A", remark: "Distinction" },
        { id: "sub-10", subject: "Physical & Health Education", ca1: 18, ca2: 17, exam: 49, total: 84, grade: "A", remark: "Distinction" }
      ],
      totalScore: 862,
      averageScore: 86.2,
      overallGrade: "A",
      teacherRemark: "An exceptional, diligent, and well-behaved student. Consistently punctual and proactive.",
      principalRemark: "Outstanding academic performance. A true ambassador of academic excellence.",
      signedBy: "Rev. Fr. Michael / Administrator",
      createdAt: "2026-09-02T10:00:00.000Z",
      updatedAt: "2026-09-02T10:00:00.000Z"
    },
    {
      id: "res-sma-0002-1",
      studentId: "std-sma-0002",
      studentNumber: "SMA-0002",
      studentFullName: "Fatima Zahra Mohammed",
      className: "JSS 2 Diamond",
      academicSession: "2026/2027",
      term: "First Term",
      pin: "89342",
      isPublished: true,
      subjects: [
        { id: "sub-201", subject: "Mathematics", ca1: 19, ca2: 18, exam: 56, total: 93, grade: "A", remark: "Distinction" },
        { id: "sub-202", subject: "English Language", ca1: 19, ca2: 19, exam: 53, total: 91, grade: "A", remark: "Distinction" },
        { id: "sub-203", subject: "Basic Science & Technology", ca1: 17, ca2: 18, exam: 52, total: 87, grade: "A", remark: "Distinction" },
        { id: "sub-204", subject: "Social Studies", ca1: 18, ca2: 17, exam: 49, total: 84, grade: "A", remark: "Distinction" },
        { id: "sub-205", subject: "Computer Studies / ICT", ca1: 20, ca2: 20, exam: 58, total: 98, grade: "A", remark: "Distinction" },
        { id: "sub-206", subject: "Agricultural Science", ca1: 16, ca2: 17, exam: 50, total: 83, grade: "A", remark: "Distinction" },
        { id: "sub-207", subject: "Civic Education", ca1: 18, ca2: 19, exam: 51, total: 88, grade: "A", remark: "Distinction" },
        { id: "sub-208", subject: "French Language", ca1: 18, ca2: 18, exam: 54, total: 90, grade: "A", remark: "Distinction" }
      ],
      totalScore: 714,
      averageScore: 89.25,
      overallGrade: "A",
      teacherRemark: "Brilliant intellectual aptitude, exemplary leadership, and immaculate handwriting.",
      principalRemark: "Highest standing in JSS 2. Keep aiming for the pinnacle of academic distinction.",
      signedBy: "Rev. Fr. Michael / Administrator",
      createdAt: "2026-09-02T10:30:00.000Z",
      updatedAt: "2026-09-02T10:30:00.000Z"
    },
    {
      id: "res-sma-0003-1",
      studentId: "std-sma-0003",
      studentNumber: "SMA-0003",
      studentFullName: "Divine Favour Olumide",
      className: "SSS 1 Science",
      academicSession: "2026/2027",
      term: "First Term",
      pin: "71209",
      isPublished: true,
      subjects: [
        { id: "sub-301", subject: "Mathematics", ca1: 20, ca2: 19, exam: 57, total: 96, grade: "A", remark: "Distinction" },
        { id: "sub-302", subject: "English Language", ca1: 18, ca2: 18, exam: 52, total: 88, grade: "A", remark: "Distinction" },
        { id: "sub-303", subject: "Physics", ca1: 19, ca2: 19, exam: 54, total: 92, grade: "A", remark: "Distinction" },
        { id: "sub-304", subject: "Chemistry", ca1: 17, ca2: 18, exam: 50, total: 85, grade: "A", remark: "Distinction" },
        { id: "sub-305", subject: "Biology", ca1: 18, ca2: 17, exam: 53, total: 88, grade: "A", remark: "Distinction" },
        { id: "sub-306", subject: "Further Mathematics", ca1: 19, ca2: 20, exam: 55, total: 94, grade: "A", remark: "Distinction" },
        { id: "sub-307", subject: "Technical Drawing", ca1: 17, ca2: 18, exam: 51, total: 86, grade: "A", remark: "Distinction" }
      ],
      totalScore: 629,
      averageScore: 89.86,
      overallGrade: "A",
      teacherRemark: "Analytical mind with great scientific curiosity. Excellent laboratory conduct.",
      principalRemark: "Superb scientific mastery. Commended by the Faculty Board of Examiners.",
      signedBy: "Rev. Fr. Michael / Administrator",
      createdAt: "2026-09-02T11:00:00.000Z",
      updatedAt: "2026-09-02T11:00:00.000Z"
    }
  ];
  const starterPins = [
    {
      id: "pin-sma-0001-1",
      pin: "54821",
      studentId: "std-sma-0001",
      studentNumber: "SMA-0001",
      studentFullName: "Chukwuemeka David Emmanuel",
      resultId: "res-sma-0001-1",
      academicSession: "2026/2027",
      term: "First Term",
      status: "UNUSED",
      usedAt: null,
      createdAt: "2026-09-02T10:00:00.000Z"
    },
    {
      id: "pin-sma-0002-1",
      pin: "89342",
      studentId: "std-sma-0002",
      studentNumber: "SMA-0002",
      studentFullName: "Fatima Zahra Mohammed",
      resultId: "res-sma-0002-1",
      academicSession: "2026/2027",
      term: "First Term",
      status: "UNUSED",
      usedAt: null,
      createdAt: "2026-09-02T10:30:00.000Z"
    },
    {
      id: "pin-sma-0003-1",
      pin: "71209",
      studentId: "std-sma-0003",
      studentNumber: "SMA-0003",
      studentFullName: "Divine Favour Olumide",
      resultId: "res-sma-0003-1",
      academicSession: "2026/2027",
      term: "First Term",
      status: "UNUSED",
      usedAt: null,
      createdAt: "2026-09-02T11:00:00.000Z"
    }
  ];
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.students)) {
        return {
          settings: parsed.settings || DEFAULT_SCHOOL_SETTINGS,
          students: parsed.students,
          results: parsed.results || [],
          pins: parsed.pins || [],
          gradeScales: parsed.gradeScales || DEFAULT_GRADE_SCALES,
          sessions: parsed.sessions || INITIAL_ACADEMIC_SESSIONS,
          backgrounds: parsed.backgrounds && parsed.backgrounds.length > 0 ? parsed.backgrounds : BUILTIN_RESULT_BACKGROUNDS,
          monitoringLogs: parsed.monitoringLogs || [],
          adminPasswordHash: parsed.adminPasswordHash || hashPassword("Mary12345+")
        };
      }
    } catch (err) {
      console.error("Error reading database file:", err);
    }
  }
  const BAKED_DB_FILE = path.join(process.cwd(), "src", "lib", "bakedDatabase.json");
  if (fs.existsSync(BAKED_DB_FILE)) {
    try {
      const bakedData = JSON.parse(fs.readFileSync(BAKED_DB_FILE, "utf-8"));
      if (bakedData && Array.isArray(bakedData.students)) {
        saveDatabase(bakedData);
        return bakedData;
      }
    } catch {
    }
  }
  const initialDb = {
    settings: DEFAULT_SCHOOL_SETTINGS,
    students: starterStudents,
    results: starterResults,
    pins: starterPins,
    gradeScales: DEFAULT_GRADE_SCALES,
    sessions: INITIAL_ACADEMIC_SESSIONS,
    backgrounds: BUILTIN_RESULT_BACKGROUNDS,
    monitoringLogs: [],
    adminPasswordHash: hashPassword("Mary12345+")
    // Default administrator credential
  };
  saveDatabase(initialDb);
  return initialDb;
}
async function saveDatabase(dataToSave) {
  try {
    const tempPath = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), "utf-8");
    fs.renameSync(tempPath, DB_FILE);
  } catch (err) {
    console.error("Failed to save database to local cache:", err);
  }
  if (process.env.SQL_HOST && process.env.SQL_USER) {
    db.insert(appStore).values({
      key: "main_database",
      data: dataToSave,
      updatedAt: /* @__PURE__ */ new Date()
    }).onConflictDoUpdate({
      target: appStore.key,
      set: {
        data: dataToSave,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).then(() => {
    }).catch((err) => {
      console.error("Cloud SQL async persistence notice:", err?.message || err);
    });
  }
  try {
    await syncDatabaseToSupabase(dataToSave);
  } catch (err) {
    console.error("Supabase sync notice:", err?.message || err);
  }
}
var database = loadDatabase();
async function initCloudSqlData() {
  if (process.env.SQL_HOST && process.env.SQL_USER) {
    try {
      const records = await db.select().from(appStore).where(eq(appStore.key, "main_database")).limit(1);
      if (records.length > 0 && records[0].data) {
        const remoteData = records[0].data;
        if (remoteData && Array.isArray(remoteData.students)) {
          database = remoteData;
          try {
            fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), "utf-8");
          } catch {
          }
          console.log(`[Cloud SQL] Loaded permanent database with ${database.students.length} students, ${database.results.length} results.`);
          return;
        }
      }
      await db.insert(appStore).values({
        key: "main_database",
        data: database,
        updatedAt: /* @__PURE__ */ new Date()
      }).onConflictDoNothing();
      console.log("[Cloud SQL] Initialized permanent database store.");
    } catch (err) {
      console.error("[Cloud SQL] Notice on startup:", err);
    }
  }
}
initCloudSqlData();
async function initSupabaseData() {
  try {
    const supabaseData = await loadDatabaseFromSupabase();
    if (supabaseData && Array.isArray(supabaseData.students) && supabaseData.students.length > 0) {
      const existingMap = new Map(database.students.map((s) => [s.studentNumber, s]));
      supabaseData.students.forEach((s) => {
        existingMap.set(s.studentNumber, s);
      });
      database.students = Array.from(existingMap.values());
      if (Array.isArray(supabaseData.results) && supabaseData.results.length > 0) {
        const resMap = new Map(database.results.map((r) => [`${r.studentNumber}-${r.term}`, r]));
        supabaseData.results.forEach((r) => {
          resMap.set(`${r.studentNumber}-${r.term}`, r);
        });
        database.results = Array.from(resMap.values());
      }
      if (Array.isArray(supabaseData.pins) && supabaseData.pins.length > 0) {
        const pinMap = new Map(database.pins.map((p) => [p.pin, p]));
        supabaseData.pins.forEach((p) => {
          pinMap.set(p.pin, p);
        });
        database.pins = Array.from(pinMap.values());
      }
      if (supabaseData.settings) {
        database.settings = { ...database.settings, ...supabaseData.settings };
      }
      if (Array.isArray(supabaseData.gradeScales) && supabaseData.gradeScales.length > 0) {
        database.gradeScales = supabaseData.gradeScales;
      }
      if (Array.isArray(supabaseData.sessions) && supabaseData.sessions.length > 0) {
        database.sessions = supabaseData.sessions;
      }
      console.log(`[Supabase] Live database synchronized: ${database.students.length} students, ${database.results.length} results, ${database.pins.length} PINs.`);
    }
  } catch (err) {
    console.error("[Supabase Init Notice]:", err?.message || err);
  }
}
initSupabaseData();
function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Admin authentication required." });
  }
  const token = authHeader.substring(7);
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
  next();
}
app.get("/api/public/config", (req, res) => {
  const activeBg = database.backgrounds.find((b) => b.id === database.settings.activeBackgroundId) || database.backgrounds[0];
  const publicConfig = {
    schoolName: database.settings.schoolName,
    established: database.settings.established,
    portalTitle: database.settings.portalTitle,
    motto: database.settings.motto,
    logoUrl: database.settings.logoUrl,
    signedBy: database.settings.defaultRemarks.signedBy || "Rev. Fr. Michael / Administrator",
    activeBackground: activeBg
  };
  return res.json(publicConfig);
});
app.post("/api/public/verify-result", (req, res) => {
  const { studentFullName, pin } = req.body;
  if (!studentFullName || !pin || !studentFullName.toString().trim() || !pin.toString().trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter your full name and result PIN."
    });
  }
  const queryName = studentFullName.toString().trim();
  const queryPin = pin.toString().trim();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const pinRecord = database.pins.find((p) => p.pin === queryPin);
  const isNameMatch = pinRecord && pinRecord.studentFullName.trim().toLowerCase() === queryName.toLowerCase();
  if (!pinRecord || !isNameMatch) {
    const log2 = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      studentFullName: queryName,
      studentNumber: pinRecord ? pinRecord.studentNumber : "UNKNOWN",
      academicSession: pinRecord ? pinRecord.academicSession : database.settings.currentSession,
      term: pinRecord ? pinRecord.term : database.settings.currentTerm,
      pin: queryPin,
      pinStatus: pinRecord ? pinRecord.status : "UNUSED",
      userAgent: req.headers["user-agent"] || "Unknown",
      success: false,
      message: "Incorrect student name or PIN."
    };
    database.monitoringLogs.unshift(log2);
    saveDatabase(database);
    return res.status(400).json({
      success: false,
      message: "Incorrect student name or PIN. Please check your details and try again."
    });
  }
  const result = database.results.find((r) => r.id === pinRecord.resultId);
  if (!result || !result.isPublished) {
    const log2 = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      studentFullName: pinRecord.studentFullName,
      studentNumber: pinRecord.studentNumber,
      academicSession: pinRecord.academicSession,
      term: pinRecord.term,
      pin: pinRecord.pin,
      pinStatus: pinRecord.status,
      userAgent: req.headers["user-agent"] || "Unknown",
      success: false,
      message: "Result not yet published."
    };
    database.monitoringLogs.unshift(log2);
    saveDatabase(database);
    return res.status(400).json({
      success: false,
      message: "Your result is not yet available. Please contact the school."
    });
  }
  if (pinRecord.status === "USED") {
    const log2 = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now,
      studentFullName: pinRecord.studentFullName,
      studentNumber: pinRecord.studentNumber,
      academicSession: pinRecord.academicSession,
      term: pinRecord.term,
      pin: pinRecord.pin,
      pinStatus: "USED",
      userAgent: req.headers["user-agent"] || "Unknown",
      success: false,
      message: "PIN already used."
    };
    database.monitoringLogs.unshift(log2);
    saveDatabase(database);
    return res.status(400).json({
      success: false,
      message: "This result PIN has already been used. Please contact the school."
    });
  }
  pinRecord.status = "USED";
  pinRecord.usedAt = now;
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    studentFullName: pinRecord.studentFullName,
    studentNumber: pinRecord.studentNumber,
    academicSession: pinRecord.academicSession,
    term: pinRecord.term,
    pin: pinRecord.pin,
    pinStatus: "USED",
    userAgent: req.headers["user-agent"] || "Unknown",
    success: true,
    message: "Result verified successfully."
  };
  database.monitoringLogs.unshift(log);
  saveDatabase(database);
  const activeBg = database.backgrounds.find((b) => b.id === database.settings.activeBackgroundId) || database.backgrounds[0];
  return res.json({
    success: true,
    message: "Result verified successfully.",
    result,
    schoolSettings: {
      schoolName: database.settings.schoolName,
      established: database.settings.established,
      portalTitle: database.settings.portalTitle,
      motto: database.settings.motto,
      logoUrl: database.settings.logoUrl,
      signedBy: database.settings.defaultRemarks.signedBy || "Rev. Fr. Michael / Administrator",
      activeBackground: activeBg
    },
    background: activeBg
  });
});
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password or PIN is required." });
  }
  const incomingHash = hashPassword(password);
  const isValid = incomingHash === database.adminPasswordHash;
  if (!isValid) {
    return res.status(401).json({ error: "Invalid Admin credentials." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.add(token);
  return res.json({
    success: true,
    token,
    message: "Authenticated successfully."
  });
});
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: "Logged out successfully." });
});
app.post("/api/admin/change-credential", authAdmin, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Both old and new passwords are required." });
  }
  if (hashPassword(oldPassword) !== database.adminPasswordHash) {
    return res.status(400).json({ error: "Current password is incorrect." });
  }
  if (newPassword.trim().length < 4) {
    return res.status(400).json({ error: "New password must be at least 4 characters." });
  }
  database.adminPasswordHash = hashPassword(newPassword);
  saveDatabase(database);
  return res.json({
    success: true,
    message: "Admin credential updated successfully. Old credential is now invalid."
  });
});
app.get("/api/admin/data", authAdmin, (req, res) => {
  return res.json({
    settings: database.settings,
    students: database.students,
    results: database.results,
    pins: database.pins,
    gradeScales: database.gradeScales,
    sessions: database.sessions,
    backgrounds: database.backgrounds,
    monitoringLogs: database.monitoringLogs
  });
});
app.post("/api/admin/settings", authAdmin, async (req, res) => {
  const newSettings = req.body;
  database.settings = { ...database.settings, ...newSettings };
  if (newSettings.defaultRemarks?.signedBy) {
    const globalSign = newSettings.defaultRemarks.signedBy.trim();
    database.results.forEach((r) => {
      r.signedBy = globalSign;
    });
  }
  await saveDatabase(database);
  return res.json({ success: true, settings: database.settings, results: database.results });
});
app.post("/api/admin/students/save", authAdmin, async (req, res) => {
  const studentData = req.body;
  if (!studentData.fullName || !studentData.studentNumber || !studentData.className) {
    return res.status(400).json({ error: "Full Name, Student Number, and Class are required." });
  }
  const duplicate = database.students.find(
    (s) => s.studentNumber.trim().toUpperCase() === studentData.studentNumber.trim().toUpperCase() && s.id !== studentData.id
  );
  if (duplicate) {
    return res.status(400).json({ error: `Student number "${studentData.studentNumber}" is already assigned to ${duplicate.fullName}.` });
  }
  const existingIndex = database.students.findIndex((s) => s.id === studentData.id);
  if (existingIndex >= 0) {
    const oldNumber = database.students[existingIndex].studentNumber;
    database.students[existingIndex] = { ...studentData };
    if (oldNumber !== studentData.studentNumber) {
      database.results.forEach((r) => {
        if (r.studentId === studentData.id || r.studentNumber === oldNumber) {
          r.studentNumber = studentData.studentNumber;
          r.studentFullName = studentData.fullName;
        }
      });
      database.pins.forEach((p) => {
        if (p.studentId === studentData.id || p.studentNumber === oldNumber) {
          p.studentNumber = studentData.studentNumber;
          p.studentFullName = studentData.fullName;
        }
      });
    }
  } else {
    database.students.push({
      ...studentData,
      id: studentData.id || `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  await saveDatabase(database);
  return res.json({ success: true, students: database.students });
});
app.post("/api/admin/students/delete", authAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Student ID is required." });
  database.students = database.students.filter((s) => s.id !== id);
  database.results = database.results.filter((r) => r.studentId !== id);
  database.pins = database.pins.filter((p) => p.studentId !== id);
  await saveDatabase(database);
  await Promise.all([
    supabaseRequest(`students?id=eq.${encodeURIComponent(id)}`, "DELETE").catch(() => {
    }),
    supabaseRequest(`results?student_id=eq.${encodeURIComponent(id)}`, "DELETE").catch(() => {
    }),
    supabaseRequest(`pins?student_id=eq.${encodeURIComponent(id)}`, "DELETE").catch(() => {
    })
  ]);
  return res.json({ success: true, students: database.students });
});
app.post("/api/admin/results/save", authAdmin, async (req, res) => {
  const resultData = req.body;
  if (!resultData.studentId || !resultData.className || !resultData.academicSession || !resultData.term) {
    return res.status(400).json({ error: "Student, Class, Academic Session, and Term are required." });
  }
  const student = database.students.find((s) => s.id === resultData.studentId);
  if (!student) {
    return res.status(400).json({ error: "Selected student does not exist." });
  }
  const maxCa1 = database.settings.maxScores.ca1;
  const maxCa2 = database.settings.maxScores.ca2;
  const maxExam = database.settings.maxScores.exam;
  const validatedSubjects = (resultData.subjects || []).map((subj) => {
    const ca1 = Math.min(Math.max(0, Number(subj.ca1) || 0), maxCa1);
    const ca2 = Math.min(Math.max(0, Number(subj.ca2) || 0), maxCa2);
    const exam = Math.min(Math.max(0, Number(subj.exam) || 0), maxExam);
    const total = ca1 + ca2 + exam;
    const { grade, remark } = calculateGrade(total, database.gradeScales);
    return {
      id: subj.id || `subj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subject: subj.subject.trim(),
      ca1,
      ca2,
      exam,
      total,
      grade,
      remark
    };
  });
  const totalScore = validatedSubjects.reduce((sum, s) => sum + s.total, 0);
  const averageScore = validatedSubjects.length > 0 ? Number((totalScore / validatedSubjects.length).toFixed(1)) : 0;
  const overallGrade = calculateGrade(averageScore, database.gradeScales).grade;
  let pinCode = "";
  if (resultData.pin && resultData.pin.toString().trim()) {
    pinCode = resultData.pin.toString().trim();
    if (!/^\d+$/.test(pinCode)) {
      return res.status(400).json({ error: "Result PIN must consist of numbers only." });
    }
    const duplicate = database.pins.find((p) => p.pin === pinCode && p.resultId !== resultData.id);
    if (duplicate) {
      return res.status(400).json({
        error: `PIN ${pinCode} is already assigned to ${duplicate.studentFullName}. Please enter a different PIN or generate a unique one.`
      });
    }
  } else {
    const existingPinRecord = database.pins.find((p) => p.resultId === resultData.id);
    if (existingPinRecord) {
      pinCode = existingPinRecord.pin;
    } else {
      const existingPinsSet = new Set(database.pins.map((p) => p.pin));
      const pinLength = database.settings.pinLength === -1 ? database.settings.customPinLength || 5 : database.settings.pinLength || 5;
      pinCode = generateNumericPin(pinLength, existingPinsSet);
    }
  }
  const resultId = resultData.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const finalResult = {
    ...resultData,
    id: resultId,
    studentId: student.id,
    studentNumber: student.studentNumber,
    studentFullName: student.fullName,
    className: resultData.className,
    academicSession: resultData.academicSession,
    term: resultData.term,
    pin: pinCode,
    isPublished: typeof resultData.isPublished === "boolean" ? resultData.isPublished : true,
    subjects: validatedSubjects,
    totalScore,
    averageScore,
    overallGrade,
    teacherRemark: resultData.teacherRemark || database.settings.defaultRemarks.teacherRemark,
    principalRemark: resultData.principalRemark || database.settings.defaultRemarks.principalRemark,
    signedBy: database.settings.defaultRemarks.signedBy || resultData.signedBy || "Rev. Fr. Michael / Administrator",
    createdAt: resultData.createdAt || now,
    updatedAt: now
  };
  const resIndex = database.results.findIndex((r) => r.id === resultId);
  if (resIndex >= 0) {
    database.results[resIndex] = finalResult;
  } else {
    database.results.push(finalResult);
  }
  const pinIndex = database.pins.findIndex((p) => p.resultId === resultId);
  if (pinIndex >= 0) {
    database.pins[pinIndex].pin = pinCode;
    database.pins[pinIndex].studentFullName = student.fullName;
    database.pins[pinIndex].studentNumber = student.studentNumber;
    database.pins[pinIndex].academicSession = resultData.academicSession;
    database.pins[pinIndex].term = resultData.term;
  } else {
    database.pins.push({
      id: `pin-rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pin: pinCode,
      studentId: student.id,
      studentNumber: student.studentNumber,
      studentFullName: student.fullName,
      resultId: finalResult.id,
      academicSession: resultData.academicSession,
      term: resultData.term,
      status: "UNUSED",
      usedAt: null,
      createdAt: now
    });
  }
  await saveDatabase(database);
  return res.json({ success: true, result: finalResult, pins: database.pins });
});
app.post("/api/admin/results/delete", authAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Result ID is required." });
  database.results = database.results.filter((r) => r.id !== id);
  database.pins = database.pins.filter((p) => p.resultId !== id);
  await saveDatabase(database);
  await Promise.all([
    supabaseRequest(`results?id=eq.${encodeURIComponent(id)}`, "DELETE").catch(() => {
    }),
    supabaseRequest(`pins?result_id=eq.${encodeURIComponent(id)}`, "DELETE").catch(() => {
    })
  ]);
  return res.json({ success: true, results: database.results, pins: database.pins });
});
app.post("/api/admin/results/toggle-publish", authAdmin, async (req, res) => {
  const { id } = req.body;
  const result = database.results.find((r) => r.id === id);
  if (!result) return res.status(404).json({ error: "Result not found." });
  result.isPublished = !result.isPublished;
  await saveDatabase(database);
  return res.json({ success: true, result });
});
app.post("/api/admin/pins/reset", authAdmin, async (req, res) => {
  const { pinId } = req.body;
  const pinRecord = database.pins.find((p) => p.id === pinId);
  if (!pinRecord) {
    return res.status(404).json({ error: "PIN record not found." });
  }
  pinRecord.status = "UNUSED";
  pinRecord.usedAt = null;
  await saveDatabase(database);
  return res.json({
    success: true,
    message: `PIN ${pinRecord.pin} reset to UNUSED successfully.`,
    pinRecord
  });
});
app.post("/api/admin/pins/generate-unique", authAdmin, (req, res) => {
  const pinLength = database.settings.pinLength === -1 ? database.settings.customPinLength || 5 : database.settings.pinLength || 5;
  const existingPinsSet = new Set(database.pins.map((p) => p.pin));
  const pin = generateNumericPin(pinLength, existingPinsSet);
  return res.json({ success: true, pin });
});
app.post("/api/admin/pins/update", authAdmin, async (req, res) => {
  const { pinId, pin } = req.body;
  if (!pinId || !pin) {
    return res.status(400).json({ error: "PIN ID and new PIN are required." });
  }
  const cleanPin = pin.toString().trim();
  if (!/^\d+$/.test(cleanPin)) {
    return res.status(400).json({ error: "PIN must consist of numbers only." });
  }
  const duplicate = database.pins.find((p) => p.pin === cleanPin && p.id !== pinId);
  if (duplicate) {
    return res.status(400).json({
      error: `The PIN ${cleanPin} is already assigned to ${duplicate.studentFullName}. Please choose another PIN.`
    });
  }
  const pinRecord = database.pins.find((p) => p.id === pinId);
  if (!pinRecord) {
    return res.status(404).json({ error: "PIN record not found." });
  }
  pinRecord.pin = cleanPin;
  const result = database.results.find((r) => r.id === pinRecord.resultId);
  if (result) {
    result.pin = cleanPin;
  }
  await saveDatabase(database);
  return res.json({
    success: true,
    message: `PIN updated to ${cleanPin} permanently.`,
    pinRecord,
    results: database.results,
    pins: database.pins
  });
});
app.post("/api/admin/pins/delete", authAdmin, async (req, res) => {
  const { pinId } = req.body;
  if (!pinId) {
    return res.status(400).json({ error: "PIN ID is required." });
  }
  database.pins = database.pins.filter((p) => p.id !== pinId);
  await saveDatabase(database);
  await supabaseRequest(`pins?id=eq.${encodeURIComponent(pinId)}`, "DELETE").catch(() => {
  });
  return res.json({ success: true, pins: database.pins });
});
app.post("/api/admin/grades/save", authAdmin, async (req, res) => {
  const { scales } = req.body;
  if (!Array.isArray(scales)) {
    return res.status(400).json({ error: "Invalid scales format." });
  }
  database.gradeScales = scales;
  database.results.forEach((resRecord) => {
    resRecord.subjects.forEach((subj) => {
      const g = calculateGrade(subj.total, scales);
      subj.grade = g.grade;
      subj.remark = g.remark;
    });
    resRecord.overallGrade = calculateGrade(resRecord.averageScore, scales).grade;
  });
  await saveDatabase(database);
  return res.json({ success: true, gradeScales: database.gradeScales, results: database.results });
});
app.post("/api/admin/sessions/add", authAdmin, async (req, res) => {
  const { session } = req.body;
  if (!session || !session.trim()) {
    return res.status(400).json({ error: "Session name is required (e.g. 2032/2033)." });
  }
  const trimmed = session.trim();
  if (database.sessions.some((s) => s.session === trimmed)) {
    return res.status(400).json({ error: "This academic session already exists." });
  }
  database.sessions.push({
    id: `sess-${Date.now()}`,
    session: trimmed,
    isCurrent: false
  });
  await saveDatabase(database);
  return res.json({ success: true, sessions: database.sessions });
});
app.post("/api/admin/sessions/set-current", authAdmin, async (req, res) => {
  const { session, term } = req.body;
  if (session) {
    database.sessions.forEach((s) => {
      s.isCurrent = s.session === session;
    });
    database.settings.currentSession = session;
  }
  if (term) {
    database.settings.currentTerm = term;
  }
  await saveDatabase(database);
  return res.json({ success: true, settings: database.settings, sessions: database.sessions });
});
app.post("/api/admin/upload-logo", authAdmin, (req, res) => {
  const { dataUrl } = req.body;
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    return res.status(400).json({ error: "Valid image data is required." });
  }
  try {
    database.settings.logoUrl = dataUrl;
    saveDatabase(database);
    return res.json({
      success: true,
      logoUrl: dataUrl,
      message: "School logo updated and saved permanently."
    });
  } catch (err) {
    console.error("Logo upload error:", err);
    return res.status(500).json({ error: "Failed to save uploaded logo." });
  }
});
app.post("/api/admin/upload-background", authAdmin, (req, res) => {
  const { name, dataUrl } = req.body;
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    return res.status(400).json({ error: "Valid background image is required." });
  }
  try {
    const newBg = {
      id: `bg-up-${Date.now()}`,
      name: name?.trim() || `Custom Background ${database.backgrounds.length + 1}`,
      type: "uploaded",
      url: dataUrl,
      themeStyle: "custom",
      isProtected: false
    };
    database.backgrounds.push(newBg);
    saveDatabase(database);
    return res.json({
      success: true,
      background: newBg,
      backgrounds: database.backgrounds,
      message: "Result background uploaded and saved permanently."
    });
  } catch (err) {
    console.error("Background upload error:", err);
    return res.status(500).json({ error: "Failed to save uploaded background." });
  }
});
app.post("/api/admin/background/delete", authAdmin, (req, res) => {
  const { id } = req.body;
  const bg = database.backgrounds.find((b) => b.id === id);
  if (!bg) return res.status(404).json({ error: "Background not found." });
  if (bg.isProtected) {
    return res.status(400).json({ error: "Built-in certificate backgrounds are protected and cannot be deleted." });
  }
  if (database.settings.activeBackgroundId === id) {
    database.settings.activeBackgroundId = "bg-classic-parchment";
  }
  database.backgrounds = database.backgrounds.filter((b) => b.id !== id);
  saveDatabase(database);
  return res.json({
    success: true,
    backgrounds: database.backgrounds,
    activeBackgroundId: database.settings.activeBackgroundId
  });
});
app.post("/api/admin/background/set-active", authAdmin, (req, res) => {
  const { id } = req.body;
  if (!database.backgrounds.some((b) => b.id === id)) {
    return res.status(404).json({ error: "Background not found." });
  }
  database.settings.activeBackgroundId = id;
  saveDatabase(database);
  return res.json({ success: true, activeBackgroundId: id });
});
app.post("/api/admin/sync", authAdmin, async (req, res) => {
  if (process.env.SQL_HOST && process.env.SQL_USER) {
    try {
      const records = await db.select().from(appStore).where(eq(appStore.key, "main_database")).limit(1);
      if (records.length > 0 && records[0].data) {
        database = records[0].data;
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), "utf-8");
        } catch {
        }
      }
    } catch (err) {
      console.error("Error syncing from Cloud SQL:", err);
    }
  }
  try {
    const supabaseData = await loadDatabaseFromSupabase();
    if (supabaseData && Array.isArray(supabaseData.students) && supabaseData.students.length > 0) {
      const existingMap = new Map(database.students.map((s) => [s.studentNumber, s]));
      supabaseData.students.forEach((s) => existingMap.set(s.studentNumber, s));
      database.students = Array.from(existingMap.values());
      if (Array.isArray(supabaseData.results) && supabaseData.results.length > 0) {
        const resMap = new Map(database.results.map((r) => [`${r.studentNumber}-${r.term}`, r]));
        supabaseData.results.forEach((r) => resMap.set(`${r.studentNumber}-${r.term}`, r));
        database.results = Array.from(resMap.values());
      }
      if (Array.isArray(supabaseData.pins) && supabaseData.pins.length > 0) {
        const pinMap = new Map(database.pins.map((p) => [p.pin, p]));
        supabaseData.pins.forEach((p) => pinMap.set(p.pin, p));
        database.pins = Array.from(pinMap.values());
      }
    }
    await syncDatabaseToSupabase(database);
  } catch (err) {
    console.error("Error in Supabase sync:", err?.message || err);
  }
  saveDatabase(database);
  return res.json({
    success: true,
    message: "Synchronized with Supabase & permanent database successfully.",
    data: {
      settings: database.settings,
      studentsCount: database.students.length,
      resultsCount: database.results.length,
      pinsCount: database.pins.length
    }
  });
});
app.use("/downloads", express.static(path.join(process.cwd(), "public", "downloads")));
app.get("/api/admin/backup/export", authAdmin, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=st_michael_academy_db_backup_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`
  );
  return res.json(database);
});
app.post("/api/admin/backup/restore", authAdmin, (req, res) => {
  const backupData = req.body;
  if (!backupData || !Array.isArray(backupData.students)) {
    return res.status(400).json({ error: "Invalid backup file format. Missing students array." });
  }
  database = {
    settings: backupData.settings || database.settings,
    students: backupData.students || [],
    results: backupData.results || [],
    pins: backupData.pins || [],
    gradeScales: backupData.gradeScales || database.gradeScales,
    sessions: backupData.sessions || database.sessions,
    backgrounds: backupData.backgrounds || database.backgrounds,
    monitoringLogs: backupData.monitoringLogs || [],
    adminPasswordHash: backupData.adminPasswordHash || database.adminPasswordHash
  };
  saveDatabase(database);
  syncDatabaseToSupabase(database).catch((err) => {
    console.error("Supabase restore sync error:", err);
  });
  return res.json({
    success: true,
    message: `Database restored successfully: ${database.students.length} students, ${database.results.length} results, ${database.pins.length} PINs.`,
    data: {
      studentsCount: database.students.length,
      resultsCount: database.results.length,
      pinsCount: database.pins.length
    }
  });
});
async function startServer() {
  app.use("/downloads", express.static(path.join(process.cwd(), "public", "downloads")));
  app.use(express.static(path.join(process.cwd(), "public")));
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ST. MICHAEL GREAT ACADEMY Portal Server running on http://0.0.0.0:${PORT}`);
  });
}
var isDirectExecution = Boolean(
  process.argv[1] && (process.argv[1].endsWith("server.ts") || process.argv[1].endsWith("server.cjs") || process.argv[1].endsWith("server.js"))
);
var isServerless = Boolean(
  process.env.IS_SERVERLESS === "true" || process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT
);
if (isDirectExecution && !isServerless) {
  startServer();
}
var server_default = app;
export {
  server_default as default
};
