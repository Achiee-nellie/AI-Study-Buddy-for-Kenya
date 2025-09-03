import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  language: 'en' | 'sw';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, language }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    school: ''
  });

  const content = {
    en: {
      login: 'Sign In',
      register: 'Create Account',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      school: 'School Name',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUp: 'Sign up',
      switchToLogin: 'Sign in',
      loading: 'Please wait...',
      welcomeBack: 'Welcome back!',
      accountCreated: 'Account created successfully!',
      invalidCredentials: 'Invalid email or password',
      emailExists: 'Email already exists',
      passwordMismatch: 'Passwords do not match',
      weakPassword: 'Password must be at least 8 characters with uppercase, lowercase, and number',
      invalidEmail: 'Please enter a valid email address',
      requiredField: 'This field is required',
      phoneFormat: 'Phone number must start with 254 (e.g., 254712345678)',
      securityNote: 'Your data is encrypted and secure'
    },
    sw: {
      login: 'Ingia',
      register: 'Tengeneza Akaunti',
      email: 'Anwani ya Barua Pepe',
      password: 'Nywila',
      confirmPassword: 'Thibitisha Nywila',
      firstName: 'Jina la Kwanza',
      lastName: 'Jina la Mwisho',
      phoneNumber: 'Nambari ya Simu',
      school: 'Jina la Shule',
      signIn: 'Ingia',
      createAccount: 'Tengeneza Akaunti',
      forgotPassword: 'Umesahau Nywila?',
      noAccount: 'Huna akaunti?',
      hasAccount: 'Una akaunti tayari?',
      signUp: 'Jisajili',
      switchToLogin: 'Ingia',
      loading: 'Tafadhali subiri...',
      welcomeBack: 'Karibu tena!',
      accountCreated: 'Akaunti imetengenezwa kwa mafanikio!',
      invalidCredentials: 'Barua pepe au nywila si sahihi',
      emailExists: 'Barua pepe tayari ipo',
      passwordMismatch: 'Nywila hazifanani',
      weakPassword: 'Nywila lazima iwe na angalau herufi 8 na herufi kubwa, ndogo, na nambari',
      invalidEmail: 'Tafadhali ingiza anwani sahihi ya barua pepe',
      requiredField: 'Sehemu hii inahitajika',
      phoneFormat: 'Nambari ya simu lazima ianze na 254 (mfano: 254712345678)',
      securityNote: 'Data yako imehifadhiwa kwa usalama'
    }
  };

  const currentContent = content[language];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone: string) => {
    // Kenyan phone format: 254XXXXXXXXX
    const phoneRegex = /^254[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = currentContent.requiredField;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = currentContent.invalidEmail;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = currentContent.requiredField;
    } else if (authMode === 'register' && !validatePassword(formData.password)) {
      newErrors.password = currentContent.weakPassword;
    }

    if (authMode === 'register') {
      // Additional registration validations
      if (!formData.firstName) newErrors.firstName = currentContent.requiredField;
      if (!formData.lastName) newErrors.lastName = currentContent.requiredField;
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = currentContent.requiredField;
      } else if (!validatePhone(formData.phoneNumber)) {
        newErrors.phoneNumber = currentContent.phoneFormat;
      }
      if (!formData.school) newErrors.school = currentContent.requiredField;
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = currentContent.passwordMismatch;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateAuth = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (authMode === 'login') {
        // Simulate login validation
        const existingUsers = JSON.parse(localStorage.getItem('shulecoach_users') || '[]');
        const user = existingUsers.find((u: any) => u.email === formData.email);
        
        if (!user || user.password !== formData.password) {
          setErrors({ general: currentContent.invalidCredentials });
          return;
        }

        // Successful login
        const authUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          school: user.school,
          phoneNumber: user.phoneNumber,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('shulecoach_auth', JSON.stringify(authUser));
        onAuthSuccess(authUser);
        onClose();
      } else {
        // Simulate registration
        const existingUsers = JSON.parse(localStorage.getItem('shulecoach_users') || '[]');
        
        if (existingUsers.find((u: any) => u.email === formData.email)) {
          setErrors({ email: currentContent.emailExists });
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password, // In real app, this would be hashed
          firstName: formData.firstName,
          lastName: formData.lastName,
          school: formData.school,
          phoneNumber: formData.phoneNumber,
          createdAt: new Date().toISOString(),
          verified: false
        };

        existingUsers.push(newUser);
        localStorage.setItem('shulecoach_users', JSON.stringify(existingUsers));

        // Auto-login after registration
        const authUser = {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          school: newUser.school,
          phoneNumber: newUser.phoneNumber,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('shulecoach_auth', JSON.stringify(authUser));
        onAuthSuccess(authUser);
        onClose();
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await simulateAuth();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {authMode === 'login' ? currentContent.login : currentContent.register}
          </DialogTitle>
          <DialogDescription className="text-center">
            {authMode === 'login' 
              ? currentContent.welcomeBack 
              : 'Join thousands of students preparing for KCSE'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* Registration Fields */}
          {authMode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{currentContent.firstName}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">{currentContent.lastName}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="school">{currentContent.school}</Label>
                <Input
                  id="school"
                  type="text"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  className={errors.school ? 'border-red-500' : ''}
                />
                {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school}</p>}
              </div>

              <div>
                <Label htmlFor="phoneNumber">{currentContent.phoneNumber}</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="254712345678"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <Label htmlFor="email">{currentContent.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password">{currentContent.password}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field (Registration only) */}
          {authMode === 'register' && (
            <div>
              <Label htmlFor="confirmPassword">{currentContent.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {currentContent.loading}
              </>
            ) : (
              authMode === 'login' ? currentContent.signIn : currentContent.createAccount
            )}
          </Button>

          {/* Forgot Password (Login only) */}
          {authMode === 'login' && (
            <div className="text-center">
              <Button variant="link" className="text-sm text-blue-600">
                {currentContent.forgotPassword}
              </Button>
            </div>
          )}

          {/* Switch Mode */}
          <div className="text-center text-sm text-gray-600">
            {authMode === 'login' ? currentContent.noAccount : currentContent.hasAccount}
            <Button
              type="button"
              variant="link"
              className="ml-1 p-0 text-blue-600"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setErrors({});
              }}
            >
              {authMode === 'login' ? currentContent.signUp : currentContent.switchToLogin}
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {currentContent.securityNote}
            </Badge>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}