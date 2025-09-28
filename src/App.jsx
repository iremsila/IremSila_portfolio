import React, { useMemo, useState } from "react";
// ---- Minimal inline icon set (no external deps) ----
const Icon = ({ path, size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {path}
  </svg>
);

const MailIcon = (p) => (
  <Icon {...p} path={<g><path d="M4 7l8 5 8-5"/><rect x="4" y="5" width="16" height="14" rx="2"/></g>} />
);
const GithubIcon = (p) => (
  <Icon {...p} path={<path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 3.5 5.07 5.07 0 0 0 17.91.5S16.73.15 14 2a13.38 13.38 0 0 0-8 0C3.27.15 2.09.5 2.09.5A5.07 5.07 0 0 0 2 3.5 5.44 5.44 0 0 0 .5 8.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 6 18.13V22" />} />
);
const LinkedinIcon = (p) => (
  <Icon {...p} path={<g><rect x="2" y="9" width="7" height="13"/><circle cx="5.5" cy="5.5" r="2.5"/><path d="M16 22v-7a4 4 0 0 1 8 0v7"/></g>} />
);
const LinkIcon = (p) => (
  <Icon {...p} path={<g><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1"/></g>} />
);
const FileDownIcon = (p) => (
  <Icon {...p} path={<g><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></g>} />
);
const ExternalLinkIcon = (p) => (
  <Icon {...p} path={<g><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></g>} />
);
const ArrowRightIcon = (p) => (
  <Icon {...p} path={<g><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></g>} />
);
const PhoneIcon = (p) => (
  <Icon {...p} path={<g><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.1 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.31 1.78.57 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.07a2 2 0 0 1 2.11-.45c.85.26 1.73.45 2.63.57A2 2 0 0 1 22 16.92z"/></g>} />
);
const BookOpenIcon = (p) => (
  <Icon {...p} path={<g><path d="M2 3h7a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-7a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h7z"/></g>} />
);
const BriefcaseIcon = (p) => (
  <Icon {...p} path={<g><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/></g>} />
);
const LaptopIcon = (p) => (
  <Icon {...p} path={<g><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></g>} />
);
const StarIcon = (p) => (
  <Icon {...p} path={<path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />} />
);

// ---------- HELPERS & THEME (single source of truth) ----------
const container = "max-w-6xl mx-auto px-3 sm:px-4";
const gradientText =
  "bg-gradient-to-r from-amber-700/70 via-orange-400/70 to-amber-500/70 bg-clip-text text-transparent"; // warm coffee gradient
const backgroundClass =
  "min-h-screen bg-gradient-to-br from-[#FAF3E0] via-[#F7E9D7] to-[#FAF3E0] text-slate-900";

function buildMailtoHref(email, subject, body) {
  const s = encodeURIComponent(subject || "");
  const b = encodeURIComponent(body || "");
  return `mailto:${email}?subject=${s}&body=${b}`;
}

// ---- lightweight dev tests (run only in dev) ----
if (typeof window !== "undefined" && import.meta?.env?.DEV) {
  console.assert(
    buildMailtoHref("a@b.com", "Hi", "Line1\nLine2").includes("Line1%0ALine2"),
    "Mailto should encode newlines as %0A"
  );
  console.assert(
    buildMailtoHref("a@b.com", "A & B", "C & D").includes("A%20%26%20B"),
    "Mailto should encode special chars like &"
  );
  console.assert(
    buildMailtoHref("x@y.com", "", "").startsWith("mailto:x@y.com?subject="),
    "Mailto should start properly with recipient"
  );
  console.assert(
    buildMailtoHref("t@t.com", "Merhaba İrem", "Selam İrem\nGörüşelim?").includes("Merhaba%20%C4%B0rem"),
    "Should encode Turkish characters"
  );
  console.assert(
    buildMailtoHref("z@z.com", "Test", "").includes("subject=Test&body="),
    "Should handle empty body"
  );
}

// ---------- DATA ----------
const projects = [
  {
    title: "Paven — Movie App",
    subtitle:
      "Popular movies, search with suggestions, favorites, auth, smooth UI animations",
    stack: [
      "Kotlin",
      "MVVM",
      "Compose",
      "XML",
      "Retrofit",
      "Room",
      "Hilt",
      "Glide/Coil",
    ],
    highlights: [
      "List/Grid toggle, real-time search, favorites management",
      "Compose + XML hybrid UI, clean architecture (MVVM)",
    ],
    github: "https://github.com/iremsila/OBSS_CodeCamp2024",
    image: "/images/paven_collage_3x1.jpg",
  },
  {
  title: "WorkWise — Freelancer & Employer Platform",
  subtitle: "Users register as freelancers or employers, post/apply for jobs, manage profiles",
  stack: ["Flutter", "Dart", "Provider", "PHP", "MySQL", "REST"],
  highlights: [
    "Full-stack approach: Flutter frontend + PHP/MySQL backend",
    "State management with Provider; auth & CRUD flows",
  ],
  github: "https://github.com/iremsila/FreelancerApp",
  image: "/images/workwise_collage_6x1.jpg", 
},
  {
    title: "Drug Discovery — OCR-based Drug Identification (TUBITAK 2209-A)",
    subtitle: "Mobile app that scans drug packages via OCR and fetches details",
    stack: ["Kotlin", "ML Kit (OCR)", "CameraX", "Retrofit", "Room", "Hilt"],
    highlights: [
      "End-to-end OCR flow (camera → text → API → detail screen)",
      "Clean architecture with DI, caching, and offline support",
    ],
    github: "https://github.com/iremsila/drug_recognizer_app",
    image: "/images/drug_collage_5x1.png",
  },
  {
    title: "Architect UI — CSS Design Project",
    subtitle: "Architect-themed landing page built with pure CSS and semantic HTML",
    stack: ["HTML", "CSS"],
    highlights: [
      "Semantic HTML structure",
      "Custom CSS styling for modern UI",
      "Responsive design principles",
    ],
    github: "https://github.com/iremsila/architect-ui-css",
  },
  {
    title: "Responsive Layout Showcase — HTML/CSS",
    subtitle: "Demonstration of responsive layouts using CSS flexbox and grid",
    stack: ["HTML", "CSS"],
    highlights: [
      "Mobile-first design",
      "Flexbox and grid implementations",
      "Clean and maintainable structure",
    ],
    github: "https://github.com/iremsila/responsive-layouts-css",
  },
  {
    title: "Predictive Modeling and Analysis",
    subtitle: "Capstone exam project on predictive analytics",
    stack: ["Python", "Scikit-learn", "Pandas"],
    highlights: [
      "Built and validated predictive models",
      "Applied feature engineering and preprocessing",
      "Evaluation with metrics like accuracy and RMSE",
    ],
    github: "https://www.kaggle.com/code/iremsilayildirim/data-science-predictive-analytics",
    isKaggle: true,
  },
];

const experiences = [
  {
    role: "Software Developer",
    company: "Huawei",
    period: "Feb 2025 – Jun 2025",
    location: "Izmir, Turkiye",
    bullets: [
      "ArkTS & HarmonyOS; modular architecture, reusable components",
      "Atomic widgets, state management; user-centric UI/UX",
      "Agile ceremonies, peer reviews; onboarding docs",
    ],
  },
  {
    role: "Android Developer",
    company: "OBSS",
    period: "Jul 2024 – Oct 2024 (Remote)",
    location: "Remote",
    bullets: [
      "MVVM, Compose + XML; Navigation (Compose/Fragment)",
      "Room, Hilt, Retrofit (Moshi/Gson), OkHttp Interceptor",
      "Testing: JUnit, Espresso; tooling: Git, Ktlint",
    ],
  },
  {
    role: "App Developer",
    company: "Robfly",
    period: "May 2023 – Jan 2024",
    location: "Turkiye",
    bullets: [
      "Kotlin Android app → migrated to Flutter for cross-platform",
      "State mgmt, local DB, offline-first improvements",
    ],
  },
  {
    role: "Software Developer (R&D)",
    company: "SmartTech R&D",
    period: "Jul 2023 – Oct 2023",
    location: "Turkiye",
    bullets: [
      "Python (Pandas, NumPy) for financial data analysis",
      "Reinforcement learning for portfolio allocation",
    ],
  },

  // --- NEW SECTION ---
  {
    role: "ESC Volunteer",
    company: "European Solidarity Corps",
    period: "2025",
    location: "Spain",
    bullets: [
      "Delivered workshops and talks on Sustainable Development Goals (SDGs)",
      "Promoted cultural exchange and teamwork in an international environment",
      "Enhanced adaptability, presentation, and communication skills",
    ],
  },
  {
    role: "Campus Ambassador",
    company: "Huawei Student Developers",
    period: "2024 – 2025",
    location: "Abdullah Gül University",
    bullets: [
      "Organized events and competitions for students",
      "Introduced Huawei’s mobile & cloud technologies",
      "Strengthened leadership and community engagement skills",
    ],
  },
];

const skills = {
  Languages: ["Kotlin", "Dart", "Java", "Python", "TypeScript", "C", "SQL"],
  Mobile: ["Android (Compose, XML)", "Flutter"],
  Backend_DB: ["Firebase (Firestore)", "FirebaseAuth", "Firebase Storage", "Realtime Database", "MySQL", "Spring Boot"],
  Data_ML: ["Pandas", "NumPy", "OCR", "TensorFlow (basic)"],
  Tools: ["Git", "Android Studio", "Postman", "Jupyter", "VS Code"],
};

const links = {
  email: "iremsilayildirimm@gmail.com",
  linkedin: "https://www.linkedin.com/in/iremsila-yildirim/",
  github: "https://github.com/iremsila",
  medium: "https://medium.com/@iremsila0108",
  instagram: "https://www.instagram.com/codingwithiremsila/",
  cv: "/cv/IremSilaYildirim_Resume.pdf", // put ASCII file name under public/cv/
};

// ---------- UI PRIMITIVES ----------
function SectionTitle({ kicker, title, children }) {
  return (
    <div className="mb-6 sm:mb-10">
      {kicker && (
        <div className="text-xs sm:text-sm tracking-widest uppercase text-slate-500 mb-2">
          {kicker}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
        {title}
      </h2>
      {children && (
        <p className="text-slate-600 mt-3 max-w-2xl text-sm sm:text-base">{children}</p>
      )}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black bg-white/70 backdrop-blur px-2.5 py-1 text-[11px] sm:text-xs me-2 mb-2 shadow-sm">
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 shadow-sm hover:from-amber-200 hover:via-orange-200 hover:to-amber-300 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

// --- Mini carousel only for cards ---
function MiniCarousel({ images = [] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  if (!images.length) return <div className="w-full h-44 bg-slate-100" />;

  return (
    <div className="relative w-full h-44 bg-white dark:bg-zinc-900">
      <img
        src={images[idx]}
        alt={`WorkWise ${idx + 1}`}
        className="w-full h-full object-contain bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
        draggable={false}
      />
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg border bg-white/80 px-2 py-1 text-xs"
        aria-label="Prev"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border bg-white/80 px-2 py-1 text-xs"
        aria-label="Next"
      >
        ›
      </button>
      <div className="absolute bottom-2 inset-x-0 text-center text-[11px] text-black/70">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}


function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 text-white/95 px-2.5 py-1 text-[11px] sm:text-xs">
      <StarIcon className="w-3 h-3" /> {children}
    </span>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const totalStacks = useMemo(
    () => Object.values(skills).reduce((acc, arr) => acc + arr.length, 0),
    []
  );

   const workExperiences = useMemo(
    () => experiences.filter(e => !/(volunteer|ambassador)/i.test(e.role)),
    []
  );
  const volunteerExperiences = useMemo(
    () => experiences.filter(e => /(volunteer|ambassador)/i.test(e.role)),
    []
  );

  return (
    <div className={backgroundClass}>
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur">
        <div className={`${container} py-3 flex items-center justify-between`}>
          <a href="#home" className="font-semibold tracking-tight text-sm sm:text-base">
            <span className={gradientText}>Irem Sila Yildirim</span>
          </a>

          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:opacity-70">About</a>
            <a href="#experience" className="hover:opacity-70">Experience</a>
            <a href="#projects" className="hover:opacity-70">Projects</a>
            <a href="#skills" className="hover:opacity-70">Skills</a>
            <a href="#contact" className="hover:opacity-70">Contact</a>
            <a href="#references" className="hover:opacity-70">References</a>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <a
              href={links.cv}
              download
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:shadow"
            >
              <FileDownIcon className="w-4 h-4" /> CV
            </a>
            <a
              href={`mailto:${links.email}`}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:shadow"
            >
              <MailIcon className="w-4 h-4" /> Contact
            </a>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-sm"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-white/95">
            <nav className={`${container} py-2 grid grid-cols-2 gap-2 text-sm`}>
              {[
                ["About", "#about"],
                ["Experience", "#experience"],
                ["Projects", "#projects"],
                ["Skills", "#skills"],
                ["Contact", "#contact"],
                ["References", "#references"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  onClick={() => setMenuOpen(false)}
                  href={href}
                  className="rounded-xl border px-3 py-2"
                >
                  {label}
                </a>
              ))}
              <a href={links.github} target="_blank" rel="noreferrer" className="rounded-xl border px-3 py-2">GitHub</a>
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className={`${container} py-14 sm:py-20 md:py-28`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 mb-2">
              • Developer
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
              New Graduate <span className="whitespace-nowrap">Computer Engineer</span>{" "}
              <span className={gradientText}>Passionate about Software & Innovation</span>
            </h1>
            <p className="mt-4 text-slate-700 max-w-xl text-sm sm:text-base">
              Software developer with strong experience in Android & Flutter, and exposure to HarmonyOS (ArkTS), MVVM architecture, and OCR-powered features. I also explore web, full-stack, and AI technologies, aiming to deliver versatile, end-to-end solutions. I care about creating delightful user experiences, writing readable code, and learning fast.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a href={links.cv} download className="rounded-xl border px-4 py-2 text-sm hover:shadow inline-flex items-center gap-2">
                <FileDownIcon className="w-4 h-4" /> Download CV
              </a>
              <a href="#projects" className="rounded-xl border px-4 py-2 text-sm hover:shadow inline-flex items-center gap-2">
                View Projects <ArrowRightIcon className="w-4 h-4" />
              </a>
              <a href={`mailto:${links.email}`} className="rounded-xl border px-4 py-2 text-sm hover:shadow inline-flex items-center gap-2">
                <MailIcon className="w-4 h-4" /> Contact Me
              </a>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
              <Pill>Based in Turkiye</Pill>
              <Pill>English B2–C1</Pill>
              <Pill>Open to relocation</Pill>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4 text-center">
              {[
                ["GPA", "3.16"],
                ["Projects", String(projects.length)],
                ["Stacks", String(totalStacks)],
              ].map(([label, value]) => (
                <Card key={label} className="p-3 sm:p-4">
                  <div className="text-2xl sm:text-3xl font-semibold">{value}</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mt-1">{label}</div>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:justify-self-end">
            <img
              src="/profile.jpeg"
              alt="Irem Sila Yildirim"
              className="w-44 sm:w-60 md:w-80 aspect-square rounded-2xl object-cover border shadow-inner cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]"
              onClick={() => setLightboxOpen(true)}
            />
          </div>
        </div>

        {lightboxOpen && (
          <div
            role="dialog"
            aria-modal
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <img
              src="/profile.jpeg"
              alt="Irem Sila Yildirim large"
              className="max-w-[92vw] max-h-[82vh] rounded-3xl shadow-2xl border"
            />
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className={`${container} py-10 sm:py-14`}>
        <SectionTitle kicker="About" title="Who am I?">
          I graduated from Abdullah Gul University (100% English, GPA 3.16). I interned at Huawei (HarmonyOS/ArkTS)
          and OBSS (Android/Kotlin), shipped apps, and volunteered in Spain via ESC. I enjoy clean architecture,
          teamwork, and turning ideas into products that actually ship.
        </SectionTitle>
        <Card className="p-5 sm:p-6">
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 text-sm sm:text-base text-slate-700">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpenIcon className="w-4 h-4"/> Mindset</h3>
              <p>
                Curious, fast learner, and pragmatic. I value readable code, strong typing, and incremental delivery. I like designing flows first, then building them with small commits, tests when it matters, and thoughtful reviews. Beyond code, I actively seek feedback, stay open to new ideas, and believe in continuous learning as part of my growth.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><LaptopIcon className="w-4 h-4"/> What I build</h3>
              <p>
                I primarily develop mobile applications with Android (Compose, XML) and Flutter, but I also explore other areas such as full-stack development, web technologies, and applied AI. I enjoy being versatile — not limiting myself to a single stack — which helps me adapt quickly, experiment with new tools, and deliver end-to-end solutions. I care about feature work, polishing UI, and performance optimizations while keeping a product-oriented mindset.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><BriefcaseIcon className="w-4 h-4"/> Collaboration</h3>
              <p>
                Comfortable in Agile teams: daily standups, code reviews, and pairing. I enjoy knowledge sharing — whether it’s writing onboarding notes, documenting decisions, or publishing blog posts on Medium to share insights with a wider audience. I value teamwork, open communication, and the chance to learn from different perspectives while contributing my own.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2"><StarIcon className="w-4 h-4"/> Next</h3>
              <p>
                I want to grow into a product-minded engineer, not only deepening my expertise in mobile but also strengthening my full-stack and AI skills. My goal is to build versatile, scalable solutions, improve my testing and CI/CD practices, and explore on-device ML (TFLite) and cloud integrations for smarter, more adaptive products.
              </p>
            </div>
          </div>
        </Card>
      </section>
      

      {/* EXPERIENCE */}
<section id="experience" className={`${container} py-10 sm:py-14`}>
  <SectionTitle kicker="Experience" title="Professional timeline" />
  <div className="relative">
    <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200" />
    <div className="space-y-4">
      {workExperiences.map((exp, i) => (
        <div key={`work-${i}`} className="transition-transform duration-200 hover:-translate-y-0.5">
          <Card className="p-4 sm:p-5 ps-12 sm:ps-14 relative">
            <div className="absolute left-3 sm:left-5 top-5 w-2.5 h-2.5 rounded-full bg-slate-400 shadow ring-2 ring-white" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm sm:text-base">{exp.role} · {exp.company}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500">{exp.period} · {exp.location}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {exp.bullets.map((b, idx) => <Badge key={idx}>{b}</Badge>)}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  </div>

  {/* Volunteer & Ambassador */}
  <div className="mt-10">
    <SectionTitle kicker="Experience" title="Volunteer & Ambassador">
      Community-facing roles where I led events, gave SDG-focused talks, and supported peers.
    </SectionTitle>
    <div className="relative">
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200" />
      <div className="space-y-4">
        {volunteerExperiences.map((exp, i) => (
          <div key={`vol-${i}`} className="transition-transform duration-200 hover:-translate-y-0.5">
            <Card className="p-4 sm:p-5 ps-12 sm:ps-14 relative">
              <div className="absolute left-3 sm:left-5 top-5 w-2.5 h-2.5 rounded-full bg-slate-400 shadow ring-2 ring-white" />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{exp.role} · {exp.company}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">{exp.period} · {exp.location}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {exp.bullets.map((b, idx) => <Badge key={idx}>{b}</Badge>)}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* PROJECTS */}
      <section id="projects" className={`${container} py-10 sm:py-14`}>
  
          <SectionTitle kicker="Projects" title="Selected work">
  Selected projects across mobile, web/CSS, and data science — built with clean architecture, great UX, and a strong product mindset.
</SectionTitle>

       

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <Card key={i} className="group overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
              <div className="relative">
  {p.image ? (
    <img
      src={p.image}
      alt={p.title}
      loading="lazy"
      className={`w-full ${
        p.title.startsWith("WorkWise")
          ? "aspect-[30/11] h-auto object-cover rounded-2xl border border-amber-200"
          : "h-44 object-cover"
      }`}
    />
  ) : (
    <div className="w-full h-44 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100" />
  )}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent" />
</div>



              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold truncate">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600">{p.subtitle}</p>
                  </div>

                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm rounded-lg border border-black px-2.5 py-1.5 hover:shadow"
                  >
                    {p.isKaggle ? (
                      <>
                        <ExternalLinkIcon className="w-4 h-4" /> Notebook
                      </>
                    ) : (
                      <>
                        <GithubIcon className="w-4 h-4" /> Code
                      </>
                    )}
                  </a>
                </div>

                <div className="flex flex-wrap mt-3">
                  {p.stack.map((s, idx) => (
                    <Badge key={idx}>{s}</Badge>
                  ))}
                </div>

                <ul className="list-disc ms-5 text-xs sm:text-sm text-slate-700 space-y-1 mt-3">
                  {p.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* More projects */}
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-black px-3 py-1.5 hover:shadow"
          >
            <GithubIcon className="w-4 h-4" /> More on GitHub
          </a>
          <a
            href="https://www.kaggle.com/iremsilayildirim"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-black px-3 py-1.5 hover:shadow"
          >
            <ExternalLinkIcon className="w-4 h-4" /> More on Kaggle
          </a>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className={`${container} py-10 sm:py-14`}>
        <SectionTitle kicker="Skills" title="Technologies I use" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Programming Languages */}
          <Card className="p-4 sm:p-5">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Programming Languages</h3>
            <div className="flex flex-wrap">
              {["Java","Python","Kotlin","TypeScript","C","Dart","SQL"].map((it) => (
                <Badge key={it}>{it}</Badge>
              ))}
            </div>
          </Card>

          {/* Backend & Databases */}
          <Card className="p-4 sm:p-5">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Backend & Databases</h3>
            <div className="flex flex-wrap">
              {["MySQL","Spring Boot","Firebase (Firestore)","FirebaseAuth","Firebase Storage","Realtime Database"].map((it) => (
                <Badge key={it}>{it}</Badge>
              ))}
            </div>
          </Card>

          {/* Software Development Practices */}
          <Card className="p-4 sm:p-5">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Software Development Practices</h3>
            <div className="flex flex-wrap">
              {["JUnit","CI/CD","Material Design","Data Structures & Algorithms","Agile Development","OOP"].map((it) => (
                <Badge key={it}>{it}</Badge>
              ))}
            </div>
          </Card>

          {/* Development */}
          <Card className="p-4 sm:p-5">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Development</h3>
            <div className="flex flex-wrap">
              {["Flutter","CSS","Data Science","API Integration","Native Development","RESTful API","PHP","HTML","JSON","Machine Learning","Optical Character Recognition","Bootstrap","MVVM","Android SDK"].map((it) => (
                <Badge key={it}>{it}</Badge>
              ))}
            </div>
          </Card>

          {/* Development Tools & IDEs */}
          <Card className="p-4 sm:p-5">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Development Tools & IDEs</h3>
            <div className="flex flex-wrap">
              {["Bitbucket","Eclipse","GitHub","Git","Visual Studio","SourceTree","Postman","Jupyter Notebook","Android Studio"].map((it) => (
                <Badge key={it}>{it}</Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className={`${container} py-12 sm:py-16`}>
        <SectionTitle kicker="Contact" title="Let’s build something together" />
        <Card className="p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <MailIcon className="w-4 h-4" />
                <span className="font-semibold">Email:</span>
                <a className="underline underline-offset-4 break-all" href={`mailto:${links.email}`}>
                  {links.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                <span className="font-semibold">Location:</span>
                Turkiye (Open to relocation)
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
                <a className="inline-flex items-center gap-1 underline underline-offset-4" href={links.linkedin}>
                  <LinkedinIcon className="w-4 h-4" /> LinkedIn
                </a>
                <a className="inline-flex items-center gap-1 underline underline-offset-4" href={links.github}>
                  <GithubIcon className="w-4 h-4" /> GitHub
                </a>
                <a className="inline-flex items-center gap-1 underline underline-offset-4" href={links.medium}>
                  <LinkIcon className="w-4 h-4" /> Medium
                </a>
                <a className="inline-flex items-center gap-1 underline underline-offset-4" href={links.instagram}>
                  <LinkIcon className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const subject = "Collaboration opportunity";
                const body = [
                  "Hi Irem,",
                  "",
                  "I saw your portfolio and would love to connect about...",
                  "",
                  "—",
                ].join("\\n");
                window.location.href = buildMailtoHref(links.email, subject, body);
              }}
              className="bg-slate-50/70 rounded-xl p-4 border"
            >
              <div className="font-medium mb-2">Quick hello</div>
              <p className="text-slate-600 text-sm mb-3">
                Prefer email? Click send.
              </p>
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:shadow">
                Open Email <ExternalLinkIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </Card>
      </section>

      {/* REFERENCES */}
      <section id="references" className={`${container} py-10 sm:py-14`}>
        <SectionTitle kicker="References" title="References & recommendations">
          Professional references are available upon request.
        </SectionTitle>
        <Card className="p-5 sm:p-6">
          <p className="text-sm text-slate-700">
            Please contact me via email for reference details. I’m happy to share contact information and letters upon request.
          </p>
        </Card>
      </section>

      <footer className={`${container} pb-14 sm:pb-16 pt-4 text-[11px] sm:text-xs text-slate-500`}>
        © {new Date().getFullYear()} Irem Sila Yildirim — Built with React & Tailwind
      </footer>
    </div>
  );
}
