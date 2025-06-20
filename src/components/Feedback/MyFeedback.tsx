import React from 'react';
import { CheckCircle, Clock, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeedback } from '../../context/FeedbackContext';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

export const MyFeedback: React.FC = () => {
  const { user } = useAuth();
  const { getFeedbacksForEmployee, acknowledgeFeedback } = useFeedback();

  const employeeFeedbacks = getFeedbacksForEmployee(user!.id);

  const handleAcknowledge = (feedbackId: string) => {
    acknowledgeFeedback(feedbackId);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Feedback</h1>
        <p className="text-gray-600 mt-1">View all feedback you've received from your manager.</p>
      </div>

      {employeeFeedbacks.length > 0 ? (
        <div className="space-y-6">
          {employeeFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="p-6 animate-slide-up">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">From: {feedback.managerName}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={feedback.sentiment}>{feedback.sentiment}</Badge>
                  {feedback.acknowledged ? (
                    <Badge variant="acknowledged">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Acknowledged
                    </Badge>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge variant="pending">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      <button
                        onClick={() => handleAcknowledge(feedback.id)}
                        className="px-3 py-1 text-xs bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-200"
                      >
                        Acknowledge
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-1 h-6 bg-success-500 rounded-full mr-3"></div>
                    <h4 className="font-medium text-success-700">Strengths & Positive Contributions</h4>
                  </div>
                  <div className="bg-success-50 border border-success-200 p-4 rounded-lg ml-4">
                    <p className="text-gray-700 leading-relaxed">{feedback.strengths}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-1 h-6 bg-warning-500 rounded-full mr-3"></div>
                    <h4 className="font-medium text-warning-700">Areas for Improvement & Development</h4>
                  </div>
                  <div className="bg-warning-50 border border-warning-200 p-4 rounded-lg ml-4">
                    <p className="text-gray-700 leading-relaxed">{feedback.improvements}</p>
                  </div>
                </div>
              </div>

              {feedback.acknowledged && feedback.acknowledgedAt && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                    You acknowledged this feedback on{' '}
                    {new Date(feedback.acknowledgedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}

              {!feedback.acknowledged && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Action Required</p>
                        <p className="text-sm text-blue-700 mt-1">
                          Please acknowledge this feedback to confirm you've reviewed it.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback received yet</h3>
          <p className="text-gray-500">
            You haven't received any feedback from your manager yet. 
            Feedback will appear here when your manager provides it.
          </p>
        </Card>
      )}
    </div>
  );
};