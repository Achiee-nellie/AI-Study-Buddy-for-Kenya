import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, BookOpen } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  onAuthRequired: () => void;
  language: 'en' | 'sw';
}

export default function ProtectedRoute({ children, onAuthRequired, language }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  const content = {
    en: {
      title: 'Authentication Required',
      message: 'Please sign in to access your study dashboard and track your progress.',
      signIn: 'Sign In',
      features: [
        'Save your study progress',
        'Track quiz scores',
        'Access personalized content',
        'Sync across devices'
      ]
    },
    sw: {
      title: 'Uthibitisho Unahitajika',
      message: 'Tafadhali ingia ili kufikia dashibodi yako ya masomo na kufuatilia maendeleo yako.',
      signIn: 'Ingia',
      features: [
        'Hifadhi maendeleo yako ya masomo',
        'Fuatilia alama za maswali',
        'Fikia maudhui ya kibinafsi',
        'Sawazisha kwenye vifaa vyote'
      ]
    }
  };

  const currentContent = content[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{currentContent.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-center">{currentContent.message}</p>
            
            <div className="space-y-2">
              {currentContent.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={onAuthRequired}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {currentContent.signIn}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}