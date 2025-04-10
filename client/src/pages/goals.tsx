import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LockIcon, Sparkles } from "lucide-react";

export default function Goals() {
  const goals = [
    {
      id: 1,
      title: "Crack GATE 2025",
      progress: 35,
      tasks: ["Complete DBMS syllabus", "Solve previous year papers", "Complete mock tests"],
      pro: false,
    },
    {
      id: 2,
      title: "Finish Portfolio",
      progress: 70, 
      tasks: ["Add recent projects", "Update skills section", "Improve responsive design"],
      pro: false,
    },
    {
      id: 3,
      title: "Learn Machine Learning",
      progress: 20,
      tasks: ["Finish Python basics", "Complete ML course", "Build 3 projects"],
      pro: true,
    },
  ];

  return (
    <>
      <Navbar />
      <Sidebar />
      
      <main className="container mx-auto pt-20 px-4 pb-20 md:pb-8">
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Goals</h1>
          <p className="text-gray-600 mb-6">Track and achieve your long-term goals with AI assistance</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className={`overflow-hidden hover:shadow-md transition-shadow ${goal.pro ? 'border-purple-200' : ''}`}>
                <CardHeader className={`${goal.pro ? 'bg-gradient-to-r from-purple-50 to-blue-50' : 'bg-gradient-to-r from-blue-50 to-gray-50'}`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    {goal.pro && (
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" /> PRO
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Next steps:</h3>
                  <ul className="space-y-2 mb-4">
                    {goal.tasks.map((task, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                          <div className={`h-3 w-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                        </div>
                        <span className={index === 0 ? 'text-gray-800' : 'text-gray-500'}>
                          {task}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {goal.pro ? (
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      Get AI Recommendations
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <LockIcon className="h-4 w-4 mr-2" /> AI Coaching (Pro)
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Goal Card */}
            <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-500 text-2xl">+</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">Add New Goal</h3>
              <p className="text-gray-500 text-sm text-center">
                Create a new goal and let AI help you achieve it
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </>
  );
}
