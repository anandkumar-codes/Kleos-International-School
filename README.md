# Kleos International School — Website, Portals & Admin

A complete digital presence for **Kleos International School** (CBSE, Miyapur, Hyderabad):
public website, parent portal, student portal and a school administration dashboard with a
built-in CMS. Built with React 19, Vite, React Router and Recharts.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Demo logins

| Portal  | Username       | Password   | Opens            |
|---------|----------------|------------|------------------|
| Parent  | `parent@kleos` | `kleos123` | `/portal/parent` |
| Student | `KIS-sahithi`  | `kleos123` | `/portal/student`|
| Staff   | `admin@kleos`  | `admin123` | `/admin`         |

The login page has a **Fill** button that enters the demo credentials. In the admin,
press **Ctrl + K** for global search.

## Mobile app

The `mobile/` folder contains the Kleos School app for Android and iOS (Expo / React Native), with visitor,
parent, student and staff experiences. It reuses this website's data files. See [mobile/README.md](mobile/README.md)
to run it on a phone with Expo Go or build an APK.

## What's included

- **Public website**: Home, About (with a history timeline), Academics, Admissions (validated enquiry form),
  Facilities, Activities, Faculty (filter by department), Events (upcoming/past + month filter),
  Gallery (categories, search, lightbox), Contact (map), Privacy, Terms, 404.
- **Parent portal**: dashboard, student profile, attendance calendar, homework, results, fees with
  online payment and receipts, timetable, announcements, events, leave requests, and messages to the class teacher.
- **Student portal**: dashboard, timetable, attendance, assignments, results, subjects, events,
  announcements, profile.
- **Admin dashboard**: analytics, Students (add/edit/delete/profile), Parents, Teachers, Classes,
  Attendance (marking + charts), Examinations (marks entry + report cards), Assignments,
  Admissions (drag-and-drop pipeline), Fees (record payment, receipts, reminders), Website CMS,
  Messages, Notifications, Reports (PDF / Excel / CSV), Settings.

Changes made in the CMS (hero, about, principal, events, announcements, gallery, faculty visibility,
facilities) appear on the public website straight away.

## Before showing this to the school, replace these

All school identity details are in **`src/data/school.js`**. Items marked `// confirm` there are placeholders:

- CBSE affiliation number, school code and founding year (shown as 2014)
- Email addresses (`info@` / `admissions@kleosschool.in`) and the emergency number
- Principal and leadership names, fee amounts, and statistics (12+ years, results, medals) in `src/data/content.js`
- **Photos**: the site uses Unsplash stock images. Swap in real photos of the campus (for example the
  building and classroom photos from the Google Maps listing) through Admin → Website Content, or by changing `IMG` in `school.js`.

## Architecture

```
src/
  components/ui        design-system components (Button, Modal, DataTable, Tabs, Toast…)
  components/public    website header, footer, sections, forms
  components/admin     admin page primitives (PageHead, Kpi, Panel)
  components/charts    chart wrappers using a validated, colour-blind-safe palette
  layouts/             PublicLayout, AdminLayout (sidebar, Ctrl+K search, notifications)
  pages/public|portal|admin
  services/            store (state + persistence), auth, api (backend seam), analytics
  data/                school identity, website content, sample-record generator
  hooks/  utils/  styles/
```

Data is stored in the browser (`localStorage`) for the demo. `src/services/api.js` and
`src/services/store.jsx` are where you'd plug in a real backend. Admin → Settings → **Reset demo data**
restores the original sample data.

See `docs/INFORMATION-ARCHITECTURE.md` for the UX structure and design system.
