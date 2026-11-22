# Altius Institute App — Real-time version (Firebase + Play Store)

Guruvu garu, idi indhaka share chesina Altius Institute App ne, real-time ga marchina version.
Language: HTML + CSS + JavaScript (single app, www/index.html).
Real-time DB: Google Firebase Firestore — free Spark plan.
Android: Capacitor — free, www folder ni Android app ga wrap chesthundi.

## Architecture — okka chota
- Frontend: www/index.html (admin + student login, students/marks, HR, courses, schedule calendar, 10 puzzles/day)
- Real-time sync: www/realtime-sync.js
  - DB change ayithe 3 sec lopu localStorage + Firestore doc `altius/db` lo save avthundi
  - Firestore onSnapshot valla admin phone lo change, student phone lo instant ga kanipisthundi
  - Firebase keys lekapothe Offline mode: data aa phone lone save avthundi, app work avthundi, sync avvadu
- Package: com.altius.chessacademy, App name: Altius Institute, Version: 2.0.0

## Free cloud options — endhuku Firebase?
1. **Firebase Firestore (idi — recommended):** Google di, free Spark plan, real-time, 1 GB storage, roju ~50k reads / 20k writes free. Small institute (<100 students) ki saripothundi. Play Store app ki best.
2. **Supabase:** Free kuda, Postgres + real-time, auth strong. Setup konchem ekkuva, ee folder lo Firebase place lo Supabase client pettali — kavali ante cheppandi, marchistha.
3. **Muse web version:** Data Muse server lo free ga save avthundi, kani Play Store ki velladu, Google link raadu.
4. **Google Sheets:** Vaddu — real-time kadu, passwords ki safe kadu.

## Step 1 — Firebase free project (meeru cheyyali, 10 min)
1. console.firebase.google.com open cheyyandi, mee Google account tho login avvandi
2. Add project > name: Altius Institute > Google Analytics OFF chesina parledhu > Create
3. Build > Firestore Database > Create database > Start in test mode > location: asia-south1 (India) > Enable
4. Project Settings (gear icon) > Your apps > Web app (</>) > nickname: altius-web > Register
5. Vachina apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId — www/firebase-config.js lo PASTE_YOUR_... place lo paste cheyyandi
6. Firestore Database > Rules tab > firestore.rules file lo unna rules paste chesi Publish cheyyandi

Test: www/index.html ni browser lo open cheyyandi. Admin account create cheyyandi, vere phone/browser lo student login tho chudandi — admin change instant ga kanipinchali. Lekapothe "Offline mode" toast vasthundi, ante keys sariga padaledhu ani artham.

## Step 2 — Google link (Firebase Hosting, free)
Computer lo Node.js 20+ undali.
```
npm install -g firebase-tools
firebase login
firebase init hosting  (public folder: www ani ivvandi, single-page app: Yes)
firebase deploy --only hosting,firestore:rules
```
Link vasthundi: https://<mee-project-id>.web.app — adi Google link, evariki aina share cheyyochu.

## Step 3 — Play Store AAB (meeru cheyyali, Android Studio kavali)
```
cd altius-institute-app-realtime
npm install
npx cap add android
npx cap sync android
npx cap open android
```
Android Studio lo:
- Build > Generate Signed App Bundle / APK > Android App Bundle (AAB) > Create new keystore (password gurthu pettukondi, pothhe update cheyyaleru) > release build
- AAB file vasthundi: android/app/build/outputs/bundle/release/app-release.aab

## Step 4 — Play Console (meeru cheyyali, $25 one-time)
1. play.google.com/console — Google account tho Developer account create cheyyandi, $25 one-time fee (Gobi mee account tho cheyyaledu, payment + identity verification meeve)
2. Create app > name: Altius Institute, package: com.altius.chessacademy, category: Education, free app
3. App content: Privacy Policy (app lo student data collect chestham ani oka simple page/link kavali), Content rating, Target audience, Data safety form fill cheyyandi
4. Screenshots (phone 2-8), app icon 512x512, feature graphic 1024x500 — app nunchi teesukondi
5. Release > Production > AAB upload cheyyandi > Review ki pampandi (usually 1-3 days)
6. Publish ayyaka Play Store link vasthundi — adi share cheyyandi. Ade Google link.

## Important — security
- Ee version lo student/admin passwords Firestore lo plain ga save avthayi (v1 testing rules). Real students tho live ki velle mundhu Firebase Auth add chesi, rules ni admin-only write ga marchali.
- Admin password ni vere chota vadina password ga pettoddu.
- Firestore doc okate (altius/db) — data 1 MB lopu undali. Students 100+ ayithe collections ga marchali, appudu cheppandi.

