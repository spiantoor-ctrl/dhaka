// ========== PRODUCT DATA ==========
const products = [
  { id:'shirt',  emoji:'👔', tag:"MEN'S",    name:'Classic Formal Shirt', price:1200, desc:'Premium quality formal shirt perfect for office and events. Soft breathable fabric.' },
  { id:'dress',  emoji:'👗', tag:"WOMEN'S",  name:'Summer Dress',         price:1800, desc:'Beautiful summer dress, lightweight and comfortable. Perfect for casual and semi-formal occasions.' },
  { id:'jacket', emoji:'🧥', tag:'UNISEX',   name:'Winter Jacket',        price:3500, desc:'Warm and stylish winter jacket. Water resistant with a smooth inner lining.' },
  { id:'jeans',  emoji:'👖', tag:"MEN'S",    name:'Slim Fit Jeans',       price:2200, desc:'Classic slim fit jeans in premium denim. Versatile for casual and smart-casual wear.' }
];

// Payment accounts (seller sets these from sell form — for demo using defaults)
const paymentAccounts = {
  bkash:  { number: '01704310629', name: 'SPI ANTOOR' },
  nagad:  { number: '01704310629', name: 'SPI ANTOOR' },
  rocket: { number: '01704310629', name: 'SPI ANTOOR' }
};

let cart = [];
let currentProduct = null;
let currentPayMethod = null;
let pageHistory = ['home'];

// ========== PAGE NAVIGATION ==========
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);

  // track history
  if (pageHistory[pageHistory.length-1] !== id) pageHistory.push(id);

  // back button: show on all except home
  const backBtn = document.getElementById('backBtn');
  const menuWrap = document.getElementById('menuWrap');
  if (id === 'home') {
    backBtn.style.display = 'none';
    menuWrap.style.display = 'block';
  } else {
    backBtn.style.display = 'flex';
    menuWrap.style.display = 'none';
  }

  initFadeIn();
  if (id === 'buy') renderProducts();
  if (id === 'cart') renderCart();
}

function goBack() {
  pageHistory.pop(); // remove current
  const prev = pageHistory[pageHistory.length-1] || 'home';
  pageHistory.pop(); // remove prev so showPage re-adds it
  showPage(prev);
}

// ========== 3 DOT MENU ==========
document.getElementById('menuBtn').addEventListener('click', function(e) {
  e.stopPropagation();
  document.getElementById('dropdown').classList.toggle('open');
});
document.addEventListener('click', function() {
  document.getElementById('dropdown').classList.remove('open');
});

// ========== SEARCH ==========
function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 100);
}
function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}
// Close search on ESC
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeSearch(); });

function doSearch(val) {
  const res = document.getElementById('searchResults');
  if (!val.trim()) { res.innerHTML = ''; return; }
  const filtered = products.filter(p => p.name.toLowerCase().includes(val.toLowerCase()) || p.tag.toLowerCase().includes(val.toLowerCase()));
  if (!filtered.length) { res.innerHTML = '<p style="text-align:center;color:#aaa;padding:20px;">No results found</p>'; return; }
  res.innerHTML = filtered.map(p => `
    <div class="search-result-item" onclick="closeSearch(); showProductDetail('${p.id}')">
      <div class="sr-emoji" style="background:#f9f9f7;">${p.emoji}</div>
      <div class="sr-info"><p>${p.name}</p><small>${p.tag} &nbsp;•&nbsp; ৳ ${p.price.toLocaleString()}</small></div>
    </div>
  `).join('');
}

// ========== PRODUCTS ==========
function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => `
    <div class="pcard fade-in" onclick="showProductDetail('${p.id}')">
      <div class="pimg" style="background:#f9f9f7;">${p.emoji}</div>
      <div class="pinfo">
        <div class="ptag">${p.tag}</div>
        <div class="pname">${p.name}</div>
        <div class="prow">
          <span class="pprice">৳ ${p.price.toLocaleString()}</span>
          <button class="pbuy">View</button>
        </div>
      </div>
    </div>
  `).join('');
  initFadeIn();
}

