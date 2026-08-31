import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll position to the top whenever the route changes. React Router doesn't
// do this automatically for SPA navigation (only real page loads reset scroll), so
// without this, clicking a link while scrolled down on one page leaves you scrolled
// down on the next page too — e.g. landing on the footer instead of the top.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  // Browsers have their own automatic scroll-restoration behavior that can silently
  // fight with a manual scrollTo() call. Disabling it hands full control to this
  // component — this is the most common reason this exact pattern fails.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}