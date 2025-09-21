import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeader } from '@/components/admin/admin-header';

interface AssignmentFormData {
  title: string;
  description: string;
  questionType: 'quiz' | 'program' | 'problem' | 'essay' | 'multiple-choice';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  dueDate: string;
  questionContent: string;
}

export function WorkingAssignmentCreator() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    description: '',
    questionType: 'problem',
    difficulty: 'medium',
    points: 10,
    dueDate: '',
    questionContent: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof AssignmentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestCreate = () => {
    // Create a test assignment with sample data
    setFormData({
      title: 'Test Assignment - Array Sorting',
      description: 'Implement a sorting algorithm to sort an array of integers',
      questionType: 'program',
      difficulty: 'medium',
      points: 25,
      dueDate: '',
      questionContent: 'Write a function that takes an array of integers and returns a sorted array. You can use any sorting algorithm of your choice. Explain the time complexity of your solution.'
    });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.questionContent.trim()) {
      alert('Please fill in all required fields (Title, Description, Question Content)');
      return;
    }

    setIsLoading(true);

    try {
      // Create assignment object
      const assignment = {
        id: `assign-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        topicId: undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        points: formData.points,
        createdAt: new Date(),
        createdBy: 'admin-1',
        isActive: true,
        submissions: [],
        question: {
          type: formData.questionType,
          content: formData.questionContent
        },
        instructions: '',
        tags: []
      };

      // Get existing assignments from localStorage
      const existingAssignments = JSON.parse(localStorage.getItem('dsa_assignments') || '[]');
      
      // Add new assignment
      existingAssignments.push(assignment);
      
      // Save back to localStorage
      localStorage.setItem('dsa_assignments', JSON.stringify(existingAssignments));
      
      console.log('Assignment saved successfully:', assignment);
      
      // Show success message
      alert(`Assignment "${assignment.title}" created successfully!`);
      
      // Ask if user wants to create another or go back
      const createAnother = confirm('Would you like to create another assignment?');
      if (createAnother) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          questionType: 'problem',
          difficulty: 'medium',
          points: 10,
          dueDate: '',
          questionContent: ''
        });
      } else {
        // Navigate back to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert('Failed to save assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Assignment</h1>
            <p className="text-gray-600">Create new assignments for students to complete</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter assignment title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                placeholder="Brief description of the assignment..."
                required
              />
            </div>

            {/* Question Type and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={formData.questionType}
                  onChange={(e) => handleInputChange('questionType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="problem">Problem Solving</option>
                  <option value="quiz">Quiz</option>
                  <option value="program">Programming</option>
                  <option value="essay">Essay</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Question Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Content *
              </label>
              <textarea
                value={formData.questionContent}
                onChange={(e) => handleInputChange('questionContent', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40"
                placeholder="Enter the question or problem statement..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={isLoading || !formData.title.trim() || !formData.description.trim() || !formData.questionContent.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Saving...' : 'Save Assignment'}
              </button>
              
              <button
                onClick={handleTestCreate}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
              >
                Fill Test Data
              </button>
              
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
