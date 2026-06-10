const products = [
  {id:'shirt', emoji:'👔', tag:"MEN'S", name:'Classic Formal Shirt', price:1200, desc:'Premium quality formal shirt perfect for office and events. Soft breathable fabric.'},
  {id:'dress', emoji:'👗', tag:"WOMEN'S", name:'Summer Dress', price:1800, desc:'Beautiful summer dress, lightweight and comfortable. Perfect for casual and semi-formal occasions.'},
  {id:'jacket', emoji:'🧥', tag:'UNISEX', name:'Winter Jacket', price:3500, desc:'Warm and stylish winter jacket. Water resistant with a smooth inner lining.'},
  {id:'jeans', emoji:'👖', tag:"MEN'S", name:'Slim Fit Jeans', price:2200, desc:'Classic slim fit jeans in premium denim. Versatile for casual and smart-casual wear.'}
];

const payAccounts = {
  bkash:  {number:'01704310629', name:'SPI ANTOOR'},
  nagad:  {number:'01704310629', name:'SPI ANTOOR'},
  rocket: {number:'01704310629', name:'SPI ANTOOR'}
};

let cart = [];
let currentProduct = null;
let currentPayMethod = null;
let pageHistory = ['home'];

// ===== PAGE NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  pg.classList.add('active');
  window.scrollTo(0,0);
  if (pageHistory[pageHistory.length-1] !== id) pageHistory.push(id);

  const backBtn = document.getElementById('backBtn');
  const menuWrap = document.getElementById('menuWrap');
  if (id === 'home') {
    backBtn.style.display = 'none';
    menuWrap.style.display = 'block';
  } else {
    backBtn.style.display = 'flex';
    menuWrap.style.display = 'none';
  }

  document.getElementById('dropdown').classList.remove('open');
  if (id === 'buy') renderProducts();
  if (id === 'cart') renderCart();
  initReveal();
}

function goBack() {
  pageHistory.pop();
  const prev = pageHistory[pageHistory.length-1] || 'home';
  pageHistory.pop();
  showPage(prev);
}

// ===== MENU =====
document.getElementById('menuBtn').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('dropdown').classList.toggle('open');
});
document.addEventListener('click', () => document.getElementById('dropdown').classList.remove('open'));

// ===== SEARCH =====
function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 100);
}
function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}
document.addEventListener('keydown', e => { if(e.key==='Escape') closeSearch(); });

function doSearch(val) {
  const res = document.getElementById('searchResults');
  if (!val.trim()) { res.innerHTML=''; return; }
  const found = products.filter(p => p.name.toLowerCase().includes(val.toLowerCase()) || p.tag.toLowerCase().includes(val.toLowerCase()));
  if (!found.length) { res.innerHTML='<p style="text-align:center;color:#aaa;padding:20px;">No results found</p>'; return; }
  res.innerHTML = found.map(p => `
    <div class="search-result-item" onclick="closeSearch();showProductDetail('${p.id}')">
      <div class="sr-emoji">${p.imgSrc ? `<img src="${p.imgSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">` : p.emoji}</div>
      <div class="sr-info"><p>${p.name}</p><small>${p.tag} • ৳ ${p.price.toLocaleString()}</small></div>
    </div>`).join('');
}

// ===== PRODUCTS =====
function renderProducts() {
  document.getElementById('productGrid').innerHTML = products.map(p => `
    <div class="pcard" onclick="showProductDetail('${p.id}')">
      <div class="pimg" style="background:#f9f9f7;">${p.imgSrc ? `<img src="${p.imgSrc}">` : p.emoji}</div>
      <div class="pinfo">
        <div class="ptag">${p.tag}</div>
        <div class="pname">${p.name}</div>
        <div class="prow"><span class="pprice">৳ ${p.price.toLocaleString()}</span><button class="pbuy">View</button></div>
      </div>
    </div>`).join('');
  initReveal();
}

function showProductDetail(id) {
  currentProduct = products.find(p => p.id === id);
  const imgEl = document.getElementById('productImg');
  imgEl.innerHTML = currentProduct.imgSrc ? `<img src="${currentProduct.imgSrc}">` : currentProduct.emoji;
  document.getElementById('productTag').textContent = currentProduct.tag;
  document.getElementById('productName').textContent = currentProduct.name;
  document.getElementById('productDesc').textContent = currentProduct.desc;
  document.getElementById('productPrice').textContent = '৳ ' + currentProduct.price.toLocaleString();
  const btn = document.getElementById('addToCartBtn');
  btn.innerHTML = '<i class="ti ti-shopping-cart"></i> Add to Cart';
  btn.style.background = '';
  btn.style.color = '';
  showPage('product');
}

