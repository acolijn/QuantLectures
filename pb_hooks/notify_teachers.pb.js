/// <reference path="../pb_data/types.d.ts" />

// Teacher signups without a signup token land as role "pending" and wait for an
// admin to approve them in the Admin panel. Nobody looks at that panel unprompted,
// so these hooks send the two emails that keep the flow moving:
//
//   1. a new pending teacher  → every superuser gets a "please review" email
//   2. pending → teacher      → the teacher gets an "you're approved" email
//
// Mail goes through the SMTP settings in the PocketBase dashboard. A failed send is
// logged and swallowed: the signup or approval itself has already succeeded and must
// not be reported back to the user as an error.
//
// JSVM handlers run in isolated contexts and cannot see top-level helpers in this
// file, so each handler is self-contained.

onRecordAfterCreateSuccess((e) => {
  e.next();

  if (e.record.getString("role") !== "pending") return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[c]);

  try {
    const meta = e.app.settings().meta;
    const recipients = e.app.findAllRecords("_superusers")
      .map((su) => ({ address: su.email() }))
      .filter((r) => r.address);
    if (recipients.length === 0) return;

    const name = e.record.getString("name") || "(no name)";
    const email = e.record.email();

    e.app.newMailClient().send(new MailerMessage({
      from: { address: meta.senderAddress, name: meta.senderName },
      to: recipients,
      subject: `${meta.appName}: new teacher signup awaiting approval`,
      html:
        `<p><strong>${esc(name)}</strong> (${esc(email)}) signed up as a teacher ` +
        `and is waiting for approval.</p>` +
        `<p>Approve or reject them in the Admin panel: ` +
        `<a href="${meta.appURL}">${esc(meta.appURL)}</a></p>`,
    }));
  } catch (err) {
    e.app.logger().error("pending-teacher notification failed", "error", String(err));
  }
}, "users");

onRecordAfterUpdateSuccess((e) => {
  e.next();

  const before = e.record.original().getString("role");
  const after = e.record.getString("role");
  if (before !== "pending" || after !== "teacher") return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[c]);

  try {
    const meta = e.app.settings().meta;
    const name = e.record.getString("name");
    const greeting = name ? `Hi ${esc(name)},` : "Hi,";

    e.app.newMailClient().send(new MailerMessage({
      from: { address: meta.senderAddress, name: meta.senderName },
      to: [{ address: e.record.email() }],
      subject: `${meta.appName}: your teacher account is approved`,
      html:
        `<p>${greeting}</p>` +
        `<p>Your teacher account on ${esc(meta.appName)} has been approved. ` +
        `Sign in to create and edit courses.</p>` +
        `<p><a href="${meta.appURL}">${esc(meta.appURL)}</a></p>`,
    }));
  } catch (err) {
    e.app.logger().error("teacher approval email failed", "error", String(err));
  }
}, "users");
