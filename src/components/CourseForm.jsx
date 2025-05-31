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
      title: '',
      code: '',
      instructor: {
        name: '',
        email: '',
        availableTimeSlots: [{ weekday: 1, startTime: '09:00', endTime: '10:00' }],
      },
      startDate: '',
      endDate: '',
      schedule: [{ classType: 'lecture', weekday: 1, startTime: '09:00', endTime: '10:00' }],
    },
  });

  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: 'schedule',
  });

  const {
    fields: slotFields,
    append: appendSlot,
    remove: removeSlot,
  } = useFieldArray({
    control,
    name: 'instructor.availableTimeSlots',
  });

  return (
    <form className="course-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="form-group">
        <label>Course Title</label>
        <input {...register('title', { required: 'Required' })} className="form-input" />
        {errors.title && <span className="error-message">{errors.title.message}</span>}
      </div>

      {/* Code */}
      <div className="form-group">
        <label>Course Code</label>
        <input {...register('code', { required: 'Required' })} className="form-input" />
        {errors.code && <span className="error-message">{errors.code.message}</span>}
      </div>

      {/* Instructor */}
      <div className="form-group">
        <label>Instructor Name</label>
        <input {...register('instructor.name', { required: 'Required' })} className="form-input" />
        <label>Instructor Email</label>
        <input {...register('instructor.email', { required: 'Required' })} className="form-input" />
      </div>

      {/* Instructor Time Slots */}
      <div className="form-group">
        <label>Instructor Available Time Slots</label>
        {slotFields.map((field, idx) => (
          <div key={field.id} className="form-row schedule-item">
            <select
              {...register(`instructor.availableTimeSlots.${idx}.weekday`, { valueAsNumber: true })}
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i + 1}>
                  {d}
                </option>
              ))}
            </select>
            <input type="time" {...register(`instructor.availableTimeSlots.${idx}.startTime`)} />
            <input type="time" {...register(`instructor.availableTimeSlots.${idx}.endTime`)} />
            <button type="button" onClick={() => removeSlot(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendSlot({ weekday: 1, startTime: '09:00', endTime: '10:00' })}
        >
          + Add Slot
        </button>
      </div>

      {/* Start / End Date */}
      <div className="form-row">
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" {...register('startDate', { required: 'Required' })} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" {...register('endDate', { required: 'Required' })} />
        </div>
      </div>

      {/* Schedule */}
      <div className="form-group">
        <label>Schedule</label>
        {scheduleFields.map((field, idx) => (
          <div key={field.id} className="form-row schedule-item">
            <select {...register(`schedule.${idx}.classType`)}>
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
            </select>
            <select {...register(`schedule.${idx}.weekday`, { valueAsNumber: true })}>
              {DAYS.map((d, i) => (
                <option key={i} value={i + 1}>
                  {d}
                </option>
              ))}
            </select>
            <input type="time" {...register(`schedule.${idx}.startTime`)} />
            <input type="time" {...register(`schedule.${idx}.endTime`)} />
            <button type="button" onClick={() => removeSchedule(idx)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            appendSchedule({
              classType: 'lecture',
              weekday: 1,
              startTime: '09:00',
              endTime: '10:00',
            })
          }
        >
          + Add Class
        </button>
      </div>

      {/* Submit */}
      <div className="form-group">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
