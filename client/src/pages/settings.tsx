import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

export default function Settings() {
  const { data } = useQuery({
    queryKey: ['/api/me'],
    retry: false
  });
  
  const user = data?.user || { name: "User", email: "user@example.com" };
  
  return (
    <>
      <Navbar />
      <Sidebar />
      
      <main className="container mx-auto pt-20 px-4 pb-20 md:pb-8">
        <div className="mt-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
          
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and account settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                        alt="User avatar" 
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="mb-1">
                        Change Avatar
                      </Button>
                      <p className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user.username} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience with AutoPilot AI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Dark Mode</Label>
                        <p className="text-sm text-gray-500">Use dark theme across the application</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Separator />
                    
                    <h3 className="text-lg font-medium">Planning Preferences</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Default Work Hours</Label>
                        <p className="text-sm text-gray-500">Set your typical working hours</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input 
                          className="w-20" 
                          type="time" 
                          defaultValue="09:00" 
                        />
                        <span>to</span>
                        <Input 
                          className="w-20" 
                          type="time" 
                          defaultValue="17:00" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Auto-generate Daily Plan</Label>
                        <p className="text-sm text-gray-500">Create a plan automatically at the start of each day</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive plan summaries and updates via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Task Reminders</Label>
                        <p className="text-sm text-gray-500">Get notifications before scheduled tasks</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Motivational Messages</Label>
                        <p className="text-sm text-gray-500">Receive motivational tips throughout the day</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Product Updates</Label>
                        <p className="text-sm text-gray-500">Be notified about new features and improvements</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Notification Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription and payment methods.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800">Current Plan: Free</h3>
                          <p className="text-sm text-gray-500">Limited features and capabilities</p>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          Upgrade to Pro
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 text-center">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Pro Plan Benefits</h3>
                      <ul className="space-y-2 text-sm text-left max-w-md mx-auto mb-4">
                        <li className="flex items-start">
                          <div className="rounded-full bg-green-500 p-0.5 mr-2 mt-1">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          Unlimited daily plans and storage
                        </li>
                        <li className="flex items-start">
                          <div className="rounded-full bg-green-500 p-0.5 mr-2 mt-1">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          Advanced AI plan personalization
                        </li>
                        <li className="flex items-start">
                          <div className="rounded-full bg-green-500 p-0.5 mr-2 mt-1">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          AI goal coaching and long-term planning
                        </li>
                      </ul>
                      <p className="text-gray-500 text-sm">Upgrade today and unlock your full productivity potential!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNav />
    </>
  );
}
