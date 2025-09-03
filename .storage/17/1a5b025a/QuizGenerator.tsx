import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, X, Trophy, RefreshCw, Play } from 'lucide-react';

interface QuizGeneratorProps {
  language: 'en' | 'sw';
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  topic: string;
}

interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export default function QuizGenerator({ language }: QuizGeneratorProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const content = {
    en: {
      title: "AI Quiz Generator",
      description: "Test your knowledge with AI-generated questions",
      generateQuiz: "Generate New Quiz",
      startQuiz: "Start Quiz",
      nextQuestion: "Next Question",
      submitAnswer: "Submit Answer",
      showResults: "Show Results",
      restartQuiz: "Restart Quiz",
      question: "Question",
      of: "of",
      score: "Your Score",
      correct: "Correct",
      incorrect: "Incorrect",
      explanation: "Explanation",
      progress: "Progress"
    },
    sw: {
      title: "Kizalishaji cha Maswali cha AI",
      description: "Jaribu ujuzi wako na maswali yanayozalishwa na AI",
      generateQuiz: "Zalisha Swali Jipya",
      startQuiz: "Anza Swali",
      nextQuestion: "Swali Linalofuata",
      submitAnswer: "Wasilisha Jibu",
      showResults: "Onyesha Matokeo",
      restartQuiz: "Anza Upya Swali",
      question: "Swali",
      of: "ya",
      score: "Alama Yako",
      correct: "Sahihi",
      incorrect: "Makosa",
      explanation: "Maelezo",
      progress: "Maendeleo"
    }
  };

  const currentContent = content[language];

  // Sample quiz questions
  const sampleQuestions: Question[] = [
    {
      id: '1',
      question: language === 'en' 
        ? 'What is the solution to the quadratic equation x² - 5x + 6 = 0?'
        : 'Suluhisho la mlinganyo wa quadratic x² - 5x + 6 = 0 ni lipi?',
      options: language === 'en'
        ? ['x = 1, x = 6', 'x = 2, x = 3', 'x = -2, x = -3', 'x = 5, x = 1']
        : ['x = 1, x = 6', 'x = 2, x = 3', 'x = -2, x = -3', 'x = 5, x = 1'],
      correctAnswer: 1,
      explanation: language === 'en'
        ? 'Factoring: x² - 5x + 6 = (x - 2)(x - 3) = 0, so x = 2 or x = 3'
        : 'Kugawanya: x² - 5x + 6 = (x - 2)(x - 3) = 0, kwa hiyo x = 2 au x = 3',
      subject: 'Mathematics',
      topic: 'Quadratic Equations'
    },
    {
      id: '2',
      question: language === 'en'
        ? 'What is the process by which plants make their own food?'
        : 'Ni utaratibu gani ambao mimea hutengeneza chakula chao?',
      options: language === 'en'
        ? ['Respiration', 'Photosynthesis', 'Transpiration', 'Germination']
        : ['Kupumua', 'Photosynthesis', 'Kutoa jasho', 'Kuota'],
      correctAnswer: 1,
      explanation: language === 'en'
        ? 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.'
        : 'Photosynthesis ni mchakato ambapo mimea hutumia mwanga wa jua, maji, na kaboni dioksidi kutengeneza glukosi na oksijeni.',
      subject: 'Biology',
      topic: 'Plant Processes'
    },
    {
      id: '3',
      question: language === 'en'
        ? 'What is the chemical symbol for Gold?'
        : 'Ni alama gani ya kikemia ya Dhahabu?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correctAnswer: 2,
      explanation: language === 'en'
        ? 'The chemical symbol for Gold is Au, derived from the Latin word "aurum".'
        : 'Alama ya kikemia ya Dhahabu ni Au, inayotokana na neno la Kilatini "aurum".',
      subject: 'Chemistry',
      topic: 'Chemical Symbols'
    }
  ];

  const [questions] = useState<Question[]>(sampleQuestions);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setQuizResults([]);
    setShowResults(false);
    setSelectedAnswer('');
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === '') return;

    const result: QuizResult = {
      questionId: questions[currentQuestion].id,
      selectedAnswer: parseInt(selectedAnswer),
      isCorrect: parseInt(selectedAnswer) === questions[currentQuestion].correctAnswer
    };

    setQuizResults(prev => [...prev, result]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = quizResults.filter(result => result.isCorrect).length;
    return {
      correct: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setQuizResults([]);
    setShowResults(false);
    setSelectedAnswer('');
  };

  if (!quizStarted) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <span>{currentContent.title}</span>
          </CardTitle>
          <p className="text-gray-600">{currentContent.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
              <BookOpen className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'Ready to Test Your Knowledge?' : 'Tayari Kujaribu Ujuzi Wako?'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' 
                  ? 'This quiz contains 3 questions covering Mathematics, Biology, and Chemistry topics.'
                  : 'Swali hili lina maswali 3 yanayoshughulikia mada za Hisabati, Biolojia, na Kemia.'}
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {language === 'en' ? '3 Questions' : 'Maswali 3'}
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {language === 'en' ? '~5 minutes' : '~dakika 5'}
                </Badge>
              </div>
            </div>
            <Button 
              onClick={handleStartQuiz}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              {currentContent.startQuiz}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-green-600" />
            <span>{currentContent.score}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mb-6">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {score.correct}/{score.total}
              </div>
              <div className="text-2xl font-semibold text-green-600 mb-2">
                {score.percentage}%
              </div>
              <p className="text-gray-600">
                {language === 'en' 
                  ? `You got ${score.correct} out of ${score.total} questions correct!`
                  : `Umepata maswali ${score.correct} kati ya ${score.total} sahihi!`}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'Question Review' : 'Mapitio ya Maswali'}
            </h3>
            {questions.map((question, index) => {
              const result = quizResults[index];
              const isCorrect = result?.isCorrect || false;
              
              return (
                <div key={question.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex} 
                            className={`p-2 rounded text-sm ${
                              optionIndex === question.correctAnswer 
                                ? 'bg-green-100 text-green-800 font-medium'
                                : optionIndex === result?.selectedAnswer && !isCorrect
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <CheckCircle className="h-4 w-4 inline ml-2 text-green-600" />
                            )}
                            {optionIndex === result?.selectedAnswer && !isCorrect && (
                              <X className="h-4 w-4 inline ml-2 text-red-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Badge variant={isCorrect ? 'default' : 'destructive'} className="ml-4">
                      {isCorrect ? currentContent.correct : currentContent.incorrect}
                    </Badge>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{currentContent.explanation}:</strong> {question.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={resetQuiz} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {currentContent.restartQuiz}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              {currentContent.generateQuiz}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <span>
              {currentContent.question} {currentQuestion + 1} {currentContent.of} {questions.length}
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {question.subject}
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {question.topic}
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{currentContent.progress}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.question}
          </h3>
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            {currentQuestion + 1} {currentContent.of} {questions.length} {language === 'en' ? 'questions' : 'maswali'}
          </div>
          <Button 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === ''}
            className="bg-green-600 hover:bg-green-700"
          >
            {currentQuestion === questions.length - 1 ? currentContent.showResults : currentContent.nextQuestion}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}