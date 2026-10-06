import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getConcept } from "../services/api.js";
import LessonList from "../components/LessonList.jsx";
import QuestionList from "../components/QuestionList.jsx";
import { Loading, ErrorState } from "../components/Status.jsx";

export default function LessonsPage() {
  const { conceptId } = useParams();
  const [concept, setConcept] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [looseQuestions, setLooseQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setConcept(null);
    setLessons(null);
    setLooseQuestions([]);
    setError(null);

    getConcept(conceptId)
      .then((data) => {
        if (cancelled) return;
        setConcept(data.concept);
        setLessons(data.lessons || []);
        setLooseQuestions(data.questions || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [conceptId, reloadKey]);

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/topics" className="hover:text-emerald-400">
          Topics
        </Link>
        <span className="mx-2">/</span>
        {concept?.section_id ? (
          <>
            <Link
              to={`/sections/${concept.section_id}`}
              className="hover:text-emerald-400"
            >
              {concept.section_name}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : concept ? (
          <>
            <Link
              to={`/topics/${concept.topic_id}`}
              className="hover:text-emerald-400"
            >
              {concept.topic_name}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : null}
        <span className="text-slate-300">{concept ? concept.name : "..."}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {concept ? concept.name : "Lessons"}
        </h1>
        {concept?.description && (
          <p className="mt-1 text-sm text-slate-400">{concept.description}</p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          Read the lessons in order, then practise what you learned.
        </p>
      </div>

      {error && (
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      )}

      {!lessons && !error && <Loading label="Loading lessons..." />}

      {lessons && (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Lessons
            </h2>
            <LessonList lessons={lessons} />
          </section>

          {looseQuestions.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Extra challenges
              </h2>
              <QuestionList questions={looseQuestions} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
