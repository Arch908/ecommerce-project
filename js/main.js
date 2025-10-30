/* main.js
 * Renders navbar, loads products, search on home.
 * Adds modal triggers and product detail modal functionality.
 */

(function(){
  // storage helpers (already in data.js but ensuring availability)
  window.loadProducts = function(){
    try { return JSON.parse(localStorage.getItem('wg_products')) || []; } catch(e){ return [] }
  };
  window.saveProducts = function(list){
    localStorage.setItem('wg_products', JSON.stringify(list));
  };

  window.loadUsers = function(){
    try { return JSON.parse(localStorage.getItem('wg_users')) || []; } catch(e){ return [] }
  };
  window.saveUsers = function(list){
    localStorage.setItem('wg_users', JSON.stringify(list));
  };

  // NAVBAR render
  function renderNavbar(){
    const root = document.getElementById('navbar-root');
    if(!root) return;
    const user = JSON.parse(localStorage.getItem('wg_current_user') || 'null');

    root.innerHTML = `
      <nav class="navbar">
      <img src="/assests/imgs/icon img.png" alt="watch gallery logo" class="logo">
        <div class="brand"><a href="index.html" style="color:white;text-decoration:none;">The Watch Gallery</a></div>
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="categories.html">Categories</a>
          ${ user ? `<a href="cart.html">Cart</a>
                     ${ user.role === 'admin' ? `<a href="admin.html">Dashboard</a>` : '' }
                     <span class="username-pill">${escapeHtml(user.username)}</span>
                     <a href="#" id="logoutLink">Logout</a>`
                 : `<a href="login.html">Login</a>
                    <a href="register.html">Register</a>` }
        </div>
      </nav>
    `;

    const logoutLink = document.getElementById('logoutLink');
    if(logoutLink){
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('wg_current_user');
        window.location.href = 'index.html';
      });
    }
  }

  // escape helper
  function escapeHtml(str){
    if(!str) return '';
    return String(str).replace(/[&<>"'`=\/]/g, function(s) {
      return ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
        "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
      })[s];
    });
  }

  // Render product card (shared)
  window.renderProductCard = function(p){
    return `
      <div class="product card" data-id="${p.id}">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" data-open="${p.id}" />
        <h3 data-open="${p.id}">${escapeHtml(p.title)}</h3>
        <p class="muted">${escapeHtml(p.description || '').slice(0,80)}</p>
        <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
          <div class="price">&#8360;${p.price}</div>
          <button class="btn small" data-add="${p.id}">Add to cart</button>
        </div>
      </div>
    `.trim();
  };

  // Attach add-to-cart behavior
  function attachAddButtons(){
    document.querySelectorAll('[data-add]').forEach(btn => {
      btn.onclick = function(){
        const pid = this.getAttribute('data-add');
        addToCartById(pid, 1);
      };
    });
  }

  window.addToCartById = function(pid, qty){
    const user = JSON.parse(localStorage.getItem('wg_current_user') || 'null');
    if(!user) {
      if(confirm('You must be logged in to add to cart. Go to login?')) window.location = 'login.html';
      return;
    }
    const prods = loadProducts();
    const item = prods.find(p => p.id === pid);
    if(!item) return alert('Product not found');
    const cartKey = 'wg_cart_' + user.username;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const found = cart.find(i => i.id === pid);
    if(found) found.qty += qty; else cart.push({...item, qty:qty});
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert('Added to cart');
  };

  // MODAL logic
  function getModalElements(){
    return {
      modal: document.getElementById('productModal'),
      backdrop: document.getElementById('modalBackdrop'),
      closeBtn: document.getElementById('modalClose'),
      closeBtn2: document.getElementById('modalCloseBtn'),
      image: document.getElementById('modalImage'),
      title: document.getElementById('modalTitle'),
      desc: document.getElementById('modalDesc'),
      price: document.getElementById('modalPrice'),
      cat: document.getElementById('modalCategory'),
      qtyInput: document.getElementById('qtyInput'),
      qtyPlus: document.getElementById('qtyPlus'),
      qtyMinus: document.getElementById('qtyMinus'),
      addBtn: document.getElementById('modalAddBtn')
    };
  }

  function attachModalTriggers(){
    document.querySelectorAll('[data-open]').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const pid = el.getAttribute('data-open');
        openProductModal(pid);
      });
    });
  }

  window.openProductModal = function(pid){
    const prod = loadProducts().find(p => p.id === pid);
    if(!prod) return;
    const dom = getModalElements();
    dom.image.src = prod.image;
    dom.image.alt = prod.title;
    dom.title.textContent = prod.title;
    dom.desc.textContent = prod.description || '';
    dom.price.textContent = '&#8360;' + prod.price;
    dom.cat.textContent = prod.category;
    dom.qtyInput.value = 1;

    dom.addBtn.onclick = function(){
      const qty = Math.max(1, parseInt(dom.qtyInput.value || 1, 10));
      addToCartById(pid, qty);
      closeModal();
    };
    dom.qtyPlus.onclick = () => { dom.qtyInput.value = Math.max(1, parseInt(dom.qtyInput.value||1,10)+1); };
    dom.qtyMinus.onclick = () => { dom.qtyInput.value = Math.max(1, parseInt(dom.qtyInput.value||1,10)-1); };

    // open modal
    dom.modal.setAttribute('aria-hidden','false');
    // close handlers
    dom.backdrop && dom.backdrop.addEventListener('click', closeModal, { once: true });
    dom.closeBtn && dom.closeBtn.addEventListener('click', closeModal, { once: true });
    dom.closeBtn2 && dom.closeBtn2.addEventListener('click', closeModal, { once: true });
  };

  function closeModal(){
    const dom = getModalElements();
    if(dom && dom.modal) dom.modal.setAttribute('aria-hidden','true');
  }

  // Attach remove handlers later if dynamic

  // Home page load
  document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();

    // Home product grid
    const grid = document.getElementById('productGrid');
    if(grid){
      const all = loadProducts();
      grid.innerHTML = all.slice(0, 12).map(renderProductCard).join('');
      attachAddButtons();
      attachModalTriggers();
    }

    // Home search box
    const homeSearch = document.getElementById('homeSearch');
    if(homeSearch){
      homeSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const all = loadProducts().filter(p => p.title.toLowerCase().includes(q));
        const grid = document.getElementById('productGrid');
        if(grid){
          grid.innerHTML = all.map(renderProductCard).join('');
          attachAddButtons();
          attachModalTriggers();
        }
      });
    }
  });

  // expose helper to other pages
  window.attachModalTriggers = attachModalTriggers;
  window.attachAddButtons = attachAddButtons;
  window.renderNavbar = renderNavbar;
})();
