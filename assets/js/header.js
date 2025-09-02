// header.js - renders shared navbar & footer, updates cart badge from Firebase
(function(){
  const header = document.getElementById('appHeader');
  const active = document.body.getAttribute('data-page') || 'home';
  const nav = (name, href, key) => 
    `<li class="nav-item"><a class="nav-link ${active===key?'active fw-semibold':''}" href="${href}">${name}</a></li>`;

  const html = `
  <nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
    <div class="container">
      <a class="navbar-brand fw-bold text-primary" href="index.html">KKFS Merch</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          ${nav('Home','index.html','home')}
          ${nav('Athletic','athletic.html','athletic')}
          ${nav('General','general.html','general')}
          ${nav('Seasonal','seasonal.html','seasonal')}
        </ul>
        <a class="btn btn-outline-primary position-relative" href="cart.html">
          🛒 Cart <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
        </a>
      </div>
    </div>
  </nav>`;
  if(header) header.innerHTML = html;

  // Cart badge from Firebase
  async function updateBadge(){
    try{
      const cart = await STORE.getCart();
      const n = cart.reduce((a,i)=>a+i.qty,0);
      const b = document.getElementById('cartCount');
      if(b){ 
        b.textContent = n; 
        b.classList.toggle('d-none', n===0); 
      }
    }catch(e){
      console.error("Error updating cart badge:", e);
    }
  }

  // Update badge on cart changes
  window.addEventListener('cartUpdated', updateBadge);
  
  // Initial badge update when user is authenticated
  if (typeof STORE !== 'undefined') {
    updateBadge();
  }
})();