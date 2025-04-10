import { CloudLightning } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gradient-to-r from-primary to-purple-500 p-1 rounded-md text-white">
        <CloudLightning className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-bold text-gray-800">AutoPilot AI</h1>
    </div>
  );
}
