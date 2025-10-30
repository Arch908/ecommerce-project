/* cart.js
 * Shows the cart, handles dummy payment, orders, and order listing.
 */

(function(){
  function esc(s){ return (s||'').toString() }

  function renderCart(){
    const user = JSON.parse(localStorage.getItem('wg_current_user') || 'null');
    const container = document.getElementById('cartContainer');
    if(!container) return;
    if(!user){ container.innerHTML = `<div class="card">Please <a href="login.html">login</a> to view your cart.</div>`; return; }
    const cartKey = 'wg_cart_' + user.username;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    if(cart.length === 0){
      container.innerHTML = `<div class="card">Your cart is empty.</div>`;
      document.getElementById('cartTotal').textContent = '';
      return;
    }
    let out = cart.map((it, idx) => `
      <div class="card" style="display:flex;align-items:center;gap:12px">
        <img src="${it.image}" style="width:90px;height:90px;object-fit:cover;border-radius:8px" />
        <div style="flex:1">
          <div style="font-weight:700">${esc(it.title)}</div>
          <div class="muted">${esc(it.description || '')}</div>
          <div style="margin-top:6px">Qty: 
            <button class="btn small" data-dec="${it.id}">−</button>
            <span style="margin:0 8px">${it.qty}</span>
            <button class="btn small" data-inc="${it.id}">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">&#8360;${(it.price * it.qty).toFixed(2)}</div>
          <div style="margin-top:8px">
            <button class="btn" data-remove="${it.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
    container.innerHTML = out;
    // total
    const total = cart.reduce((s,i)=> s + (i.price * i.qty), 0);
    document.getElementById('cartTotal').textContent = 'Total: $' + total.toFixed(2);

    // attach remove
    document.querySelectorAll('[data-remove]').forEach(b=>{
      b.addEventListener('click', () => {
        const pid = b.getAttribute('data-remove');
        const newCart = cart.filter(x => x.id !== pid);
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        renderCart();
      });
    });

    // qty inc/dec
    document.querySelectorAll('[data-inc]').forEach(b=>{
      b.addEventListener('click', () => {
        const pid = b.getAttribute('data-inc');
        const idx = cart.findIndex(x => x.id === pid);
        if(idx>=0){ cart[idx].qty += 1; localStorage.setItem(cartKey, JSON.stringify(cart)); renderCart(); }
      });
    });
    document.querySelectorAll('[data-dec]').forEach(b=>{
      b.addEventListener('click', () => {
        const pid = b.getAttribute('data-dec');
        const idx = cart.findIndex(x => x.id === pid);
        if(idx>=0){ cart[idx].qty = Math.max(1, cart[idx].qty - 1); localStorage.setItem(cartKey, JSON.stringify(cart)); renderCart(); }
      });
    });
  }

  // pay (dummy) - moves cart into orders
  const payBtn = document.getElementById('payBtn');
  if(payBtn){
    payBtn.addEventListener('click', () => {
      const user = JSON.parse(localStorage.getItem('wg_current_user') || 'null');
      if(!user) return alert('Please login to pay');
      const cartKey = 'wg_cart_' + user.username;
      const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      if(cart.length === 0) return alert('Cart empty');

      // create order
      const order = {
        id: 'o_' + Math.random().toString(36).slice(2,10),
        username: user.username,
        items: cart,
        total: cart.reduce((s,i)=> s + (i.price*i.qty), 0),
        status: 'paid',
        createdAt: new Date().toISOString()
      };

      // save user orders
      const userOrdersKey = 'wg_orders_' + user.username;
      const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
      userOrders.unshift(order);
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));

      // save global orders for admin
      const allOrders = JSON.parse(localStorage.getItem('wg_all_orders') || '[]');
      allOrders.unshift(order);
      localStorage.setItem('wg_all_orders', JSON.stringify(allOrders));

      // clear cart
      localStorage.removeItem(cartKey);
      alert('Payment successful (dummy). Order placed.');

      renderCart();
      renderOrdersList();
    });
  }

  // clear cart
  const clearBtn = document.getElementById('clearCartBtn');
  if(clearBtn){
    clearBtn.addEventListener('click', () => {
      const user = JSON.parse(localStorage.getItem('wg_current_user') || 'null');
      if(!user) return alert('Login first');
      localStorage.removeItem('wg_cart_' + user.username);
      renderCart();
    });
  }

  // render orders (for this user)
  function renderOrdersList(){
    const user = JSON.parse(localStorage.getItem('wg_current_user') || 'null');
    const node = document.getElementById('ordersList');
    if(!node) return;
    if(!user){ node.innerHTML = '<div class="card">Login to see your orders</div>'; return; }
    const orders = JSON.parse(localStorage.getItem('wg_orders_' + user.username) || '[]');
    if(orders.length === 0) { node.innerHTML = '<div class="card">No orders yet.</div>'; return; }
    node.innerHTML = orders.map(o => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>Order:</strong> ${o.id}</div>
          <div class="muted">${new Date(o.createdAt).toLocaleString()}</div>
        </div>
        <div style="margin-top:8px">${o.items.map(it=>`<div>${it.title} x ${it.qty} — &#8360;${(it.price*it.qty).toFixed(2)}</div>`).join('')}</div>
        <div style="margin-top:8px"><strong>Total:</strong> &#8360;${o.total.toFixed(2)}</div>
        <div style="margin-top:8px"><strong>Status:</strong> ${o.status}</div>
      </div>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    renderOrdersList();
  });

})();
