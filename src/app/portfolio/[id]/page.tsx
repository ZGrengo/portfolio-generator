import { notFound } from 'next/navigation';
import MinimalisticTemplate from '@/components/templates/MinimalisticTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolio';

async function getPortfolio(id: string) {
  try {
    await connectDB();
    const portfolio = await Portfolio.findById(id).lean();
    return portfolio;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export default async function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    notFound();
  }

  // Helper function to recursively convert ObjectIds and Dates to strings
  const serializeForClient = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Check if it's an ObjectId (has toString method and constructor name)
    if (obj && typeof obj === 'object' && typeof obj.toString === 'function' && 
        (obj.constructor?.name === 'ObjectId' || obj.toString().match(/^[0-9a-fA-F]{24}$/))) {
      return obj.toString();
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => serializeForClient(item));
    }

    // Handle plain objects
    if (typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // Skip MongoDB internal fields if desired, but we'll keep _id as string
          result[key] = serializeForClient(obj[key]);
        }
      }
      return result;
    }

    return obj;
  };

  // Convert MongoDB document to plain object
  const serializedPortfolio = serializeForClient(portfolio);

  // Build clean portfolio data object for client components
  const portfolioData = {
    title: serializedPortfolio.title,
    description: serializedPortfolio.description,
    template: serializedPortfolio.template,
    projects: serializedPortfolio.projects?.map((proj: any) => ({
      title: proj.title || '',
      description: proj.description || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
      imageUrls: Array.isArray(proj.imageUrls) 
        ? proj.imageUrls.filter((url: any) => url && typeof url === 'string')
        : (proj.imageUrl ? [proj.imageUrl] : []), // Backward compatibility
      projectUrl: proj.projectUrl || undefined,
      githubUrl: proj.githubUrl || undefined,
    })) || [],
    skills: Array.isArray(serializedPortfolio.skills) ? serializedPortfolio.skills : [],
    education: serializedPortfolio.education?.map((edu: any) => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.startDate ? (typeof edu.startDate === 'string' ? edu.startDate : new Date(edu.startDate).toISOString()) : '',
      endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : new Date(edu.endDate).toISOString()) : undefined,
    })) || [],
    experience: serializedPortfolio.experience?.map((exp: any) => ({
      company: exp.company || '',
      position: exp.position || '',
      description: exp.description || '',
      startDate: exp.startDate ? (typeof exp.startDate === 'string' ? exp.startDate : new Date(exp.startDate).toISOString()) : '',
      endDate: exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : new Date(exp.endDate).toISOString()) : undefined,
    })) || [],
  };

  const TemplateComponent = serializedPortfolio.template === 'modern' ? ModernTemplate : MinimalisticTemplate;

  return (
    <TemplateComponent
      portfolio={portfolioData}
      portfolioId={id}
      colors={serializedPortfolio.colors || {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        highlight: '#F59E0B',
      }}
    />
  );
}