## Files
- www/index.html — app motham
- www/firebase-config.js — mee Firebase keys (idi matrame marchali)
- www/realtime-sync.js — real-time sync logic
- capacitor.config.json, package.json — Android wrapper
- firestore.rules, firebase.json — Firebase rules + hosting

## FREE APK — billing/card akkarledhu (important)
Screenshot lo chupinchina page Google Cloud free trial billing page — adi Firebase ki AVASARAM LEDHU.
Card add cheyyakandi, aa page close cheyyandi.

Firebase Spark plan free, card akkarledhu:
- console.firebase.google.com ki vellandi (console.cloud.google.com/freetrial ki kadu)
- Mee project Altius-chess-academy already create ayyindi, danine open cheyyandi
- Build > Firestore Database > Create database > Test mode — idi Spark (free) lone untundi, Upgrade to Blaze ani adigithe No ani vadileyandi

Free ga APK teesukune 2 ways (card/billing ledhu):
1. GitHub Actions (best, free): ee folder lo .github/workflows/build-apk.yml undi.
   GitHub lo repo create chesi files upload cheyyandi > Actions > Build APK > Run workflow > Artifacts lo app-debug.apk download cheyyandi.
2. PWABuilder (pwabuilder.com, free): Firebase Hosting link paste chesi Android package download cheyyandi.
3. Android Studio (free, PC lo): npm install > npx cap add android > npx cap sync > Build APK — card akkarledhu.

Play Store lo publish cheyyali ante matrame $25 one-time Play Console fee untundi. APK test cheyyadaniki adi akkarledhu.

## App icon — updated 2026-11-21
- Logo: mee ichina Altius Chess Academy gold logo, transparent background.
- www/icon.png / assets/icon.png — transparent 512x512, app lo top bar + favicon lo vaduthundi.
- assets/play-store-icon-512.png — opaque green background version, Play Store ki idi vadandi (Play Store transparent icon accept cheyyadu).
- Capacitor Android icon kosam: npx @capacitor/assets generate --iconBackgroundColor '#175c36' --iconForegroundColor '#ffffff' (assets/icon.png nunchi generate avthundi).

## GitHub Actions fail ayithe — fix 2026-11-21
Workflow 11-16 sec lo fail ayithe, karanam setup-node cache npm — package-lock lekunda cache fail avthundi.
Fix: workflow lo cache teesesanu, package-lock.json repo lo add chesanu.
Malli push chesaka Actions lo green tick ravali. Inka fail ayithe, aa run ni tap chesi error line screenshot pampandi.

## GitHub Actions fail — Java 21 fix 2026-11-22
Error: `invalid source release: 21`, Task `:capacitor-android:compileDebugJavaWithJavac FAILED`
Fix: workflow lo Java 17 ni Java 21 ga marchanu. Capacitor 7 ki JDK 21 kavali.

## App icon fix — 2026-11-22
Paatha APK lo default Capacitor blue X icon vachindi, endukante cap sync alone
icon generate cheyyadu. Fix: @capacitor/assets generate step workflow lo
add chesanu, assets/icon.png + assets/splash.png nunchi launcher icons
generate avthayi. Test chesanu — local ga assets generate success, ic_launcher.png vachindi.
Mundu install chesina app ni uninstall chesi, kotta APK install cheyyandi.

## Mobile fit + realistic pieces — 2026-11-22
- Top bar status bar kinda vastundi, brand + Log in/Join buttons overflow ayyi
  page antha wide ayyindi. Fix: safe-area padding, topbar wrap, mobile lo
  brand subtitle hide, Log in hide (Join matrame), hero font/padding tagginchadam,
  overflow-x hidden.
- Chess pieces: chinna Unicode glyphs badulu real Staunton SVG pieces
  (Cburnett, public domain) www/pieces/ lo — hero board + puzzle board renditlo
  peddaga (88% of square), shadow tho kanipisthayi.

## Light + colourful + cute interface — 2026-11-22
- App dark ga undakudadhu: phone dark mode lo unna kuda app Light lone
  open avthundi. Dark kavali ante matrame top bar 🌙 button / Settings >
  Theme lo Dark pick cheyyandi. Default = Light.
- Calendar colourful: today = pink-gold gradient + ✨, weekend = lavender-pink,
  selected = green gradient, class chips pink / purple / orange / blue
  colours lo rotate avthayi, day hover lo lift avthundi.
