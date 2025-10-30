/* auth.js
 * Handles register & login using localStorage.
 */

(function(){
  function showMsg(id, txt, timeout=3000){
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = txt;
    setTimeout(()=> el.textContent = '', timeout);
  }

  // Register
  const regBtn = document.getElementById('regBtn');
  if(regBtn){
    regBtn.addEventListener('click', () => {
      const username = (document.getElementById('regUsername') || {}).value?.trim();
      const password = (document.getElementById('regPassword') || {}).value?.trim();
      const role = (document.getElementById('regRole') || {}).value || 'user';
      if(!username || !password) return showMsg('regMsg','Please fill all fields');
      const users = loadUsers();
      if(users.find(u => u.username === username)) return showMsg('regMsg','Username already exists');
      users.push({ username, password, role });
      saveUsers(users);
      showMsg('regMsg','Registered! Redirecting to login...');
      setTimeout(()=> window.location = 'login.html', 900);
    });
  }

  // Login
  const loginBtn = document.getElementById('loginBtn');
  if(loginBtn){
    loginBtn.addEventListener('click', () => {
      const username = (document.getElementById('loginUsername') || {}).value?.trim();
      const password = (document.getElementById('loginPassword') || {}).value?.trim();
      if(!username || !password) return showMsg('loginMsg','Please fill both fields');
      const users = loadUsers();
      const user = users.find(u => u.username === username && u.password === password);
      if(!user) return showMsg('loginMsg','Invalid credentials');
      // store active user
      localStorage.setItem('wg_current_user', JSON.stringify({ username: user.username, role: user.role }));
      showMsg('loginMsg','Login successful — redirecting...');
      setTimeout(()=> window.location = 'index.html', 700);
    });
  }
})();
