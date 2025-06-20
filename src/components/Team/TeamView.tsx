import React from 'react';
import { User, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

// Mock team members data
const mockTeamMembers = [
  { id: '2', name: 'Alex Chen', email: 'alex@company.com', role: 'Frontend Developer', joinDate: '2023-06-15' },
  { id: '3', name: 'Jordan Smith', email: 'jordan@company.com', role: 'Backend Developer', joinDate: '2023-04-20' },
  { id: '4', name: 'Maya Patel', email: 'maya@company.com', role: 'Full Stack Developer', joinDate: '2023-08-10' },
  { id: '6', name: 'Emma Davis', email: 'emma@company.com', role: 'QA Engineer', joinDate: '2023-03-05' },
  { id: '7', name: 'Ryan Taylor', email: 'ryan@company.com', role: 'DevOps Engineer', joinDate: '2023-07-12' },
];

export const TeamView: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksForManager } = useFeedback();

  const managerFeedbacks = getFeedbacksForManager(user!.id);
  
  // Filter team members based on current user's team
  const teamMembers = mockTeamMembers.filter(member => 
    user?.teamMembers?.includes(member.id)
  );

  const getFeedbackStatsForEmployee = (employeeId: string) => {
    const employeeFeedbacks = managerFeedbacks.filter(f => f.employeeId === employeeId);
    return {
      total: employeeFeedbacks.length,
      acknowledged: employeeFeedbacks.filter(f => f.acknowledged).length,
      lastFeedback: employeeFeedbacks[0]?.createdAt,
      sentiment: employeeFeedbacks[0]?.sentiment
    };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Team Overview</h1>
        <p className="text-gray-600 mt-1">Manage your team members and track their feedback history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => {
          const stats = getFeedbackStatsForEmployee(member.id);
          
          return (
            <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-xl mr-4">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Feedback</span>
                  <span className="font-medium text-gray-900">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Acknowledged</span>
                  <span className="font-medium text-gray-900">{stats.acknowledged}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="text-xs text-gray-500">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {stats.lastFeedback && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Latest Feedback</span>
                    <Badge variant={stats.sentiment!}>{stats.sentiment}</Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(stats.lastFeedback).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors duration-200 text-sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Give Feedback
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                  View History
                </button>
              </div>

              {stats.total === 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">No feedback given yet</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {teamMembers.length === 0 && (
        <Card className="p-12 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
          <p className="text-gray-500">
            You don't have any team members assigned to you yet.
          </p>
        </Card>
      )}
    </div>
  );
};