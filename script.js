// Page navigation
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  initFadeIn();
}

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

// Product data
const products = {
  shirt:  { emoji: '👔', tag: "MEN'S", name: 'Classic Formal Shirt', price: '৳ 1,200', desc: 'A premium quality formal shirt perfect for office and events. Made with soft breathable fabric.' },
  dress:  { emoji: '👗', tag: "WOMEN'S", name: 'Summer Dress', price: '৳ 1,800', desc: 'Beautiful summer dress, lightweight and comfortable. Perfect for casual and semi-formal occasions.' },
  jacket: { emoji: '🧥', tag: 'UNISEX', name: 'Winter Jacket', price: '৳ 3,500', desc: 'Warm and stylish winter jacket. Water resistant with a smooth inner lining.' },
  jeans:  { emoji: '👖', tag: "MEN'S", name: 'Slim Fit Jeans', price: '৳ 2,200', desc: 'Classic slim fit jeans in premium denim. Versatile for casual and smart-casual wear.' }
};

function showProduct(id) {
  const p = products[id];
  document.getElementById('productImg').textContent = p.emoji;
  document.getElementById('productTag').textContent = p.tag;
  document.getElementById('productName').textContent = p.name;
  document.getElementById('productDesc').textContent = p.desc;
  document.getElementById('productPrice').textContent = p.price;
  const msg = encodeURIComponent('Hi SPI ANTOOR! I want to order: ' + p.name + ' (' + p.price + ')');
  document.getElementById('productWhatsapp').href = 'https://wa.me/8801704310629?text=' + msg;
  document.getElementById('productGmail').href = 'mailto:spiantoor@gmail.com?subject=Order: ' + p.name + '&body=Hi, I want to order ' + p.name + ' at ' + p.price;
  showPage('product');
}

// Scroll fade-in
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.pcard, .feat, .about-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}
initFadeIn();

// Sell form steps
function nextStep(n) {
  document.querySelectorAll('.sell-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + n).classList.add('active');
  if (n === 3) updateConfirm();
}

function handlePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('uploadBox').style.display = 'none';
    document.getElementById('photoPreview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

document.getElementById('uploadBox').addEventListener('click', function() {
  document.getElementById('photoInput').click();
});

function updateConfirm() {
  const name = document.getElementById('prodName').value || 'Product Name';
  const cat = document.getElementById('prodCat').value;
  const price = document.getElementById('prodPrice').value || '0';
  const desc = document.getElementById('prodDesc').value;
  const previewSrc = document.getElementById('previewImg').src;

  document.getElementById('confirmName').textContent = name;
  document.getElementById('confirmCat').textContent = cat.toUpperCase();
  document.getElementById('confirmPrice').textContent = '৳ ' + price;
  document.getElementById('confirmDesc').textContent = desc;

  if (previewSrc && previewSrc !== window.location.href) {
    document.getElementById('confirmImg').innerHTML = '<img src="' + previewSrc + '" style="width:100%; max-height:180px; object-fit:cover; border-radius:10px;">';
  }

  const msg = encodeURIComponent('Hi! I want to sell:\nProduct: ' + name + '\nCategory: ' + cat + '\nPrice: ৳' + price + '\nDetails: ' + desc);
  document.getElementById('submitWhatsapp').href = 'https://wa.me/8801704310629?text=' + msg;
}

function resetForm() {
  document.getElementById('prodName').value = '';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodDesc').value = '';
  document.getElementById('uploadBox').style.display = 'block';
  document.getElementById('photoPreview').style.display = 'none';
}
