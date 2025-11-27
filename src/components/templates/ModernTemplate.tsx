'use client';

import ShareButton from '@/components/ShareButton';
import GalleryCarousel from '@/components/GalleryCarousel';

interface ModernTemplateProps {
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

export default function ModernTemplate({ portfolio, portfolioId, colors }: ModernTemplateProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary, color: '#ffffff' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-6 text-white">
              {portfolio.title}
            </h1>
            <p className="text-xl leading-relaxed text-white/90">
              {portfolio.description}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: `linear-gradient(to bottom, transparent, ${colors.secondary})` }} />
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-8 text-white">Skills</h2>
            <div className="flex flex-wrap gap-4">
              {portfolio.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-6 py-3 rounded-full text-white font-medium shadow-lg"
                  style={{ backgroundColor: colors.highlight }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-white">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portfolio.projects.map((project, idx) => (
                <article
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform"
                  style={{ color: '#ffffff' }}
                >
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
                  <h3 className="text-2xl font-bold mb-3 text-white">{project.title}</h3>
                  <p className="mb-4 leading-relaxed text-white/90">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="text-xs px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: colors.primary }}
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
                        className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                        style={{ backgroundColor: colors.highlight }}
                      >
                        View Project
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg border-2 text-white font-medium transition-colors"
                        style={{ borderColor: colors.primary }}
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
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-white">Experience</h2>
            <div className="space-y-6">
              {portfolio.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{exp.position}</h3>
                      <p className="text-lg text-white/80">{exp.company}</p>
                    </div>
                    <span
                      className="text-sm font-medium mt-2 md:mt-0 px-4 py-1 rounded-full"
                      style={{ backgroundColor: colors.highlight, color: 'white' }}
                    >
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  </div>
                  <p className="text-white/90 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.education.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-white">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                  <p className="text-white/80 mb-1">{edu.field}</p>
                  <p className="text-white/80 mb-3">{edu.institution}</p>
                  <span
                    className="text-sm font-medium px-3 py-1 rounded-full inline-block"
                    style={{ backgroundColor: colors.primary, color: 'white' }}
                  >
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/20 py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center text-white/70">
          Portfolio generated with Portfolio Generator
        </div>
      </footer>
      <ShareButton portfolioId={portfolioId} />
    </div>
  );
}