function showProductDetail(id) {
  currentProduct = products.find(p => p.id === id);
  document.getElementById('productImg').textContent = currentProduct.emoji;
  document.getElementById('productTag').textContent = currentProduct.tag;
  document.getElementById('productName').textContent = currentProduct.name;
  document.getElementById('productDesc').textContent = currentProduct.desc;
  document.getElementById('productPrice').textContent = '৳ ' + currentProduct.price.toLocaleString();
  showPage('product');
}

// ========== CART ==========
function addToCart() {
  if (!currentProduct) return;
  const existing = cart.find(c => c.id === currentProduct.id);
  if (existing) { existing.qty++; } else { cart.push({...currentProduct, qty:1}); }
  updateCartBadge();
  const btn = document.getElementById('addToCartBtn');
  btn.innerHTML = '<i class="ti ti-check"></i> Added!';
  btn.style.background = '#25D366';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.innerHTML = '<i class="ti ti-shopping-cart"></i> Add to Cart';
    btn.style.background = '';
    btn.style.color = '';
  }, 1500);
}

function updateCartBadge() {
  const total = cart.reduce((s,c) => s+c.qty, 0);
  const dot = document.getElementById('cartDot');
  const count = document.getElementById('cartCount');
  if (total > 0) { dot.style.display='block'; count.style.display='block'; count.textContent=total; }
  else { dot.style.display='none'; count.style.display='none'; }
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const subtitle = document.getElementById('cartSubtitle');
  if (!cart.length) {
    container.innerHTML = '<div class="empty-cart"><i class="ti ti-shopping-cart"></i><p>Your cart is empty</p></div>';
    footer.style.display = 'none';
    subtitle.textContent = '0 items';
    return;
  }
  subtitle.textContent = cart.reduce((s,c)=>s+c.qty,0) + ' items';
  container.innerHTML = cart.map((c,i) => `
    <div class="cart-item">
      <div class="cart-emoji">${c.emoji}</div>
      <div class="cart-info"><p>${c.name}</p><small>${c.tag} &nbsp;•&nbsp; Qty: ${c.qty}</small></div>
      <div class="cart-item-price">৳ ${(c.price*c.qty).toLocaleString()}</div>
      <button class="cart-remove" onclick="removeFromCart(${i})"><i class="ti ti-x"></i></button>
    </div>
  `).join('');
  const total = cart.reduce((s,c)=>s+(c.price*c.qty),0);
  document.getElementById('cartTotal').textContent = '৳ ' + total.toLocaleString();
  footer.style.display = 'block';
}

function removeFromCart(i) {
  cart.splice(i,1);
  updateCartBadge();
  renderCart();
}

function checkoutCart() {
  currentProduct = { name: cart.map(c=>c.name).join(', '), price: cart.reduce((s,c)=>s+(c.price*c.qty),0) };
  showPage('payment');
}

// ========== BUY FLOW ==========
function startBuy() {
  showPage('payment');
}

function selectPayment(method) {
  currentPayMethod = method;
  if (method === 'cod') { showPage('cod'); return; }
  const acc = paymentAccounts[method];
  const titles = { bkash:'bKash Payment', nagad:'Nagad Payment', rocket:'Rocket Payment' };
  const colors = { bkash:'#E2136E', nagad:'#F4821F', rocket:'#8B1A8D' };
  document.getElementById('transTitle').textContent = titles[method];
  document.getElementById('accountBox').innerHTML = `
    <div class="pay-method" style="color:${colors[method]}">${method.toUpperCase()}</div>
    <div class="account-num">${acc.number}</div>
    <div class="account-name">${acc.name}</div>
  `;
  document.getElementById('transStep1').textContent = 'Open your ' + method.charAt(0).toUpperCase()+method.slice(1) + ' app';
  document.getElementById('transAmount').textContent = '৳ ' + (currentProduct ? (typeof currentProduct.price === 'number' ? currentProduct.price.toLocaleString() : currentProduct.price) : '0');
  showPage('transaction');
}

document.getElementById('transUploadBox').addEventListener('click', function() {
  document.getElementById('transPhoto').click();
});

function handleTransPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('transPreviewImg').src = e.target.result;
    document.getElementById('transUploadBox').style.display = 'none';
    document.getElementById('transPhotoPreview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function submitOrder() {
  const txid = document.getElementById('transId').value.trim();
  if (!txid) { alert('Please enter your Transaction ID'); return; }
  const pname = currentProduct ? currentProduct.name : 'Product';
  const price = currentProduct ? (typeof currentProduct.price === 'number' ? '৳ '+currentProduct.price.toLocaleString() : currentProduct.price) : '';
  document.getElementById('successMsg').textContent = 'Your order has been sent to the seller. Transaction ID: ' + txid;
  document.getElementById('successProduct').innerHTML = '<strong>' + pname + '</strong><br>' + price + '<br><span style="color:#25D366;font-weight:600;">✓ Payment via ' + currentPayMethod + '</span>';
  cart = []; updateCartBadge();
  showPage('success');
}

function submitCOD() {
  const name = document.getElementById('codName').value.trim();
  const phone = document.getElementById('codPhone').value.trim();
  const address = document.getElementById('codAddress').value.trim();
  if (!name || !phone || !address) { alert('Please fill all fields'); return; }
  const pname = currentProduct ? currentProduct.name : 'Product';
  document.getElementById('successMsg').textContent = 'Your Cash on Delivery order is confirmed! We will contact you at ' + phone;
  document.getElementById('successProduct').innerHTML = '<strong>' + pname + '</strong><br><span style="color:#27ae60;font-weight:600;">✓ Cash on Delivery</span><br>Delivery to: ' + address;
  cart = []; updateCartBadge();
  showPage('success');
}

// ========== SELL FORM ==========
function nextSellStep(n) {
  document.querySelectorAll('.sell-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step'+n).classList.add('active');
  if (n === 3) updateSellPreview();
}

document.getElementById('sellUploadBox').addEventListener('click', function() {
  document.getElementById('sellPhoto').click();
});

function handleSellPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('sellPreviewImg').src = e.target.result;
    document.getElementById('sellUploadBox').style.display = 'none';
    document.getElementById('sellPhotoPreview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function updateSellPreview() {
  const name = document.getElementById('sellName').value || 'Product Name';
  const cat = document.getElementById('sellCat').value;
  const price = document.getElementById('sellPrice').value || '0';
  const desc = document.getElementById('sellDesc').value;
  const previewSrc = document.getElementById('sellPreviewImg').src;
  let imgHtml = '<div style="font-size:40px;text-align:center;padding:16px;">📷</div>';
  if (previewSrc && previewSrc !== window.location.href) imgHtml = '<img src="'+previewSrc+'" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;margin-bottom:10px;">';
  document.getElementById('sellPreviewCard').innerHTML = imgHtml + '<div class="ptag">'+cat.toUpperCase()+'</div><div class="pname">'+name+'</div><div class="pprice">৳ '+price+'</div><p style="font-size:12px;color:#666;margin-top:6px;">'+desc+'</p>';
}

function submitSell() {
  const name = document.getElementById('sellName').value.trim();
  const sellerName = document.getElementById('sellerName').value.trim();
  const sellerPhone = document.getElementById('sellerPhone').value.trim();
  if (!name || !sellerName || !sellerPhone) { alert('Please fill required fields'); return; }
  // Update payment accounts with seller's numbers
  const bkash = document.getElementById('sellerBkash').value.trim();
  const nagad = document.getElementById('sellerNagad').value.trim();
  const rocket = document.getElementById('sellerRocket').value.trim();
  if (bkash) { paymentAccounts.bkash.number = bkash; paymentAccounts.bkash.name = sellerName; }
  if (nagad) { paymentAccounts.nagad.number = nagad; paymentAccounts.nagad.name = sellerName; }
  if (rocket) { paymentAccounts.rocket.number = rocket; paymentAccounts.rocket.name = sellerName; }
  // Add product to list
  const newP = {
    id: 'sell_'+Date.now(),
    emoji: '🛍️',
    tag: document.getElementById('sellCat').value.toUpperCase(),
    name: name,
    price: parseInt(document.getElementById('sellPrice').value) || 0,
    desc: document.getElementById('sellDesc').value
  };
  const previewSrc = document.getElementById('sellPreviewImg').src;
  if (previewSrc && previewSrc !== window.location.href) newP.imgSrc = previewSrc;
  products.push(newP);
  alert('✓ Product listed successfully! It is now visible in the Buy section.');
  showPage('buy');
}

// ========== FADE IN ==========
function initFadeIn() {
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
    }, {threshold:0.1});
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
  }, 50);
}

// Init
renderProducts();
