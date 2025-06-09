import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCourses } from '../hooks/useCourses';
import { LoadingAnimation } from '../../animations';

export default function EventForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const { courses, loading: coursesLoading } = useCourses();
  const [startDate, setStartDate] = useState(initialData?.start || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: '',
      start: '',
      end: '',
      courseID: '',
      weight: '',
      type: 'assignment',
      description: '',
      location: '',
      color: '#E74C3C',
    },
  });

  const processFormData = (data) => {
    // Process form data before submitting
    const formattedData = {
      ...data,
      // Ensure date fields are in ISO format
      end: new Date(data.end).toISOString(),
      // If start date is not provided, use the end date
      start: data.start ? new Date(data.start).toISOString() : new Date(data.end).toISOString(),
    };

    onSubmit(formattedData);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit(processFormData)}>
      {/* Title */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="modal-input"
        />
        {errors.title && <div className="error-message">{errors.title.message}</div>}
      </div>

      {/* Course */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="courseID">
          Course
        </label>
        <select
          id="courseID"
          {...register('courseID', { required: 'Course is required' })}
          className="modal-input"
          disabled={coursesLoading}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.code} - {course.title} ({course.section})
            </option>
          ))}
        </select>
        {errors.courseID && <div className="error-message">{errors.courseID.message}</div>}
      </div>

      {/* Start Date */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="start">
          Start Date (optional)
        </label>
        <input
          id="start"
          type="datetime-local"
          {...register('start')}
          className="modal-input"
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      {/* End Date */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="end">
          Due Date
        </label>
        <input
          id="end"
          type="datetime-local"
          {...register('end', {
            required: 'Due date is required',
            validate: (value) => {
              // If start date is set, ensure end date is after start date
              if (startDate && new Date(value) <= new Date(startDate)) {
                return 'Due date must be after start date';
              }
              return true;
            },
          })}
          className="modal-input"
        />
        {errors.end && <div className="error-message">{errors.end.message}</div>}
      </div>

      {/* Weight */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="weight">
          Weight (%)
        </label>
        <input
          id="weight"
          type="number"
          {...register('weight', {
            required: 'Weight is required',
            min: { value: 0, message: 'Weight must be positive' },
            max: { value: 100, message: 'Weight cannot exceed 100%' },
          })}
          className="modal-input"
        />
        {errors.weight && <div className="error-message">{errors.weight.message}</div>}
      </div>

      {/* Type */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="type">
          Type
        </label>
        <select id="type" {...register('type')} className="modal-input">
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
          <option value="project">Project</option>
          <option value="quiz">Quiz</option>
          <option value="test">Test</option>
          <option value="homework">Homework</option>
        </select>
      </div>

      {/* Location */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          {...register('location')}
          className="modal-input"
          placeholder="e.g., Room 123, Online, etc."
        />
      </div>

      {/* Description */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="description">
          Description
        </label>
        <textarea id="description" {...register('description')} className="modal-input" />
      </div>

      {/* Color */}
      <div className="modal-form-group">
        <label className="modal-label" htmlFor="color">
          Color
        </label>
        <input
          id="color"
          type="color"
          {...register('color')}
          className="modal-input color-picker"
          defaultValue="#E74C3C"
        />
      </div>

      {/* Buttons */}
      <div className="modal-actions">
        <button
          type="button"
          className="modal-button modal-cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="modal-button modal-submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="button-loading">
              <LoadingAnimation size="small" style={{ width: 24, height: 24 }} />
              <span>Saving</span>
            </div>
          ) : (
            'Save'
          )}
        </button>
      </div>

      <style jsx>{`
        .event-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background-color: #cad2c5;
        }

        .error-message {
          color: #a72f38;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .color-picker {
          height: 40px;
          padding: 0.25rem;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
}
