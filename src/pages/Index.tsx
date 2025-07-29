import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VerificationForm from '@/components/VerificationForm';
import RunnerDetails from '@/components/RunnerDetails';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, MapPin, Users } from 'lucide-react';

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

const Index = () => {
  const [runnerData, setRunnerData] = useState<RunnerData | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown to September 26, 2025
  useEffect(() => {
    const eventDate = new Date('2025-09-26T06:00:00+06:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;
      
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerificationSuccess = (data: RunnerData) => {
    setRunnerData(data);
  };

  const handleBack = () => {
    setRunnerData(null);
  };

  return (
    <div className="min-h-screen bg-background font-inter flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
            Justice Half Marathon
            <span className="block text-2xl md:text-3xl text-accent font-semibold mt-2">
              2025
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Confirm your registration details for the biggest running event in Sylhet
          </p>
          <p className="text-base text-muted-foreground">
            আপনার রেজিস্ট্রেশন তথ্য নিশ্চিত করুন
          </p>
        </div>

        {/* Countdown Timer */}
        <Card className="max-w-4xl mx-auto mb-12 shadow-card animate-bounce-in">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center space-x-2">
                <Timer className="h-6 w-6" />
                <span>Event Countdown / ইভেন্ট কাউন্টডাউন</span>
              </h2>
              <p className="text-muted-foreground">September 26, 2025 • Sylhet, Bangladesh</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { label: 'Days', labelBn: 'দিন', value: countdown.days },
                { label: 'Hours', labelBn: 'ঘন্টা', value: countdown.hours },
                { label: 'Minutes', labelBn: 'মিনিট', value: countdown.minutes },
                { label: 'Seconds', labelBn: 'সেকেন্ড', value: countdown.seconds },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-2">
                    <div className="text-2xl md:text-3xl font-bold">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    <div>{item.label}</div>
                    <div>{item.labelBn}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Stats */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 animate-slide-in-right">
          {[
            { icon: MapPin, title: '21 KM', subtitle: 'Half Marathon', color: 'text-primary' },
            { icon: Users, title: '1000+', subtitle: 'Expected Runners', color: 'text-accent' },
            { icon: Timer, title: '4', subtitle: 'Categories', color: 'text-marathon-orange' },
          ].map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <stat.icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.title}</div>
                <div className="text-muted-foreground">{stat.subtitle}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {runnerData ? (
            <RunnerDetails data={runnerData} onBack={handleBack} />
          ) : (
            <VerificationForm onVerificationSuccess={handleVerificationSuccess} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
