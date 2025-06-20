import React from 'react';
import { MessageSquare, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksForEmployee, acknowledgeFeedback } = useFeedback();

  const employeeFeedbacks = getFeedbacksForEmployee(user!.id);
  const totalFeedbacks = employeeFeedbacks.length;
  const acknowledgedCount = employeeFeedbacks.filter(f => f.acknowledged).length;
  const pendingCount = totalFeedbacks - acknowledgedCount;
  const recentFeedbacks = employeeFeedbacks.slice(0, 3);

  const sentimentCounts = employeeFeedbacks.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAcknowledge = (feedbackId: string) => {
    acknowledgeFeedback(feedbackId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}. Here's your feedback overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary-600" />
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
              <CheckCircle className="w-6 h-6 text-success-600" />
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
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Positive Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{sentimentCounts.positive || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Feedback Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
            {recentFeedbacks.length > 0 ? (
              <div className="space-y-6">
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border-l-4 border-primary-200 pl-6 relative animate-slide-up">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-600 rounded-full"></div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">From: {feedback.managerName}</p>
                        <p className="text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={feedback.sentiment}>{feedback.sentiment}</Badge>
                        {!feedback.acknowledged && (
                          <button
                            onClick={() => handleAcknowledge(feedback.id)}
                            className="px-3 py-1 text-xs bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-success-700 mb-1">Strengths:</p>
                        <p className="text-sm text-gray-700 bg-success-50 p-3 rounded-lg">{feedback.strengths}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-warning-700 mb-1">Areas for Improvement:</p>
                        <p className="text-sm text-gray-700 bg-warning-50 p-3 rounded-lg">{feedback.improvements}</p>
                      </div>
                    </div>
                    {feedback.acknowledged && (
                      <p className="text-xs text-gray-500 mt-3 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-success-500" />
                        Acknowledged on {new Date(feedback.acknowledgedAt!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't received any feedback from your manager yet.</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {/* Feedback Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Positive</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{sentimentCounts.positive || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Neutral</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{sentimentCounts.neutral || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Needs Attention</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{sentimentCounts.negative || 0}</span>
              </div>
            </div>
          </Card>

          {/* Action Items */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
            <div className="space-y-3">
              {pendingCount > 0 && (
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <p className="text-sm font-medium text-warning-800">Pending Reviews</p>
                  <p className="text-xs text-warning-600">You have {pendingCount} feedback{pendingCount > 1 ? 's' : ''} to acknowledge</p>
                </div>
              )}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Growth Opportunities</p>
                <p className="text-xs text-blue-600">Review improvement suggestions from recent feedback</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};