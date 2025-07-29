import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { LogIn, Download, Filter, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

interface RunnerData {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  tshirtSize: string;
  confirmed: string;
  transactionId: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [runners, setRunners] = useState<RunnerData[]>([]);
  const [filteredRunners, setFilteredRunners] = useState<RunnerData[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockRunners: RunnerData[] = [
    {
      fullName: "আহমেদ করিম",
      email: "ahmed.karim@example.com",
      phone: "+8801712345678",
      category: "21 KM Half Marathon",
      tshirtSize: "L",
      confirmed: "Yes",
      transactionId: "TX123456789"
    },
    {
      fullName: "ফাতিমা খাতুন",
      email: "fatima.khatun@example.com", 
      phone: "+8801787654321",
      category: "10 KM Long Run",
      tshirtSize: "M",
      confirmed: "No",
      transactionId: "TX987654321"
    },
    {
      fullName: "রহিম উদ্দিন",
      email: "rahim.uddin@example.com",
      phone: "+8801512345678",
      category: "Student 10K",
      tshirtSize: "XL",
      confirmed: "Yes",
      transactionId: "TX456789123"
    },
    {
      fullName: "সারা বেগম",
      email: "sara.begum@example.com",
      phone: "+8801612345678",
      category: "Kids 1 KM Fun Run",
      tshirtSize: "S Kids'",
      confirmed: "No",
      transactionId: "TX789123456"
    }
  ];

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load runners data when user is authenticated
          setTimeout(() => {
            setRunners(mockRunners);
            setFilteredRunners(mockRunners);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setRunners(mockRunners);
        setFilteredRunners(mockRunners);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Filter runners based on search and filter criteria
    let filtered = runners;

    if (searchTerm) {
      filtered = filtered.filter(runner =>
        runner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        runner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        runner.phone.includes(searchTerm) ||
        runner.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter(runner => {
        switch (filter) {
          case 'confirmed': return runner.confirmed === 'Yes';
          case 'pending': return runner.confirmed === 'No';
          case 'half-marathon': return runner.category === '21 KM Half Marathon';
          case 'long-run': return runner.category === '10 KM Long Run';
          case 'student': return runner.category === 'Student 10K';
          case 'kids': return runner.category === 'Kids 1 KM Fun Run';
          default: return true;
        }
      });
    }

    setFilteredRunners(filtered);
  }, [runners, searchTerm, filter]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel!",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRunners([]);
    setFilteredRunners([]);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Full Name', 'Email', 'Phone', 'Category', 'T-Shirt Size', 'Confirmed', 'Transaction ID'],
      ...filteredRunners.map(runner => [
        runner.fullName,
        runner.email,
        runner.phone,
        runner.category,
        runner.tshirtSize,
        runner.confirmed,
        runner.transactionId
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `justice-marathon-runners-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredRunners.length} runner records.`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '21 KM Half Marathon': return 'bg-primary text-primary-foreground';
      case '10 KM Long Run': return 'bg-accent text-accent-foreground';
      case 'Student 10K': return 'bg-marathon-yellow text-black';
      case 'Kids 1 KM Fun Run': return 'bg-marathon-orange text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 font-inter">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Admin Login</CardTitle>
            <p className="text-muted-foreground">Justice Half Marathon 2025</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="admin@justicehalfmarathon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
              variant="marathon"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Demo credentials: admin@example.com / password123
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
              <p className="text-muted-foreground">Justice Half Marathon 2025</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{runners.length}</div>
                  <div className="text-sm text-muted-foreground">Total Runners</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {runners.filter(r => r.confirmed === 'Yes').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Confirmed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-8 w-8 text-marathon-yellow" />
                <div>
                  <div className="text-2xl font-bold">
                    {runners.filter(r => r.confirmed === 'No').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Download className="h-8 w-8 text-accent" />
                <div>
                  <Button
                    onClick={exportToCSV}
                    variant="accent"
                    size="sm"
                    className="w-full"
                  >
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, phone, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Runners</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="half-marathon">21 KM Half Marathon</SelectItem>
                  <SelectItem value="long-run">10 KM Long Run</SelectItem>
                  <SelectItem value="student">Student 10K</SelectItem>
                  <SelectItem value="kids">Kids 1 KM Fun Run</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Runners Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Runners ({filteredRunners.length})</span>
              <Filter className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>T-Shirt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRunners.map((runner, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{runner.fullName}</TableCell>
                      <TableCell>{runner.email}</TableCell>
                      <TableCell>{runner.phone}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(runner.category)}>
                          {runner.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{runner.tshirtSize}</TableCell>
                      <TableCell>
                        <Badge variant={runner.confirmed === 'Yes' ? 'default' : 'secondary'}>
                          {runner.confirmed === 'Yes' ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Confirmed</>
                          ) : (
                            <><AlertCircle className="h-3 w-3 mr-1" /> Pending</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{runner.transactionId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;