// Local type definitions for the frontend
export type UserType = 'SELLER' | 'BUYER';
export type DealType = 'SALE' | 'INVESTMENT';
export type RequestStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface User {
  id: number;
  userType: UserType;
  username: string;
  organizationName: string;
  fullName: string;
  phone?: string;
  lastAccess?: Date;
  comments?: string;
}

export interface Project {
  id: number;
  name: string;
  dealType: DealType;
  industry: string;
  createdAt: Date;
  isVisible: boolean;
  isCompleted: boolean;
}

export interface Request {
  id: number;
  userType: UserType;
  topic: string;
  createdAt: Date;
  status: RequestStatus;
  fullName: string;
  phone?: string;
  comments?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

// Types for filtering
export interface ProjectFilter {
  search?: string;
  industry?: string;
  dealType?: DealType;
  isCompleted?: boolean;
}

export interface RequestFilter {
  search?: string;
  userType?: UserType;
  status?: RequestStatus;
}

export interface UserFilter {
  search?: string;
  userType?: UserType;
  organization?: string;
}
