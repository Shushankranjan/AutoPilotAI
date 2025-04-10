import { Link, useLocation } from "wouter";
import { Home, Calendar, Lightbulb, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "My Plans", path: "/plans" },
    { icon: Lightbulb, label: "AI Goals", path: "/goals" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  return (
    <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-gray-200 pt-20 z-40">
      <div className="flex flex-col items-center space-y-6">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "p-2 rounded-lg hover:bg-gray-100 transition-colors",
                  isActive ? "bg-blue-50 text-blue-500" : "text-gray-500"
                )}
                title={item.label}
              >
                <item.icon className="h-6 w-6" />
              </a>
            </Link>
          );
        })}
        
        <div className="border-t border-gray-200 w-8 my-2"></div>
        
        <Link href="/upgrade">
          <a
            className="p-2 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors"
            title="Upgrade"
          >
            <Star className="h-6 w-6" />
          </a>
        </Link>
      </div>
    </aside>
  );
}
