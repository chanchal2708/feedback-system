import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { FeedbackSentiment } from '../../types';
import { Card } from '../UI/Card';
import { LoadingSpinner } from '../UI/LoadingSpinner';

// Mock team members data (in a real app, this would come from an API)
const mockTeamMembers = [
  { id: '2', name: 'Alex Chen', email: 'alex@company.com' },
  { id: '3', name: 'Jordan Smith', email: 'jordan@company.com' },
  { id: '4', name: 'Maya Patel', email: 'maya@company.com' },
  { id: '6', name: 'Emma Davis', email: 'emma@company.com' },
  { id: '7', name: 'Ryan Taylor', email: 'ryan@company.com' },
];

export const FeedbackForm: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [sentiment, setSentiment] = useState<FeedbackSentiment>('positive');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { addFeedback } = useFeedback();
  const navigate = useNavigate();

  // Filter team members based on current user's team
  const teamMembers = mockTeamMembers.filter(member => 
    user?.teamMembers?.includes(member.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !strengths || !improvements) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedMember = teamMembers.find(member => member.id === selectedEmployee);
    
    addFeedback({
      managerId: user!.id,
      employeeId: selectedEmployee,
      strengths,
      improvements,
      sentiment,
      managerName: user!.name,
      employeeName: selectedMember!.name
    });

    // Reset form
    setSelectedEmployee('');
    setStrengths('');
    setImprovements('');
    setSentiment('positive');
    setIsSubmitting(false);

    // Navigate to feedback history
    navigate('/feedback/history');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Give Feedback</h1>
        <p className="text-gray-600 mt-1">Provide structured feedback to help your team members grow.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
              Select Team Member
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                id="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Choose a team member...</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Strengths */}
          <div>
            <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-2">
              Strengths & Positive Contributions
            </label>
            <textarea
              id="strengths"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              rows={4}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Highlight what this team member does well, their key strengths, and positive contributions..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Focus on specific examples and behaviors that demonstrate their strengths.
            </p>
          </div>

          {/* Areas for Improvement */}
          <div>
            <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-2">
              Areas for Improvement & Development
            </label>
            <textarea
              id="improvements"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              rows={4}
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Provide constructive suggestions for areas where they can grow and develop..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and actionable. Focus on growth opportunities rather than criticism.
            </p>
          </div>

          {/* Overall Sentiment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Sentiment
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSentiment('positive')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  sentiment === 'positive'
                    ? 'border-success-500 bg-success-50 text-success-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">😊</div>
                  <p className="font-medium">Positive</p>
                  <p className="text-xs text-gray-600">Strong performance</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSentiment('neutral')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  sentiment === 'neutral'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">😐</div>
                  <p className="font-medium">Neutral</p>
                  <p className="text-xs text-gray-600">Meeting expectations</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSentiment('negative')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  sentiment === 'negative'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">😟</div>
                  <p className="font-medium">Needs Attention</p>
                  <p className="text-xs text-gray-600">Requires improvement</p>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedEmployee || !strengths || !improvements}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Submit Feedback
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};