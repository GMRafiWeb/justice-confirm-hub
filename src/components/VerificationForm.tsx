import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerificationFormProps {
  onVerificationSuccess: (data: RunnerData) => void;
}

interface RunnerData {
  fullName: string;
  email: string;
  phone: string;
  alternativePhone: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  tshirtSize: string;
  accommodation: string;
  category: string;
  paymentNumber: string;
  transactionId: string;
  confirmed: string;
}

const VerificationForm = ({ onVerificationSuccess }: VerificationFormProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Mock Google Sheets data - replace with actual API call
  const mockRunnerData: RunnerData[] = [
    {
      fullName: "আহমেদ করিম",
      email: "ahmed.karim@example.com", 
      phone: "+8801712345678",
      alternativePhone: "+8801812345678",
      dateOfBirth: "1990-01-15",
      address: "Sylhet, Bangladesh",
      gender: "Male",
      tshirtSize: "L",
      accommodation: "No",
      category: "21 KM Half Marathon",
      paymentNumber: "+8801712345678",
      transactionId: "TX123456789",
      confirmed: "No"
    },
    {
      fullName: "ফাতিমা খাতুন",
      email: "fatima.khatun@example.com",
      phone: "+8801787654321", 
      alternativePhone: "+8801887654321",
      dateOfBirth: "1985-05-20",
      address: "Dhaka, Bangladesh",
      gender: "Female",
      tshirtSize: "M",
      accommodation: "Yes",
      category: "10 KM Long Run",
      paymentNumber: "+8801787654321",
      transactionId: "TX987654321",
      confirmed: "No"
    }
  ];

  const handleVerification = async () => {
    if (!searchInput.trim()) {
      setError('দয়া করে আপনার ফোন নম্বর বা ট্রানজাকশন আইডি লিখুন');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Search in mock data - replace with actual Google Sheets API call
      const foundRunner = mockRunnerData.find(runner => 
        runner.phone === searchInput || 
        runner.transactionId === searchInput ||
        runner.phone.replace(/\+88/, '') === searchInput.replace(/\+88/, '')
      );

      if (foundRunner) {
        onVerificationSuccess(foundRunner);
        toast({
          title: "তথ্য পাওয়া গেছে!",
          description: "আপনার রেজিস্ট্রেশন তথ্য সফলভাবে খুঁজে পাওয়া গেছে।",
        });
      } else {
        setError('কোনো রানার পাওয়া যায়নি। যোগাযোগ করুন: +8801568082587 অথবা info@justicehalfmarathon.com');
      }
    } catch (err) {
      setError('একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          রেজিস্ট্রেশন যাচাই
        </CardTitle>
        <p className="text-muted-foreground">
          Verify Your Registration
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-2">
              ফোন নম্বর বা ট্রানজাকশন আইডি / Phone Number or Transaction ID
            </label>
            <Input
              id="search"
              type="text"
              placeholder="+8801XXXXXXXXX or TX123456789"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="animate-bounce-in">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleVerification}
            disabled={isLoading}
            className="w-full"
            variant="marathon"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>খোঁজা হচ্ছে...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>তথ্য যাচাই করুন / Verify Details</span>
              </div>
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help? Contact us:</p>
          <div className="mt-1 space-y-1">
            <p>📞 +8801568082587</p>
            <p>✉️ info@justicehalfmarathon.com</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;