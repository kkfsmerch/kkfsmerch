// ui.js - UI utilities for product display and interaction
const UI = (function(){
  
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

  // Show size selection modal
  function showSizeModal(product){
    // Remove existing modal
    const existingModal = document.getElementById('sizeModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create size options
    const sizeOptions = product.sizes.map(size => {
      const stock = product.stock?.[size] ?? Infinity;
      const disabled = stock <= 0 ? 'disabled' : '';
      const stockText = stock === Infinity ? '' : ` (${stock} left)`;
      
      return `
        <div class="col-6 col-md-4">
          <input type="radio" class="btn-check" name="size" id="size-${size}" value="${size}" ${disabled}>
          <label class="btn btn-outline-primary w-100" for="size-${size}">
            ${size}${stockText}
          </label>
        </div>
      `;
    }).join('');

    // Create modal HTML
    const modalHTML = `
      <div class="modal fade" id="sizeModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Select Size - ${product.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row g-2 mb-3">
                ${sizeOptions}
              </div>
              <div class="mb-3">
                <label for="quantity" class="form-label">Quantity</label>
                <input type="number" class="form-control" id="quantity" min="1" max="10" value="1">
              </div>
              <div class="text-center">
                <img src="${product.img}" alt="${product.name}" class="img-fluid rounded" style="max-height:200px">
                <div class="mt-2">
                  <strong class="text-primary">${STORE.fmt(product.price)}</strong>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="confirmAddToCart">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add to DOM and show
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal('#sizeModal');
    modal.show();

    // Handle add to cart
    document.getElementById('confirmAddToCart').addEventListener('click', async () => {
      const selectedSize = document.querySelector('input[name="size"]:checked');
      const quantity = parseInt(document.getElementById('quantity').value) || 1;

      if (!selectedSize) {
        alert('Please select a size');
        return;
      }

      // Add to cart
      try {
        await STORE.addToCart(product, selectedSize.value, quantity);
        modal.hide();
        
        // Show success message
        showToast('Added to cart!', 'success');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding to cart. Please try again.');
      }
    });

    // Clean up when modal is hidden
    document.getElementById('sizeModal').addEventListener('hidden.bs.modal', () => {
      document.getElementById('sizeModal').remove();
    });
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

  // Public interface
  return {
    productCard,
    wireGridClicks,
    showToast
  };
})();

// Make UI globally available
window.UI = UI;
