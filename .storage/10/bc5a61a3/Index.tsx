import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BookOpen, MessageSquare, Camera, Globe, BarChart3, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const navigate = useNavigate();

  const content = {
    en: {
      hero: {
        title: "Master KCSE with AI-Powered Study Buddy",
        subtitle: "Get personalized tutoring, instant quizzes, and step-by-step explanations for all KCSE subjects",
        cta: "Start Learning Free"
      },
      features: [
        {
          icon: MessageSquare,
          title: "AI Tutor Chat",
          description: "Ask questions and get detailed explanations in real-time"
        },
        {
          icon: Camera,
          title: "OCR Notes Scanner",
          description: "Upload handwritten notes and convert them to digital text"
        },
        {
          icon: BookOpen,
          title: "Smart Quizzes",
          description: "Auto-generated quizzes from your study materials"
        },
        {
          icon: Globe,
          title: "Bilingual Support",
          description: "Learn in English or Swahili - switch anytime"
        },
        {
          icon: BarChart3,
          title: "Progress Tracking",
          description: "Monitor your learning progress with detailed analytics"
        },
        {
          icon: Users,
          title: "Teacher Dashboard",
          description: "Class progress heatmaps for educators"
        }
      ],
      pricing: {
        title: "Choose Your Learning Plan",
        plans: [
          {
            name: "Free",
            price: "KES 0",
            period: "/month",
            features: ["10 questions per day", "Basic quizzes", "English support", "Progress tracking"],
            cta: "Get Started Free"
          },
          {
            name: "Pro Student",
            price: "KES 199",
            period: "/month",
            features: ["Unlimited questions", "Advanced quizzes", "OCR scanning", "Bilingual support", "Exam simulators", "Offline study packs"],
            cta: "Upgrade to Pro",
            popular: true
          },
          {
            name: "School Plan",
            price: "KES 3,999",
            period: "/classroom/month",
            features: ["Multi-seat access", "Teacher dashboard", "Class analytics", "Bulk content upload", "Priority support"],
            cta: "Contact Sales"
          }
        ]
      }
    },
    sw: {
      hero: {
        title: "Jifunze KCSE na Msaidizi wa AI",
        subtitle: "Pata mafunzo ya kibinafsi, maswali ya haraka, na maelezo ya hatua kwa hatua kwa masomo yote ya KCSE",
        cta: "Anza Kujifunza Bure"
      },
      features: [
        {
          icon: MessageSquare,
          title: "Mazungumzo ya AI",
          description: "Uliza maswali na upate maelezo ya kina wakati huo huo"
        },
        {
          icon: Camera,
          title: "Skana ya Maandishi",
          description: "Pakia maandishi ya mkono na uyabadilishe kuwa maandishi ya kidijitali"
        },
        {
          icon: BookOpen,
          title: "Maswali Mahiri",
          description: "Maswali yanayotengenezwa kiotomatiki kutoka vifaa vyako vya masomo"
        },
        {
          icon: Globe,
          title: "Msaada wa Lugha Mbili",
          description: "Jifunze kwa Kiingereza au Kiswahili - badilisha wakati wowote"
        },
        {
          icon: BarChart3,
          title: "Ufuatiliaji wa Maendeleo",
          description: "Fuatilia maendeleo yako ya kujifunza na takwimu za kina"
        },
        {
          icon: Users,
          title: "Dashibodi ya Mwalimu",
          description: "Ramani za joto za maendeleo ya darasa kwa waelimishaji"
        }
      ],
      pricing: {
        title: "Chagua Mpango Wako wa Kujifunza",
        plans: [
          {
            name: "Bure",
            price: "KES 0",
            period: "/mwezi",
            features: ["Maswali 10 kwa siku", "Maswali ya msingi", "Msaada wa Kiingereza", "Ufuatiliaji wa maendeleo"],
            cta: "Anza Bure"
          },
          {
            name: "Mwanafunzi Pro",
            price: "KES 199",
            period: "/mwezi",
            features: ["Maswali yasiyo na kikomo", "Maswali ya hali ya juu", "Uskani wa OCR", "Msaada wa lugha mbili", "Jaribio la mtihani", "Vifurushi vya kusoma nje ya mtandao"],
            cta: "Pandisha hadi Pro",
            popular: true
          },
          {
            name: "Mpango wa Shule",
            price: "KES 3,999",
            period: "/darasa/mwezi",
            features: ["Ufikiaji wa viti vingi", "Dashibodi ya mwalimu", "Takwimu za darasa", "Upakiaji wa maudhui kwa wingi", "Msaada wa kipaumbele"],
            cta: "Wasiliana na Mauzo"
          }
        ]
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">ShuleCoach</span>
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
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            {language === 'en' ? 'Sign In' : 'Ingia'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-4 w-4 mr-2" />
            {language === 'en' ? 'AI-Powered Learning' : 'Kujifunza kwa Nguvu za AI'}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            {currentContent.hero.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {currentContent.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              onClick={() => navigate('/dashboard')}
            >
              {currentContent.hero.cta}
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              {language === 'en' ? 'Watch Demo' : 'Ona Onyesho'}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Powerful Features for Better Learning' : 'Vipengele Vyenye Nguvu kwa Kujifunza Bora'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Everything you need to excel in your KCSE preparation' 
              : 'Kila kitu unachohitaji kufanikiwa katika maandalizi yako ya KCSE'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentContent.features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {currentContent.pricing.title}
          </h2>
          <p className="text-xl text-gray-600">
            {language === 'en' 
              ? 'Flexible plans for every student and school' 
              : 'Mipango inayoweza kubadilika kwa kila mwanafunzi na shule'}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentContent.pricing.plans.map((plan, index) => (
            <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${
              plan.popular ? 'border-2 border-green-500 scale-105' : 'border-0'
            } bg-white/90 backdrop-blur-sm`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-blue-500">
                  {language === 'en' ? 'Most Popular' : 'Maarufu Zaidi'}
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-green-600">
                  {plan.price}
                  <span className="text-sm text-gray-500 font-normal">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-6 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => navigate('/dashboard')}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6 text-green-400" />
            <span className="text-xl font-bold">ShuleCoach</span>
          </div>
          <p className="text-gray-400 mb-4">
            {language === 'en' 
              ? 'Empowering Kenyan students with AI-powered learning' 
              : 'Kuwezesha wanafunzi wa Kenya kwa kujifunza kwa nguvu za AI'}
          </p>
          <p className="text-sm text-gray-500">
            © 2024 ShuleCoach. {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'}
          </p>
        </div>
      </footer>
    </div>
  );
}