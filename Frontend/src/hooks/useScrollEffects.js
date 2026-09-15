import { useEffect } from 'react';

export function useScrollEffects() {
  useEffect(() => {
    const nav = document.querySelector('.navbar-brand-custom');
    function handleScroll() {
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll);
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);
}
