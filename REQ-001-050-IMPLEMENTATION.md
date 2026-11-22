# Altius Chess Institute App — REQ-001 to REQ-050 Implementation Note

Excel source: `chess_academy_app_detailed_requirements_0_h64r.xlsx` (50 requirements).
Implemented in: `www/index.html` (now ~2,190 lines) + `www/realtime-sync.js` (sync layer).
Existing features kept: Admin/Student logins, 10 puzzles/day, schedule calendar, HR staff/courses,
Green-Gold theme, System/Dark/Light, 4 colour themes, Firebase/Firestore realtime sync (`altius/db`),
Capacitor APK via GitHub Actions (`com.altius.chessacademy`). No fake students, no fake contacts, no fees.
Data starts empty; admin adds all real data.

## New roles (REQ-040–044)
Login now has 4 tabs: **Student, Parent, Trainer, Admin**.
- **Admin** — full management (students, trainers, classes, allocations, records, academy data).
- **Trainer** — own login (admin creates it in HR → Trainer logins, with assigned students).
  Sees only assigned students; manages attendance, notes, homework, puzzles, assessments,
  tournaments, reports for them.
- **Student** — own data only: schedule, attendance, notes, homework, puzzles, feedback,
  assessments, ratings, reports.
- **Parent** — logs in with the child's Student ID + parent password (set by admin in the
  student form; blank = same as student password). Sees only the linked child; cannot
  submit homework or solve daily puzzles.
- Gating is enforced in code (`canSeeStudent` / `visibleStudents` / `canManageStudent`).

## Per-requirement implementation
| REQ | Where |
|---|---|
| 001 | Student form: name, student contact, parent/guardian + phone, DOB (age auto), joining date, assigned trainer, class plan, total classes allocated, Active/Inactive; search via Students list + History filters |
| 002 | Student Profile pane (admin + trainer "Open full profile"): allocation, attendance history, class notes, homework, puzzle performance, assessments, ratings, tournaments, progress reports |
| 003 | Classes pane → Schedule class: students (multi-select), trainer, date, start/end time, type, location |
| 004 | Student form "Total classes allocated" (+ course); profile shows allocated / completed / remaining |
| 005 | `classCounts()`: only status Completed counts; Cancelled / Rescheduled never count; class status button on each class |
| 006 | Attendance pane: pick class → Present / Absent / Late / Leave per student + remarks |
| 007 | Attendance history table (date, time, class, trainer, status, remarks) in profile + Attendance pane |
| 008 | `attendanceSummary()`: attended / missed / late / excused totals + attendance % |
| 009 | Reminders pane: in-app class reminders (date, time, trainer); admin sets minutes-before-class (default 60) |
| 010 | `classes[]` records (date, times, trainer, students, status) + calendar event mirror (`syncEventForClass`) |
| 011–015 | After-class workflow modal: topics, detailed notes, understanding (Independent / Needed hints / Needed repeated explanation), improvement areas, next-class focus |
| 016 | Homework: assign to one student — title, description, assigned/due dates, topic, material/link |
| 017 | Homework statuses Pending / In Progress / Submitted / Completed, with history |
| 018 | Student submits homework online (written answer, move sequence, comments) |
| 019 | Trainer review: feedback, request corrections, final status |
| 020 | Assigned Puzzles: trainer assigns from the daily puzzle bank (position, instructions, topic, due date) |
| 021 | Student "Play on board": interactive Staunton board, correct starting position, side to move |
| 022 | Move validation vs stored solution (`apzTap`); wrong moves rejected with attempt recorded |
| 023 | `puzzleAttempts[]`: student, puzzle, date, moves, attempt no., correctness, completion |
| 024 | `puzzlePerf()`: assigned / attempted / solved / incorrect + success % |
| 025 | Assessments: post-class check (question / task / position) |
| 026 | 1–5 rating + comment (1 Needs significant improvement … 5 Excellent) |
| 027 | 7 skill areas rated separately: Tactics, Calculation, Openings, Positional Play, Endgames, Practical Decision-Making, Time Management |
| 028 | Practical application in games (applied? + examples/observations) |
| 029 | Strengths / weaknesses / improvement targets, stored as dated records |
| 030 | Ratings: FIDE (Standard / Rapid / Blitz) with date + note |
| 031 | Ratings: Chess.com (Bullet / Blitz / Rapid / Daily) |
| 032 | Ratings: Lichess (Bullet / Blitz / Rapid / Classical) |
| 033 | Rating history + SVG progress graph, separate per source + time control, never combined |
| 034 | Tournaments: name, date, location/platform, format, time control, rounds |
| 035 | Tournament results: W/D/L, total score, final rank |
| 036 | Tournament game-review notes (mistakes, missed opportunities, strengths, class topics applied) |
| 037 | Weekly reports auto-generated from saved records (`buildWeeklySummary`) |
| 038 | Trainer reviews/edits the report (final summary/comments) before sharing |
| 039 | Reports shared only to the student + linked parent (student view shows Shared reports only) |
| 040 | Trainer interface: assigned students only, all teaching actions |
| 041 | Student interface: own schedule, attendance, notes, homework, puzzles, feedback, assessments, ratings, reports |
| 042 | Admin interface: students, trainers, classes, allocations, access, academy records |
| 043 | Parent interface: linked child's schedule, attendance, homework status, puzzle performance, reports |
| 044 | Role gating everywhere (`canSeeStudent`, `visibleStudents`); unauthorised records are not listed or editable |
| 045 | Reminders: new homework/puzzle + due-date reminders; trainer sees pending/overdue lists |
| 046 | All collections persist via Firestore `altius/db` + localStorage; history is append-only, never overwritten (`ensureCollections`) |
| 047 | History & Search: filter by student, date range, trainer, status, topic, record type + audit trail |
| 048 | After-class workflow modal completes attendance + notes + understanding + improvement + next focus in one place, linked to the same class/student |
| 049 | `reqFields()` validation: required fields checked before saving, clear "Please fill: …" message |
| 050 | `logAudit()` + `updatedAt`/`updatedBy` stamps on every edit; audit trail visible in History & Search |

