import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageSquare, Upload, Trophy, Clock, Globe, User, Settings, Crown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FileUpload from '@/components/FileUpload';
import AIChat from '@/components/AIChat';
import QuizGenerator from '@/components/QuizGenerator';
import PaymentModal from '@/components/PaymentModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthModal from '@/components/AuthModal';

export default function Dashboard() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    plan: any;
  }>({
    isOpen: false,
    plan: null
  });
  const [authModal, setAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout, login } = useAuth();

  useEffect(() => {
    // Check for subscription status
    const savedSubscription = localStorage.getItem('shulecoach_subscription');
    if (savedSubscription) {
      setSubscription(JSON.parse(savedSubscription));
    }
  }, []);

  const content = {
    en: {
      welcome: subscription?.plan === 'Pro Student' ? `Welcome back, ${user?.firstName}! (Pro)` : `Welcome back, ${user?.firstName}!`,
      todayProgress: "Today's Progress",
      questionsUsed: "Questions Used",
      studyStreak: "Study Streak",
      tabs: {
        study: "Study",
        upload: "Upload",
        quiz: "Quiz",
        progress: "Progress"
      },
      recentSessions: "Recent Study Sessions",
      quickActions: "Quick Actions",
      proFeatures: "Pro Features",
      unlimitedQuestions: "Unlimited Questions",
      ocrScanning: "OCR Scanning",
      examSimulators: "Exam Simulators",
      upgradeNow: "Upgrade to Pro",
      signOut: "Sign Out"
    },
    sw: {
      welcome: subscription?.plan === 'Mwanafunzi Pro' ? `Karibu tena, ${user?.firstName}! (Pro)` : `Karibu tena, ${user?.firstName}!`,
      todayProgress: "Maendeleo ya Leo",
      questionsUsed: "Maswali Yaliyotumiwa",
      studyStreak: "Mfuatano wa Masomo",
      tabs: {
        study: "Soma",
        upload: "Pakia",
        quiz: "Swali",
        progress: "Maendeleo"
      },
      recentSessions: "Vipindi vya Hivi Karibuni vya Masomo",
      quickActions: "Vitendo vya Haraka",
      proFeatures: "Vipengele vya Pro",
      unlimitedQuestions: "Maswali Yasiyo na Kikomo",
      ocrScanning: "Uskani wa OCR",
      examSimulators: "Jaribio la Mtihani",
      upgradeNow: "Pandisha hadi Pro",
      signOut: "Toka"
    }
  };

  const currentContent = content[language];

  const recentSessions = [
    { subject: "Mathematics", topic: "Quadratic Equations", time: "2 hours ago", progress: 85 },
    { subject: "Chemistry", topic: "Organic Chemistry", time: "1 day ago", progress: 70 },
    { subject: "Physics", topic: "Waves and Sound", time: "2 days ago", progress: 92 }
  ];

  const isPro = subscription?.plan === 'Pro Student' || subscription?.plan === 'Mwanafunzi Pro';
  const questionsUsed = isPro ? 25 : 7;
  const questionLimit = isPro ? 'Unlimited' : 10;

  const handleUpgrade = () => {
    const proPlan = {
      name: language === 'en' ? 'Pro Student' : 'Mwanafunzi Pro',
      price: 'KES 199',
      period: language === 'en' ? '/month' : '/mwezi',
      features: language === 'en' 
        ? ["Unlimited questions", "Advanced quizzes", "OCR scanning", "Bilingual support", "Exam simulators", "Offline study packs"]
        : ["Maswali yasiyo na kikomo", "Maswali ya hali ya juu", "Uskani wa OCR", "Msaada wa lugha mbili", "Jaribio la mtihani", "Vifurushi vya kusoma nje ya mtandao"]
    };

    setPaymentModal({
      isOpen: true,
      plan: proPlan
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      plan: null
    });
  };

  const handleAuthRequired = () => {
    setAuthModal(true);
  };

  const handleAuthSuccess = (userData: any) => {
    login(userData);
  };

  const closeAuthModal = () => {
    setAuthModal(false);
  };

  return (
    <ProtectedRoute onAuthRequired={handleAuthRequired} language={language}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">ShuleCoach</span>
              {isPro && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  PRO
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
                className="flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'en' ? 'Kiswahili' : 'English'}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="ml-2">{currentContent.signOut}</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentContent.welcome}</h1>
            <p className="text-gray-600">Ready to continue your KCSE preparation journey?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{currentContent.todayProgress}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">7/10</div>
                <Progress value={70} className="bg-green-400" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{currentContent.questionsUsed}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {questionsUsed}/{isPro ? '∞' : questionLimit}
                </div>
                <p className="text-sm opacity-90">
                  {isPro ? (language === 'en' ? 'Pro plan - unlimited' : 'Mpango wa Pro - bila kikomo') : (language === 'en' ? 'Free plan limit' : 'Kikomo cha mpango wa bure')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{currentContent.studyStreak}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8" />
                  <span className="text-3xl font-bold">5 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="study" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="study" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>{currentContent.tabs.study}</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>{currentContent.tabs.upload}</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{currentContent.tabs.quiz}</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>{currentContent.tabs.progress}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study">
              <AIChat language={language} />
            </TabsContent>

            <TabsContent value="upload">
              {isPro ? (
                <FileUpload language={language} />
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-0">
                  <CardContent className="p-8 text-center">
                    <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === 'en' ? 'Pro Feature' : 'Kipengele cha Pro'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'en' 
                        ? 'Upload and scan your handwritten notes with OCR technology' 
                        : 'Pakia na skana maandishi yako ya mkono kwa teknolojia ya OCR'}
                    </p>
                    <Button onClick={handleUpgrade} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      {currentContent.upgradeNow}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="quiz">
              <QuizGenerator language={language} />
            </TabsContent>

            <TabsContent value="progress">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0">
                  <CardHeader>
                    <CardTitle>{currentContent.recentSessions}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentSessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{session.subject}</h4>
                          <p className="text-sm text-gray-600">{session.topic}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {session.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{session.progress}%</div>
                          <Progress value={session.progress} className="w-16 h-2" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0">
                  <CardHeader>
                    <CardTitle>{currentContent.quickActions}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate('/study')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start AI Tutoring Session
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => isPro ? null : handleUpgrade()}
                      disabled={!isPro}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Study Materials
                      {!isPro && <Crown className="h-4 w-4 ml-auto text-yellow-500" />}
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Generate Practice Quiz
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Trophy className="h-4 w-4 mr-2" />
                      View Detailed Progress
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Upgrade Banner - Only show for free users */}
          {!isPro && (
            <Card className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Upgrade to Pro for Unlimited Access!</h3>
                    <p className="opacity-90">Get unlimited questions, OCR scanning, and exam simulators for just KES 199/month</p>
                  </div>
                  <Button onClick={handleUpgrade} variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modals */}
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={closePaymentModal}
          plan={paymentModal.plan}
          language={language}
        />

        <AuthModal
          isOpen={authModal}
          onClose={closeAuthModal}
          onAuthSuccess={handleAuthSuccess}
          language={language}
        />
      </div>
    </ProtectedRoute>
  );
}