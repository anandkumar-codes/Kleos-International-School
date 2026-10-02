# Kleos International School — UX Structure & Information Architecture

## 1. Audiences & their first questions

| Audience | Arrives wanting to know | Primary path |
|---|---|---|
| Prospective parent | Is this a good school? What board? Fees/process? How do I apply? | Home → Academics / Facilities → Admissions → Enquiry form |
| Current parent | Attendance, homework, fees, circulars | Parent Login → Parent Portal |
| Student | Timetable, assignments, results | Student Login → Student Portal |
| School office / admin | Strength, attendance, admissions, fee collection, today's tasks | Admin Login → Admin Dashboard |
| Visitor / community | Location, contact, events | Contact, Events, Gallery |

## 2. Product map

```
PUBLIC WEBSITE (cream / serif identity)
├── Home
│   ├── Hero (campus image, tagline, Apply / Explore)
│   ├── Trust strip (CBSE · Grades · Ratio · Transport)
│   ├── About + animated stats
│   ├── Why Kleos (6 pillars — asymmetric bento, not a card grid)
│   ├── Academic programmes (stage rail: Pre-Primary → Senior Secondary)
│   ├── Campus & facilities (image mosaic with hover)
│   ├── Principal's message (editorial split layout)
│   ├── Events (date-led list) + News & announcements (ticker list)
│   ├── Gallery preview (masonry + lightbox)
│   ├── Testimonials (quote carousel)
│   ├── Admissions CTA band
│   └── Contact (map + enquiry form)
├── About ── overview, history timeline, vision/mission, values, leadership, achievements, affiliation, infrastructure
├── Academics ── curriculum, grade cards, subjects by stage, pedagogy, assessment, calendar, resources
├── Admissions ── 6-step process, eligibility, documents, fee guidance, FAQs, validated enquiry form
├── Campus Life
│   ├── Facilities ── alternating image/text feature sections
│   ├── Activities ── clubs, sports, arts, houses
│   ├── Faculty ── directory filtered by department
│   └── Gallery ── category chips, search, lightbox
├── Events ── upcoming / past tabs, month filter calendar strip, details modal
├── Contact ── channels, office timings, emergency, map, contact + admission forms
└── Login (Parent / Student / Admin tabs)

PARENT PORTAL (light, card-based, top-tab app — distinct from public site)
Dashboard · Child profile · Attendance · Homework · Results · Fees & receipts · Timetable
Announcements · Events · Leave requests · Messages

STUDENT PORTAL (same shell, student accent colour)
Dashboard · Timetable · Attendance · Assignments · Results · Subjects · Events · Announcements · Profile

ADMIN DASHBOARD (sidebar app, Ctrl+K search, notifications)
Overview: Dashboard
People:   Students · Parents · Teachers · Classes
Academic: Attendance · Examinations · Assignments
Office:   Admissions (kanban pipeline) · Fees
Website:  Website Content (CMS) · Events · Announcements · Gallery · Facilities · Faculty
Comms:    Messages · Notifications
Insight:  Reports (PDF / Excel / CSV)
System:   Settings
```

## 3. Data flow

All content lives in a single store (`src/services/store.jsx`) persisted to `localStorage`.
The CMS writes to the same store the public website reads from — editing the hero title,
an event or a gallery image in the admin is reflected on the public site immediately.
`src/data/school.js` holds the school's identity (name, address, phone, board) in one place.
`src/services/api.js` is the seam where a real backend would be connected later.

## 4. Design system

- **Type**: Fraunces (display serif — heritage, warmth) + Plus Jakarta Sans (UI/body).
- **Colour**: Kleos Green `#0b4d3a` (from the campus façade), Laurel Gold `#e8a53b`,
  Kleos Red `#c8323c` (logo red) for accent only; warm cream `#fbf8f1` canvas on the public site,
  cool neutral `#f4f6f5` canvas in dashboards.
- **Shape**: 14–24px radii on cards, pill buttons, soft layered shadows.
- **Motion**: 200–600ms ease-out; reveal-on-scroll, number counters, card lift. Honors `prefers-reduced-motion`.
- **Components**: Button, Badge, Card, Modal, Drawer, Tabs, DataTable (sort/search/paginate),
  Pagination, Field/Select/Textarea with validation, Dropdown, Toast, Alert, Breadcrumbs,
  EmptyState, Skeleton, StatCard, ChartCard, Avatar, SmartImage (graceful fallback).
