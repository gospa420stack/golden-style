const cursor = document.querySelector(".luxury-cursor");
  const ring = document.querySelector(".luxury-cursor-ring");

  let mouseX = 0;
  let mouseY = 0;

  let ringX = 0;
  let ringY = 0;

  let lastParticle = 0;

  /* ================================
     MOUSE MOVEMENT
  ================================= */

  document.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";

    createGoldParticle(mouseX, mouseY);

  });


  /* ================================
     SMOOTH OUTER RING
  ================================= */

  function animateRing() {

    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";

    requestAnimationFrame(animateRing);
  }

  animateRing();


  /* ================================
     GOLD PARTICLES
  ================================= */

  function createGoldParticle(x, y) {

    const now = Date.now();

    /* Prevent too many particles */
    if (now - lastParticle < 30) return;

    lastParticle = now;

    const particle = document.createElement("div");

    particle.className = "gold-particle";

    const size = Math.random() * 5 + 2;

    particle.style.width = size + "px";
    particle.style.height = size + "px";

    particle.style.left = x + "px";
    particle.style.top = y + "px";

    const moveX = (Math.random() - 0.5) * 45;
    const moveY = (Math.random() - 0.5) * 45;

    particle.style.setProperty("--moveX", moveX + "px");
    particle.style.setProperty("--moveY", moveY + "px");

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 900);


    /* Occasionally create a sparkle */

    if (Math.random() < 0.12) {

      const sparkle = document.createElement("div");

      sparkle.className = "gold-sparkle";
      sparkle.innerHTML = "✦";

      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";

      const sparkX = (Math.random() - 0.5) * 60;
      const sparkY = (Math.random() - 0.5) * 60;

      sparkle.style.setProperty("--sparkX", sparkX + "px");
      sparkle.style.setProperty("--sparkY", sparkY + "px");

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }
  }


  /* ================================
     HOVER EFFECT
  ================================= */

  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, .card, [role='button']"
  );

  interactiveElements.forEach((element) => {

    element.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      ring.classList.add("hover");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      ring.classList.remove("hover");
    });

  });