import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  language: 'en' | 'sw';
}

export default function PaymentModal({ isOpen, onClose, plan, language }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    // M-Pesa fields
    phoneNumber: '',
    // Card fields
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    // Common fields
    email: ''
  });

  // Early return if plan is null
  if (!plan) {
    return null;
  }

  const content = {
    en: {
      title: 'Complete Your Payment',
      selectPayment: 'Select Payment Method',
      mpesa: 'M-Pesa',
      card: 'Credit/Debit Card',
      phoneNumber: 'M-Pesa Phone Number',
      phonePlaceholder: '254712345678',
      cardNumber: 'Card Number',
      cardPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'Expiry Date',
      expiryPlaceholder: 'MM/YY',
      cvv: 'CVV',
      cvvPlaceholder: '123',
      cardName: 'Cardholder Name',
      cardNamePlaceholder: 'John Doe',
      email: 'Email Address',
      emailPlaceholder: 'your@email.com',
      payNow: 'Pay Now',
      processing: 'Processing Payment...',
      success: 'Payment Successful!',
      error: 'Payment Failed',
      tryAgain: 'Try Again',
      close: 'Close',
      mpesaInstructions: 'You will receive an M-Pesa prompt on your phone to complete the payment.',
      cardInstructions: 'Enter your card details to complete the payment securely.',
      successMessage: 'Your subscription has been activated successfully!',
      errorMessage: 'There was an error processing your payment. Please try again.'
    },
    sw: {
      title: 'Kamilisha Malipo Yako',
      selectPayment: 'Chagua Njia ya Malipo',
      mpesa: 'M-Pesa',
      card: 'Kadi ya Mkopo/Benki',
      phoneNumber: 'Nambari ya Simu ya M-Pesa',
      phonePlaceholder: '254712345678',
      cardNumber: 'Nambari ya Kadi',
      cardPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'Tarehe ya Mwisho',
      expiryPlaceholder: 'MM/YY',
      cvv: 'CVV',
      cvvPlaceholder: '123',
      cardName: 'Jina la Mmiliki wa Kadi',
      cardNamePlaceholder: 'John Doe',
      email: 'Anwani ya Barua Pepe',
      emailPlaceholder: 'your@email.com',
      payNow: 'Lipa Sasa',
      processing: 'Inachakata Malipo...',
      success: 'Malipo Yamefanikiwa!',
      error: 'Malipo Yameshindwa',
      tryAgain: 'Jaribu Tena',
      close: 'Funga',
      mpesaInstructions: 'Utapokea ujumbe wa M-Pesa kwenye simu yako kukamilisha malipo.',
      cardInstructions: 'Ingiza maelezo ya kadi yako kukamilisha malipo kwa usalama.',
      successMessage: 'Usajili wako umeamilishwa kwa mafanikio!',
      errorMessage: 'Kulikuwa na hitilafu katika kuchakata malipo yako. Tafadhali jaribu tena.'
    }
  };

  const currentContent = content[language];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email) return false;
    
    if (paymentMethod === 'mpesa') {
      return formData.phoneNumber.length >= 12;
    } else {
      return formData.cardNumber.length >= 16 && 
             formData.expiryDate.length >= 5 && 
             formData.cvv.length >= 3 && 
             formData.cardName.length >= 2;
    }
  };

  const simulateIntaSendPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    // Simulate IntaSend API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        setPaymentStatus('success');
        
        // Store payment success in localStorage
        localStorage.setItem('shulecoach_subscription', JSON.stringify({
          plan: plan.name,
          price: plan.price,
          activatedAt: new Date().toISOString(),
          status: 'active'
        }));
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    await simulateIntaSendPayment();
  };

  const handleClose = () => {
    if (paymentStatus === 'success') {
      // Refresh the page to update subscription status
      window.location.reload();
    }
    onClose();
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setIsProcessing(false);
  };

  if (paymentStatus === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span>{currentContent.success}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-gray-600 mb-4">{currentContent.successMessage}</p>
            <Badge className="bg-green-100 text-green-800">
              {plan.name} - {plan.price}{plan.period}
            </Badge>
          </div>
          <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
            {currentContent.close}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <span>{currentContent.error}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <p className="text-gray-600 mb-4">{currentContent.errorMessage}</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={resetPayment} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {currentContent.tryAgain}
            </Button>
            <Button onClick={handleClose} variant="outline" className="flex-1">
              {currentContent.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{currentContent.title}</DialogTitle>
          <DialogDescription>
            {plan.name} - {plan.price}{plan.period}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'mpesa')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mpesa" className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>{currentContent.mpesa}</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>{currentContent.card}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mpesa" className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">{currentContent.mpesaInstructions}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">{currentContent.phoneNumber}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={currentContent.phonePlaceholder}
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email-mpesa">{currentContent.email}</Label>
                <Input
                  id="email-mpesa"
                  type="email"
                  placeholder={currentContent.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">{currentContent.cardInstructions}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">{currentContent.cardNumber}</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder={currentContent.cardPlaceholder}
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">{currentContent.expiryDate}</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder={currentContent.expiryPlaceholder}
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2'))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">{currentContent.cvv}</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder={currentContent.cvvPlaceholder}
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cardName">{currentContent.cardName}</Label>
                <Input
                  id="cardName"
                  type="text"
                  placeholder={currentContent.cardNamePlaceholder}
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email-card">{currentContent.email}</Label>
                <Input
                  id="email-card"
                  type="email"
                  placeholder={currentContent.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            Total: <span className="font-bold text-lg">{plan.price}</span>
          </div>
          <Button 
            onClick={handlePayment}
            disabled={!validateForm() || isProcessing}
            className="bg-green-600 hover:bg-green-700 min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {currentContent.processing}
              </>
            ) : (
              currentContent.payNow
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}