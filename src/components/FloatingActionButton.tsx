import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, FileText, Calendar, Download, MapPin, Timer, Users } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Register and pay fees', completed: true },
    { id: '2', text: 'Confirm registration details', completed: false },
    { id: '3', text: 'Download event guide', completed: false },
    { id: '4', text: 'Check race day weather', completed: false },
    { id: '5', text: 'Prepare running gear', completed: false },
    { id: '6', text: 'Plan transportation to venue', completed: false },
    { id: '7', text: 'Get adequate rest before race', completed: false },
    { id: '8', text: 'Arrive at venue 1 hour early', completed: false },
  ]);

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const downloadEventGuide = () => {
    // Create a mock PDF download
    const pdfContent = `
Justice Half Marathon 2025 - Event Guide

Event Details:
- Date: September 26, 2025
- Time: 6:00 AM onwards
- Venue: Sylhet, Bangladesh

Race Categories:
1. 21 KM Half Marathon
2. 10 KM Long Run  
3. Student 10K
4. Kids 1 KM Fun Run

Race Day Schedule:
5:30 AM - Registration opens
6:00 AM - Warm-up session
6:30 AM - Half Marathon start
7:00 AM - 10 KM races start
8:00 AM - Kids Fun Run start

What to Bring:
- Comfortable running shoes
- Weather-appropriate clothing
- Water bottle
- Energy snacks
- BIB number (collected on race day)

Contact Information:
Phone: +8801568082587
Email: info@justicehalfmarathon.com

Organized by: Army IBA Hiking & Trekking Club
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'justice-half-marathon-2025-guide.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-in"
          variant="marathon"
        >
          <Calendar className="h-6 w-6" />
        </Button>

        {/* Expanded FAB Options */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 space-y-3 animate-slide-in-right">
            {/* Event Day Checklist */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 shadow-lg"
                  variant="accent"
                  size="sm"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Event Day Checklist</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {completedCount}/{checklistItems.length}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {checklistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {progressPercentage === 100 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-800 font-medium">
                        🎉 All set for race day! Good luck!
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Event Guide */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 shadow-lg"
                  variant="outline"
                  size="sm"
                >
                  <FileText className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Event Guide</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                      <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">September 26, 2025</div>
                      <div className="text-xs text-muted-foreground">6:00 AM onwards</div>
                    </div>
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
                      <MapPin className="h-6 w-6 text-accent mx-auto mb-2" />
                      <div className="text-sm font-medium">Sylhet</div>
                      <div className="text-xs text-muted-foreground">Bangladesh</div>
                    </div>
                  </div>

                  {/* Race Categories */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Race Categories</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-primary/5 p-2 rounded">21 KM Half Marathon</div>
                      <div className="bg-accent/5 p-2 rounded">10 KM Long Run</div>
                      <div className="bg-marathon-yellow/20 p-2 rounded">Student 10K</div>
                      <div className="bg-marathon-orange/20 p-2 rounded">Kids 1 KM Fun Run</div>
                    </div>
                  </div>

                  {/* Race Day Schedule */}
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center space-x-2">
                      <Timer className="h-4 w-4" />
                      <span>Race Day Schedule</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Registration opens</span>
                        <span className="font-medium">5:30 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Warm-up session</span>
                        <span className="font-medium">6:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Half Marathon start</span>
                        <span className="font-medium">6:30 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>10 KM races start</span>
                        <span className="font-medium">7:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kids Fun Run start</span>
                        <span className="font-medium">8:00 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={downloadEventGuide}
                    className="w-full"
                    variant="marathon"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Complete Guide
                  </Button>

                  {/* Contact Info */}
                  <div className="bg-muted/50 p-3 rounded-lg text-center text-xs text-muted-foreground">
                    <p>Need help? Contact: +8801568082587</p>
                    <p>Email: info@justicehalfmarathon.com</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingActionButton;