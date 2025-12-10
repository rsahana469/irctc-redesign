
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebarBackdrop") || document.querySelector(".sidebar-backdrop");
  const navLinks = document.querySelectorAll(".sidebar-link");

  function safeToggleSidebar(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!sidebar) return;
    sidebar.classList.toggle("open");
    if (backdrop) backdrop.classList.toggle("active");
  }

  if (menuToggle) {
    // click for desktop + many mobiles
    menuToggle.addEventListener("click", safeToggleSidebar);

    // touchstart for Android (non-passive so preventDefault works)
    menuToggle.addEventListener("touchstart", function(e) {
      e.preventDefault();
      safeToggleSidebar(e);
    }, { passive: false });

    // enhance accessibility: close with Escape
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        safeToggleSidebar();
      }
    });
  }

  // allow clicking the backdrop to close
  if (backdrop) {
    backdrop.addEventListener('click', safeToggleSidebar);
    backdrop.addEventListener('touchstart', function(e) {
      e.preventDefault();
      safeToggleSidebar(e);
    }, { passive: false });
  }

  // close sidebar when a nav link is tapped (mobile)
  if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (sidebar && sidebar.classList.contains('open')) safeToggleSidebar();
      });
      link.addEventListener('touchstart', function(e) {
        if (sidebar && sidebar.classList.contains('open')) {
          e.preventDefault();
          safeToggleSidebar();
          // navigate after small timeout so the toggle happens first
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            setTimeout(()=> window.location.hash = href, 120);
          }
        }
      }, { passive: false });
    });
  }

  // helpful debug tool: run window._debugElementAtMenuToggle() in console
  window._debugElementAtMenuToggle = function () {
    const el = document.getElementById('menuToggle');
    if (!el) return { error: 'no menuToggle found' };
    const r = el.getBoundingClientRect();
    const x = Math.round(r.left + r.width/2);
    const y = Math.round(r.top + r.height/2);
    return { x, y, topElement: document.elementFromPoint(x, y) };
  };
});
