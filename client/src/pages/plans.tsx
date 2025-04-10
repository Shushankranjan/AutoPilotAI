import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ClockIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Plans() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/plans'],
    staleTime: 10000
  });
  
  const plans = data?.plans || [];
  
  return (
    <>
      <Navbar />
      <Sidebar />
      
      <main className="container mx-auto pt-20 px-4 pb-20 md:pb-8">
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">My Saved Plans</h1>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your plans...</p>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center p-6">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to load plans</h3>
                  <p className="text-gray-600 mb-4">There was an error loading your plans. Please try again later.</p>
                  <Button>Retry</Button>
                </div>
              </CardContent>
            </Card>
          ) : plans.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center p-6">
                  <CalendarDays className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No plans saved yet</h3>
                  <p className="text-gray-600 mb-4">Generate and save your first plan on the home page.</p>
                  <Button>Create Your First Plan</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan: any) => (
                <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{new Date(plan.createdAt).toLocaleDateString()}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {plan.timeAvailable} hours plan
                        </CardDescription>
                      </div>
                      <div className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {plan.mood}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <h3 className="font-medium text-gray-700 mb-2">Priority Tasks:</h3>
                    <div className="flex flex-wrap gap-2">
                      {plan.priorityTasks.map((task: string, index: number) => (
                        <div 
                          key={index} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {task}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 py-3 flex justify-between">
                    <Button variant="ghost" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Use Again</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <MobileNav />
    </>
  );
}
