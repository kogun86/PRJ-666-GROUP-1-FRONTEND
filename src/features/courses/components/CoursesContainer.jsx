import React, { useState, useEffect } from 'react';
import Modal from '../../../componentShared/Modal';
import { LoadingAnimation } from '../../animations';
import TabsBar from '../../../componentShared/TabsBar';
import CourseForm from './CourseForm';
import ClassesList from './ClassesList';
import CoursesList from './CoursesList';
import { useCourseSubmit, useClassDelete, useCourseDeletion } from '../';
import { useCourses } from '../hooks/useCourses';
import { secondsToTime, getWeekday } from '../utils/timeUtils';

// Define tab constants for better readability
const TABS = {
  CLASSES: 'classes',
  COURSES: 'courses',
};

// Define tab display names
const TAB_LABELS = {
  [TABS.CLASSES]: 'My Classes',
  [TABS.COURSES]: 'My Courses',
};

export default function CoursesContainer() {
  const [activeTab, setActiveTab] = useState(TABS.CLASSES);
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
    resetState: resetClassDeleteState,
  } = useClassDelete();

  const {
    deleteCourse,
    isDeleting: isDeletingCourse,
    success: deleteCourseSuccess,
    resetState: resetCourseDeletionState,
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
      // Reset the success state after refreshing to prevent multiple refreshes
      resetClassDeleteState();
    }
  }, [deleteClassSuccess, refreshClasses, resetClassDeleteState]);

  // Refresh course data when a course is deleted successfully
  useEffect(() => {
    if (deleteCourseSuccess) {
      refreshCourses();
      // Reset the success state after refreshing to prevent multiple refreshes
      resetCourseDeletionState();
    }
  }, [deleteCourseSuccess, refreshCourses, resetCourseDeletionState]);

  // Refresh data when tab changes to ensure we have the latest data
  useEffect(() => {
    if (activeTab === TABS.CLASSES) {
      console.log('🔄 Tab changed to Classes, refreshing data');
      refreshClasses();
    } else if (activeTab === TABS.COURSES) {
      console.log('🔄 Tab changed to Courses, refreshing data');
      refreshCourses();
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
  };

  function handleAdd() {
    setEditData(null);
    setEditIndex(null);

    // If on Classes tab, switch to Courses tab before showing the form
    if (activeTab === TABS.CLASSES) {
      setActiveTab(TABS.COURSES);
    }

    setShowForm(true);
  }

  const handleDeleteClass = async (classId) => {
    if (!classId) {
      console.error('No class ID provided for deletion');
      return;
    }

    try {
      const result = await deleteClass(classId);

      if (!result.success && result.error) {
        // Show error message to user
        console.error('Error deleting class:', result.error);
        alert(`Failed to delete class: ${result.error}`);
      } else if (result.success) {
        console.log('Class deleted successfully');
        // The success state is already set in the hook, which will trigger the useEffect to refresh
      }
    } catch (err) {
      console.error('Exception during class deletion:', err);
      alert(`An error occurred: ${err.message}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      console.error('No course ID provided for deletion');
      return;
    }

    try {
      const result = await deleteCourse(courseId);

      if (!result.success && result.error) {
        // Show error message to user
        console.error('Error deleting course:', result.error);
        alert(`Failed to delete course: ${result.error}`);
      } else if (result.success) {
        console.log('Course deleted successfully');
        // The success state is already set in the hook, which will trigger the useEffect to refresh
      }
    } catch (err) {
      console.error('Exception during course deletion:', err);
      alert(`An error occurred: ${err.message}`);
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

        // Refresh classes to show the newly created classes
        console.log('🔄 Refreshing classes after course creation');
        await refreshClasses();

        // Switch to the Classes tab to show the newly created classes
        setActiveTab(TABS.CLASSES);
        console.log('🔄 Switched to Classes tab to show new classes');
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
        <TabsBar
          tabs={[
            { id: TABS.CLASSES, label: TAB_LABELS[TABS.CLASSES] },
            { id: TABS.COURSES, label: TAB_LABELS[TABS.COURSES] },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

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
            {activeTab === TABS.CLASSES && (
              <ClassesList
                schedule={schedule}
                handleDeleteClass={handleDeleteClass}
                isDeletingClass={isDeletingClass}
              />
            )}

            {activeTab === TABS.COURSES && (
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
