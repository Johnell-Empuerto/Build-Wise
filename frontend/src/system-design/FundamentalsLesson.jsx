// Dispatcher for /system-design/fundamentals/:lessonId.
// Resolves the lesson id to its view; unknown or still-locked lessons
// bounce back to the fundamentals list instead of rendering the wrong page.
import { Navigate, useParams } from "react-router-dom";
import { FUNDAMENTALS_LESSONS } from "../data/system-design/fundamentals.js";
import WhatIsASystemLesson from "./WhatIsASystemLesson.jsx";
import ClientServerLesson from "./ClientServerLesson.jsx";
import FrontendBackendLesson from "./FrontendBackendLesson.jsx";
import ApiLesson from "./ApiLesson.jsx";

const LESSON_VIEWS = {
  "what-is-a-system": WhatIsASystemLesson,
  "client-server": ClientServerLesson,
  "frontend-backend": FrontendBackendLesson,
  api: ApiLesson,
};

export default function FundamentalsLesson() {
  const { lessonId } = useParams();
  const meta = FUNDAMENTALS_LESSONS.find((lesson) => lesson.id === lessonId);
  const View = LESSON_VIEWS[lessonId];

  if (!meta?.available || !View) {
    return <Navigate to="/system-design/fundamentals" replace />;
  }
  return <View />;
}
