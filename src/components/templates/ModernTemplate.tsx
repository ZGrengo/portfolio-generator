'use client';

import ShareButton from '@/components/ShareButton';
import GalleryCarousel from '@/components/GalleryCarousel';
import { motion } from 'framer-motion';

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

export default function ModernTemplate({
  portfolio,
  portfolioId,
  colors,
}: ModernTemplateProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  // Helper function to convert hex to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const highlightBg = hexToRgba(colors.highlight, 0.2);

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: colors.secondary }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: colors.primary }}
      >
        {/* blobs decorativos */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: colors.highlight }}
        />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full opacity-30 blur-2xl"
          style={{ background: colors.highlight }}
        />

        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="uppercase tracking-[0.25em] text-sm mb-4 text-white/70">
              Portfolio
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {portfolio.title}
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-white/90">
              {portfolio.description}
            </p>
          </motion.div>
        </div>

        {/* Border with highlight color */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            backgroundColor: colors.highlight,
          }}
        />
      </section>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-black/5 border border-black/20 shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-8 sm:p-10 space-y-24">
          {/* SKILLS */}
          {portfolio.skills.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
              <SectionHeader label="Core stack" title="Skills" color={colors.highlight} />

              <div className="flex flex-wrap gap-3">
                {portfolio.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-sm font-medium shadow-md shadow-black/30 border border-black/30 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40"
                    style={{ backgroundColor: colors.highlight }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* PROJECTS */}
          {portfolio.projects.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
            <SectionHeader label="Selected work" title="Projects" color={colors.highlight} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {portfolio.projects.map((project, idx) => (
                <motion.article
                  key={idx}
                  className="backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10 flex flex-col h-full"
                  style={{ backgroundColor: highlightBg }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {project.imageUrls && project.imageUrls.length > 0 && (
                    <div className="mb-5">
                      <GalleryCarousel
                        images={project.imageUrls.map((url) => ({
                          url,
                          title: project.title,
                          projectUrl: project.projectUrl,
                        }))}
                        colors={colors}
                      />
                    </div>
                  )}

                  <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                  <p className="mb-4 text-sm sm:text-base text-white/85">
                    {project.description}
                  </p>

                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies.map((tech, techIdx) => (
                        <span
                          key={techIdx}
                          className="text-[11px] uppercase tracking-wide px-3 py-1 rounded-full border border-white/20"
                          style={{ backgroundColor: colors.primary }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap gap-3">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                        style={{ backgroundColor: colors.highlight }}
                      >
                        <span>View project</span>
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 border border-white/40 hover:bg-white/5 transition-colors"
                        style={{ borderColor: colors.primary }}
                      >
                        <span>GitHub</span>
                        <span aria-hidden>{'</>'}</span>
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
            </motion.section>
          )}

          {/* EXPERIENCE */}
          {portfolio.experience.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
            <SectionHeader label="Background" title="Experience" color={colors.highlight} />

            <div className="space-y-5">
              {portfolio.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-md rounded-xl p-6 shadow-md border border-white/10"
                  style={{ backgroundColor: highlightBg }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {exp.position}
                      </h3>
                      <p className="text-sm text-white/80">{exp.company}</p>
                    </div>
                    <span
                      className="text-xs sm:text-sm font-medium px-4 py-1 rounded-full"
                      style={{
                        backgroundColor: colors.highlight,
                        color: 'white',
                      }}
                    >
                      {formatDate(exp.startDate)} –{' '}
                      {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
            </motion.section>
          )}

          {/* EDUCATION */}
          {portfolio.education.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
            <SectionHeader label="Studies" title="Education" color={colors.highlight} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-md rounded-xl p-6 shadow-md border border-white/10"
                  style={{ backgroundColor: highlightBg }}
                >
                  <h3 className="text-lg font-semibold mb-1">{edu.degree}</h3>
                  <p className="text-sm text-white/80 mb-1">{edu.field}</p>
                  <p className="text-sm text-white/70 mb-3">{edu.institution}</p>
                  <span
                    className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full inline-block"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {formatDate(edu.startDate)} –{' '}
                    {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </span>
                </div>
              ))}
            </div>
            </motion.section>
          )}
        </div>
      </main>

      <footer 
        className="mt-16"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-[10px] font-semibold">
              PG
            </span>
            <span>Portfolio generated with Portfolio Generator</span>
          </div>
          <ShareButton portfolioId={portfolioId} colors={colors} />
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  color,
}: {
  label: string;
  title: string;
  color: string;
}) {
  return (
    <div className="mb-8">
      <span
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-white/5 border border-white/10 mb-3"
        style={{ borderColor: color }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
    </div>
  );
}