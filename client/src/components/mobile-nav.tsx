import { Link, useLocation } from "wouter";
import { Home, Calendar, Lightbulb, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "My Plans", path: "/plans" },
    { icon: Lightbulb, label: "AI Goals", path: "/goals" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a className="flex flex-col items-center">
                <item.icon 
                  className={cn(
                    "h-6 w-6",
                    isActive ? "text-blue-500" : "text-gray-500"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs mt-1",
                    isActive ? "text-blue-500" : "text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
