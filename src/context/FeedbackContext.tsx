import React, { createContext, useContext, useState, useEffect } from 'react';
import { Feedback, FeedbackSentiment } from '../types';

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'acknowledged'>) => void;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  acknowledgeFeedback: (id: string) => void;
  getFeedbacksForEmployee: (employeeId: string) => Feedback[];
  getFeedbacksForManager: (managerId: string) => Feedback[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Mock feedback data
const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    managerId: '1',
    employeeId: '2',
    strengths: 'Excellent problem-solving skills and great attention to detail. Alex consistently delivers high-quality code and is always willing to help teammates.',
    improvements: 'Could benefit from more proactive communication during project planning phases. Consider participating more in team meetings.',
    sentiment: 'positive',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    acknowledged: true,
    acknowledgedAt: '2024-01-16T09:00:00Z',
    managerName: 'Sarah Johnson',
    employeeName: 'Alex Chen'
  },
  {
    id: '2',
    managerId: '1',
    employeeId: '3',
    strengths: 'Outstanding communication skills and natural leadership qualities. Jordan excels at mentoring junior team members.',
    improvements: 'Focus on time management for project deadlines. Sometimes takes on too many tasks simultaneously.',
    sentiment: 'positive',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    acknowledged: false,
    managerName: 'Sarah Johnson',
    employeeName: 'Jordan Smith'
  },
  {
    id: '3',
    managerId: '1',
    employeeId: '4',
    strengths: 'Creative thinking and innovative approach to problem-solving. Maya brings fresh perspectives to team discussions.',
    improvements: 'Work on code documentation and commenting practices. Also, consider improving testing coverage.',
    sentiment: 'neutral',
    createdAt: '2024-01-25T11:15:00Z',
    updatedAt: '2024-01-25T11:15:00Z',
    acknowledged: true,
    acknowledgedAt: '2024-01-26T08:30:00Z',
    managerName: 'Sarah Johnson',
    employeeName: 'Maya Patel'
  },
  {
    id: '4',
    managerId: '5',
    employeeId: '6',
    strengths: 'Exceptional analytical skills and thorough approach to testing. Emma catches bugs that others miss.',
    improvements: 'Could improve presentation skills for client meetings. Also consider learning new frontend frameworks.',
    sentiment: 'positive',
    createdAt: '2024-01-22T09:45:00Z',
    updatedAt: '2024-01-22T09:45:00Z',
    acknowledged: false,
    managerName: 'David Wilson',
    employeeName: 'Emma Davis'
  }
];

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedbacks);

  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'acknowledged'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      acknowledged: false
    };
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  const updateFeedback = (id: string, updates: Partial<Feedback>) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === id 
        ? { ...feedback, ...updates, updatedAt: new Date().toISOString() }
        : feedback
    ));
  };

  const acknowledgeFeedback = (id: string) => {
    setFeedbacks(prev => prev.map(feedback =>
      feedback.id === id
        ? { 
            ...feedback, 
            acknowledged: true, 
            acknowledgedAt: new Date().toISOString() 
          }
        : feedback
    ));
  };

  const getFeedbacksForEmployee = (employeeId: string) => {
    return feedbacks
      .filter(feedback => feedback.employeeId === employeeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getFeedbacksForManager = (managerId: string) => {
    return feedbacks
      .filter(feedback => feedback.managerId === managerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      addFeedback,
      updateFeedback,
      acknowledgeFeedback,
      getFeedbacksForEmployee,
      getFeedbacksForManager
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};