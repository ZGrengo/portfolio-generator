'use client';

import ShareButton from '@/components/ShareButton';
import GalleryCarousel from '@/components/GalleryCarousel';

interface MinimalisticTemplateProps {
  portfolio: {
    title: string;
    description: string;
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
      startDate: string;
      endDate?: string;
    }>;
    experience: Array<{
      company: string;
      position: string;
      description: string;
      startDate: string;
      endDate?: string;
    }>;
  };
  portfolioId: string;
  colors: {
    primary: string;
    secondary: string;
    highlight: string;
  };
}

export default function MinimalisticTemplate({ portfolio, portfolioId, colors }: MinimalisticTemplateProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-white" style={{ color: colors.secondary }}>
      {/* Header */}
      <header className="border-b-2 py-12 px-6" style={{ borderColor: colors.primary }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-light mb-4" style={{ color: colors.primary }}>
            {portfolio.title}
          </h1>
          <p className="text-lg font-light leading-relaxed max-w-2xl" style={{ color: colors.secondary }}>
            {portfolio.description}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-6 uppercase tracking-wider" style={{ color: colors.primary }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 text-sm border uppercase"
                  style={{ borderColor: colors.primary, color: colors.secondary }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 uppercase tracking-wider" style={{ color: colors.primary }}>
              Projects
            </h2>
            <div className="space-y-12">
              {portfolio.projects.map((project, idx) => (
                <article key={idx} className="border-b pb-8" style={{ borderColor: colors.primary }}>
                  {project.imageUrls && project.imageUrls.length > 0 && (
                    <div className="mb-6">
                      <GalleryCarousel
                        images={project.imageUrls.map((url) => ({
                          url: url,
                          title: project.title,
                          projectUrl: project.projectUrl,
                        }))}
                        colors={colors}
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-light mb-2 uppercase" style={{ color: colors.primary }}>
                    {project.title}
                  </h3>
                  <p className="mb-4 leading-relaxed" style={{ color: colors.secondary }}>
                    {project.description}
                  </p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="text-xs px-2 py-1 uppercase"
                          style={{ backgroundColor: colors.highlight, color: 'white' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline transition-opacity duration-200 hover:opacity-70"
                        style={{ color: colors.primary }}
                      >
                        View Project
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline transition-opacity duration-200 hover:opacity-70"
                        style={{ color: colors.primary }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {portfolio.experience.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 uppercase tracking-wider" style={{ color: colors.primary }}>
              Experience
            </h2>
            <div className="space-y-8">
              {portfolio.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 pl-6" style={{ borderColor: colors.primary }}>
                  <h3 className="text-lg font-medium mb-1 uppercase" style={{ color: colors.primary }}>
                    {exp.position}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: colors.secondary }}>
                    {exp.company}
                  </p>
                  <p className="text-xs mb-3" style={{ color: colors.highlight }}>
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </p>
                  <p className="leading-relaxed" style={{ color: colors.secondary }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.education.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 uppercase tracking-wider" style={{ color: colors.primary }}>
              Education
            </h2>
            <div className="space-y-8">
              {portfolio.education.map((edu, idx) => (
                <div key={idx} className="border-l-2 pl-6" style={{ borderColor: colors.primary }}>
                  <h3 className="text-lg font-medium mb-1 uppercase" style={{ color: colors.primary }}>
                    {edu.degree}
                  </h3>
                  <p className="text-sm mb-2 font-semibold" style={{ color: colors.secondary }}>
                    {edu.field}
                  </p>
                  <p className="text-sm mb-1" style={{ color: colors.secondary }}>
                    {edu.institution}
                  </p>
                  <p className="text-xs" style={{ color: colors.highlight }}>
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t-2 py-8 px-6 mt-16" style={{ borderColor: colors.primary }}>
        <div className="max-w-4xl mx-auto text-center text-sm" style={{ color: colors.secondary }}>
          Portfolio generated with Portfolio Generator
        </div>
      </footer>
      <ShareButton portfolioId={portfolioId} colors={colors} />
    </div>
  );
}

