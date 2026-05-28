import { useEffect, useState } from 'react';
import { createCourse, fetchCourses, updateCourse } from '../lib/api';

export function useCourses(isTeacher) {
  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingCourses(true);

    fetchCourses()
      .then(records => {
        if (cancelled) return;
        setCourses(records);
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

  return {
    courses,
    activeCourseId,
    loadingCourses,
    setActiveCourseId,
    createNewCourse,
    updateExistingCourse,
  };
}
