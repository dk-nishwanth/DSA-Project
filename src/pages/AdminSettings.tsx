import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AdminHeader } from '@/components/admin/admin-header';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

interface AdminSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    studentActivity: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number; // in minutes
    passwordChangeInterval: number; // in days
  };
  display: {
    density: 'compact' | 'comfortable' | 'spacious';
    fontSize: number; // percentage
  };
}

export default function AdminSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AdminSettings>({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      studentActivity: true,
      systemUpdates: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordChangeInterval: 90
    },
    display: {
      density: 'comfortable',
      fontSize: 100
    }
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend or localStorage
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">Manage your admin preferences and system settings</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appearance">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={settings.theme} 
                      onValueChange={(value: 'light' | 'dark' | 'system') => 
                        setSettings({...settings, theme: value})
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={settings.language} 
                      onValueChange={(value) => 
                        setSettings({...settings, language: value})
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="density">Interface Density</Label>
                    <Select 
                      value={settings.display.density} 
                      onValueChange={(value: 'compact' | 'comfortable' | 'spacious') => 
                        setSettings({
                          ...settings, 
                          display: {...settings.display, density: value}
                        })
                      }
                    >
                      <SelectTrigger id="density">
                        <SelectValue placeholder="Select density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="font-size">Font Size ({settings.display.fontSize}%)</Label>
                    </div>
                    <Slider
                      id="font-size"
                      min={75}
                      max={150}
                      step={5}
                      value={[settings.display.fontSize]}
                      onValueChange={(value) => 
                        setSettings({
                          ...settings, 
                          display: {...settings.display, fontSize: value[0]}
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications about important updates</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          notifications: {...settings.notifications, email: checked}
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          notifications: {...settings.notifications, push: checked}
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="student-activity">Student Activity</Label>
                      <p className="text-sm text-muted-foreground">Get notified about important student activities</p>
                    </div>
                    <Switch
                      id="student-activity"
                      checked={settings.notifications.studentActivity}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          notifications: {...settings.notifications, studentActivity: checked}
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={settings.notifications.systemUpdates}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          notifications: {...settings.notifications, systemUpdates: checked}
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings, 
                          security: {...settings.security, twoFactorAuth: checked}
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="session-timeout">Session Timeout ({settings.security.sessionTimeout} minutes)</Label>
                    </div>
                    <Slider
                      id="session-timeout"
                      min={5}
                      max={120}
                      step={5}
                      value={[settings.security.sessionTimeout]}
                      onValueChange={(value) => 
                        setSettings({
                          ...settings, 
                          security: {...settings.security, sessionTimeout: value[0]}
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password-change">Password Change Interval ({settings.security.passwordChangeInterval} days)</Label>
                    </div>
                    <Slider
                      id="password-change"
                      min={30}
                      max={180}
                      step={30}
                      value={[settings.security.passwordChangeInterval]}
                      onValueChange={(value) => 
                        setSettings({
                          ...settings, 
                          security: {...settings.security, passwordChangeInterval: value[0]}
                        })
                      }
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">Change Password</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Data Management</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline">Export All Data</Button>
                      <Button variant="outline">Import Data</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">System</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline">Clear Cache</Button>
                      <Button variant="outline">System Diagnostics</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="destructive" className="w-full">Reset All Settings</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}