// ===== CART =====
function addToCart() {
  if (!currentProduct) return;
  const ex = cart.find(c => c.id === currentProduct.id);
  if (ex) ex.qty++; else cart.push({...currentProduct, qty:1});
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
  const total = cart.reduce((s,c)=>s+c.qty,0);
  const el = document.getElementById('cartCount');
  el.style.display = total ? 'block' : 'none';
  el.textContent = total;
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  document.getElementById('cartSubtitle').textContent = cart.reduce((s,c)=>s+c.qty,0) + ' items';
  if (!cart.length) {
    container.innerHTML = '<div class="empty-cart"><i class="ti ti-shopping-cart"></i><p>Your cart is empty</p></div>';
    footer.style.display = 'none'; return;
  }
  container.innerHTML = cart.map((c,i) => `
    <div class="cart-item">
      <div class="cart-emoji">${c.imgSrc ? `<img src="${c.imgSrc}">` : c.emoji}</div>
      <div class="cart-info"><p>${c.name}</p><small>${c.tag} • Qty: ${c.qty}</small></div>
      <div class="cart-item-price">৳ ${(c.price*c.qty).toLocaleString()}</div>
      <button class="cart-remove" onclick="removeFromCart(${i})"><i class="ti ti-x"></i></button>
    </div>`).join('');
  document.getElementById('cartTotal').textContent = '৳ ' + cart.reduce((s,c)=>s+(c.price*c.qty),0).toLocaleString();
  footer.style.display = 'block';
}

function removeFromCart(i) { cart.splice(i,1); updateCartBadge(); renderCart(); }

function checkoutCart() {
  currentProduct = {name: cart.map(c=>c.name).join(', '), price: cart.reduce((s,c)=>s+(c.price*c.qty),0)};
  showPage('payment');
}

// ===== BUY FLOW =====
function startBuy() { showPage('payment'); }

function selectPayment(method) {
  currentPayMethod = method;
  if (method === 'cod') { showPage('cod'); return; }
  const acc = payAccounts[method];
  const colors = {bkash:'#E2136E', nagad:'#F4821F', rocket:'#8B1A8D'};
  const titles = {bkash:'bKash Payment', nagad:'Nagad Payment', rocket:'Rocket Payment'};
  document.getElementById('transTitle').textContent = titles[method];
  document.getElementById('accountBox').innerHTML = `
    <div class="pay-method" style="color:${colors[method]}">${method.toUpperCase()}</div>
    <div class="account-num">${acc.number}</div>
    <div class="account-name">${acc.name}</div>`;
  document.getElementById('transStep1').textContent = 'Open your ' + method.charAt(0).toUpperCase()+method.slice(1) + ' app';
  document.getElementById('transAmount').textContent = '৳ ' + (typeof currentProduct?.price === 'number' ? currentProduct.price.toLocaleString() : currentProduct?.price || '0');
  document.getElementById('transId').value = '';
  document.getElementById('transUploadBox').style.display = 'block';
  document.getElementById('transPhotoPreview').style.display = 'none';
  showPage('transaction');
}

document.getElementById('transUploadBox').addEventListener('click', () => document.getElementById('transPhoto').click());
function handleTransPhoto(input) {
  const r = new FileReader();
  r.onload = e => {
    document.getElementById('transPreviewImg').src = e.target.result;
    document.getElementById('transUploadBox').style.display = 'none';
    document.getElementById('transPhotoPreview').style.display = 'block';
  };
  r.readAsDataURL(input.files[0]);
}

function submitOrder() {
  const txid = document.getElementById('transId').value.trim();
  if (!txid) { shakeInput('transId'); return; }
  const pname = currentProduct?.name || 'Product';
  const price = typeof currentProduct?.price === 'number' ? '৳ '+currentProduct.price.toLocaleString() : '';
  document.getElementById('successMsg').textContent = 'Your order has been sent! Transaction ID: ' + txid;
  document.getElementById('successProduct').innerHTML = `<strong>${pname}</strong><br>${price}<br><span style="color:#25D366;font-weight:600;">✓ Payment via ${currentPayMethod}</span>`;
  cart = []; updateCartBadge();
  showPage('success');
}

function submitCOD() {
  const name = document.getElementById('codName').value.trim();
  const phone = document.getElementById('codPhone').value.trim();
  const addr = document.getElementById('codAddress').value.trim();
  if (!name) { shakeInput('codName'); return; }
  if (!phone) { shakeInput('codPhone'); return; }
  if (!addr) { shakeInput('codAddress'); return; }
  document.getElementById('successMsg').textContent = 'Cash on Delivery confirmed! We will contact you at ' + phone;
  document.getElementById('successProduct').innerHTML = `<strong>${currentProduct?.name||'Product'}</strong><br><span style="color:#27ae60;font-weight:600;">✓ Cash on Delivery</span><br>Delivery to: ${addr}`;
  cart = []; updateCartBadge();
  showPage('success');
}

// ===== SELL FORM with validation =====
let sellPhotoData = null;

