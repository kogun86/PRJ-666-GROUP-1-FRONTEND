import React, { useState, useEffect } from 'react';
import Modal from '../../../componentShared/Modal';
import { LoadingAnimation } from '../../animations';
import TabsBar from '../../../componentShared/TabsBar';
import CourseForm from './CourseForm';
import ClassesList from './ClassesList';
import CoursesList from './CoursesList';
import { useCourseSubmit, useClassDelete, useCourseDeletion } from '../';
import { useCourses } from '../hooks/useCourses';
import { secondsToTime, getWeekday, weekdayToIndex, convertToSeconds } from '../utils/timeUtils';
import { Auth } from '../../../features/auth/lib/amplifyClient';

const TABS = {
  CLASSES: 'classes',
  COURSES: 'courses',
};

const TAB_LABELS = {
  [TABS.CLASSES]: 'My Classes',
  [TABS.COURSES]: 'My Courses',
};

export default function CoursesContainer() {
  const [activeTab, setActiveTab] = useState(TABS.CLASSES);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const { myCourses, schedule, isLoading, refreshCourses, refreshClasses, addCourse } =
    useCourses();
  const {
    submitCourse,
    isSubmitting,
    success: submitSuccess,
    error: submitError,
    resetState: resetSubmitState,
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

  useEffect(() => {
    if (submitSuccess) {
      setShowForm(false);
      setEditData(null);
      setEditIndex(null);
    }
  }, [submitSuccess]);

  useEffect(() => {
    if (deleteClassSuccess) {
      refreshClasses();
      resetClassDeleteState();
    }
  }, [deleteClassSuccess, refreshClasses, resetClassDeleteState]);

  useEffect(() => {
    if (deleteCourseSuccess) {
      refreshCourses();
      resetCourseDeletionState();
    }
  }, [deleteCourseSuccess, refreshCourses, resetCourseDeletionState]);

  useEffect(() => {
    if (activeTab === TABS.CLASSES) {
      refreshClasses();
    } else {
      refreshCourses();
    }
  }, [activeTab, refreshClasses, refreshCourses]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setEditIndex(null);
    setShowForm(true);
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass(classId);
    } catch (err) {
      alert(`Error deleting class: ${err.message}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
    } catch (err) {
      alert(`Error deleting course: ${err.message}`);
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

    const payload = {
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
          weekday: typeof s.weekday === 'number' ? s.weekday : weekdayToIndex(s.weekday),
          startTime: typeof s.startTime === 'string' ? convertToSeconds(s.startTime) : s.startTime,
          endTime: typeof s.endTime === 'string' ? convertToSeconds(s.endTime) : s.endTime,
        })),
      },
      schedule: data.schedule.map((s) => ({
        classType: s.classType || 'lecture',
        weekday: typeof s.weekday === 'number' ? s.weekday : weekdayToIndex(s.weekday),
        startTime: typeof s.startTime === 'string' ? convertToSeconds(s.startTime) : s.startTime,
        endTime: typeof s.endTime === 'string' ? convertToSeconds(s.endTime) : s.endTime,
        location: s.location || 'TBD',
      })),
    };

    try {
      if (editData) {
        // —— EDIT MODE ——
        const API_BASE = process.env.NEXT_PUBLIC_API_URL;
        let headers;
        if (process.env.NODE_ENV === 'development') {
          headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-id-token',
          };
        } else {
          const user = await Auth.getCurrentUser();
          if (!user?.authorizationHeaders) {
            throw new Error('Not authenticated');
          }
          headers = user.authorizationHeaders();
        }

        const res = await fetch(`${API_BASE}/v1/courses/${editData._id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Update failed: ${res.status}`);
        }

        await refreshCourses();
        await refreshClasses();
        setShowForm(false);
        setEditData(null);
        setEditIndex(null);
        return;
      }

      const result = await submitCourse(payload);
      if (result.success) {
        const created = result.course;
        addCourse({
          _id: result.courseId || created._id,
          title: created.title,
          code: created.code,
          section: created.section,
          professor: created.instructor.name,
          color: created.color,
          grade: 0,
          schedule: created.schedule.map((s) => ({
            time:
              typeof s.startTime === 'number'
                ? `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`
                : `${s.startTime}–${s.endTime}`,
            weekDay: getWeekday(s.weekday),
          })),
        });
        await refreshClasses();
        setActiveTab(TABS.CLASSES);
      } else {
        throw new Error(result.errors?.join(', ') || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to save course: ${err.message}`);
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

        {!showForm && activeTab === TABS.COURSES && (
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
