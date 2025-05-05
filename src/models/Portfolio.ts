import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  userId: string;
  title: string;
  description: string;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    imageUrl?: string;
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
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    imageUrl: { type: String },
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