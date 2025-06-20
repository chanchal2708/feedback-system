import React, { useState } from 'react';
import { Edit2, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

export const FeedbackHistory: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksForManager } = useFeedback();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  const managerFeedbacks = getFeedbacksForManager(user!.id);
  
  const filteredFeedbacks = selectedFilter === 'all' 
    ? managerFeedbacks 
    : managerFeedbacks.filter(feedback => feedback.sentiment === selectedFilter);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Feedback History</h1>
        <p className="text-gray-600 mt-1">View and manage all feedback you've given to your team members.</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['all', 'positive', 'neutral', 'negative'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedFilter === filter
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter === 'all' && ` (${managerFeedbacks.length})`}
              {filter !== 'all' && ` (${managerFeedbacks.filter(f => f.sentiment === filter).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length > 0 ? (
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feedback.employeeName}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {feedback.updatedAt !== feedback.createdAt && (
                        <span className="ml-2 text-xs">(Updated: {new Date(feedback.updatedAt).toLocaleDateString()})</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={feedback.sentiment}>{feedback.sentiment}</Badge>
                  <Badge variant={feedback.acknowledged ? 'acknowledged' : 'pending'}>
                    {feedback.acknowledged ? 'Acknowledged' : 'Pending'}
                  </Badge>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-success-700 mb-2">Strengths & Positive Contributions</h4>
                  <div className="bg-success-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{feedback.strengths}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-warning-700 mb-2">Areas for Improvement & Development</h4>
                  <div className="bg-warning-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{feedback.improvements}</p>
                  </div>
                </div>
              </div>

              {feedback.acknowledged && feedback.acknowledgedAt && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Acknowledged by {feedback.employeeName} on{' '}
                    {new Date(feedback.acknowledgedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
          <p className="text-gray-500 mb-6">
            {selectedFilter === 'all' 
              ? "You haven't given any feedback yet. Start by providing feedback to your team members."
              : `No ${selectedFilter} feedback found. Try adjusting your filter.`
            }
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
            Give New Feedback
          </button>
        </Card>
      )}
    </div>
  );
};