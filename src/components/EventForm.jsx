import React from 'react';
import { useForm } from 'react-hook-form';

export default function EventForm({ initialData, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: '',
      date: '',
      courseCode: '',
      weight: '',
      type: 'Homework',
      description: '',
    },
  });

  return (
    <form className="event-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="event-form-group">
        <label className="form-label" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="form-input"
        />
        {errors.title && <div className="error-message">{errors.title.message}</div>}
      </div>

      {/* Date */}
      <div className="event-form-group">
        <label className="form-label" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          {...register('date', {
            required: 'Date is required',
            validate: (value) => {
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0); // reset time to 00:00:00 to compare only the date
              return selectedDate >= today || 'Date cannot be in the past';
            },
          })}
          className="form-input"
        />
        {errors.date && <div className="error-message">{errors.date.message}</div>}
      </div>

      {/* Course Code */}
      <div className="event-form-group">
        <label className="form-label" htmlFor="courseCode">
          Course Code
        </label>
        <input
          id="courseCode"
          {...register('courseCode', { required: 'Course code is required' })}
          className="form-input"
        />
        {errors.courseCode && <div className="error-message">{errors.courseCode.message}</div>}
      </div>

      {/* Weight */}
      <div className="event-form-group">
        <label className="form-label" htmlFor="weight">
          Weight (%)
        </label>
        <input
          id="weight"
          type="number"
          {...register('weight', { required: 'Weight is required', min: 0 })}
          className="form-input"
        />
        {errors.weight && <div className="error-message">{errors.weight.message}</div>}
      </div>

      {/* Type */}
      <div className="event-form-group">
        <label className="form-label" htmlFor="type">
          Type
        </label>
        <select id="type" {...register('type')} className="form-select">
          <option value="Homework">Homework</option>
          <option value="Study Session">Study Session</option>
        </select>
      </div>

      {/* Description */}
      <div className="event-form-group">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          className="form-input"
        />
        {errors.description && <div className="error-message">{errors.description.message}</div>}
      </div>

      {/* Buttons */}
      <div className="event-form-group form-actions">
        <button type="submit" className="button button-primary">
          Save
        </button>
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