- Cute polish: cards hover lift, stat cards pastel (green / gold / pink / blue),
  hero pink-gold-green gradient, pane/tab change lo side-slide transition,
  dashboard lo left/right swipe tho tab maruthundi, side menu free ga
  sideways scroll avthundi.

## New app icon — 2026-11-22
- Paatha gold circular logo vaddu ani user chepparu — kotta icon generate
  chesanu: golden chess knight (horse) front-facing, cute/friendly, gold
  laurel wreath, deep emerald green background — Altius Chess Academy
  name ki match avthundi, green + gold app colours.
- www/icon.png / assets/icon.png / assets/play-store-icon-512.png —
  kotta icon, 512x512. Old gold logo backup: assets/icon-previous-gold-logo.png
- Top bar lo kuda kotta icon ne vasthundi. @capacitor/assets generate
  step valla launcher icon kuda kotta icon tho vasthundi.

## Final app icon — selected 2026-11-22 (Cinematic 3)
- User selected: Cinematic 3 — 3D pieces gradient.
- 3D golden Knight, King, Pawn on teal-magenta-gold gradient, text
  "Altius" + "CHESS INSTITUTE" — colourful, cinematic.
- www/icon.png / assets/icon.png / assets/play-store-icon-512.png —
  ee icon ne. Old icons backup: assets/icon-previous-gold-logo.png
  (gold circular logo), assets/icon-options/ lo anni options unnayi.

## Theme — phone settings tho link (2026-11-22)
- Default theme ippudu System: app phone settings (dark/light) tho
  link ayyi untundi — phone dark mode lo unte app dark, light lo unte
  app light. Phone settings marchithe app kuda live ga marthundi.
- Topbar 🌙 button / Settings > Theme lo Light / Dark / System ga
  marchukovachu; choice ee phone lo matrame save avthundi.

## Students mobile cards + colourful themes (2026-11-22)
- Students page phone lo ippudu cards ga kanipisthundi (table kaadhu):
  prathi student card lo avatar, stage, course, coach, average,
  puzzle points, plus pedda "Edit details" and "Delete" buttons —
  sideways scroll cheyyalsina pani ledu.
- Desktop lo table lo "Actions" column sticky ga untundi — Edit/Delete
  eppudu kanipisthayi.
- Colour themes (4): Emerald Green-Gold (default), Royal Purple,
  Ocean Blue, Sunset Pink — topbar 🎨 button tho cycle cheyyachu,
  leda Settings > Colour theme lo swatch tap cheyyachu. Light/Dark/
  System mode tho kalisi panichesthundi.
- Effects: cards slide-in (stagger), buttons press scale, card hover lift.

## New logo — 2026-11-22 (user-supplied)
- User gave a new logo: navy/gold King with two Knights on a chessboard,
  gold laurel wreath, "ALTIUS / CHESS INSTITUTE" text, cream background.
- www/icon.png / assets/icon.png — 512x512, emblem only (King + Knights +
  board + laurel, no text) so it still reads at 40px top-bar / launcher size.
- www/icon-192.png — 192x192, same emblem.
- assets/play-store-icon-512.png — 512x512, FULL logo with text, opaque
  cream background #FEF7E4 (Play Store rejects transparent icons).
- assets/icon-1024.png — 1024x1024, full logo.
- assets/splash.png — 2732x2732, full logo centred on cream.
- Workflow icon/splash background colour changed green #175c36 -> cream
  #FEF7E4 to match the new logo (no green ring around the icon).
- Cinematic 3 icon backed up, NOT deleted:
  workspace/your_files/altius-icon-options/cinematic-3-selected-icon-512.png,
  cinematic-3-selected-icon-1024.png, cinematic-3-selected-splash-2732.png
- Top bar + favicon already use icon.png, so they pick up the new logo
  automatically — no code change needed.

## Logo fix — 2026-11-22 (v3, top-bar still showed old icon)
- www/icon.png / assets/icon.png are the NEW navy/gold emblem (King + 2 Knights, cream bg, no text) — verified by md5 + visual check.
- Root cause of the stale top-bar: the old Cinematic 3 file was never in the new build — the phone's WebView served the cached old `icon.png` on an update-install, because the top-bar loaded plain `icon.png` with no cache-buster.
- Fix: top-bar + favicon now load `icon.png?v=20261122`, so the new emblem is always fetched fresh. Workflow now deletes stale `mipmap-*` before `@capacitor/assets generate` and fails the build if the APK asset icon does not match www/icon.png.
- User must UNINSTALL the old app first, then install the new APK — an update-install can keep the old launcher icon cached by Android as well.
