import React, { useState } from 'react';

const ResourcesTab = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'tools', label: 'Study Tools' },
    { id: 'academic', label: 'Academic Resources' },
    { id: 'mental', label: 'Mental Health' },
    { id: 'templates', label: 'Templates' },
  ];

  const featuredResources = [
    { id: 1, name: 'Notion', category: 'Study Tools' },
    { id: 2, name: 'Anki', category: 'Study Tools' },
    { id: 3, name: 'Forest App', category: 'Study Tools' },
  ];

  const resources = [
    // Study Tools
    {
      id: 1,
      name: 'Notion',
      description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
      link: 'https://www.notion.so/',
      category: 'Study Tools',
      tags: ['planning', 'notes', 'organization'],
      isFavorite: true,
    },
    {
      id: 2,
      name: 'Anki',
      description: 'Powerful flashcard app using spaced repetition for efficient memorization.',
      link: 'https://apps.ankiweb.net/',
      category: 'Study Tools',
      tags: ['flashcards', 'memorization', 'spaced repetition'],
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Forest App',
      description: 'Stay focused and present by planting virtual trees that grow while you work.',
      link: 'https://www.forestapp.cc/',
      category: 'Study Tools',
      tags: ['focus', 'productivity', 'distraction blocker'],
      isFavorite: true,
    },
    {
      id: 4,
      name: 'Google Calendar',
      description: 'Schedule and organize your study sessions, classes, and deadlines.',
      link: 'https://calendar.google.com/',
      category: 'Study Tools',
      tags: ['planning', 'schedule', 'organization'],
      isFavorite: false,
    },
    {
      id: 5,
      name: 'Cold Turkey',
      description: 'Website and app blocker to eliminate distractions during study sessions.',
      link: 'https://getcoldturkey.com/',
      category: 'Study Tools',
      tags: ['focus', 'distraction blocker', 'productivity'],
      isFavorite: false,
    },

    // Academic Resources
    {
      id: 6,
      name: 'Campus Tutoring Services',
      description:
        'Free peer tutoring available for most subjects through the Student Success Center.',
      link: '#',
      category: 'Academic Resources',
      tags: ['tutoring', 'help', 'academic support'],
      isFavorite: false,
    },
    {
      id: 7,
      name: 'Writing Center',
      description:
        'Get help with essays, reports, and other written assignments from trained writing tutors.',
      link: '#',
      category: 'Academic Resources',
      tags: ['writing', 'essays', 'academic support'],
      isFavorite: false,
    },
    {
      id: 8,
      name: 'Zotero',
      description: 'Free tool to help collect, organize, cite, and share research sources.',
      link: 'https://www.zotero.org/',
      category: 'Academic Resources',
      tags: ['research', 'citations', 'bibliography'],
      isFavorite: false,
    },
    {
      id: 9,
      name: 'Professor Office Hours',
      description:
        'Schedule of when professors are available for one-on-one help outside of class.',
      link: '#',
      category: 'Academic Resources',
      tags: ['help', 'academic support', 'professors'],
      isFavorite: true,
    },

    // Mental Health & Wellness
    {
      id: 10,
      name: 'Campus Counseling Services',
      description: 'Free confidential counseling services for all enrolled students.',
      link: '#',
      category: 'Mental Health',
      tags: ['counseling', 'mental health', 'wellness'],
      isFavorite: false,
    },
    {
      id: 11,
      name: 'Headspace',
      description: 'Meditation and mindfulness app with student discount available.',
      link: 'https://www.headspace.com/',
      category: 'Mental Health',
      tags: ['meditation', 'mindfulness', 'stress relief'],
      isFavorite: false,
    },
    {
      id: 12,
      name: 'Study Break Activities',
      description: 'List of quick activities to refresh your mind during study breaks.',
      link: '#',
      category: 'Mental Health',
      tags: ['breaks', 'wellness', 'stress relief'],
      isFavorite: true,
    },
    {
      id: 13,
      name: 'Sleep Resources',
      description: 'Information about improving sleep quality for better academic performance.',
      link: '#',
      category: 'Mental Health',
      tags: ['sleep', 'wellness', 'health'],
      isFavorite: false,
    },

    // Templates & Downloads
    {
      id: 14,
      name: 'Weekly Study Planner',
      description: 'Printable PDF template for planning your weekly study schedule.',
      link: '#',
      category: 'Templates',
      tags: ['planner', 'organization', 'schedule'],
      isFavorite: true,
    },
    {
      id: 15,
      name: 'Cornell Notes Template',
      description: 'Printable and digital templates for Cornell note-taking method.',
      link: '#',
      category: 'Templates',
      tags: ['notes', 'organization', 'study method'],
      isFavorite: false,
    },
    {
      id: 16,
      name: 'Assignment Tracker',
      description:
        'Spreadsheet template to track all your assignments, due dates, and completion status.',
      link: '#',
      category: 'Templates',
      tags: ['organization', 'planning', 'assignments'],
      isFavorite: false,
    },
  ];

  // Filter resources based on category and search query
  const filteredResources = resources.filter(
    (resource) =>
      (activeCategory === 'all' || resource.category === activeCategory) &&
      (searchQuery === '' ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="resources-container">
      {/* Featured Resources Section */}
      <div className="featured-resources">
        <h3>Student Favorites</h3>
        <div className="featured-resources-list">
          {featuredResources.map((resource) => {
            const fullResource = resources.find((r) => r.id === resource.id);
            return (
              <div key={resource.id} className="featured-resource-item">
                <h4>{resource.name}</h4>
                <span className="resource-category">{resource.category}</span>
                <a
                  href={fullResource?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-resource-btn"
                >
                  View Resource
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="resources-search-filter">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="resource-search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        <div className="resources-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="resources-grid">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className={`resource-card ${resource.isFavorite ? 'favorite' : ''}`}
            >
              <div className="resource-card-header">
                <h3>{resource.name}</h3>
                {resource.isFavorite && <span className="favorite-star">★</span>}
              </div>
              <div className="resource-card-body">
                <p>{resource.description}</p>
                <div className="resource-tags">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="resource-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  Access Resource
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-resources">
            <p>No resources found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Templates Section */}
      {activeCategory === 'templates' || activeCategory === 'all' ? (
        <div className="templates-section">
          <h3>Downloadable Templates</h3>
          <div className="templates-grid">
            {resources
              .filter((resource) => resource.category === 'Templates')
              .map((template) => (
                <div key={template.id} className="template-card">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                  <a href={template.link} download className="download-template-btn">
                    Download Template
                  </a>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResourcesTab;
