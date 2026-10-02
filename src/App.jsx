import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Academics from './pages/public/Academics';
import Admissions from './pages/public/Admissions';
import Facilities from './pages/public/Facilities';
import Activities from './pages/public/Activities';
import Faculty from './pages/public/Faculty';
import Events from './pages/public/Events';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import { Privacy, Terms, NotFound } from './pages/public/Misc';
import { RequireRole } from './services/auth';
import { LogoMark } from './components/ui';

// Portals and admin are code-split so the public site stays fast.
const PortalRoutes = lazy(() => import('./pages/portal/PortalRoutes'));
const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes'));

function AppLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--canvas)' }} role="status" aria-label="Loading">
      <div style={{ display: 'grid', justifyItems: 'center', gap: 16, animation: 'fadeIn .3s' }}>
        <LogoMark size={56} />
        <div style={{ width: 120, height: 3, borderRadius: 3, background: 'var(--line-cool)', overflow: 'hidden' }}>
          <div className="skeleton" style={{ height: '100%', background: 'linear-gradient(90deg,transparent,var(--green-600),transparent)', backgroundSize: '200px 100%' }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="academics" element={<Academics />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="campus" element={<Navigate to="/facilities" replace />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="activities" element={<Activities />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="portal/parent/*" element={<RequireRole role="parent"><PortalRoutes role="parent" /></RequireRole>} />
        <Route path="portal/student/*" element={<RequireRole role="student"><PortalRoutes role="student" /></RequireRole>} />
        <Route path="admin/*" element={<RequireRole role="admin"><AdminRoutes /></RequireRole>} />
      </Routes>
    </Suspense>
  );
}
