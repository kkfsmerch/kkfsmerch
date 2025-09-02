
(async function(){
  const grid = document.getElementById('newArrivals');
  if(!grid) return;
  
  // Wait a bit for STORE to be available
  setTimeout(() => {
    const arr = [...PRODUCTS]
      .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    grid.innerHTML = arr.map(UI.productCard).join('');
    UI.wireGridClicks(grid);
  }, 100);
})();