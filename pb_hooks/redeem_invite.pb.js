/// <reference path="../pb_data/types.d.ts" />

// Redeeming an invite code cannot be done from the client: finding an invite by its
// code requires list access to course_invites, and any rule permissive enough to
// allow that would let a student enumerate every code in the system. So redemption
// runs here, server-side, with the code as the only thing the caller needs to know.
//
// Responds with { courseId } on success, or { reason } with a 4xx status. `reason`
// is a stable key the frontend maps to a translated message.

routerAdd("POST", "/api/redeem-invite", (e) => {
  const auth = e.auth;
  if (!auth) {
    return e.json(401, { reason: "not_authenticated" });
  }

  const role = auth.getString("role");
  if (role === "teacher" || role === "admin") {
    // Teachers get access through course_members, and fetchCourses() resolves their
    // courses from memberships only — an enrollment row would be invisible to them.
    return e.json(400, { reason: "staff_cannot_redeem" });
  }

  const body = new DynamicModel({ code: "" });
  e.bindBody(body);

  const code = String(body.code || "").trim().toUpperCase();
  if (!code) {
    return e.json(400, { reason: "empty_code" });
  }

  let invite;
  try {
    invite = $app.findFirstRecordByFilter(
      "course_invites",
      "code = {:code} && active = true",
      { code: code }
    );
  } catch (err) {
    return e.json(404, { reason: "unknown_code" });
  }

  const expiresAt = invite.getString("expires_at");
  if (expiresAt) {
    const ts = Date.parse(expiresAt.replace(" ", "T"));
    if (!isNaN(ts) && Date.now() > ts) {
      return e.json(400, { reason: "expired" });
    }
  }

  const maxUses = invite.getInt("max_uses");
  const usedCount = invite.getInt("used_count");
  if (maxUses > 0 && usedCount >= maxUses) {
    return e.json(400, { reason: "exhausted" });
  }

  const courseId = invite.getString("course_id");

  const existing = $app.findRecordsByFilter(
    "course_enrollments",
    "course_id = {:course} && user_id = {:user}",
    "",
    1,
    0,
    { course: courseId, user: auth.id }
  );
  if (existing.length > 0) {
    return e.json(400, { reason: "already_enrolled" });
  }

  $app.runInTransaction((txApp) => {
    const collection = txApp.findCollectionByNameOrId("course_enrollments");
    const enrollment = new Record(collection);
    enrollment.set("course_id", courseId);
    enrollment.set("user_id", auth.id);
    enrollment.set("invite_id", invite.id);
    txApp.save(enrollment);

    invite.set("used_count", usedCount + 1);
    txApp.save(invite);
  });

  return e.json(200, { courseId: courseId });
});
