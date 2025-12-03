'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';

type Project = {
  title: string;
  description: string;
  technologies: string[];
  imageUrls?: string[];
  projectUrl?: string;
  githubUrl?: string;
};

type Education = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
};

type Experience = {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
};

type Portfolio = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  template?: 'minimalistic' | 'modern';
  colors?: {
    primary: string;
    secondary: string;
    highlight: string;
  };
  projects: Project[];
  skills: string[];
  education: Education[];
  experience: Experience[];
  createdAt: string;
  updatedAt: string;
};

const initialCreateForm = {
  title: '',
  description: '',
  skills: '',
  template: 'minimalistic' as 'minimalistic' | 'modern',
  colors: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    highlight: '#F59E0B',
  },
};

const initialProjectForm = {
  title: '',
  description: '',
  technologies: '',
  imageUrls: [] as string[],
  projectUrl: '',
  githubUrl: '',
};

const initialEducationForm = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
};

const initialExperienceForm = {
  company: '',
  position: '',
  description: '',
  startDate: '',
  endDate: '',
};

const parseCommaSeparated = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const formatDate = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : '';

// Validation helpers
const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true; // Empty URLs are optional
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

const validateTextLength = (text: string, maxLength: number, fieldName: string): string | null => {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return `${fieldName} cannot be empty`;
  }
  if (trimmed.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or less`;
  }
  return null;
};

const validateDateRange = (startDate: string, endDate?: string): string | null => {
  if (!startDate) return null;
  
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  // Start date shouldn't be in the future
  if (start > today) {
    return 'Start date cannot be in the future';
  }
  
  if (endDate) {
    const end = new Date(endDate);
    if (end < start) {
      return 'End date must be after start date';
    }
    if (end > today) {
      return 'End date cannot be in the future';
    }
  }
  
  return null;
};

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '',
    template: 'minimalistic' as 'minimalistic' | 'modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      highlight: '#F59E0B',
    },
  });
  const [newProject, setNewProject] = useState(initialProjectForm);
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState(initialEducationForm);
  const [newExperience, setNewExperience] = useState(initialExperienceForm);
  const [mutating, setMutating] = useState(false);

  const selectedPortfolio = useMemo(() => {
    if (!portfolios.length) {
      return null;
    }

    if (selectedId) {
      return portfolios.find((portfolio) => portfolio._id === selectedId) ?? null;
    }

    return portfolios[0];
  }, [portfolios, selectedId]);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch portfolios');
      }

      setPortfolios(data.portfolios || []);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePortfolio = useCallback(
    async (id: string, payload: Record<string, unknown>, successMessage = 'Portfolio updated') => {
      setMutating(true);
      try {
        const response = await fetch('/api/portfolio', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...payload }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update portfolio');
        }

        setPortfolios((prev) =>
          prev.map((portfolio) => (portfolio._id === data.portfolio._id ? data.portfolio : portfolio))
        );
        showToast(successMessage);
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Failed to update portfolio');
      } finally {
        setMutating(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  useEffect(() => {
    if (!selectedId && portfolios.length) {
      setSelectedId(portfolios[0]._id);
    }
  }, [portfolios, selectedId]);

  useEffect(() => {
    if (selectedPortfolio) {
      setEditForm({
        title: selectedPortfolio.title,
        description: selectedPortfolio.description,
        template: selectedPortfolio.template || 'minimalistic',
        colors: selectedPortfolio.colors || {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          highlight: '#F59E0B',
        },
      });
    } else {
      setEditForm({ 
        title: '', 
        description: '',
        template: 'minimalistic',
        colors: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          highlight: '#F59E0B',
        },
      });
    }
  }, [selectedPortfolio]);

  const handleCreatePortfolio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const titleError = validateTextLength(createForm.title, 100, 'Title');
    if (titleError) {
      showError(titleError);
      return;
    }

    const descError = validateTextLength(createForm.description, 500, 'Description');
    if (descError) {
      showError(descError);
      return;
    }

    if (!isValidHexColor(createForm.colors.primary) || 
        !isValidHexColor(createForm.colors.secondary) || 
        !isValidHexColor(createForm.colors.highlight)) {
      showError('Please select valid colors');
      return;
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createForm.title.trim(),
          description: createForm.description.trim(),
          template: createForm.template,
          colors: createForm.colors,
          skills: parseCommaSeparated(createForm.skills),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portfolio');
      }

      setPortfolios((prev) => [data.portfolio, ...prev]);
      setSelectedId(data.portfolio._id);
      setCreateForm(initialCreateForm);
      showToast('Portfolio created');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create portfolio');
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    const confirmed = window.confirm('Delete this portfolio? This cannot be undone.');

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete portfolio');
      }

      setPortfolios((prev) => prev.filter((portfolio) => portfolio._id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
      showToast('Portfolio deleted');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete portfolio');
    }
  };

  const handleUpdateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPortfolio) return;

    const titleError = validateTextLength(editForm.title, 100, 'Title');
    if (titleError) {
      showError(titleError);
      return;
    }

    const descError = validateTextLength(editForm.description, 500, 'Description');
    if (descError) {
      showError(descError);
      return;
    }

    if (!isValidHexColor(editForm.colors.primary) || 
        !isValidHexColor(editForm.colors.secondary) || 
        !isValidHexColor(editForm.colors.highlight)) {
      showError('Please select valid colors');
      return;
    }

    await updatePortfolio(
      selectedPortfolio._id,
      {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        template: editForm.template,
        colors: editForm.colors,
      },
      'Details updated'
    );
  };

  const handleAddSkill = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPortfolio) return;

    const skillError = validateTextLength(newSkill, 50, 'Skill');
    if (skillError) {
      showError(skillError);
      return;
    }

    const updatedSkills = [...selectedPortfolio.skills, newSkill.trim()];
    await updatePortfolio(selectedPortfolio._id, { skills: updatedSkills }, 'Skill added');
    setNewSkill('');
  };

  const handleEditSkill = async (index: number) => {
    if (!selectedPortfolio) return;
    const current = selectedPortfolio.skills[index];
    const updated = window.prompt('Update skill', current);

    if (updated === null) {
      return;
    }

    const skillError = validateTextLength(updated, 50, 'Skill');
    if (skillError) {
      showError(skillError);
      return;
    }

    const updatedSkills = selectedPortfolio.skills.map((skill, idx) =>
      idx === index ? updated.trim() : skill
    );
    await updatePortfolio(selectedPortfolio._id, { skills: updatedSkills }, 'Skill updated');
  };

  const handleDeleteSkill = async (index: number) => {
    if (!selectedPortfolio) return;
    const updatedSkills = selectedPortfolio.skills.filter((_, idx) => idx !== index);
    await updatePortfolio(selectedPortfolio._id, { skills: updatedSkills }, 'Skill removed');
  };

  const handleAddProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPortfolio) return;

    const titleError = validateTextLength(newProject.title, 100, 'Project title');
    if (titleError) {
      showError(titleError);
      return;
    }

    const descError = validateTextLength(newProject.description, 1000, 'Project description');
    if (descError) {
      showError(descError);
      return;
    }

    // Validate URLs
    const imageUrls = newProject.imageUrls.filter((url) => url.trim() !== '');
    for (const url of imageUrls) {
      if (!isValidUrl(url)) {
        showError(`Invalid image URL: ${url}`);
        return;
      }
    }

    if (newProject.projectUrl && !isValidUrl(newProject.projectUrl)) {
      showError('Invalid project URL');
      return;
    }

    if (newProject.githubUrl && !isValidUrl(newProject.githubUrl)) {
      showError('Invalid GitHub URL');
      return;
    }

    const filteredImageUrls = imageUrls;
    const projectPayload: Project = {
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      technologies: parseCommaSeparated(newProject.technologies),
      imageUrls: filteredImageUrls.length > 0 ? filteredImageUrls.map(url => url.trim()) : undefined,
      projectUrl: newProject.projectUrl?.trim() || undefined,
      githubUrl: newProject.githubUrl?.trim() || undefined,
    };

    await updatePortfolio(
      selectedPortfolio._id,
      { projects: [...selectedPortfolio.projects, projectPayload] },
      'Project added'
    );
    setNewProject(initialProjectForm);
  };

  const handleEditProject = async (index: number) => {
    if (!selectedPortfolio) return;
    const project = selectedPortfolio.projects[index];
    const title = window.prompt('Project title', project.title);
    if (title === null) return;
    const titleError = validateTextLength(title, 100, 'Project title');
    if (titleError) {
      showError(titleError);
      return;
    }
    const description = window.prompt('Project description', project.description);
    if (description === null) return;
    const descError = validateTextLength(description, 1000, 'Project description');
    if (descError) {
      showError(descError);
      return;
    }
    const technologies = window.prompt(
      'Technologies (comma separated)',
      project.technologies.join(', ')
    );

    const updatedProject: Project = {
      ...project,
      title: title.trim(),
      description: description.trim(),
      technologies: technologies ? parseCommaSeparated(technologies) : project.technologies,
      projectUrl: project.projectUrl?.trim() || undefined,
      githubUrl: project.githubUrl?.trim() || undefined,
    };

    await updatePortfolio(
      selectedPortfolio._id,
      {
        projects: selectedPortfolio.projects.map((item, idx) =>
          idx === index ? updatedProject : item
        ),
      },
      'Project updated'
    );
  };

  const handleDeleteProject = async (index: number) => {
    if (!selectedPortfolio) return;
    const updatedProjects = selectedPortfolio.projects.filter((_, idx) => idx !== index);
    await updatePortfolio(selectedPortfolio._id, { projects: updatedProjects }, 'Project removed');
  };

  const handleAddEducation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPortfolio) return;

    const institutionError = validateTextLength(newEducation.institution, 200, 'Institution');
    if (institutionError) {
      showError(institutionError);
      return;
    }

    const degreeError = validateTextLength(newEducation.degree, 100, 'Degree');
    if (degreeError) {
      showError(degreeError);
      return;
    }

    const fieldError = validateTextLength(newEducation.field, 100, 'Field of study');
    if (fieldError) {
      showError(fieldError);
      return;
    }

    if (!newEducation.startDate) {
      showError('Start date is required');
      return;
    }

    const dateError = validateDateRange(newEducation.startDate, newEducation.endDate);
    if (dateError) {
      showError(dateError);
      return;
    }

    const educationPayload: Education = {
      institution: newEducation.institution.trim(),
      degree: newEducation.degree.trim(),
      field: newEducation.field.trim(),
      startDate: new Date(newEducation.startDate).toISOString(),
      endDate: newEducation.endDate ? new Date(newEducation.endDate).toISOString() : undefined,
    };

    await updatePortfolio(
      selectedPortfolio._id,
      { education: [...selectedPortfolio.education, educationPayload] },
      'Education added'
    );
    setNewEducation(initialEducationForm);
  };

  const handleEditEducation = async (index: number) => {
    if (!selectedPortfolio) return;
    const education = selectedPortfolio.education[index];
    const institution = window.prompt('Institution', education.institution);
    if (institution === null) return;
    const instError = validateTextLength(institution, 200, 'Institution');
    if (instError) {
      showError(instError);
      return;
    }
    const degree = window.prompt('Degree', education.degree);
    if (degree === null) return;
    const degreeError = validateTextLength(degree, 100, 'Degree');
    if (degreeError) {
      showError(degreeError);
      return;
    }
    const field = window.prompt('Field of study', education.field);
    if (field === null) return;
    const fieldError = validateTextLength(field, 100, 'Field of study');
    if (fieldError) {
      showError(fieldError);
      return;
    }
    const startDate = window.prompt(
      'Start date (YYYY-MM-DD)',
      formatDate(education.startDate)
    );
    if (startDate === null || !startDate.trim()) return;
    const endDate = window.prompt(
      'End date (YYYY-MM-DD or empty)',
      formatDate(education.endDate)
    );
    
    const dateError = validateDateRange(startDate, endDate || undefined);
    if (dateError) {
      showError(dateError);
      return;
    }

    const updatedEducation: Education = {
      institution: institution.trim(),
      degree: degree.trim(),
      field: field.trim(),
      startDate: new Date(startDate.trim()).toISOString(),
      endDate: endDate?.trim() ? new Date(endDate.trim()).toISOString() : undefined,
    };

    await updatePortfolio(
      selectedPortfolio._id,
      {
        education: selectedPortfolio.education.map((item, idx) =>
          idx === index ? updatedEducation : item
        ),
      },
      'Education updated'
    );
  };

  const handleDeleteEducation = async (index: number) => {
    if (!selectedPortfolio) return;
    const updatedEducation = selectedPortfolio.education.filter((_, idx) => idx !== index);
    await updatePortfolio(selectedPortfolio._id, { education: updatedEducation }, 'Education removed');
  };

  const handleAddExperience = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPortfolio) return;

    const companyError = validateTextLength(newExperience.company, 200, 'Company');
    if (companyError) {
      showError(companyError);
      return;
    }

    const positionError = validateTextLength(newExperience.position, 100, 'Position');
    if (positionError) {
      showError(positionError);
      return;
    }

    const descError = validateTextLength(newExperience.description, 1000, 'Description');
    if (descError) {
      showError(descError);
      return;
    }

    if (!newExperience.startDate) {
      showError('Start date is required');
      return;
    }

    const dateError = validateDateRange(newExperience.startDate, newExperience.endDate);
    if (dateError) {
      showError(dateError);
      return;
    }

    const experiencePayload: Experience = {
      company: newExperience.company.trim(),
      position: newExperience.position.trim(),
      description: newExperience.description.trim(),
      startDate: new Date(newExperience.startDate).toISOString(),
      endDate: newExperience.endDate ? new Date(newExperience.endDate).toISOString() : undefined,
    };

    await updatePortfolio(
      selectedPortfolio._id,
      { experience: [...selectedPortfolio.experience, experiencePayload] },
      'Experience added'
    );
    setNewExperience(initialExperienceForm);
  };

  const handleEditExperience = async (index: number) => {
    if (!selectedPortfolio) return;
    const experience = selectedPortfolio.experience[index];
    const company = window.prompt('Company', experience.company);
    if (company === null) return;
    const companyError = validateTextLength(company, 200, 'Company');
    if (companyError) {
      showError(companyError);
      return;
    }
    const position = window.prompt('Position', experience.position);
    if (position === null) return;
    const positionError = validateTextLength(position, 100, 'Position');
    if (positionError) {
      showError(positionError);
      return;
    }
    const description = window.prompt('Description', experience.description);
    if (description === null) return;
    const descError = validateTextLength(description, 1000, 'Description');
    if (descError) {
      showError(descError);
      return;
    }
    const startDate = window.prompt(
      'Start date (YYYY-MM-DD)',
      formatDate(experience.startDate)
    );
    if (startDate === null || !startDate.trim()) return;
    const endDate = window.prompt(
      'End date (YYYY-MM-DD or empty)',
      formatDate(experience.endDate)
    );
    
    const dateError = validateDateRange(startDate, endDate || undefined);
    if (dateError) {
      showError(dateError);
      return;
    }

    const updatedExperience: Experience = {
      company: company.trim(),
      position: position.trim(),
      description: description.trim(),
      startDate: new Date(startDate.trim()).toISOString(),
      endDate: endDate?.trim() ? new Date(endDate.trim()).toISOString() : undefined,
    };

    await updatePortfolio(
      selectedPortfolio._id,
      {
        experience: selectedPortfolio.experience.map((item, idx) =>
          idx === index ? updatedExperience : item
        ),
      },
      'Experience updated'
    );
  };

  const handleDeleteExperience = async (index: number) => {
    if (!selectedPortfolio) return;
    const updatedExperience = selectedPortfolio.experience.filter((_, idx) => idx !== index);
    await updatePortfolio(
      selectedPortfolio._id,
      { experience: updatedExperience },
      'Experience removed'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-6xl mx-auto px-4 py-10 space-y-8 w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your portfolios and their content.</p>
        </div>

        {(error || toast) && (
          <div
            className={`rounded-md border px-4 py-3 text-sm ${
              error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {error || toast}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Portfolios</h2>
              <button
                type="button"
                onClick={fetchPortfolios}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading portfolios...</p>
            ) : portfolios.length === 0 ? (
              <p className="text-gray-500">No portfolios yet. Create your first one!</p>
            ) : (
              <ul className="space-y-3">
                {portfolios.map((portfolio) => (
                  <li
                    key={portfolio._id}
                    className={`rounded-lg border px-4 py-3 ${
                      selectedPortfolio?._id === portfolio._id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(portfolio._id)}
                      className="w-full text-left"
                    >
                      <p className="font-medium text-gray-900">{portfolio.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{portfolio.description}</p>
                    </button>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Updated {new Date(portfolio.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/portfolio/${portfolio._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Demo
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeletePortfolio(portfolio._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Create Portfolio</h2>
            <form onSubmit={handleCreatePortfolio} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  placeholder="e.g. Product Designer Portfolio"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  placeholder="Short summary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={createForm.skills}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, skills: event.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  placeholder="UI Design, UX Research, Prototyping"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Template</label>
                <select
                  value={createForm.template}
                  onChange={(event) =>
                    setCreateForm((prev) => ({ ...prev, template: event.target.value as 'minimalistic' | 'modern' }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                >
                  <option value="minimalistic">Minimalistic</option>
                  <option value="modern">Modern</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Color Palette</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Primary</label>
                    <input
                      type="color"
                      value={createForm.colors.primary}
                      onChange={(event) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, primary: event.target.value },
                        }))
                      }
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Secondary</label>
                    <input
                      type="color"
                      value={createForm.colors.secondary}
                      onChange={(event) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: event.target.value },
                        }))
                      }
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Highlight</label>
                    <input
                      type="color"
                      value={createForm.colors.highlight}
                      onChange={(event) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, highlight: event.target.value },
                        }))
                      }
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Create Portfolio
              </button>
            </form>
          </section>
        </div>

        {selectedPortfolio ? (
          <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{selectedPortfolio.title}</h2>
                <p className="text-sm text-gray-500">
                  Last updated {new Date(selectedPortfolio.updatedAt).toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Mutations {mutating ? 'in progress…' : 'idle'}
              </p>
            </div>

            <form onSubmit={handleUpdateDetails} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Template</label>
                <select
                  value={editForm.template}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, template: event.target.value as 'minimalistic' | 'modern' }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                >
                  <option value="minimalistic">Minimalistic</option>
                  <option value="modern">Modern</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Color Palette</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Primary</label>
                    <input
                      type="color"
                      value={editForm.colors.primary}
                      onChange={(event) =>
                        setEditForm((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, primary: event.target.value },
                        }))
                      }
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Secondary</label>
                    <input
                      type="color"
                      value={editForm.colors.secondary}
                      onChange={(event) =>
                        setEditForm((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: event.target.value },
                        }))
                      }
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">Highlight</label>
                    <input
                      type="color"
                      value={editForm.colors.highlight}
                      onChange={(event) =>
                        setEditForm((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, highlight: event.target.value },
                        }))
                      }
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Save Details
                </button>
              </div>
            </form>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                  <span className="text-sm text-gray-500">{selectedPortfolio.skills.length} total</span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {selectedPortfolio.skills.map((skill, index) => (
                    <li
                      key={`${skill}-${index}`}
                      className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleEditSkill(index)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                  {selectedPortfolio.skills.length === 0 && (
                    <li className="text-sm text-gray-500">No skills added yet.</li>
                  )}
                </ul>
                <form onSubmit={handleAddSkill} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(event) => setNewSkill(event.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                    placeholder="Add a skill"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Add
                  </button>
                </form>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                  <span className="text-sm text-gray-500">
                    {selectedPortfolio.projects.length} total
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedPortfolio.projects.map((project, index) => (
                    <div key={`${project.title}-${index}`} className="rounded-lg border border-gray-200 p-3">
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <p className="text-sm text-gray-500">
                        Tech: {project.technologies.join(', ') || '—'}
                      </p>
                      <div className="mt-2 flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => handleEditProject(index)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedPortfolio.projects.length === 0 && (
                    <p className="text-sm text-gray-500">No projects yet.</p>
                  )}
                </div>
                <form onSubmit={handleAddProject} className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(event) =>
                      setNewProject((prev) => ({ ...prev, title: event.target.value }))
                    }
                    placeholder="Project title"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <textarea
                    value={newProject.description}
                    onChange={(event) =>
                      setNewProject((prev) => ({ ...prev, description: event.target.value }))
                    }
                    placeholder="Project description"
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(event) =>
                      setNewProject((prev) => ({ ...prev, technologies: event.target.value }))
                    }
                    placeholder="Technologies (comma separated)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Image URLs (optional)
                    </label>
                    {newProject.imageUrls.map((url, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(event) => {
                            const updatedUrls = [...newProject.imageUrls];
                            updatedUrls[idx] = event.target.value;
                            setNewProject((prev) => ({ ...prev, imageUrls: updatedUrls }));
                          }}
                          placeholder={`Image URL ${idx + 1}`}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedUrls = newProject.imageUrls.filter((_, i) => i !== idx);
                            setNewProject((prev) => ({ ...prev, imageUrls: updatedUrls }));
                          }}
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100 transition-colors"
                          aria-label="Remove image URL"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setNewProject((prev) => ({
                          ...prev,
                          imageUrls: [...prev.imageUrls, ''],
                        }));
                      }}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Add Image URL</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={newProject.projectUrl}
                    onChange={(event) =>
                      setNewProject((prev) => ({ ...prev, projectUrl: event.target.value }))
                    }
                    placeholder="Project URL (optional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(event) =>
                      setNewProject((prev) => ({ ...prev, githubUrl: event.target.value }))
                    }
                    placeholder="GitHub URL (optional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    Add Project
                  </button>
                </form>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  <span className="text-sm text-gray-500">
                    {selectedPortfolio.education.length} entries
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedPortfolio.education.map((education, index) => (
                    <div key={`${education.institution}-${index}`} className="rounded-lg border border-gray-200 p-3">
                      <p className="font-medium text-gray-900">{education.institution}</p>
                      <p className="text-sm text-gray-600">
                        {education.degree} · {education.field}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(education.startDate)} –{' '}
                        {education.endDate ? formatDate(education.endDate) : 'Present'}
                      </p>
                      <div className="mt-2 flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => handleEditEducation(index)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEducation(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedPortfolio.education.length === 0 && (
                    <p className="text-sm text-gray-500">No education records yet.</p>
                  )}
                </div>
                <form onSubmit={handleAddEducation} className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={newEducation.institution}
                    onChange={(event) =>
                      setNewEducation((prev) => ({ ...prev, institution: event.target.value }))
                    }
                    placeholder="Institution"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <input
                    type="text"
                    value={newEducation.degree}
                    onChange={(event) =>
                      setNewEducation((prev) => ({ ...prev, degree: event.target.value }))
                    }
                    placeholder="Degree"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <input
                    type="text"
                    value={newEducation.field}
                    onChange={(event) =>
                      setNewEducation((prev) => ({ ...prev, field: event.target.value }))
                    }
                    placeholder="Field of Study"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Start Date</label>
                      <input
                        type="date"
                        value={newEducation.startDate}
                        onChange={(event) =>
                          setNewEducation((prev) => ({ ...prev, startDate: event.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">End Date</label>
                      <input
                        type="date"
                        value={newEducation.endDate}
                        onChange={(event) =>
                          setNewEducation((prev) => ({ ...prev, endDate: event.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    Add Education
                  </button>
                </form>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                  <span className="text-sm text-gray-500">
                    {selectedPortfolio.experience.length} entries
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedPortfolio.experience.map((experience, index) => (
                    <div key={`${experience.company}-${index}`} className="rounded-lg border border-gray-200 p-3">
                      <p className="font-medium text-gray-900">{experience.company}</p>
                      <p className="text-sm text-gray-600">{experience.position}</p>
                      <p className="text-sm text-gray-500">{experience.description}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(experience.startDate)} –{' '}
                        {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                      </p>
                      <div className="mt-2 flex gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => handleEditExperience(index)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedPortfolio.experience.length === 0 && (
                    <p className="text-sm text-gray-500">No experience entries yet.</p>
                  )}
                </div>
                <form onSubmit={handleAddExperience} className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={newExperience.company}
                    onChange={(event) =>
                      setNewExperience((prev) => ({ ...prev, company: event.target.value }))
                    }
                    placeholder="Company"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <input
                    type="text"
                    value={newExperience.position}
                    onChange={(event) =>
                      setNewExperience((prev) => ({ ...prev, position: event.target.value }))
                    }
                    placeholder="Position"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <textarea
                    value={newExperience.description}
                    onChange={(event) =>
                      setNewExperience((prev) => ({ ...prev, description: event.target.value }))
                    }
                    placeholder="Key contributions"
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Start Date</label>
                      <input
                        type="date"
                        value={newExperience.startDate}
                        onChange={(event) =>
                          setNewExperience((prev) => ({ ...prev, startDate: event.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">End Date</label>
                      <input
                        type="date"
                        value={newExperience.endDate}
                        onChange={(event) =>
                          setNewExperience((prev) => ({ ...prev, endDate: event.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none font-sans"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    Add Experience
                  </button>
                </form>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
            Select or create a portfolio to start managing its content.
          </section>
        )}
      </div>
      <footer className="border-t mt-auto" style={{ backgroundColor: '#28536B', borderColor: '#28536B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-white/80">
            © {new Date().getFullYear()} Portfolio Generator by Gregory Pimentel.
          </p>
        </div>
      </footer>
    </div>
  );
}