function sellNext(fromStep) {
  // validate current step before going next
  if (fromStep === 1) {
    if (!sellPhotoData) { alert('Please upload a product photo first!'); return; }
    sellGoTo(2);
  } else if (fromStep === 2) {
    const name = document.getElementById('sellName').value.trim();
    const price = document.getElementById('sellPrice').value.trim();
    const sName = document.getElementById('sellerName').value.trim();
    const sPhone = document.getElementById('sellerPhone').value.trim();
    if (!name) { shakeInput('sellName'); return; }
    if (!price) { shakeInput('sellPrice'); return; }
    if (!sName) { shakeInput('sellerName'); return; }
    if (!sPhone) { shakeInput('sellerPhone'); return; }
    updateSellPreview();
    sellGoTo(3);
  }
}

function sellGoTo(n) {
  document.querySelectorAll('.sell-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step'+n).classList.add('active');
  window.scrollTo(0,0);
}

document.getElementById('sellUploadBox').addEventListener('click', () => document.getElementById('sellPhoto').click());
function handleSellPhoto(input) {
  const r = new FileReader();
  r.onload = e => {
    sellPhotoData = e.target.result;
    document.getElementById('sellPreviewImg').src = sellPhotoData;
    document.getElementById('sellUploadBox').style.display = 'none';
    document.getElementById('sellPhotoPreview').style.display = 'block';
  };
  r.readAsDataURL(input.files[0]);
}

function updateSellPreview() {
  const name = document.getElementById('sellName').value || 'Product Name';
  const cat = document.getElementById('sellCat').value;
  const price = document.getElementById('sellPrice').value || '0';
  const desc = document.getElementById('sellDesc').value;
  const imgHtml = sellPhotoData ? `<img src="${sellPhotoData}" style="width:100%;max-height:150px;object-fit:cover;border-radius:8px;margin-bottom:10px;">` : '<div style="font-size:36px;text-align:center;padding:12px;">📷</div>';
  document.getElementById('sellPreviewCard').innerHTML = imgHtml + `<div class="ptag">${cat.toUpperCase()}</div><div class="pname">${name}</div><div class="pprice">৳ ${price}</div>${desc ? `<p style="font-size:12px;color:#666;margin-top:6px;">${desc}</p>` : ''}`;
}

function submitSell() {
  const bkash = document.getElementById('sellerBkash').value.trim();
  const nagad = document.getElementById('sellerNagad').value.trim();
  const rocket = document.getElementById('sellerRocket').value.trim();
  if (!bkash && !nagad && !rocket) { alert('Please enter at least one payment number!'); return; }
  const sName = document.getElementById('sellerName').value.trim();
  if (bkash) { payAccounts.bkash.number = bkash; payAccounts.bkash.name = sName; }
  if (nagad) { payAccounts.nagad.number = nagad; payAccounts.nagad.name = sName; }
  if (rocket) { payAccounts.rocket.number = rocket; payAccounts.rocket.name = sName; }
  products.push({
    id: 'sell_'+Date.now(),
    emoji: '🛍️',
    imgSrc: sellPhotoData,
    tag: document.getElementById('sellCat').value.toUpperCase(),
    name: document.getElementById('sellName').value,
    price: parseInt(document.getElementById('sellPrice').value)||0,
    desc: document.getElementById('sellDesc').value
  });
  // reset form
  sellPhotoData = null;
  document.getElementById('sellUploadBox').style.display = 'block';
  document.getElementById('sellPhotoPreview').style.display = 'none';
  ['sellName','sellPrice','sellDesc','sellerName','sellerPhone','sellerEmail','sellerBkash','sellerNagad','sellerRocket'].forEach(id => document.getElementById(id).value='');
  sellGoTo(1);
  alert('✓ Product listed! Now visible in Buy section.');
  showPage('buy');
}

// ===== SHAKE ANIMATION for validation =====
function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#e74c3c';
  el.style.animation = 'shake 0.4s ease';
  el.focus();
  setTimeout(() => { el.style.borderColor=''; el.style.animation=''; }, 1000);
}

// ===== SCROLL REVEAL =====
function initReveal() {
  setTimeout(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, {threshold:0.1});
    document.querySelectorAll('.scroll-reveal:not(.visible), .pcard:not(.visible), .payment-item:not(.visible)').forEach(el => obs.observe(el));
  }, 60);
}
initReveal();

// Add shake keyframe dynamically
const style = document.createElement('style');
style.textContent = '@keyframes shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);}}';
document.head.appendChild(style);

let isLoggedIn=false,authMode='login';
function openAuth(m){authMode=m;document.getElementById('authTitle').innerText=m==='login'?'Login':'Sign Up';document.getElementById('authModal').style.display='block';}
function submitAuth(){
 const u=document.getElementById('authUser').value;
 const p=document.getElementById('authPass').value;
 if(authMode==='signup' && p.length<8){alert('Use a strong password (8+ chars)');return;}
 isLoggedIn=true;document.getElementById('authModal').style.display='none';alert('Logged in');
}
function googleLogin(){isLoggedIn=true;document.getElementById('authModal').style.display='none';alert('Google login placeholder');}
const oldShowPage=showPage;
showPage=function(id){
 if((id==='sell'||id==='cart')&&!isLoggedIn){openAuth('login');return;}
 oldShowPage(id);
}
