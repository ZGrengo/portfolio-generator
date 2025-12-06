import { notFound } from 'next/navigation';
import MinimalisticTemplate from '@/components/templates/MinimalisticTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import LoadingPortfolioReveal from '@/components/LoadingPortfolioReveal';
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
  const serializeForClient = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Check if it's an ObjectId (has toString method and constructor name)
    if (obj && typeof obj === 'object' && typeof obj.toString === 'function') {
      const objWithConstructor = obj as { constructor?: { name?: string }; toString: () => string };
      if (objWithConstructor.constructor?.name === 'ObjectId' || objWithConstructor.toString().match(/^[0-9a-fA-F]{24}$/)) {
        return objWithConstructor.toString();
      }
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item: unknown) => serializeForClient(item));
    }

    // Handle plain objects
    if (typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      const objRecord = obj as Record<string, unknown>;
      for (const key in objRecord) {
        if (Object.prototype.hasOwnProperty.call(objRecord, key)) {
          // Skip MongoDB internal fields if desired, but we'll keep _id as string
          result[key] = serializeForClient(objRecord[key]);
        }
      }
      return result;
    }

    return obj;
  };

  // Convert MongoDB document to plain object
  const serializedPortfolio = serializeForClient(portfolio) as Record<string, unknown>;

  // Build clean portfolio data object for client components
  const portfolioData = {
    title: (serializedPortfolio.title as string) || '',
    description: (serializedPortfolio.description as string) || '',
    template: (serializedPortfolio.template as 'minimalistic' | 'modern') || 'minimalistic',
    projects: (() => {
      const projects = serializedPortfolio.projects;
      if (projects && Array.isArray(projects)) {
        const projectsArray = projects as Array<Record<string, unknown>>;
        return projectsArray.map((proj: Record<string, unknown>) => ({
          title: (proj.title as string) || '',
          description: (proj.description as string) || '',
          technologies: Array.isArray(proj.technologies) ? (proj.technologies as string[]) : [],
          imageUrls: Array.isArray(proj.imageUrls) 
            ? (proj.imageUrls as string[]).filter((url: unknown) => url && typeof url === 'string')
            : (proj.imageUrl ? [proj.imageUrl as string] : []), // Backward compatibility
          projectUrl: (proj.projectUrl as string) || undefined,
          githubUrl: (proj.githubUrl as string) || undefined,
        }));
      }
      return [];
    })(),
    skills: (() => {
      const skills = serializedPortfolio.skills;
      return Array.isArray(skills) ? (skills as string[]) : [];
    })(),
    education: (() => {
      const education = serializedPortfolio.education;
      if (education && Array.isArray(education)) {
        const educationArray = education as Array<Record<string, unknown>>;
        return educationArray.map((edu: Record<string, unknown>) => ({
          institution: (edu.institution as string) || '',
          degree: (edu.degree as string) || '',
          field: (edu.field as string) || '',
          startDate: edu.startDate ? (typeof edu.startDate === 'string' ? edu.startDate : new Date(edu.startDate as string).toISOString()) : '',
          endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : new Date(edu.endDate as string).toISOString()) : undefined,
        }));
      }
      return [];
    })(),
    experience: (() => {
      const experience = serializedPortfolio.experience;
      if (experience && Array.isArray(experience)) {
        const experienceArray = experience as Array<Record<string, unknown>>;
        return experienceArray.map((exp: Record<string, unknown>) => ({
          company: (exp.company as string) || '',
          position: (exp.position as string) || '',
          description: (exp.description as string) || '',
          startDate: exp.startDate ? (typeof exp.startDate === 'string' ? exp.startDate : new Date(exp.startDate as string).toISOString()) : '',
          endDate: exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : new Date(exp.endDate as string).toISOString()) : undefined,
        }));
      }
      return [];
    })(),
  };

  const TemplateComponent = portfolioData.template === 'modern' ? ModernTemplate : MinimalisticTemplate;
  const colors = (serializedPortfolio.colors && typeof serializedPortfolio.colors === 'object' 
    ? serializedPortfolio.colors as { primary: string; secondary: string; highlight: string }
    : {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        highlight: '#F59E0B',
      });

  return (
    <>
      <LoadingPortfolioReveal color={colors.primary} highlightColor={colors.highlight} />
    <TemplateComponent
      portfolio={portfolioData}
      portfolioId={id}
        colors={colors}
    />
    </>
  );
}

