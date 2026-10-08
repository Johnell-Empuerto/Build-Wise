import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import TopicsPage from "./pages/TopicsPage.jsx";
import SectionsPage from "./pages/SectionsPage.jsx";
import ConceptsPage from "./pages/ConceptsPage.jsx";
import LessonsPage from "./pages/LessonsPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import ChallengePage from "./pages/ChallengePage.jsx";
import { SystemDesignProgress } from "./system-design/progress.jsx";
import SystemDesignOverview from "./system-design/SystemDesignOverview.jsx";
import SystemDesignFundamentals from "./system-design/SystemDesignFundamentals.jsx";
import FundamentalsLesson from "./system-design/FundamentalsLesson.jsx";

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-bold text-slate-950">
            BW
          </span>
          <span className="text-base font-semibold text-white">BuildWise</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            to="/topics"
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            Learn to Code
          </Link>
          <Link
            to="/system-design"
            className="text-sm font-medium text-slate-400 transition hover:text-sky-400"
          >
            System Design
          </Link>
        </div>
      </div>
    </header>
  );
}

function NotFound() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
      <p className="text-lg font-semibold text-white">Page not found</p>
      <Link
        to="/topics"
        className="mt-3 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
      >
        Back to topics
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <SystemDesignProgress>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/topics/:topicId" element={<SectionsPage />} />
            <Route path="/sections/:sectionId" element={<ConceptsPage />} />
            <Route path="/concepts/:conceptId" element={<LessonsPage />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/questions/:questionId" element={<ChallengePage />} />
            <Route path="/system-design" element={<SystemDesignOverview />} />
            <Route
              path="/system-design/fundamentals"
              element={<SystemDesignFundamentals />}
            />
            <Route
              path="/system-design/fundamentals/:lessonId"
              element={<FundamentalsLesson />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SystemDesignProgress>
      </main>
    </div>
  );
}