## Notes / limits (honest)
- Reminders are **in-app** (Reminders pane + upcoming list), not phone push notifications —
  the static Capacitor app has no push-notification service configured.
- Ratings graphs are inline SVG line charts (no chart library), one source + time control at a time.
- All new data lives in the same Firestore document `altius/db` (1 MB doc limit, as before);
  `firestore.rules` needed no change.
- Not live-tested in a browser/APK here: inline JS + `realtime-sync.js` pass Node syntax checks,
  all render functions and pane IDs verified present. The user should test login (all 4 roles),
  one full after-class workflow, and one weekly report after pushing.

## Deploy (user pushes via Termux, as before)
Unzip `altius-institute-app-realtime-v3-req-001-050.zip`, copy the project into the
`altius-institute-app-realtime` repo folder, `git add .`, commit, `git push` — GitHub Actions
builds the debug APK (`altius-app-debug-apk`).

## Add Student button on Student Profile pane — 2026-11-22 (v3 fix)
- Add Student previously lived ONLY on the Students tab (`#addStudentBtn` → `studentModal(null)`).
- Now also on the Student Profile pane (`renderProfile`, admin-only): a green "+ Add student" button in the pane header (next to the student picker) when students exist, AND a big "+ Add student" button inside the "No students yet" empty state. Both reuse the same `studentModal(null)` form — no duplicated form logic. Logo cache fix (`icon.png?v=20261122`) and all 50 requirements untouched.

## Board fix — 2026-11-22 (v3, same zip)
- Root cause: the puzzle `.board` had `aspect-ratio:1` on the container but its 64 `.sq` cells had NO aspect-ratio and the grid had NO `grid-template-rows` — row heights were content-driven, so squares stretched into rectangles on phones. Fixed: `.board` + `.mini-board` now use `grid-template-rows:repeat(8,1fr)` and every `.sq`/`.mini-board i` has `aspect-ratio:1`, so all 64 squares are perfect, equal squares at any phone width.
- Pieces: real Staunton SVGs (`www/pieces/*.svg`) at 90% of the square on puzzle boards, 92% on the home board, with a stronger drop shadow. No Unicode glyph is used on any board.
- Touch (Daily Puzzles + assigned puzzles): tap a piece → it lifts/scales with a gold glow, its square highlights, pseudo-legal destination squares glow (green dots, red ring on capturable pieces), a gold ripple + ✦ sparkle plays on the tapped square; tap a destination → the piece slides there (direction-aware `pieceSlide` animation). Wrong move → red flash + shake, message shown, try again (selection clears after 0.5s).
- Home animated board: the logged-out home hero board now auto-plays Scholar's Mate (e4 e5 Bc4 Nc6 Qh5 Nf6 Qxf7#) on a loop, one move every ~2.2s, with a caption showing the move ("▶ Auto-play demo · 4. Qxf7# — Checkmate!"). Demo only — no puzzle scores or student data touched. It pauses when the home view is hidden, the tab is hidden, or the user is logged in (so it never runs while a puzzle is open); disabled entirely under prefers-reduced-motion.
