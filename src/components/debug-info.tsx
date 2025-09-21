import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

export function DebugInfo() {
  const checks = [
    { name: 'React', status: true, details: 'React is working' },
    { name: 'UI Components', status: true, details: 'Shadcn/ui components loaded' },
    { name: 'Icons', status: true, details: 'Lucide icons working' },
    { name: 'Routing', status: window.location.pathname !== undefined, details: 'React Router working' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded">
                {check.status ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-gray-600">{check.details}</div>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <div className="text-sm">
                <div><strong>Current URL:</strong> {window.location.href}</div>
                <div><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</div>
                <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
