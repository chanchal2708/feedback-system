export type UserRole = 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
  teamMembers?: string[];
}

export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';

export interface Feedback {
  id: string;
  managerId: string;
  employeeId: string;
  strengths: string;
  improvements: string;
  sentiment: FeedbackSentiment;
  createdAt: string;
  updatedAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  managerName: string;
  employeeName: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}