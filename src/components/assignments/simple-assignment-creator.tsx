import React from 'react';
import { AdminHeader } from '@/components/admin/admin-header';

export function SimpleAssignmentCreator() {
  console.log('SimpleAssignmentCreator rendering...');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">Create Assignment - Test</h1>
          <p className="text-gray-600 mb-6">This is a simplified test version to debug the blank page issue.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Assignment Title</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter assignment title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded h-24"
                placeholder="Enter assignment description..."
              />
            </div>
            
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Test Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
