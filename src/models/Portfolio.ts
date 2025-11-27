import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  userId: string;
  title: string;
  description: string;
  template: 'minimalistic' | 'modern';
  colors: {
    primary: string;
    secondary: string;
    highlight: string;
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    imageUrls?: string[];
    projectUrl?: string;
    githubUrl?: string;
  }>;
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
  }>;
  experience: Array<{
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  template: { type: String, enum: ['minimalistic', 'modern'], default: 'minimalistic' },
  colors: {
    primary: { type: String, default: '#3B82F6' },
    secondary: { type: String, default: '#1E40AF' },
    highlight: { type: String, default: '#F59E0B' }
  },
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    imageUrls: [{ type: String }],
    projectUrl: { type: String },
    githubUrl: { type: String }
  }],
  skills: [{ type: String }],
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }
  }],
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema); 