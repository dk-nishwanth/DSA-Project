# DSA Learning Platform - Authentication System

## Overview

This document describes the comprehensive authentication system implemented for the DSA Learning Platform, which includes separate login/signup flows for students and admin users, along with an email-based authorization system for admin account creation.

## Features

### 🎓 Student Authentication
- **Login Page**: Clean interface with username/password fields
- **Signup Page**: Registration with class selection (1st Year A/B/C, 2nd Year A/B)
- **Social Login**: Google and Apple integration (placeholder)
- **Remember Me**: Session persistence option
- **Forgot Password**: Password recovery functionality (placeholder)

### 👨‍🏫 Admin Authentication
- **Admin Login**: Dedicated admin login interface
- **Admin Signup**: Registration with authorization requirement
- **Class Assignment**: Admins are assigned to specific classes
- **Authorization System**: Email-based verification for admin account creation

### 🔐 Authorization System
- **Email Verification**: Administrators receive authorization codes via email
- **Code Validation**: 6-digit verification codes with expiration
- **Secure Process**: Multi-step verification for admin account creation

## File Structure

```
src/
├── components/
│   └── auth/
│       ├── login-form.tsx              # Student login form
│       ├── admin-login-form.tsx        # Admin login form
│       ├── signup-form.tsx             # Student signup form
│       ├── admin-signup-form.tsx       # Admin signup form
│       └── authorization-system.tsx    # Email authorization system
├── pages/
│   ├── Login.tsx                       # Login page (student/admin toggle)
│   ├── Signup.tsx                      # Signup page (student/admin toggle)
│   ├── AdminDashboard.tsx              # Admin dashboard
│   ├── Authorization.tsx               # Authorization page
│   └── Landing.tsx                     # Landing page with role selection
└── components/
    └── admin/
        └── admin-header.tsx            # Admin dashboard header
```

## User Flows

### Student Flow
1. **Landing Page** → Choose "Student" role
2. **Login Page** → Enter credentials or switch to signup
3. **Signup Page** → Create account with class selection
4. **Dashboard** → Access learning materials

### Admin Flow
1. **Landing Page** → Choose "Admin/Teacher" role
2. **Admin Login** → Enter admin credentials
3. **Admin Dashboard** → Monitor student progress

### Admin Registration Flow
1. **Admin Signup** → Fill registration form
2. **Authorization Page** → Request email authorization
3. **Email Verification** → Enter 6-digit code
4. **Admin Dashboard** → Access admin panel

## Class Structure

The system supports the following class divisions:

### First Year
- **1A**: First Year Section A
- **1B**: First Year Section B  
- **1C**: First Year Section C

### Second Year
- **2A**: Second Year Section A
- **2B**: Second Year Section B

## Admin Dashboard Features

### Student Monitoring
- **Overview Tab**: Complete student list with search and filtering
- **Class View Tab**: Class-specific progress monitoring
- **Analytics Tab**: Performance distribution and activity status

### Key Metrics
- Total students across all classes
- Active vs inactive students
- Average progress percentage
- Topics covered vs total curriculum

### Student Management
- Search functionality by name/email
- Filter by class
- Progress tracking with visual indicators
- Status monitoring (active/inactive/struggling)
- Last activity tracking

## Authorization System Details

### Email Authorization Process
1. **Request Authorization**: Admin enters administrator email
2. **Email Sent**: System sends 6-digit verification code
3. **Code Verification**: Admin enters received code
4. **Account Creation**: Upon successful verification, proceed to registration

### Security Features
- **Code Expiration**: Authorization codes expire after a set time
- **Resend Functionality**: Ability to request new codes
- **Email Validation**: Proper email format verification
- **Rate Limiting**: Prevention of abuse (placeholder)

## Technical Implementation

### Form Validation
- **Required Fields**: Username, password, email validation
- **Password Matching**: Confirm password validation
- **Email Format**: RFC-compliant email validation
- **Class Selection**: Mandatory class assignment

### State Management
- **Form State**: Local state for form data
- **Loading States**: Loading indicators for async operations
- **Error Handling**: Toast notifications for user feedback
- **Navigation**: React Router for page transitions

### UI Components
- **Shadcn/ui**: Consistent design system
- **Responsive Design**: Mobile-friendly layouts
- **Accessibility**: ARIA labels and keyboard navigation
- **Theme Support**: Light/dark mode compatibility

## API Integration Points

### Authentication Endpoints (Placeholder)
```typescript
// Student endpoints
POST /api/auth/student/login
POST /api/auth/student/signup
POST /api/auth/student/forgot-password

// Admin endpoints  
POST /api/auth/admin/login
POST /api/auth/admin/signup
POST /api/auth/admin/authorize

// Authorization endpoints
POST /api/auth/send-authorization-code
POST /api/auth/verify-authorization-code
```

### Data Models
```typescript
interface Student {
  id: string;
  username: string;
  email: string;
  class: string;
  progress: number;
  lastActive: string;
  topicsCompleted: number;
  totalTopics: number;
  status: 'active' | 'inactive' | 'struggling';
}

interface Admin {
  id: string;
  username: string;
  email: string;
  assignedClass: string;
  role: 'admin' | 'teacher';
  authorizationStatus: 'pending' | 'approved' | 'rejected';
}
```

## Security Considerations

### Password Security
- **Hashing**: Passwords should be hashed using bcrypt
- **Minimum Requirements**: 8+ characters, mixed case, numbers
- **Rate Limiting**: Prevent brute force attacks

### Session Management
- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: Automatic session timeout
- **Refresh Tokens**: Secure token renewal

### Authorization Security
- **Email Verification**: Secure email delivery
- **Code Expiration**: Time-limited authorization codes
- **Audit Trail**: Log all authorization attempts

## Future Enhancements

### Planned Features
- **Two-Factor Authentication**: SMS/email 2FA for admins
- **Role-Based Access**: Different admin permission levels
- **Bulk Operations**: Import/export student data
- **Advanced Analytics**: Detailed performance reports
- **Notification System**: Real-time alerts for admins

### Integration Opportunities
- **LMS Integration**: Connect with existing learning management systems
- **SSO Support**: Single sign-on with institutional systems
- **API Access**: RESTful API for external integrations
- **Mobile App**: Native mobile application support

## Getting Started

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the application at `http://localhost:5173`

### Testing the System
1. **Student Flow**: Navigate to `/signup` to create a student account
2. **Admin Flow**: Navigate to `/admin/signup` to test admin registration
3. **Authorization**: Test the email authorization system
4. **Dashboard**: Access `/admin/dashboard` to view student monitoring

### Demo Credentials
For testing purposes, any valid email/password combination will work in the current implementation. In production, these would be validated against a backend database.

## Support

For questions or issues related to the authentication system, please refer to the main project documentation or contact the development team.
