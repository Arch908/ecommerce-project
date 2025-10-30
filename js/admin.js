/* admin.js
 * Admin features:
 * - show products with remove button
 * - add new product
 * - show users
 * - show all orders (global) and update order status
 */

(function(){
  function ensureAdmin(){
    const user = JSON.parse(localStorage.getItem('wg_current_user') || 'null');
    if(!user || user.role !== 'admin') {
      alert('Access denied. Admins only.');
      window.location = 'index.html';
      return false;
    }
    return true;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if(!ensureAdmin()) return;
    renderProductsAdmin();
    renderUsers();
    renderOrdersAdmin();

    // add product
    const addBtn = document.getElementById('addProductBtn');
    if(addBtn){
      addBtn.addEventListener('click', () => {
        const title = document.getElementById('pTitle').value.trim();
        const price = parseFloat(document.getElementById('pPrice').value);
        const cat = document.getElementById('pCategory').value;
        const img = document.getElementById('pImage').value.trim();
        const desc = document.getElementById('pDesc').value.trim();
        if(!title || !price || !img){ document.getElementById('adminMsg').textContent = 'Title, price and image required'; return; }
        const list = loadProducts();
        const newItem = { id: uid(), title, price, category: cat, image: img, description: desc };
        list.unshift(newItem);
        saveProducts(list);
        document.getElementById('adminMsg').textContent = 'Product added';
        setTimeout(()=> document.getElementById('adminMsg').textContent = '', 1500);
        // clear fields
        document.getElementById('pTitle').value = '';
        document.getElementById('pPrice').value = '';
        document.getElementById('pImage').value = '';
        document.getElementById('pDesc').value = '';
        renderProductsAdmin();
      });
    }
  });

  function renderProductsAdmin(){
    const el = document.getElementById('adminProducts');
    if(!el) return;
    const list = loadProducts();
    if(list.length === 0) { el.innerHTML = '<div class="muted">No products</div>'; return; }
    el.innerHTML = list.map(p => `
      <div class="card" style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <img src="${p.image}" style="width:80px;height:80px;object-fit:cover;border-radius:8px" />
        <div style="flex:1">
          <div style="font-weight:700">${p.title}</div>
          <div class="muted">${p.category} • &#8360;${p.price}</div>
        </div>
        <div>
          <button class="btn" data-del="${p.id}">Remove</button>
        </div>
      </div>
    `).join('');
    // attach delete
    document.querySelectorAll('[data-del]').forEach(b => {
      b.onclick = () => {
        if(!confirm('Remove product?')) return;
        const id = b.getAttribute('data-del');
        const list2 = loadProducts().filter(x => x.id !== id);
        saveProducts(list2);
        renderProductsAdmin();
      };
    });
  }

  // users
  function renderUsers(){
    const el = document.getElementById('adminUsers');
    if(!el) return;
    const users = loadUsers();
    el.innerHTML = users.map(u => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>${u.username}</strong> <span class="muted">(${u.role})</span></div>
          <div class="muted">--</div>
        </div>
      </div>
    `).join('');
  }

  // orders
  function renderOrdersAdmin(){
    const el = document.getElementById('adminOrders');
    if(!el) return;
    const orders = JSON.parse(localStorage.getItem('wg_all_orders') || '[]');
    if(orders.length === 0) { el.innerHTML = '<div class="muted">No orders yet</div>'; return; }
    el.innerHTML = orders.map((o, idx) => `
      <div class="card" style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>Order ${o.id}</strong> <span class="muted">by ${o.username}</span></div>
          <div class="muted">${new Date(o.createdAt).toLocaleString()}</div>
        </div>
        <div style="margin-top:8px">${o.items.map(it => `<div>${it.title} x ${it.qty}</div>`).join('')}</div>
        <div style="margin-top:8px">Total: $${(o.total||0).toFixed(2)}</div>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
          <select id="status_${idx}">
            <option ${o.status==='paid'?'selected':''} value="paid">Paid</option>
            <option ${o.status==='processing'?'selected':''} value="processing">Processing</option>
            <option ${o.status==='on the way'?'selected':''} value="on the way">On the way</option>
            <option ${o.status==='delivered'?'selected':''} value="delivered">Delivered</option>
          </select>
          <button class="btn" data-update="${idx}">Update</button>
        </div>
      </div>
    `).join('');

    // attach update
    document.querySelectorAll('[data-update]').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-update'), 10);
        const sel = document.getElementById('status_' + idx);
        const newStatus = sel.value;
        const orders = JSON.parse(localStorage.getItem('wg_all_orders') || '[]');
        if(!orders[idx]) return;
        orders[idx].status = newStatus;
        localStorage.setItem('wg_all_orders', JSON.stringify(orders));
        // also update user-specific copy if exists
        const uOrdersKey = 'wg_orders_' + orders[idx].username;
        const uOrders = JSON.parse(localStorage.getItem(uOrdersKey) || '[]');
        const uIdx = uOrders.findIndex(x => x.id === orders[idx].id);
        if(uIdx >= 0){ uOrders[uIdx].status = newStatus; localStorage.setItem(uOrdersKey, JSON.stringify(uOrders)); }
        renderOrdersAdmin();
      };
    });
  }

})();
