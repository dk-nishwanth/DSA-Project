import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollegeStudentData {
  name: string;
  collegeName: string;
  standard: string;
  collegeId: string;
  phoneNo: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CollegeSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CollegeStudentData>({
    name: '',
    collegeName: '',
    standard: '',
    collegeId: '',
    phoneNo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<CollegeStudentData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CollegeStudentData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.standard) newErrors.standard = 'Standard/Year is required';
    if (!formData.collegeId.trim()) newErrors.collegeId = 'College ID is required';
    if (!formData.phoneNo.trim()) newErrors.phoneNo = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNo.replace(/\D/g, ''))) {
      newErrors.phoneNo = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual registration logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Registration Successful!",
        description: "Please complete your subscription to access the platform.",
      });
      
      // Navigate to payment page with user data
      navigate('/college-payment', { 
        state: { 
          userData: {
            name: formData.name,
            email: formData.email,
            collegeName: formData.collegeName,
            standard: formData.standard,
            collegeId: formData.collegeId,
            phoneNo: formData.phoneNo
          }
        } 
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CollegeStudentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const standardOptions = [
    { value: '1st-year', label: '1st Year' },
    { value: '2nd-year', label: '2nd Year' },
    { value: '3rd-year', label: '3rd Year' },
    { value: '4th-year', label: '4th Year' },
    { value: 'masters-1st', label: 'Masters 1st Year' },
    { value: 'masters-2nd', label: 'Masters 2nd Year' },
    { value: 'phd', label: 'PhD' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">College Student Registration</CardTitle>
            <CardDescription>
              Join our learning platform and connect with students from colleges across the country
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* College Name */}
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name *</Label>
                  <Input
                    id="collegeName"
                    type="text"
                    placeholder="Enter your college name"
                    value={formData.collegeName}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                    className={errors.collegeName ? 'border-red-500' : ''}
                  />
                  {errors.collegeName && <p className="text-sm text-red-500">{errors.collegeName}</p>}
                </div>

                {/* Standard/Year */}
                <div className="space-y-2">
                  <Label htmlFor="standard">Year/Standard *</Label>
                  <Select value={formData.standard} onValueChange={(value) => handleInputChange('standard', value)}>
                    <SelectTrigger className={errors.standard ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.standard && <p className="text-sm text-red-500">{errors.standard}</p>}
                </div>

                {/* College ID */}
                <div className="space-y-2">
                  <Label htmlFor="collegeId">College ID/Roll Number *</Label>
                  <Input
                    id="collegeId"
                    type="text"
                    placeholder="Enter your college ID"
                    value={formData.collegeId}
                    onChange={(e) => handleInputChange('collegeId', e.target.value)}
                    className={errors.collegeId ? 'border-red-500' : ''}
                  />
                  {errors.collegeId && <p className="text-sm text-red-500">{errors.collegeId}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNo">Phone Number *</Label>
                  <Input
                    id="phoneNo"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNo}
                    onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                    className={errors.phoneNo ? 'border-red-500' : ''}
                  />
                  {errors.phoneNo && <p className="text-sm text-red-500">{errors.phoneNo}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create College Student Account
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto" 
                    onClick={() => navigate('/college-login')}
                  >
                    Login here
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
