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
      const result: Record<string, unknown> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // Skip MongoDB internal fields if desired, but we'll keep _id as string
          result[key] = serializeForClient((obj as Record<string, unknown>)[key]);
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
    projects: (serializedPortfolio as Record<string, unknown>).projects && Array.isArray((serializedPortfolio as Record<string, unknown>).projects)
      ? ((serializedPortfolio as Record<string, unknown>).projects as Array<Record<string, unknown>>).map((proj) => ({
          title: (proj.title as string) || '',
          description: (proj.description as string) || '',
          technologies: Array.isArray(proj.technologies) ? (proj.technologies as string[]) : [],
      imageUrls: Array.isArray(proj.imageUrls) 
            ? (proj.imageUrls as string[]).filter((url) => url && typeof url === 'string')
            : (proj.imageUrl ? [proj.imageUrl as string] : []), // Backward compatibility
          projectUrl: (proj.projectUrl as string) || undefined,
          githubUrl: (proj.githubUrl as string) || undefined,
        }))
      : [],
    skills: Array.isArray((serializedPortfolio as Record<string, unknown>).skills) 
      ? (serializedPortfolio as Record<string, unknown>).skills as string[]
      : [],
    education: (serializedPortfolio as Record<string, unknown>).education && Array.isArray((serializedPortfolio as Record<string, unknown>).education)
      ? ((serializedPortfolio as Record<string, unknown>).education as Array<Record<string, unknown>>).map((edu) => ({
          institution: (edu.institution as string) || '',
          degree: (edu.degree as string) || '',
          field: (edu.field as string) || '',
          startDate: edu.startDate ? (typeof edu.startDate === 'string' ? edu.startDate : new Date(edu.startDate as string).toISOString()) : '',
          endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : new Date(edu.endDate as string).toISOString()) : undefined,
        }))
      : [],
    experience: (serializedPortfolio as Record<string, unknown>).experience && Array.isArray((serializedPortfolio as Record<string, unknown>).experience)
      ? ((serializedPortfolio as Record<string, unknown>).experience as Array<Record<string, unknown>>).map((exp) => ({
          company: (exp.company as string) || '',
          position: (exp.position as string) || '',
          description: (exp.description as string) || '',
          startDate: exp.startDate ? (typeof exp.startDate === 'string' ? exp.startDate : new Date(exp.startDate as string).toISOString()) : '',
          endDate: exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : new Date(exp.endDate as string).toISOString()) : undefined,
        }))
      : [],
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

