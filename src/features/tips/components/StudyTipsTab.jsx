import React, { useState, useEffect } from 'react';

const StudyTipsTab = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [advice, setAdvice] = useState({
    title: 'Advice of the Day',
    advice: "Loading today's advice...",
    id: null,
    isLoading: true,
  });

  const fetchAdvice = async () => {
    setAdvice((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      const data = await response.json();
      setAdvice({
        title: 'Advice of the Day',
        advice: data.slip.advice,
        id: data.slip.id,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching advice:', error);
      setAdvice({
        title: 'Advice of the Day',
        advice: "Couldn't load advice. Please try again later.",
        id: null,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  const categories = [
    { id: 'all', label: 'All Tips' },
    { id: 'time', label: 'Time Management' },
    { id: 'note', label: 'Note-Taking' },
    { id: 'exam', label: 'Exam Strategies' },
    { id: 'urgent', label: 'Quick Tips' },
  ];

  const studyTips = [
    // Time Management Tips
    {
      id: 1,
      title: 'Pomodoro Technique',
      description:
        'Work for 25 minutes, then take a 5-minute break. After four cycles, take a longer 15-30 minute break.',
      category: 'Time Management',
      isUrgent: true,
    },
    {
      id: 2,
      title: 'Weekly Planning Strategy',
      description:
        'Set aside time each Sunday to plan your entire week. Block out study sessions, assignments, and personal time.',
      category: 'Time Management',
      isUrgent: false,
    },
    {
      id: 3,
      title: 'Eisenhower Matrix',
      description:
        'Prioritize tasks based on urgency and importance: Do (urgent & important), Schedule (important, not urgent), Delegate (urgent, not important), Eliminate (neither).',
      category: 'Time Management',
      isUrgent: false,
    },
    {
      id: 4,
      title: '2-Minute Rule',
      description:
        'If a task takes less than 2 minutes to complete, do it immediately instead of scheduling it for later.',
      category: 'Time Management',
      isUrgent: true,
    },

    // Focus & Motivation
    {
      id: 5,
      title: 'Eliminate Distractions',
      description:
        'Turn off notifications, use website blockers, and keep your phone in another room during focused study sessions.',
      category: 'Focus & Motivation',
      isUrgent: true,
    },
    {
      id: 6,
      title: 'Study Environment',
      description:
        'Find a quiet, well-lit space with minimal distractions. Some people work better with ambient background noise.',
      category: 'Focus & Motivation',
      isUrgent: false,
    },
    {
      id: 7,
      title: 'Reward System',
      description:
        'Create small rewards for completing study goals. This builds positive associations with studying.',
      category: 'Focus & Motivation',
      isUrgent: false,
    },
    {
      id: 8,
      title: 'Visualization',
      description:
        'Spend a few minutes visualizing your success and the benefits of mastering the material before studying.',
      category: 'Focus & Motivation',
      isUrgent: false,
    },

    // Note-Taking Techniques
    {
      id: 9,
      title: 'Cornell Method',
      description:
        'Divide your page into three sections: notes, cues, and summary. Take notes on the right, write cues on the left, and summarize at the bottom.',
      category: 'Note-Taking',
      isUrgent: false,
    },
    {
      id: 10,
      title: 'Mind Mapping',
      description:
        'Create visual diagrams that connect ideas around a central concept. Great for visual learners and complex topics.',
      category: 'Note-Taking',
      isUrgent: false,
    },
    {
      id: 11,
      title: 'Digital vs. Handwritten',
      description:
        'Handwriting improves retention but digital notes are easier to search and organize. Consider using both for different purposes.',
      category: 'Note-Taking',
      isUrgent: false,
    },
    {
      id: 12,
      title: 'Color Coding',
      description:
        'Use different colors for different types of information: definitions, examples, important points, etc.',
      category: 'Note-Taking',
      isUrgent: true,
    },
    {
      id: 17,
      title: 'Sketchnoting',
      description:
        'Combine words, images and structure to create visual notes that help you remember and connect concepts more effectively.',
      category: 'Note-Taking',
      isUrgent: false,
    },
    {
      id: 18,
      title: 'Outline Method',
      description:
        'Organize notes hierarchically with main topics, subtopics, and details. Use indentation to show relationships between ideas.',
      category: 'Note-Taking',
      isUrgent: false,
    },
    {
      id: 19,
      title: 'Sentence Method',
      description:
        'Write every new thought, fact or topic as a separate numbered line. Great for fast-paced lectures or when information is presented quickly.',
      category: 'Note-Taking',
      isUrgent: true,
    },
    {
      id: 20,
      title: 'Charting Method',
      description:
        'Create a table with columns for categories and rows for details. Excellent for comparing and contrasting multiple topics.',
      category: 'Note-Taking',
      isUrgent: false,
    },

    // Exam & Quiz Strategies
    {
      id: 13,
      title: 'Spaced Repetition',
      description:
        'Review material at increasing intervals over time instead of cramming. This improves long-term retention.',
      category: 'Exam Strategies',
      isUrgent: true,
    },
    {
      id: 14,
      title: 'Mnemonics',
      description:
        'Create acronyms, rhymes, or visual associations to remember complex information.',
      category: 'Exam Strategies',
      isUrgent: false,
    },
    {
      id: 15,
      title: 'Practice Tests',
      description:
        'Take practice exams under timed conditions to simulate the real testing environment.',
      category: 'Exam Strategies',
      isUrgent: true,
    },
    {
      id: 16,
      title: 'Exam Anxiety Management',
      description:
        'Practice deep breathing, positive self-talk, and visualization to reduce test anxiety.',
      category: 'Exam Strategies',
      isUrgent: true,
    },
  ];

  // Helper function to match category
  const matchesCategory = (tipCategory, filterCategory) => {
    if (filterCategory === 'note') {
      return tipCategory === 'Note-Taking';
    }
    return tipCategory.toLowerCase().includes(filterCategory);
  };

  const filteredTips =
    activeCategory === 'all'
      ? studyTips
      : activeCategory === 'urgent'
        ? studyTips.filter((tip) => tip.isUrgent)
        : studyTips.filter((tip) => matchesCategory(tip.category, activeCategory));

  return (
    <div className="study-tips-container">
      {/* Advice of the Day Section */}
      <div className="tip-of-day">
        <div className="tip-of-day-header">
          <h3>✨ {advice.title}</h3>
          <button
            onClick={fetchAdvice}
            className="regenerate-advice-btn"
            disabled={advice.isLoading}
          >
            {advice.isLoading ? 'Loading...' : 'New Advice'}
          </button>
        </div>
        <div className="tip-of-day-content">
          <p className="advice-text">{advice.advice}</p>
          {advice.id && <span className="advice-id">#{advice.id}</span>}
        </div>
      </div>

      {/* Category Filter */}
      <div className="tips-filter">
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

      {/* Tips Grid */}
      <div className="tips-grid">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="study-tip-item">
            <div className="tip-header">
              <h3 className="study-tip-title">{tip.title}</h3>
              {tip.isUrgent && <span className="urgent-tag">Quick Win</span>}
            </div>
            <p className="study-tip-description">{tip.description}</p>
            <div className="tip-category-tag">{tip.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyTipsTab;
