export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  summary: string;
  skills: string[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
} 