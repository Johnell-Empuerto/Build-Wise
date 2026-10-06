import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLesson } from "../services/api.js";
import LessonContent from "../components/LessonContent.jsx";
import QuestionList from "../components/QuestionList.jsx";
import { Loading, ErrorState } from "../components/Status.jsx";

export default function LessonPage() {
  const { lessonId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    getLesson(lessonId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId, reloadKey]);

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
    );
  }

  if (!data) {
    return <Loading label="Loading lesson..." />;
  }

  const { lesson, siblings, challenges } = data;
  const position = siblings.findIndex((item) => item.id === lesson.id);
  const previous = position > 0 ? siblings[position - 1] : null;
  const next =
    position >= 0 && position < siblings.length - 1
      ? siblings[position + 1]
      : null;

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/topics" className="hover:text-emerald-400">
          Topics
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/topics/${lesson.topic_id}`} className="hover:text-emerald-400">
          {lesson.topic_name}
        </Link>
        {lesson.section_id && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/sections/${lesson.section_id}`}
              className="hover:text-emerald-400"
            >
              {lesson.section_name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <Link
          to={`/concepts/${lesson.concept_id}`}
          className="hover:text-emerald-400"
        >
          {lesson.concept_name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{lesson.title}</span>
      </nav>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
          Lesson {position + 1} of {siblings.length}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">{lesson.title}</h1>
      </div>

      <LessonContent lesson={lesson} />

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Practice
        </h2>
        <QuestionList questions={challenges} />
        {challenges.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 px-5 py-6 text-sm text-slate-500">
            There is nothing to practise on this lesson yet. Keep reading and
            come back when the challenges are added.
          </div>
        )}
      </section>

      <nav className="mt-8 flex items-center justify-between gap-4 border-t border-slate-800 pt-5">
        {previous ? (
          <Link
            to={`/lessons/${previous.id}`}
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            &larr; {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/lessons/${next.id}`}
            className="text-right text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            {next.title} &rarr;
          </Link>
        ) : (
          <Link
            to={`/concepts/${lesson.concept_id}`}
            className="text-sm font-medium text-slate-400 transition hover:text-emerald-400"
          >
            Back to concept &rarr;
          </Link>
        )}
      </nav>
    </div>
  );
}
