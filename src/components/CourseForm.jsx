import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function CourseForm({ initialData, onSubmit, onCancel }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: '',
      code: '',
      professor: '',
      startDate: '',
      endDate: '',
      color: '#52796f',
      schedule: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedule',
  });

  return (
    <form className="course-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Course Name */}
      <div className="form-group">
        <label className="course-form-label" htmlFor="name">
          Course Name
        </label>
        <input id="name" {...register('name', { required: 'Required' })} className="form-input" />
        {errors.name && <div className="error-message">{errors.name.message}</div>}
      </div>

      {/* Course Code */}
      <div className="form-group">
        <label className="course-form-label" htmlFor="code">
          Course Code
        </label>
        <input id="code" {...register('code', { required: 'Required' })} className="form-input" />
        {errors.code && <div className="error-message">{errors.code.message}</div>}
      </div>

      {/* Instructor */}
      <div className="form-group">
        <label className="course-form-label" htmlFor="professor">
          Instructor
        </label>
        <input id="professor" {...register('professor')} className="form-input" />
      </div>

      {/* Period */}
      <div className="form-row">
        <div className="form-group">
          <label className="course-form-label" htmlFor="startDate">
            Start Date
          </label>
          <input type="date" id="startDate" {...register('startDate')} className="form-date" />
        </div>
        <div className="form-group">
          <label className="course-form-label" htmlFor="endDate">
            End Date
          </label>
          <input type="date" id="endDate" {...register('endDate')} className="form-date" />
        </div>
      </div>

      {/* Color */}
      <div className="form-group">
        <label className="course-form-label" htmlFor="color">
          Course Color
        </label>
        <input type="color" id="color" {...register('color')} className="form-input" />
      </div>

      {/* Dynamic Schedule */}
      <div className="form-group">
        <label className="course-form-label">Class Schedule</label>
        {fields.map((field, idx) => (
          <div key={field.id} className="form-row schedule-item">
            <select
              {...register(`schedule.${idx}.day`, { required: true })}
              className="form-select"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              type="time"
              {...register(`schedule.${idx}.startTime`, { required: true })}
              className="form-time"
            />
            <input
              type="time"
              {...register(`schedule.${idx}.endTime`, { required: true })}
              className="form-time"
            />
            <button type="button" className="button button-secondary" onClick={() => remove(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button button-secondary"
          onClick={() => append({ day: 'Monday', startTime: '09:00', endTime: '10:00' })}
        >
          + Add Session
        </button>
      </div>

      {/* Actions */}
      <div className="form-group form-actions">
        <button type="submit" className="button button-primary">
          Save
        </button>
        <button type="button" onClick={onCancel} className="button button-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
