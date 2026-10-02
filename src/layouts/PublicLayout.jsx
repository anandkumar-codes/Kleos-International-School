import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';

export default function PublicLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) return void setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <Header />
      <main id="main" key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
