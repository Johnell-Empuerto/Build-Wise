import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSectionConcepts } from "../services/api.js";
import ConceptList from "../components/ConceptList.jsx";
import { Loading, ErrorState } from "../components/Status.jsx";

export default function ConceptsPage() {
  const { sectionId } = useParams();
  const [section, setSection] = useState(null);
  const [concepts, setConcepts] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setSection(null);
    setConcepts(null);
    setError(null);

    getSectionConcepts(sectionId)
      .then((data) => {
        if (cancelled) return;
        setSection(data.section);
        setConcepts(data.concepts || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionId, reloadKey]);

  return (
    <div>
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/topics" className="hover:text-emerald-400">
          Topics
        </Link>
        <span className="mx-2">/</span>
        {section && (
          <Link
            to={`/topics/${section.topic_id}`}
            className="hover:text-emerald-400"
          >
            {section.topic_name}
          </Link>
        )}
        <span className="mx-2">/</span>
        <span className="text-slate-300">{section ? section.name : "..."}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {section ? section.name : "Concepts"}
        </h1>
        {section?.description && (
          <p className="mt-1 text-sm text-slate-400">{section.description}</p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          Each concept is a short lesson followed by practice challenges.
        </p>
      </div>

      {error && (
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      )}
      {!concepts && !error && <Loading label="Loading concepts..." />}
      {concepts && <ConceptList concepts={concepts} />}
    </div>
  );
}
