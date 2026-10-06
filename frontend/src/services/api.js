// Local data layer for the frontend-only build.
//
// Every function keeps the name, arguments and response shape of the old
// backend client (services/api.js before the migration), but resolves against
// the committed curriculum snapshot in src/data/*.json instead of the backend
// origin. Nothing here touches the network, and no attempt, progress or
// stats data exists - the progress system was removed (spec §13).

import topicsData from "../data/topics.json";
import sectionsData from "../data/sections.json";
import conceptsData from "../data/concepts.json";
import lessonsData from "../data/lessons.json";
import questionsData from "../data/questions.json";
import testCasesData from "../data/test-cases.json";
import { runJudge } from "../judge/runJudge.js";

const MAX_CODE_LENGTH = 50000;

// ---- indexes ---------------------------------------------------------------

const topicsById = new Map();
const conceptsById = new Map();
const lessonsById = new Map();
const questionsById = new Map();

const sectionsByTopic = new Map();
const conceptsBySection = new Map();
const conceptsByTopic = new Map();
const lessonsByConcept = new Map();
const questionsByLesson = new Map();
const questionsByConcept = new Map();
const testCasesByQuestion = new Map();

const byOrder = (a, b) =>
  a.order_index - b.order_index || a.id - b.id;

function pushInto(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

for (const topic of topicsData) topicsById.set(topic.id, topic);
for (const section of sectionsData)
  pushInto(sectionsByTopic, section.topic_id, section);
for (const concept of conceptsData) {
  conceptsById.set(concept.id, concept);
  pushInto(conceptsByTopic, concept.topic_id, concept);
  if (concept.section_id != null)
    pushInto(conceptsBySection, concept.section_id, concept);
}
for (const lesson of lessonsData) {
  lessonsById.set(lesson.id, lesson);
  pushInto(lessonsByConcept, lesson.concept_id, lesson);
}
for (const question of questionsData) {
  questionsById.set(question.id, question);
  pushInto(questionsByConcept, question.concept_id, question);
  if (question.lesson_id != null)
    pushInto(questionsByLesson, question.lesson_id, question);
}
for (const testCase of testCasesData)
  pushInto(testCasesByQuestion, testCase.question_id, testCase);

for (const list of sectionsByTopic.values()) list.sort(byOrder);
for (const list of conceptsBySection.values()) list.sort(byOrder);
for (const list of conceptsByTopic.values()) list.sort(byOrder);
for (const list of lessonsByConcept.values()) list.sort(byOrder);
for (const list of questionsByLesson.values()) list.sort(byOrder);
for (const list of questionsByConcept.values()) list.sort(byOrder);
for (const list of testCasesByQuestion.values()) list.sort(byOrder);

// ---- helpers ---------------------------------------------------------------

function positiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
}

function getTopicOr404(topicId) {
  const topic = topicsById.get(topicId);
  if (!topic) throw new Error(`Topic ${topicId} not found`);
  return topic;
}

function getSectionOr404(sectionId) {
  const section = sectionsData.find((row) => row.id === sectionId);
  if (!section) throw new Error(`Section ${sectionId} not found`);
  return section;
}

function getConceptOr404(conceptId) {
  const concept = conceptsById.get(conceptId);
  if (!concept) throw new Error(`Concept ${conceptId} not found`);
  return concept;
}

function getLessonOr404(lessonId) {
  const lesson = lessonsById.get(lessonId);
  if (!lesson) throw new Error(`Lesson ${lessonId} not found`);
  return lesson;
}

function getQuestionOr404(questionId) {
  const question = questionsById.get(questionId);
  if (!question) throw new Error(`Question ${questionId} not found`);
  return question;
}

function lessonCount(conceptId) {
  return (lessonsByConcept.get(conceptId) || []).length;
}

function challengeCount(conceptId) {
  return (questionsByConcept.get(conceptId) || []).length;
}

function questionCountForLesson(lessonId) {
  return (questionsByLesson.get(lessonId) || []).length;
}

function topicChallengeCount(topicId) {
  let count = 0;
  for (const concept of conceptsByTopic.get(topicId) || [])
    count += challengeCount(concept.id);
  return count;
}

function conceptIdsInSection(sectionId) {
  return (conceptsBySection.get(sectionId) || []).map((concept) => concept.id);
}

// ---- curriculum reads ------------------------------------------------------

