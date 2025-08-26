import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface AuthorizationSystemProps {
  onAuthorized?: () => void;
  onCancel?: () => void;
}

export function AuthorizationSystem({ onAuthorized, onCancel }: AuthorizationSystemProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const { toast } = useToast();

  const handleRequestAuthorization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to send authorization email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate sending an email
      const mockCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      toast({
        title: "Authorization email sent",
        description: `A verification code has been sent to ${email}. Please check your inbox.`,
      });

      // In a real implementation, you would:
      // 1. Send an email to the provided address
      // 2. Store the authorization code securely
      // 3. Set an expiration time for the code
      
      setShowCodeInput(true);
      setIsLoading(false);
      
      // For demo purposes, show the code in console
      console.log('Authorization code:', mockCode);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send authorization email. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to verify the code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-character code
      if (authorizationCode.length === 6) {
        setIsAuthorized(true);
        toast({
          title: "Authorization successful",
          description: "You are now authorized to create an admin account.",
        });
        
        if (onAuthorized) {
          onAuthorized();
        }
      } else {
        toast({
          title: "Invalid code",
          description: "Please enter a valid 6-character authorization code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify authorization code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Code resent",
        description: "A new authorization code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthorized) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Authorization Successful</CardTitle>
          <CardDescription>
            You are now authorized to create an admin account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onAuthorized} className="w-full">
            Continue to Admin Registration
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Admin Authorization Required</CardTitle>
        <CardDescription>
          To create an admin account, you need authorization from the system administrator.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showCodeInput ? (
          <form onSubmit={handleRequestAuthorization} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Administrator Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Alert>
              <AlertDescription>
                Enter the email address of the system administrator who can authorize your admin account creation.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Request Authorization
                  </>
                )}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Authorization Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={authorizationCode}
                onChange={(e) => setAuthorizationCode(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
            </div>
            <Alert>
              <AlertDescription>
                Check your email for the authorization code. Enter the 6-digit code to verify your authorization.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Code
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleResendCode} disabled={isLoading}>
                Resend
              </Button>
            </div>
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCodeInput(false);
                  setAuthorizationCode('');
                }}
              >
                Use different email
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
