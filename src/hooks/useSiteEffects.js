import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useSiteEffects = () => {
  const location = useLocation();

  useEffect(() => {
    // ---------- Animated number counter ----------
    function animateCounter(el) {
      const target  = parseFloat(el.dataset.count || 0);
      const suffix  = el.dataset.suffix || "";
      const dur     = 1400;
      const start   = performance.now();

      function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function formatNum(v) {
        if (!Number.isInteger(target)) return v.toFixed(1);
        const rounded = Math.round(v);
        return rounded >= 1000 ? rounded.toLocaleString() : String(rounded);
      }

      function frame(now) {
        const progress = Math.min((now - start) / dur, 1);
        const value = target * easeOut(progress);
        el.textContent = formatNum(value) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = formatNum(target) + suffix;
      }

      requestAnimationFrame(frame);
    }

    // ---------- Scroll fade-in ----------
    const fadeEls = document.querySelectorAll(".fade-up, .fade-left, .fade-right");
    const processGrids = document.querySelectorAll(".process-grid");
    const statEls = document.querySelectorAll("[data-count]");

    if (!("IntersectionObserver" in window)) {
      fadeEls.forEach((e) => e.classList.add("in"));
      processGrids.forEach((g) => g.classList.add("line-in"));
      statEls.forEach((e) => animateCounter(e));
    } else {
      const fadeIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              fadeIO.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      fadeEls.forEach((e) => fadeIO.observe(e));

      const lineIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("line-in");
              lineIO.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      processGrids.forEach((g) => lineIO.observe(g));

      const counterIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              animateCounter(e.target);
              counterIO.unobserve(e.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      statEls.forEach((e) => counterIO.observe(e));

      // MutationObserver to catch dynamically added elements
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const nodesToObserve = node.querySelectorAll(".fade-up, .fade-left, .fade-right");
              nodesToObserve.forEach((n) => fadeIO.observe(n));
              if (node.matches(".fade-up, .fade-left, .fade-right")) fadeIO.observe(node);
              
              const linesToObserve = node.querySelectorAll(".process-grid");
              linesToObserve.forEach((l) => lineIO.observe(l));
              if (node.matches(".process-grid")) lineIO.observe(node);

              const countersToObserve = node.querySelectorAll("[data-count]");
              countersToObserve.forEach((c) => counterIO.observe(c));
              if (node.matches("[data-count]")) counterIO.observe(node);
            }
          });
        });
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });
      window._mutationObserver = mutationObserver;
    }

    // ---------- Parallax ----------
    const collage = document.querySelector(".collage");
    let parallaxCells = [];
    if (collage) {
      parallaxCells = collage.querySelectorAll(".ph");
    }
    const speeds = [0.04, -0.06, 0.05, -0.04, 0.06, -0.03, 0.05];

    function updateParallax() {
      if (!collage) return;
      const rect   = collage.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      parallaxCells.forEach((cell, i) => {
        const py = center * (speeds[i] || 0.04);
        cell.style.setProperty("--py", py + "px");
      });
    }

    window.addEventListener("scroll", updateParallax, { passive: true });
    updateParallax();

    // ---------- Arkin entrance ----------
    const img = document.querySelector(".arkin-hero-img");
    if (img) {
      img.style.opacity = "0";
      img.style.transform = "translateY(40px)";
      img.style.transition = "opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)";
      setTimeout(() => {
        img.style.opacity = "1";
        img.style.transform = "translateY(0)";
        setTimeout(() => {
          img.style.transition = "";
          img.style.transform = "";
        }, 950);
      }, 300);
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("scroll", updateParallax);
      if (window._mutationObserver) {
        window._mutationObserver.disconnect();
        delete window._mutationObserver;
      }
    };
  }, [location.pathname]);
};

export default useSiteEffects;