export async function getTopics() {
  const topics = topicsData
    .slice()
    .sort(byOrder)
    .map((topic) => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      order_index: topic.order_index,
      section_count: (sectionsByTopic.get(topic.id) || []).length,
      challenge_count: topicChallengeCount(topic.id),
    }));

  return { success: true, topics };
}

export async function getTopic(topicId) {
  const id = positiveInteger(topicId);
  if (id === null) throw new Error("topicId must be a positive integer");
  const topic = getTopicOr404(id);

  const sections = (sectionsByTopic.get(id) || []).map((section) => {
    const conceptIds = conceptIdsInSection(section.id);
    const lessonTotal = conceptIds.reduce(
      (sum, conceptId) => sum + lessonCount(conceptId),
      0
    );
    const challengeTotal = conceptIds.reduce(
      (sum, conceptId) => sum + challengeCount(conceptId),
      0
    );
    return {
      id: section.id,
      topic_id: section.topic_id,
      name: section.name,
      description: section.description,
      order_index: section.order_index,
      concept_count: conceptIds.length,
      lesson_count: lessonTotal,
      challenge_count: challengeTotal,
    };
  });

  return {
    success: true,
    topic: {
      id: topic.id,
      name: topic.name,
      description: topic.description,
      order_index: topic.order_index,
    },
    sections,
  };
}

export async function getSectionConcepts(sectionId) {
  const id = positiveInteger(sectionId);
  if (id === null) throw new Error("sectionId must be a positive integer");
  const section = getSectionOr404(id);
  const topic = topicsById.get(section.topic_id);

  const concepts = (conceptsBySection.get(id) || []).map((concept) => ({
    id: concept.id,
    topic_id: concept.topic_id,
    section_id: concept.section_id,
    name: concept.name,
    description: concept.description,
    order_index: concept.order_index,
    lesson_count: lessonCount(concept.id),
    challenge_count: challengeCount(concept.id),
  }));

  return {
    success: true,
    section: {
      id: section.id,
      topic_id: section.topic_id,
      name: section.name,
      description: section.description,
      topic_name: topic ? topic.name : null,
    },
    concepts,
  };
}

export async function getConcept(conceptId) {
  const id = positiveInteger(conceptId);
  if (id === null) throw new Error("conceptId must be a positive integer");
  const concept = getConceptOr404(id);
  const topic = topicsById.get(concept.topic_id);
  const section =
    concept.section_id != null ? getSectionOr404(concept.section_id) : null;

  const lessons = (lessonsByConcept.get(id) || []).map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    order_index: lesson.order_index,
    challenge_count: questionCountForLesson(lesson.id),
  }));

  const looseQuestions = (questionsByConcept.get(id) || [])
    .filter((question) => question.lesson_id == null)
    .map((question) => ({
      id: question.id,
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      challenge_type: question.challenge_type,
      level: question.level,
      order_index: question.order_index,
    }));

  return {
    success: true,
    concept: {
      id: concept.id,
      name: concept.name,
      description: concept.description,
      topic_id: concept.topic_id,
      section_id: concept.section_id,
      topic_name: topic ? topic.name : null,
      section_name: section ? section.name : null,
    },
    lessons,
    questions: looseQuestions,
  };
}

export async function getLesson(lessonId) {
  const id = positiveInteger(lessonId);
  if (id === null) throw new Error("lessonId must be a positive integer");
  const lesson = getLessonOr404(id);
  const concept = getConceptOr404(lesson.concept_id);
  const topic = topicsById.get(concept.topic_id);
  const section =
    concept.section_id != null ? getSectionOr404(concept.section_id) : null;

  const siblings = (lessonsByConcept.get(concept.id) || []).map((row) => ({
    id: row.id,
    title: row.title,
  }));

  const challenges = (questionsByLesson.get(id) || []).map((question) => ({
    id: question.id,
    title: question.title,
    description: question.description,
    difficulty: question.difficulty,
    challenge_type: question.challenge_type,
    level: question.level,
    order_index: question.order_index,
  }));

  return {
    success: true,
    lesson: {
      id: lesson.id,
      concept_id: lesson.concept_id,
      title: lesson.title,
      explanation: lesson.explanation,
      examples: lesson.examples,
      notes: lesson.notes,
      common_mistakes: lesson.common_mistakes,
      order_index: lesson.order_index,
      concept_name: concept.name,
      section_id: concept.section_id,
      section_name: section ? section.name : null,
      topic_id: concept.topic_id,
      topic_name: topic ? topic.name : null,
    },
    siblings,
    challenges,
  };
}

