/* Altius Institute App — Real-time sync (Firebase Firestore, free Spark plan)
   How it works:
   - Same HTML/CSS/JS app, no UI change.
   - Data (admin, students, staff, courses, events, settings) is kept in DB as before.
   - Every 3 seconds, if DB changed, it is saved to localStorage AND to Firestore doc altius/db.
   - Firestore onSnapshot listens live: admin phone lo change chesthe, student phone lo
     instant ga update avthundi, page reload cheyyakunda.
   - Firebase keys lekapothe: Offline mode — data localStorage lo save avthundi,
     aa phone lone untundi, vere phone ki sync avvadu. App matram work avthundi.
   - Firestore doc is ONE document, so institute data 1 MB lopu undali — small institute ki saripothundi.
*/
(function () {
  var LS_KEY = "altius_db_v2";
  var lastSaved = "";
  var fbReady = false;
  var docRef = null;

  function dbJson() { try { return JSON.stringify(DB); } catch (e) { return ""; } }
  function saveLocal() { try { localStorage.setItem(LS_KEY, dbJson()); } catch (e) {} }
  function loadLocal() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      if (!d || typeof d !== "object") return false;
      if (d.admin !== undefined) DB.admin = d.admin;
      if (Array.isArray(d.students)) DB.students = d.students;
      if (Array.isArray(d.staff)) DB.staff = d.staff;
      if (Array.isArray(d.courses)) DB.courses = d.courses;
      if (Array.isArray(d.events)) DB.events = d.events;
      if (d.settings && typeof d.settings === "object") DB.settings = d.settings;
      return true;
    } catch (e) { return false; }
  }
  function rerender() {
    try {
      if (typeof session !== "undefined" && session) {
        if (session.role === "admin" && typeof renderAdmin === "function") renderAdmin();
        else if (session.role === "student" && typeof renderStudent === "function") renderStudent();
      }
      if (typeof renderCalendars === "function") renderCalendars();
      if (typeof renderContact === "function") renderContact();
    } catch (e) {}
  }
  function applyRemote(data) {
    if (!data) return;
    var clean = {
      admin: data.admin || null,
      students: data.students || [],
      staff: data.staff || [],
      courses: data.courses || [],
      events: data.events || [],
      settings: data.settings || { phone: "", email: "", address: "" }
    };
    var j = JSON.stringify(clean);
    if (j === lastSaved || j === dbJson()) return;
    DB.admin = clean.admin;
    DB.students = clean.students;
    DB.staff = clean.staff;
    DB.courses = clean.courses;
    DB.events = clean.events;
    DB.settings = clean.settings;
    lastSaved = dbJson();
    saveLocal();
    rerender();
  }
  function saveNow() {
    var j = dbJson();
    if (!j || j === lastSaved) return;
    lastSaved = j;
    saveLocal();
    if (fbReady && docRef) {
      var payload = {
        admin: DB.admin,
        students: DB.students,
        staff: DB.staff,
        courses: DB.courses,
        events: DB.events,
        settings: DB.settings,
        _updatedAt: Date.now()
      };
      docRef.set(payload).catch(function (e) { console.warn("Firestore save failed", e); });
    }
  }

  // 1) Load phone-local data first, so reload ayina data pothundi ane old bug fix avthundi.
  loadLocal();
  lastSaved = dbJson();
  window.ALTIUS_SAVE_NOW = saveNow;

  // 2) Firebase init, if real keys are pasted.
  try {
    var cfg = window.FIREBASE_CONFIG || null;
    var valid = cfg && cfg.apiKey && cfg.apiKey.indexOf("PASTE") !== 0 &&
      cfg.projectId && cfg.projectId.indexOf("PASTE") !== 0 &&
      typeof window.firebase !== "undefined";
    if (valid) {
      firebase.initializeApp(cfg);
      var fb = firebase.firestore();
      docRef = fb.collection("altius").doc("db");
      fbReady = true;
      window.ALTIUS_REALTIME = { mode: "firebase", ready: true };
      docRef.onSnapshot(function (snap) {
        if (!snap.exists) return;
        var d = snap.data();
        if (d) applyRemote(d);
      }, function (err) { console.warn("Firestore listen failed", err); });
    } else {
      window.ALTIUS_REALTIME = { mode: "local", ready: false };
    }
  } catch (e) {
    window.ALTIUS_REALTIME = { mode: "local", ready: false };
  }

  // 3) Autosave + save on hide.
  setInterval(saveNow, 3000);
  window.addEventListener("pagehide", saveNow);
  document.addEventListener("visibilitychange", function () { if (document.hidden) saveNow(); });

  setTimeout(function () {
    try {
      if (fbReady) toast("Real-time ON — admin change student ki instant ga kanipisthundi");
      else toast("Offline mode — Firebase keys pettaka real-time ON avthundi");
    } catch (e) {}
  }, 800);
})();
