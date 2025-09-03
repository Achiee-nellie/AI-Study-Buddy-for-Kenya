import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Lightbulb, BookOpen, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  subject?: string;
  topic?: string;
}

interface AIChatProps {
  language: 'en' | 'sw';
  selectedSubject?: string;
  selectedTopic?: string;
}

export default function AIChat({ language, selectedSubject, selectedTopic }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      title: "AI Study Assistant",
      placeholder: "Ask me anything about your studies...",
      send: "Send",
      typing: "AI is thinking...",
      welcomeMessage: "Hello! I'm your AI study buddy. I can help you with KCSE subjects, explain concepts, and create practice questions. What would you like to learn today?",
      exampleQuestions: [
        "Explain quadratic equations step by step",
        "What is photosynthesis?",
        "Help me with essay writing techniques",
        "Create a quiz on atomic structure"
      ]
    },
    sw: {
      title: "Msaidizi wa Masomo wa AI",
      placeholder: "Niulize chochote kuhusu masomo yako...",
      send: "Tuma",
      typing: "AI inafikiria...",
      welcomeMessage: "Hujambo! Mimi ni rafiki yako wa masomo wa AI. Ninaweza kukusaidia na masomo ya KCSE, kueleza dhana, na kuunda maswali ya mazoezi. Ungependa kujifunza nini leo?",
      exampleQuestions: [
        "Eleza mlinganyo wa quadratic hatua kwa hatua",
        "Photosynthesis ni nini?",
        "Nisaidie na mbinu za kuandika insha",
        "Tengeneza swali la muundo wa atomi"
      ]
    }
  };

  const currentContent = content[language];

  // Sample AI responses for demo
  const sampleResponses = {
    en: [
      "Great question! Let me break this down step by step for you...",
      "I'd be happy to help you understand this concept. Here's a detailed explanation:",
      "This is an important topic in KCSE. Let me explain it clearly:",
      "Excellent! Let me provide you with a comprehensive answer:",
      "That's a thoughtful question. Here's what you need to know:"
    ],
    sw: [
      "Swali zuri! Hebu nikueleze hili hatua kwa hatua...",
      "Nitafurahi kukusaidia kuelewa dhana hii. Hapa kuna maelezo ya kina:",
      "Hii ni mada muhimu katika KCSE. Hebu niieleze kwa uwazi:",
      "Vizuri sana! Hebu nikupe jibu kamili:",
      "Hilo ni swali la busara. Hapa kuna unachohitaji kujua:"
    ]
  };

  useEffect(() => {
    // Add welcome message when component mounts
    if (messages.length === 0) {
      const welcomeMsg: Message = {
        id: '1',
        type: 'ai',
        content: currentContent.welcomeMessage,
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  }, [language]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      subject: selectedSubject,
      topic: selectedTopic
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responses = sampleResponses[language];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      let aiResponse = randomResponse;
      
      // Add context-specific responses
      if (selectedSubject && selectedTopic) {
        aiResponse += `\n\nSince you're studying ${selectedTopic} in ${selectedSubject}, here are some key points:\n\n• This concept is fundamental to understanding the subject\n• Practice problems will help reinforce your learning\n• Remember to review this topic regularly for KCSE preparation`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleExampleQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Card className="h-[600px] bg-white/80 backdrop-blur-sm border-0 flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span>{currentContent.title}</span>
          {selectedSubject && selectedTopic && (
            <div className="flex items-center space-x-2 ml-auto">
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {selectedSubject}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {selectedTopic}
              </Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`flex-1 max-w-[80%] ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{currentContent.typing}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Example Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lightbulb className="h-4 w-4" />
              <span>{language === 'en' ? 'Try asking:' : 'Jaribu kuuliza:'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentContent.exampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleExampleQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={currentContent.placeholder}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}