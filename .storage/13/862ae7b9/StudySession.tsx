import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, ArrowLeft, Globe, MessageSquare, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIChat from '@/components/AIChat';

export default function StudySession() {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const navigate = useNavigate();

  const subjects = {
    en: [
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'physics', label: 'Physics' },
      { value: 'biology', label: 'Biology' },
      { value: 'english', label: 'English' },
      { value: 'kiswahili', label: 'Kiswahili' },
      { value: 'history', label: 'History' },
      { value: 'geography', label: 'Geography' }
    ],
    sw: [
      { value: 'mathematics', label: 'Hisabati' },
      { value: 'chemistry', label: 'Kemia' },
      { value: 'physics', label: 'Fizikia' },
      { value: 'biology', label: 'Biolojia' },
      { value: 'english', label: 'Kiingereza' },
      { value: 'kiswahili', label: 'Kiswahili' },
      { value: 'history', label: 'Historia' },
      { value: 'geography', label: 'Jiografia' }
    ]
  };

  const topics = {
    mathematics: {
      en: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
      sw: ['Aljebra', 'Jiometri', 'Trigonometri', 'Hesabu za Tofauti', 'Takwimu']
    },
    chemistry: {
      en: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
      sw: ['Kemia ya Kikaboni', 'Kemia Isiyo ya Kikaboni', 'Kemia ya Kimwili', 'Kemia ya Uchambuzi']
    },
    physics: {
      en: ['Mechanics', 'Waves and Sound', 'Electricity', 'Magnetism', 'Modern Physics'],
      sw: ['Makanika', 'Mawimbi na Sauti', 'Umeme', 'Sumaku', 'Fizikia ya Kisasa']
    }
  };

  const content = {
    en: {
      title: "AI Study Session",
      selectSubject: "Select Subject",
      selectTopic: "Select Topic",
      startSession: "Start Learning Session",
      backToDashboard: "Back to Dashboard"
    },
    sw: {
      title: "Kipindi cha Masomo cha AI",
      selectSubject: "Chagua Somo",
      selectTopic: "Chagua Mada",
      startSession: "Anza Kipindi cha Kujifunza",
      backToDashboard: "Rudi kwenye Dashibodi"
    }
  };

  const currentContent = content[language];
  const currentSubjects = subjects[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentContent.backToDashboard}</span>
            </Button>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">ShuleCoach</span>
            </div>
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentContent.title}</h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Get personalized help with your KCSE subjects' 
                : 'Pata msaada wa kibinafsi na masomo yako ya KCSE'}
            </p>
          </div>

          {/* Subject and Topic Selection */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-green-600" />
                <span>
                  {language === 'en' ? 'Choose Your Study Focus' : 'Chagua Mkazo wa Masomo Yako'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentContent.selectSubject}
                  </label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder={currentContent.selectSubject} />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSubjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentContent.selectTopic}
                  </label>
                  <Select 
                    value={selectedTopic} 
                    onValueChange={setSelectedTopic}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={currentContent.selectTopic} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedSubject && topics[selectedSubject as keyof typeof topics] && 
                        topics[selectedSubject as keyof typeof topics][language].map((topic, index) => (
                          <SelectItem key={index} value={topic}>
                            {topic}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedSubject && selectedTopic && (
                <div className="flex items-center space-x-2 pt-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {currentSubjects.find(s => s.value === selectedSubject)?.label}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedTopic}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Chat Interface */}
          <AIChat 
            language={language} 
            selectedSubject={selectedSubject}
            selectedTopic={selectedTopic}
          />
        </div>
      </div>
    </div>
  );
}