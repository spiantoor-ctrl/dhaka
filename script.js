// 3 dot menu
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');

menuBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

document.addEventListener('click', function() {
  dropdown.classList.remove('open');
});

// Add to cart button effect
const pbuyBtns = document.querySelectorAll('.pbuy');
pbuyBtns.forEach(btn => {
  btn.addEventListener('click', function(e) {
    // ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    this.textContent = '✓ Added';
    this.classList.add('added');
    setTimeout(() => {
      this.textContent = 'Add';
      this.classList.remove('added');
    }, 1500);
  });
});

// Scroll fade-in animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.pcard, .cat, .feat, .hero, .section-header').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