export async function getQuestion(questionId) {
  const id = positiveInteger(questionId);
  if (id === null) throw new Error("questionId must be a positive integer");
  const question = getQuestionOr404(id);
  const concept = getConceptOr404(question.concept_id);
  const topic = topicsById.get(concept.topic_id);
  const section =
    concept.section_id != null ? getSectionOr404(concept.section_id) : null;
  const lesson =
    question.lesson_id != null ? lessonsById.get(question.lesson_id) : null;

  // Same contract as the old endpoint: only the visible example tests are
  // handed to the page. The judge still runs every exported test case.
  const testCases = (testCasesByQuestion.get(id) || [])
    .filter((testCase) => testCase.is_hidden === false)
    .map((testCase) => ({
      id: testCase.id,
      input: testCase.input,
      expected_output: testCase.expected_output,
      is_hidden: testCase.is_hidden,
      order_index: testCase.order_index,
    }));

  return {
    success: true,
    question: {
      id: question.id,
      concept_id: question.concept_id,
      lesson_id: question.lesson_id,
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      challenge_type: question.challenge_type,
      level: question.level,
      starter_code: question.starter_code,
      function_name: question.function_name,
      concept_name: concept.name,
      topic_id: concept.topic_id,
      section_id: concept.section_id,
      topic_name: topic ? topic.name : null,
      lesson_title: lesson ? lesson.title : null,
      section_name: section ? section.name : null,
    },
    testCases,
  };
}

// ---- judging (runs in a Web Worker, never on the UI thread) ----------------

export async function runQuestion(questionId, code) {
  const id = positiveInteger(questionId);
  if (id === null) throw new Error("questionId must be a positive integer");

  if (typeof code !== "string" || code.trim() === "") {
    throw new Error("code must be a non-empty string");
  }
  if (code.length > MAX_CODE_LENGTH) {
    throw new Error(`code must be at most ${MAX_CODE_LENGTH} characters`);
  }

  const question = getQuestionOr404(id);
  const testCases = testCasesByQuestion.get(id) || [];
  const mode = question.challenge_type === "predict_output" ? "console" : "function";

  const outcome = await runJudge({
    code,
    functionName: question.function_name || "",
    mode,
    testCases,
  });

  // Attempts no longer exist: no attempt row is written or returned.
  return { success: true, outcome, attempt: null };
}

// ---- next challenge: pure curriculum order ---------------------------------
// Flat, deterministic order: topic -> section -> concept -> lesson -> challenge
// (loose challenges of a concept come after its lessons). No adaptive logic,
// no mastery state - the same challenge is offered regardless of past runs.

let orderedQuestionIds = null;

function buildCurriculumOrder() {
  const ids = [];
  const orderedTopics = topicsData.slice().sort(byOrder);

  for (const topic of orderedTopics) {
    const sections = sectionsByTopic.get(topic.id) || [];
    const conceptsWithSections = new Set();
    for (const section of sections) {
      for (const concept of conceptsBySection.get(section.id) || []) {
        conceptsWithSections.add(concept.id);
        appendConceptQuestions(ids, concept.id);
      }
    }
    for (const concept of conceptsByTopic.get(topic.id) || []) {
      if (!conceptsWithSections.has(concept.id)) {
        appendConceptQuestions(ids, concept.id);
      }
    }
  }

  return ids;
}

function appendConceptQuestions(ids, conceptId) {
  for (const lesson of lessonsByConcept.get(conceptId) || []) {
    for (const question of questionsByLesson.get(lesson.id) || []) {
      ids.push(question.id);
    }
  }
  for (const question of questionsByConcept.get(conceptId) || []) {
    if (question.lesson_id == null) ids.push(question.id);
  }
}

export async function getNextChallenge(fromQuestionId) {
  if (!orderedQuestionIds) orderedQuestionIds = buildCurriculumOrder();

  const from = Number(fromQuestionId);
  const index = Number.isInteger(from)
    ? orderedQuestionIds.indexOf(from)
    : -1;

  if (index === -1) {
    const first = orderedQuestionIds[0];
    return {
      success: true,
      question: first == null ? null : { id: first },
    };
  }

  const next = orderedQuestionIds[index + 1];
  return {
    success: true,
    question: next == null ? null : { id: next },
  };
}

// Exported for verification: the exact flat order Next Challenge follows.
export function getCurriculumOrder() {
  if (!orderedQuestionIds) orderedQuestionIds = buildCurriculumOrder();
  return orderedQuestionIds.slice();
}
