-- Create a table for confirmation logs
CREATE TABLE public.confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for edit logs
CREATE TABLE public.edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  old_name TEXT,
  new_name TEXT,
  old_tshirt TEXT,
  new_tshirt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for admin actions
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for confirmations (public can insert/select their own)
CREATE POLICY "Anyone can view confirmations" 
ON public.confirmations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert confirmations" 
ON public.confirmations 
FOR INSERT 
WITH CHECK (true);

-- Create policies for edits (public can insert/view)
CREATE POLICY "Anyone can view edits" 
ON public.edits 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert edits" 
ON public.edits 
FOR INSERT 
WITH CHECK (true);

-- Create policies for admin actions (only authenticated admins)
CREATE POLICY "Admins can view admin actions" 
ON public.admin_actions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert admin actions" 
ON public.admin_actions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_confirmations_updated_at
  BEFORE UPDATE ON public.confirmations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_confirmations_phone ON public.confirmations(phone);
CREATE INDEX idx_edits_phone ON public.edits(phone);
CREATE INDEX idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);