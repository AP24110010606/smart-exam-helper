import { useEffect, useState } from 'react';
import api from '../api/client';

export default function QuizPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchFlashcards() {
      try {
        const { data } = await api.get('/api/flashcards');
        setFlashcards(data);
      } catch (err) {
        console.error('Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    }
    fetchFlashcards();
  }, []);

  function toggleCardSelection(cardId) {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  }

  function generateQuiz() {
    if (selectedCards.length === 0) return;

    setGenerating(true);
    const selected = flashcards.filter(card => selectedCards.includes(card._id));
    const quizQuestions = selected.map(card => {
      // Generate multiple choice options
      const correctAnswer = card.answer;
      const wrongOptions = flashcards
        .filter(c => c._id !== card._id)
        .map(c => c.answer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [correctAnswer, ...wrongOptions].sort(() => 0.5 - Math.random());
      return {
        question: card.question,
        options,
        correctAnswer,
        userAnswer: null
      };
    });
    setQuiz(quizQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setGenerating(false);
  }

  function answerQuestion(answer) {
    const updatedQuiz = [...quiz];
    updatedQuiz[currentQuestion].userAnswer = answer;
    if (answer === updatedQuiz[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setQuiz(updatedQuiz);

    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-matte-terracotta border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="font-landing text-3xl font-semibold text-matte-charcoal dark:text-matte-cream">Quiz Mode</h1>

      {!quiz.length ? (
        <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
          <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream mb-4">Select Flashcards for Quiz</h2>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {flashcards.map(card => (
              <label key={card._id} className="flex items-center gap-3 p-3 rounded-lg border border-matte-border hover:bg-matte-cream dark:border-matte-night-border dark:hover:bg-matte-night-elevated">
                <input
                  type="checkbox"
                  checked={selectedCards.includes(card._id)}
                  onChange={() => toggleCardSelection(card._id)}
                  className="rounded border-matte-border text-matte-terracotta focus:ring-matte-terracotta dark:border-matte-night-border"
                />
                <div>
                  <p className="font-medium text-matte-charcoal dark:text-matte-cream">{card.question}</p>
                  <p className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">{card.answer}</p>
                </div>
              </label>
            ))}
          </div>
          <button
            onClick={generateQuiz}
            disabled={selectedCards.length === 0 || generating}
            className="mt-4 rounded-xl bg-matte-terracotta px-6 py-2.5 font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {generating ? 'Generating…' : `Start Quiz (${selectedCards.length} questions)`}
          </button>
        </div>
      ) : showResult ? (
        <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
          <h2 className="font-landing text-lg font-semibold text-matte-charcoal dark:text-matte-cream mb-4">Quiz Results</h2>
          <p className="text-xl mb-4">Score: {score} / {quiz.length}</p>
          <div className="space-y-4">
            {quiz.map((q, index) => (
              <div key={index} className="p-4 rounded-lg border border-matte-border dark:border-matte-night-border">
                <p className="font-medium mb-2">{q.question}</p>
                <p className={`text-sm ${q.userAnswer === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                  Your answer: {q.userAnswer}
                </p>
                {q.userAnswer !== q.correctAnswer && (
                  <p className="text-sm text-green-600">Correct: {q.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setQuiz([])}
            className="mt-4 rounded-xl bg-matte-charcoal px-6 py-2.5 font-semibold text-matte-cream transition hover:bg-matte-charcoal-soft dark:bg-matte-terracotta dark:hover:bg-matte-terracotta-hover"
          >
            Take Another Quiz
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-matte-border bg-matte-paper p-6 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
              Question {currentQuestion + 1} of {quiz.length}
            </span>
            <span className="text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
              Score: {score}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-6 text-matte-charcoal dark:text-matte-cream">
            {quiz[currentQuestion].question}
          </h3>
          <div className="grid gap-3">
            {quiz[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => answerQuestion(option)}
                className="w-full text-left p-4 rounded-xl border border-matte-border bg-matte-cream hover:bg-matte-cream-dark transition dark:border-matte-night-border dark:bg-matte-night-elevated dark:hover:bg-matte-charcoal"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}