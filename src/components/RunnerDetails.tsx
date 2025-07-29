import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Edit, Save, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

interface RunnerDetailsProps {
  data: RunnerData;
  onBack: () => void;
}

const tshirtSizes = [
  "Xs Kids'", "S Kids'", "M Kids'", 
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case '21 KM Half Marathon': return 'bg-primary text-primary-foreground';
    case '10 KM Long Run': return 'bg-accent text-accent-foreground';
    case 'Student 10K': return 'bg-marathon-yellow text-black';
    case 'Kids 1 KM Fun Run': return 'bg-marathon-orange text-white';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const RunnerDetails = ({ data, onBack }: RunnerDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    fullName: data.fullName,
    tshirtSize: data.tshirtSize
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(data.confirmed === 'Yes');
  const { toast } = useToast();

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      // Log confirmation to Supabase
      const { error } = await supabase
        .from('confirmations')
        .insert({
          phone: data.phone,
          status: 'confirmed'
        });

      if (error) throw error;

      // Here you would also update the Google Sheet
      // await updateGoogleSheet(data.phone, { confirmed: 'Yes' });

      setIsConfirmed(true);
      toast({
        title: "নিশ্চিতকরণ সফল!",
        description: "Details confirmed successfully! আপনার তথ্য সফলভাবে নিশ্চিত করা হয়েছে।",
      });
    } catch (error) {
      console.error('Confirmation error:', error);
      toast({
        title: "Error",
        description: "Failed to confirm details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      // Log edit to Supabase
      const { error } = await supabase
        .from('edits')
        .insert({
          phone: data.phone,
          old_name: data.fullName,
          new_name: editedData.fullName,
          old_tshirt: data.tshirtSize,
          new_tshirt: editedData.tshirtSize
        });

      if (error) throw error;

      // Here you would also update the Google Sheet
      // await updateGoogleSheet(data.phone, editedData);

      // Update local data
      data.fullName = editedData.fullName;
      data.tshirtSize = editedData.tshirtSize;

      setIsEditing(false);
      toast({
        title: "তথ্য আপডেট সফল!",
        description: "Details updated successfully! আপনার তথ্য সফলভাবে আপডেট করা হয়েছে।",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Status Card */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isConfirmed ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-600">Confirmed</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-marathon-yellow" />
                  <span className="text-lg font-semibold text-marathon-yellow">Pending Confirmation</span>
                </>
              )}
            </div>
            <Badge className={getCategoryColor(data.category)}>
              {data.category}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Runner Details Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>রানার তথ্য / Runner Details</span>
            {!isConfirmed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Editable Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name / পূর্ণ নাম</label>
              {isEditing ? (
                <Input
                  value={editedData.fullName}
                  onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                  className="font-medium"
                />
              ) : (
                <p className="p-2 bg-muted rounded-md font-medium">{data.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">T-Shirt Size / টি-শার্ট সাইজ</label>
              {isEditing ? (
                <Select
                  value={editedData.tshirtSize}
                  onValueChange={(value) => setEditedData({...editedData, tshirtSize: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tshirtSizes.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="p-2 bg-muted rounded-md font-medium">{data.tshirtSize}</p>
              )}
            </div>

            {/* Read-only Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="p-2 bg-muted/50 rounded-md text-muted-foreground">{data.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone / ফোন</label>
              <p className="p-2 bg-muted/50 rounded-md text-muted-foreground">{data.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender / লিঙ্গ</label>
              <p className="p-2 bg-muted/50 rounded-md text-muted-foreground">{data.gender}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth / জন্ম তারিখ</label>
              <p className="p-2 bg-muted/50 rounded-md text-muted-foreground">{data.dateOfBirth}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address / ঠিকানা</label>
              <p className="p-2 bg-muted/50 rounded-md text-muted-foreground">{data.address}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Accommodation / থাকার ব্যবস্থা</label>
              <p className="p-2 bg-muted/50 rounded-md text-muted-foreground">{data.accommodation}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Transaction ID / ট্রানজাকশন আইডি</label>
              <p className="p-2 bg-muted/50 rounded-md text-muted-foreground">{data.transactionId}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {isEditing ? (
              <Button
                onClick={handleSaveEdit}
                disabled={isSaving}
                variant="marathon"
                className="flex-1"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes / পরিবর্তন সংরক্ষণ</span>
                  </div>
                )}
              </Button>
            ) : !isConfirmed ? (
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                variant="confirm"
                className="flex-1"
              >
                {isConfirming ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirm Details / তথ্য নিশ্চিত করুন</span>
                  </div>
                )}
              </Button>
            ) : (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ধন্যবাদ! আপনার রেজিস্ট্রেশন নিশ্চিত হয়েছে। / Thank you! Your registration has been confirmed.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 sm:flex-initial"
            >
              Back / ফিরে যান
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunnerDetails;