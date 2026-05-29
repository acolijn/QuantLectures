import { useEffect, useState } from 'react';
import {
  addCourseEditorByEmail,
  createCourse,
  fetchCourseMembers,
  fetchCourses,
  removeCourseEditor,
  updateCourse,
} from '../lib/api';

export function useCourses(isTeacher) {
  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseMembersByCourse, setCourseMembersByCourse] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoadingCourses(true);

    fetchCourses()
      .then(records => {
        if (cancelled) return;
        setCourses(records);
        setCourseMembersByCourse({});
        setActiveCourseId(prev => {
          if (records.length === 0) return null;
          if (prev && records.some(c => c.id === prev)) return prev;
          return records[0].id;
        });
      })
      .catch(err => console.error('Failed to load courses:', err))
      .finally(() => {
        if (!cancelled) setLoadingCourses(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isTeacher]);

  async function createNewCourse(name) {
    const created = await createCourse({ name });
    setCourses(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name, 'nl')));
    setActiveCourseId(created.id);
    return created;
  }

  async function updateExistingCourse(courseId, updates) {
    const updated = await updateCourse(courseId, updates);
    setCourses(prev =>
      prev
        .map(course => (course.id === courseId ? updated : course))
        .sort((a, b) => a.name.localeCompare(b.name, 'nl'))
    );
    return updated;
  }

  async function refreshCourseMembers(courseId) {
    if (!courseId) return [];
    const members = await fetchCourseMembers(courseId);
    setCourseMembersByCourse(prev => ({ ...prev, [courseId]: members }));
    return members;
  }

  async function addEditorToCourse(courseId, email) {
    const added = await addCourseEditorByEmail(courseId, email);
    setCourseMembersByCourse(prev => {
      const existing = prev[courseId] ?? [];
      return { ...prev, [courseId]: [...existing, added] };
    });
    return added;
  }

  async function removeEditorFromCourse(courseId, memberId) {
    await removeCourseEditor(memberId);
    setCourseMembersByCourse(prev => ({
      ...prev,
      [courseId]: (prev[courseId] ?? []).filter(member => member.id !== memberId),
    }));
  }

  return {
    courses,
    activeCourseId,
    loadingCourses,
    courseMembersByCourse,
    setActiveCourseId,
    createNewCourse,
    updateExistingCourse,
    refreshCourseMembers,
    addEditorToCourse,
    removeEditorFromCourse,
  };
}
