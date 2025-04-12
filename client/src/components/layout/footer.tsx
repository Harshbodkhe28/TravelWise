import { Link } from "wouter";
import { Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="text-primary text-2xl" />
              <span className="text-xl font-semibold">TravelWise</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting travelers with verified travel agencies for personalized travel experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Travelers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-white transition-colors">
                  Travel Guides
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Insurance</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Customer Support</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Agencies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth?tab=register" className="text-gray-400 hover:text-white transition-colors">
                  Join Our Platform
                </Link>
              </li>
              <li>
                <Link href="/agency-dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Agency Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Agency Support</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} TravelWise. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <select 
                className="bg-gray-800 text-gray-400 rounded px-3 py-1 text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                defaultValue="en"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
