const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdown');

menuBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

document.addEventListener('click', function() {
  dropdown.classList.remove('open');
});

const pbuyBtns = document.querySelectorAll('.pbuy');
pbuyBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    this.textContent = '✓ Added';
    this.style.background = '#1a1a1a';
    this.style.color = '#fff';
    this.style.borderColor = '#1a1a1a';
    setTimeout(() => {
      this.textContent = 'Add';
      this.style.background = '';
      this.style.color = '';
      this.style.borderColor = '';
    }, 1500);
  });
});
