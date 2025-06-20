import React from 'react';
import { Users, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksForManager } = useFeedback();

  const managerFeedbacks = getFeedbacksForManager(user!.id);
  const totalFeedbacks = managerFeedbacks.length;
  const recentFeedbacks = managerFeedbacks.slice(0, 5);
  
  const sentimentCounts = managerFeedbacks.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const acknowledgedCount = managerFeedbacks.filter(f => f.acknowledged).length;
  const pendingCount = totalFeedbacks - acknowledgedCount;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}. Here's your team feedback overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{user?.teamMembers?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{totalFeedbacks}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acknowledged</p>
              <p className="text-2xl font-bold text-gray-900">{acknowledgedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Sentiment Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-success-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Positive</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">{sentimentCounts.positive || 0}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-500 h-2 rounded-full" 
                    style={{ width: `${totalFeedbacks ? ((sentimentCounts.positive || 0) / totalFeedbacks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Neutral</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">{sentimentCounts.neutral || 0}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${totalFeedbacks ? ((sentimentCounts.neutral || 0) / totalFeedbacks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Negative</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">{sentimentCounts.negative || 0}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${totalFeedbacks ? ((sentimentCounts.negative || 0) / totalFeedbacks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Give New Feedback</p>
                  <p className="text-sm text-gray-600">Provide feedback to team members</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-secondary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">View Team</p>
                  <p className="text-sm text-gray-600">Manage your team members</p>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
        {recentFeedbacks.length > 0 ? (
          <div className="space-y-4">
            {recentFeedbacks.map((feedback) => (
              <div key={feedback.id} className="border-l-4 border-primary-200 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{feedback.employeeName}</p>
                  <div className="flex space-x-2">
                    <Badge variant={feedback.sentiment}>{feedback.sentiment}</Badge>
                    <Badge variant={feedback.acknowledged ? 'acknowledged' : 'pending'}>
                      {feedback.acknowledged ? 'Acknowledged' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Strengths:</strong> {feedback.strengths.slice(0, 100)}...
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No feedback given yet. Start by providing feedback to your team members.</p>
        )}
      </Card>
    </div>
  );
};