// ui.js - UI utilities for product display and interaction (NON-MODULE VERSION)
(function(){
  
  // Format product card HTML
  function productCard(product){
    const inStock = Object.values(product.stock || {}).some(s => s > 0) || product.stock === undefined;
    const stockText = inStock ? '' : '<small class="text-danger">Out of Stock</small>';
    const limitedBadge = product.limited ? '<span class="position-absolute top-0 start-0 badge bg-danger m-2">Limited</span>' : '';
    
    return `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm product-card position-relative" data-product-id="${product.id}">
          ${limitedBadge}
          <img src="${product.img}" class="card-img-top" alt="${product.name}" style="height:200px;object-fit:cover">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-semibold">${product.name}</h5>
            <p class="card-text text-muted small flex-grow-1">${product.desc}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <span class="fw-bold text-primary">${STORE.fmt(product.price)}</span>
              <button class="btn btn-sm btn-outline-primary add-to-cart-btn" ${!inStock ? 'disabled' : ''}>
                ${inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            ${stockText}
          </div>
        </div>
      </div>
    `;
  }

  // Wire up click events for product grid
  function wireGridClicks(gridElement){
    gridElement.addEventListener('click', async (e) => {
      const addBtn = e.target.closest('.add-to-cart-btn');
      if (!addBtn || addBtn.disabled) return;

      const card = addBtn.closest('.product-card');
      const productId = card.dataset.productId;
      const product = STORE.getProductById(productId);
      
      if (!product) {
        console.error('Product not found:', productId);
        return;
      }

      // Show size selection modal
      showSizeModal(product);
    });
  }

  // Show size selection modal - ORIGINAL DESIGN
  function showSizeModal(product){
    // Simple prompt-based selection (your original might have been different)
    // If you had a different modal design, please let me know what it looked like
    
    const sizeOptions = product.sizes.filter(size => {
      const stock = product.stock?.[size] ?? Infinity;
      return stock > 0;
    });
    
    if (sizeOptions.length === 0) {
      alert('This item is out of stock');
      return;
    }
    
    // If only one size available, skip selection
    if (sizeOptions.length === 1) {
      const size = sizeOptions[0];
      const qty = parseInt(prompt(`How many ${product.name} (Size: ${size}) would you like to add?`, '1')) || 0;
      if (qty > 0) {
        STORE.addToCart(product, size, qty);
        alert('Added to cart!');
      }
      return;
    }
    
    // Multiple sizes - show selection
    const sizeChoice = prompt(`Select size for ${product.name}:\n${sizeOptions.map((s, i) => `${i+1}. ${s}`).join('\n')}`, '1');
    const sizeIndex = parseInt(sizeChoice) - 1;
    
    if (sizeIndex >= 0 && sizeIndex < sizeOptions.length) {
      const size = sizeOptions[sizeIndex];
      const qty = parseInt(prompt(`How many ${product.name} (Size: ${size}) would you like to add?`, '1')) || 0;
      if (qty > 0) {
        STORE.addToCart(product, size, qty);
        alert('Added to cart!');
      }
    }
  }

  // Show toast notification
  function showToast(message, type = 'info'){
    const toastHTML = `
      <div class="toast align-items-center text-bg-${type} border-0" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.querySelector('.toast:last-child');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove after hiding
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }

  // Make UI globally available
  window.UI = {
    productCard,
    wireGridClicks,
    showToast
  };
})();
