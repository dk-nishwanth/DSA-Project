import { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuizQuestions, QuizQuestion } from '@/data/quizData';
import { addQuizScore, SAMPLE_PROFILE } from '@/data/profileData';

interface InteractiveQuizProps {
  topicId: string;
}

export function InteractiveQuiz({ topicId }: InteractiveQuizProps) {
  const questions = getQuizQuestions(topicId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  if (questions.length === 0) {
    return null; // No quiz available for this topic
  }

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      // Save quiz score to profile when quiz is completed
      const quizScore = {
        topicId,
        score,
        totalQuestions: questions.length,
        date: new Date(),
        timeTaken: 0, // You can add timer functionality later
        difficulty: 'medium' as const
      };
      
      // In a real app, you would update the global profile state here
      // For now, we'll just log it
      console.log('Quiz completed:', quizScore);
      
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowHint(false);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: "Excellent! 🎉", color: "text-green-600" };
    if (percentage >= 60) return { message: "Good job! 👍", color: "text-blue-600" };
    if (percentage >= 40) return { message: "Keep practicing! 💪", color: "text-yellow-600" };
    return { message: "Review the topic and try again! 📚", color: "text-red-600" };
  };

  if (quizCompleted) {
    const scoreMessage = getScoreMessage();
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
      >
        <div className="text-center space-y-4">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
          <h3 className="text-2xl font-bold">Quiz Complete!</h3>
          <div className="text-4xl font-bold text-purple-600">
            {score}/{questions.length}
          </div>
          <p className={`text-lg font-semibold ${scoreMessage.color}`}>
            {scoreMessage.message}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetQuiz} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
          🧠 Quick Quiz
        </h3>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
          <p className="text-lg font-medium mb-4">{currentQ.question}</p>
          
          <div className="space-y-2">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  showResult
                    ? index === currentQ.correctAnswer
                      ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : index === selectedAnswer && index !== currentQ.correctAnswer
                      ? 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-700 dark:hover:bg-blue-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <span>
                      {index === currentQ.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : index === selectedAnswer ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : null}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Hint */}
        {currentQ.hint && !showResult && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="text-xs"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
          </div>
        )}

        <AnimatePresence>
          {showHint && currentQ.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
            >
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Hint:</strong> {currentQ.hint}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                💡 Explanation:
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {currentQ.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        {showResult && (
          <div className="flex justify-center">
            <Button onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}