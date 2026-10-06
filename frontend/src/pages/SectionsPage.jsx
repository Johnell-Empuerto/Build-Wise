import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTopic } from "../services/api.js";
import SectionList from "../components/SectionList.jsx";
import { Loading, ErrorState } from "../components/Status.jsx";

export default function SectionsPage() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [sections, setSections] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setTopic(null);
    setSections(null);
    setError(null);

    getTopic(topicId)
      .then((data) => {
        if (cancelled) return;
        setTopic(data.topic);
        setSections(data.sections || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [topicId, reloadKey]);

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/topics" className="hover:text-emerald-400">
          Topics
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{topic ? topic.name : "..."}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {topic ? topic.name : "Sections"}
        </h1>
        {topic?.description && (
          <p className="mt-1 text-sm text-slate-400">{topic.description}</p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          Work through the sections in order, or jump straight to what you need.
        </p>
      </div>

      {error && (
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      )}
      {!sections && !error && <Loading label="Loading sections..." />}
      {sections && <SectionList sections={sections} />}
    </div>
  );
}
