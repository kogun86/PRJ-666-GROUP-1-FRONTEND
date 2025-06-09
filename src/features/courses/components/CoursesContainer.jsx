import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { LoadingAnimation } from '../../../components/ui';
import CourseForm from './CourseForm';
import ClassesList from './ClassesList';
import CoursesList from './CoursesList';
import { useCourseSubmit, useClassDelete, useCourseDeletion } from '../';
import { useCourses } from '../hooks/useCourses';
import { secondsToTime, getWeekday } from '../utils/timeUtils';

export default function CoursesContainer() {
  const [activeTab, setActiveTab] = useState('My Classes');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const { myCourses, schedule, isLoading, error, addCourse, refreshClasses, refreshCourses } =
    useCourses();

  const {
    submitCourse,
    isSubmitting,
    error: submitError,
    success: submitSuccess,
    resetState,
  } = useCourseSubmit();

  const {
    deleteClass,
    isDeleting: isDeletingClass,
    success: deleteClassSuccess,
  } = useClassDelete();

  const {
    deleteCourse,
    isDeleting: isDeletingCourse,
    success: deleteCourseSuccess,
  } = useCourseDeletion();

  // Reset the submit state when the form is closed
  useEffect(() => {
    if (!showForm) {
      resetState();
    }
  }, [showForm, resetState]);

  // If submission was successful, update UI
  useEffect(() => {
    if (submitSuccess) {
      setShowForm(false);
    }
  }, [submitSuccess]);

  // Refresh class data when a class is deleted successfully
  useEffect(() => {
    if (deleteClassSuccess) {
      refreshClasses();
    }
  }, [deleteClassSuccess, refreshClasses]);

  // Refresh course data when a course is deleted successfully
  useEffect(() => {
    if (deleteCourseSuccess) {
      refreshCourses();
    }
  }, [deleteCourseSuccess, refreshCourses]);

  function handleAdd() {
    setEditData(null);
    setEditIndex(null);

    // If on Classes tab, switch to Courses tab before showing the form
    if (activeTab === 'My Classes') {
      setActiveTab('My Courses');
    }

    setShowForm(true);
  }

  const handleDeleteClass = async (classId) => {
    if (!classId) {
      console.error('No class ID provided for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClass(classId);
      } catch (err) {
        console.error('Error deleting class:', err);
      }
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      console.error('No course ID provided for deletion');
      return;
    }

    if (
      window.confirm(
        'Are you sure you want to delete this course? This will also delete all associated classes.'
      )
    ) {
      try {
        await deleteCourse(courseId);
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  const handleEditCourse = (course, idx) => {
    setEditData(course);
    setEditIndex(idx);
    setShowForm(true);
  };

  async function handleSubmit(data) {
    if (
      !data.title ||
      !data.code ||
      !data.startDate ||
      !data.endDate ||
      !data.instructor?.name ||
      !data.instructor?.email ||
      !data.instructor?.availableTimeSlots?.length ||
      !data.schedule?.length
    ) {
      alert('All fields are required.');
      return;
    }

    try {
      const newCourse = {
        title: data.title,
        code: data.code,
        section: data.section,
        status: 'active',
        startDate: data.startDate,
        endDate: data.endDate,
        color: data.color,
        instructor: {
          name: data.instructor.name,
          email: data.instructor.email,
          availableTimeSlots: data.instructor.availableTimeSlots.map((s) => ({
            weekday: typeof s.weekday === 'number' ? s.weekday : weekdayToIndex(s.weekDay),
            startTime: s.startTime, // Time conversion will be handled in useCourseSubmit
            endTime: s.endTime, // Time conversion will be handled in useCourseSubmit
          })),
        },
        schedule: data.schedule.map((s) => ({
          classType: s.classType || 'lecture',
          weekday: typeof s.weekday === 'number' ? s.weekday : weekdayToIndex(s.weekDay),
          startTime: s.startTime, // Time conversion will be handled in useCourseSubmit
          endTime: s.endTime, // Time conversion will be handled in useCourseSubmit
          location: s.location || 'TBD',
        })),
      };

      console.log('📤 Submitting course to backend:', JSON.stringify(newCourse, null, 2));

      const result = await submitCourse(newCourse);

      if (result.success) {
        console.log('✅ Course created:', result);
        setShowForm(false);

        // Get the created course from the response
        const createdCourse = result.course;

        // Add the new course to the UI
        addCourse({
          _id: result.courseId || (createdCourse && createdCourse._id) || `temp-${Date.now()}`,
          title: createdCourse?.title || newCourse.title,
          code: createdCourse?.code || newCourse.code,
          section: createdCourse?.section || newCourse.section,
          professor: createdCourse?.instructor?.name || newCourse.instructor.name,
          color: createdCourse?.color || newCourse.color,
          grade: 0,
          schedule: (createdCourse?.schedule || newCourse.schedule).map((s) => ({
            time:
              typeof s.startTime === 'number'
                ? `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`
                : `${s.startTime}–${s.endTime}`,
            weekDay: getWeekday(s.weekday),
          })),
        });
      } else {
        console.error('❌ Error creating course:', result.errors);
        alert(`Failed to create course: ${result.errors?.join(', ') || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Exception during course submission:', error);
      alert(`An error occurred: ${error.message}`);
    }
  }

  return (
    <div className="courses-container">
      <div className="profile-card">
        <div className="profile-action-row tabs-bar">
          {['My Classes', 'My Courses'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setShowForm(false);
              }}
              className={`profile-button ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {!showForm && (
          <div className="add-course-row">
            <button className="button button-primary add-course-button" onClick={handleAdd}>
              + Add Course
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <LoadingAnimation size="large" />
            <p className="loading-text">Loading your courses...</p>
          </div>
        ) : (
          <div className="profile-content mt-4">
            {activeTab === 'My Classes' && (
              <ClassesList
                schedule={schedule}
                handleDeleteClass={handleDeleteClass}
                isDeletingClass={isDeletingClass}
              />
            )}

            {activeTab === 'My Courses' && (
              <>
                <Modal
                  isOpen={showForm}
                  onClose={() => setShowForm(false)}
                  title={editData ? 'Edit Course' : 'Add New Course'}
                >
                  <CourseForm
                    initialData={editData}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                    isSubmitting={isSubmitting}
                    error={submitError}
                  />
                </Modal>

                <CoursesList
                  courses={myCourses}
                  handleAdd={handleAdd}
                  handleEdit={handleEditCourse}
                  handleDelete={handleDeleteCourse}
                  isDeleting={isDeletingCourse}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
