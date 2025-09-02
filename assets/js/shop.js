// shop.js - renders a merch page by category (athletic/general/seasonal) with type filters
(function(){
  const $ = s=>document.querySelector(s);
  const category = document.body.getAttribute('data-category'); // 'athletic'|'general'|'seasonal'
  const grid = document.getElementById('grid');
  const sortSelect = document.getElementById('sortSelect');

  function apply(){
    let list = PRODUCTS.filter(p => p.category === category);
    const sort = sortSelect?.value || 'featured';

    if(sort==='price-asc')  list.sort((a,b)=>a.price-b.price);
    if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    if(sort==='name')       list.sort((a,b)=>a.name.localeCompare(b.name));

    grid.innerHTML = list.map(UI.productCard).join('');
    UI.wireGridClicks(grid);
  }

  // events
  sortSelect?.addEventListener('change', apply);

  // initial render
  apply();
})();