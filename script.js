 // CURSOR
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateCursor() {
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        ring.style.width = '50px';
        ring.style.height = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.width = '36px';
        ring.style.height = '36px';
      });
    });

    // SYSTEM TIME
    const sysTime = document.getElementById('sysTime');
    function updateTime() {
      const now = new Date();
      sysTime.textContent = now.toTimeString().split(' ')[0];
    }
    setInterval(updateTime, 1000);
    updateTime();

    // SCROLL REVEAL
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate skill bars
          entry.target.querySelectorAll('.skill-fill').forEach(bar => {
            const w = bar.dataset.width;
            setTimeout(() => { bar.style.width = w + '%'; }, 200);
          });
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(r => observer.observe(r));

    // Also observe skill panel separately
    document.querySelectorAll('.skills-panel').forEach(panel => {
      const skillObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            panel.querySelectorAll('.skill-fill').forEach((bar, i) => {
              const w = bar.dataset.width;
              setTimeout(() => { bar.style.width = w + '%'; }, 300 + i * 100);
            });
          }
        });
      }, { threshold: 0.3 });
      skillObs.observe(panel);
    });

    // NAV ACTIVE
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
      });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--obsidian)' : '';
      });
    });
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const msg = document.getElementById('formMsg');
    const form = e.target;

    // Loading state
    btnText.textContent = 'TRANSMITTING...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', { // ← paste your ID here
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btnText.textContent = 'Message Sent';
        btn.style.background = 'var(--rust)';
        msg.style.display = 'block';
        msg.style.color = 'var(--rust)';
        msg.textContent = '✓ SIGNAL RECEIVED — I\'ll get back to you soon.';
        form.reset();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.opacity = '1';
      msg.style.display = 'block';
      msg.style.color = '#c0392b';
      msg.textContent = '✗ TRANSMISSION FAILED — Please try again.';
    }
  });