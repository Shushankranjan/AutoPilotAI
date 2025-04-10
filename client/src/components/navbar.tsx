import { useState } from "react";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { PricingModal } from "./pricing-modal";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api";

export function Navbar() {
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  const { data: userData } = useQuery({
    queryKey: ['/api/me'],
    retry: false
  });
  
  const userName = userData?.user?.name || "User";
  
  return (
    <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo Section */}
        <Logo />
        
        {/* Center Quote - Hidden on Mobile */}
        <div className="hidden md:block text-center text-gray-600 font-medium">
          <span>Let's conquer the day, {userName} 🚀</span>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center space-x-4">
          <Button size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-200 transition-colors">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={() => setShowPricingModal(true)}
            variant="outline" 
            className="relative rounded-full text-sm font-semibold text-gray-800 hover:shadow-md transition-all group"
          >
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-[10px] text-white px-1.5 rounded-full shadow-sm">
              Pro
            </span>
            Upgrade
          </Button>
          
          <div className="relative">
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm hover:shadow-md transition-all cursor-pointer">
              <AvatarImage 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="User profile" 
              />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
      
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
    </header>
  );
}
