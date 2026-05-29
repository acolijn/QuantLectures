import { useEffect, useState } from 'react';
import {
  addCourseEditorByEmail,
  approvePendingTeacher,
  createCourse,
  createCourseInvite,
  fetchCourseMembers,
  fetchCourseInvites,
  fetchCourses,
  fetchPendingTeachers,
  redeemInviteCode,
  rejectPendingTeacher,
  removeCourseEditor,
  revokeCourseInvite,
  updateCourse,
} from '../lib/api';

export function useCourses(isTeacher) {
  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseMembersByCourse, setCourseMembersByCourse] = useState({});
  const [courseInvitesByCourse, setCourseInvitesByCourse] = useState({});
  const [pendingTeachers, setPendingTeachers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoadingCourses(true);

    fetchCourses()
      .then(records => {
        if (cancelled) return;
        setCourses(records);
        setCourseMembersByCourse({});
        setCourseInvitesByCourse({});
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

  async function refreshCourseInvites(courseId) {
    if (!courseId) return [];
    const invites = await fetchCourseInvites(courseId);
    setCourseInvitesByCourse(prev => ({ ...prev, [courseId]: invites }));
    return invites;
  }

  async function createInviteForCourse(courseId, payload) {
    const invite = await createCourseInvite(courseId, payload);
    setCourseInvitesByCourse(prev => ({
      ...prev,
      [courseId]: [invite, ...(prev[courseId] ?? [])],
    }));
    return invite;
  }

  async function revokeInviteForCourse(courseId, inviteId) {
    await revokeCourseInvite(inviteId);
    setCourseInvitesByCourse(prev => ({
      ...prev,
      [courseId]: (prev[courseId] ?? []).map(inv => (
        inv.id === inviteId ? { ...inv, active: false } : inv
      )),
    }));
  }

  async function redeemStudentInvite(code) {
    const courseId = await redeemInviteCode(code);
    const records = await fetchCourses();
    setCourses(records);
    setActiveCourseId(prev => {
      if (prev && records.some(c => c.id === prev)) return prev;
      return courseId ?? records[0]?.id ?? null;
    });
    return courseId;
  }

  async function refreshPendingTeachers() {
    const pending = await fetchPendingTeachers();
    setPendingTeachers(pending);
    return pending;
  }

  async function approveTeacher(userId) {
    await approvePendingTeacher(userId);
    setPendingTeachers(prev => prev.filter(user => user.id !== userId));
  }

  async function rejectTeacher(userId, mode) {
    await rejectPendingTeacher(userId, mode);
    setPendingTeachers(prev => prev.filter(user => user.id !== userId));
  }

  return {
    courses,
    activeCourseId,
    loadingCourses,
    courseMembersByCourse,
    courseInvitesByCourse,
    pendingTeachers,
    setActiveCourseId,
    createNewCourse,
    updateExistingCourse,
    refreshCourseMembers,
    addEditorToCourse,
    removeEditorFromCourse,
    refreshCourseInvites,
    createInviteForCourse,
    revokeInviteForCourse,
    redeemStudentInvite,
    refreshPendingTeachers,
    approveTeacher,
    rejectTeacher,
  };
}
