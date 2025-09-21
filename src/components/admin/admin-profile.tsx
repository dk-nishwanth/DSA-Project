import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Edit, X } from 'lucide-react';

export function AdminProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock admin data - in a real app, this would come from an API or context
  const [adminData, setAdminData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'Administrator',
    department: 'Computer Science',
    joinDate: 'January 2023',
    bio: 'Experienced administrator with a background in computer science education.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  });

  const handleSave = () => {
    // In a real app, this would send data to an API
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Profile</h1>
            <p className="text-muted-foreground">Manage your admin account information</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={adminData.avatar} alt={`${adminData.firstName} ${adminData.lastName}`} />
                      <AvatarFallback>{adminData.firstName.charAt(0)}{adminData.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="flex items-center gap-2">
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={adminData.firstName} 
                            onChange={(e) => setAdminData({...adminData, firstName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={adminData.lastName} 
                            onChange={(e) => setAdminData({...adminData, lastName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            value={adminData.email} 
                            onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input 
                            id="department" 
                            value={adminData.department} 
                            onChange={(e) => setAdminData({...adminData, department: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Input 
                            id="bio" 
                            value={adminData.bio} 
                            onChange={(e) => setAdminData({...adminData, bio: e.target.value})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{adminData.firstName} {adminData.lastName}</h3>
                          <p className="text-muted-foreground">{adminData.role}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{adminData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Department</p>
                            <p className="text-sm text-muted-foreground">{adminData.department}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Join Date</p>
                            <p className="text-sm text-muted-foreground">{adminData.joinDate}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <p className="text-sm font-medium">Bio</p>
                          <p className="text-sm text-muted-foreground">{adminData.bio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="account" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Account Security</h3>
                    <p className="text-sm text-muted-foreground">Manage your account security settings</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Account Management</h3>
                      <p className="text-sm text-muted-foreground">Manage your account settings</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}