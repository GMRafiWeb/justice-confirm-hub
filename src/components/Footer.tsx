import { Heart, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Event Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Justice Half Marathon 2025</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Sylhet, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>26th September 2025</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Organized by Army IBA Hiking & Trekking Club
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">যোগাযোগ / Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+8801568082587</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@justicehalfmarathon.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>aibahtc454@gmail.com</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-medium">President: Hasib Hasan Moon</p>
            </div>
          </div>

          {/* Links & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Links</h3>
            <div className="space-y-2 text-sm">
              <a 
                href="https://www.justicehalfmarathon.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Main Website
              </a>
              <a 
                href="/admin" 
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Admin Panel
              </a>
            </div>
            
            {/* Social Media Placeholders */}
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Follow us on social media</p>
              <div className="flex space-x-2 mt-2">
                {/* Add social media links when available */}
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs">FB</span>
                </div>
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs">IG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Justice Half Marathon. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center space-x-1">
              <span>Designed and developed with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by <strong>MD Golam Mubasshir Rafi</strong></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;