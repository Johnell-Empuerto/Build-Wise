import { useEffect, useState } from "react";
import { getTopics } from "../services/api.js";
import TopicList from "../components/TopicList.jsx";
import { Loading, ErrorState } from "../components/Status.jsx";

export default function TopicsPage() {
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getTopics()
      .then((data) => {
        // Only topics with real challenge content are listed; future topics
        // (Browser, Async, Advanced, Algorithms) stay out of the UI until
        // they have lessons - no "coming soon" placeholders (V1 §22).
        const withContent = (data.topics || []).filter(
          (topic) => Number(topic.challenge_count) > 0
        );
        if (!cancelled) setTopics(withContent);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Topics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Pick a topic to start learning JavaScript step by step. Then apply
          what you learn to real-world scenarios in JavaScript Problem Solving.
        </p>
      </div>

      {error && <ErrorState message={error} />}
      {!topics && !error && <Loading label="Loading topics..." />}
      {topics && <TopicList topics={topics} />}
    </div>
  );
}
