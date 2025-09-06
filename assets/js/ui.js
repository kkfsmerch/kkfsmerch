const UI = (function(){
  const $ = (s, root=document)=>root.querySelector(s);
  const $$ = (s, root=document)=>root.querySelectorAll(s);

  function productCard(p){
    const inStock = Object.values(p.stock).some(v=>v>0);
    const limited = p.limited ? '<span class="ribbon badge text-bg-danger">Sold Out</span>' : '';
    const price = STORE?.fmt ? STORE.fmt(p.price) : `₩${p.price.toLocaleString('ko-KR')}`;
    
    return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card product-card h-100 position-relative">
        ${limited}
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h3 class="h6 m-0 mb-1">${p.name}</h3>
          <p class="text-secondary small mb-2 text-capitalize">${p.category} • ${p.type}</p>
          <p class="text-muted small mb-2">${p.desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="price">${price}</span>
            <button class="btn btn-primary btn-sm" data-view="${p.id}">View</button>
          </div>
          ${inStock ? '' : '<span class="mt-2 badge text-bg-secondary">Out of stock</span>'}
        </div>
      </div>
    </div>`;
  }

  function ensureProductModal(){
    if(document.getElementById('productModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body p-0">
            <div class="row g-0">
              <div class="col-md-6">
                <img id="mImg" src="" class="w-100 h-100 object-fit-cover" alt="product image">
              </div>
              <div class="col-md-6 p-3">
                <div class="d-flex justify-content-between align-items-start">
                  <h3 id="mName" class="h4 m-0"></h3>
                  <span id="mBadge" class="badge text-bg-danger d-none">Sold Out</span>
                </div>
                <p id="mCategory" class="text-secondary small mb-2"></p>
                <p id="mDesc" class="mb-2"></p>
                <div class="mb-2"><span class="price" id="mPrice"></span></div>
                <div id="variantWrap" class="mb-3"></div>
                
                <div class="mb-3" style="max-width:200px;">
                  <label for="mQty" class="form-label">Qty</label>
                  <input
                    type="number"
                    id="mQty"
                    class="form-control"
                    value="1"
                    min="1"
                    max="50"
                    required
                    onfocus="if(this.value==1)this.value='';"
                    oninput="if(this.value>50)this.value=50"
                    onblur="if(!this.value || this.value<1)this.value=1"
                    onkeypress="return /[0-9]/.test(event.key)"
                  >
                </div>

                <button id="addToCartBtn" class="btn btn-primary w-100">Add to cart</button>
                <p id="mStockNote" class="text-danger small mt-2 d-none">Out of stock for selected size.</p>

                <p class="text-muted small mt-2">
                  To complete your order, please go to the cart section and checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`);
  }

  function openProductModal(id){
    ensureProductModal();
    const p = PRODUCTS.find(x=>x.id===id); 
    if(!p) {
      console.error('Product not found:', id);
      return;
    }
    
    const modal = new bootstrap.Modal('#productModal');
    const m = {
      img: $('#mImg'), name: $('#mName'), cat: $('#mCategory'), desc: $('#mDesc'),
      price: $('#mPrice'), badge: $('#mBadge'), variants: $('#variantWrap'),
      qty: $('#mQty'), add: $('#addToCartBtn'), out: $('#mStockNote')
    };
    
    m.img.src = p.img; 
    m.name.textContent = p.name;
    m.cat.textContent = `${p.category} • ${p.type}`;
    m.desc.textContent = p.desc; 
    m.price.textContent = STORE?.fmt ? STORE.fmt(p.price) : `$${(p.price/100).toFixed(2)}`;
    m.badge.classList.toggle('d-none', !p.limited);

    m.variants.innerHTML = p.sizes.map(s=>{
      const disabled = (p.stock[s]||0)===0 ? 'disabled' : '';
      const note = disabled ? ' (OOS)' : '';
      return `<div class="form-check form-check-inline size-pill mb-2">
        <input ${disabled} class="form-check-input" type="radio" name="size" id="sz-${s}" value="${s}">
        <label class="form-check-label" for="sz-${s}">${s}${note}</label>
      </div>`;
    }).join('');

    let sel = null;
    const first = p.sizes.find(s => (p.stock[s]||0) > 0);
    if(first){ 
      const el = document.getElementById('sz-'+first); 
      if(el){ 
        el.checked = true; 
        sel = first; 
      } 
    }
    m.out.classList.add('d-none'); 
    m.add.disabled = !first;

    m.variants.querySelectorAll('input').forEach(inp=>{
      inp.addEventListener('change', ()=>{
        sel = inp.value;
        const left = p.stock[sel]||0;
        m.out.classList.toggle('d-none', left>0);
        m.add.disabled = !(left>0);
        if(Number(m.qty.value||1) > left) m.qty.value = Math.max(1,left);
      });
    });

    m.qty.addEventListener('input', ()=>{
      const left = p.stock[sel]||0;
      if(Number(m.qty.value||1) > left) m.qty.value = Math.max(1,left);
    });

    // Fixed add to cart functionality
    m.add.onclick = async ()=>{

      if(!sel) {
        alert('Please select a size');
        return;
      }

      // Check if STORE is available and user is authenticated
      if (typeof STORE === 'undefined') {
        alert('Store not initialized. Please refresh the page.');
        return;
      }

      if (!STORE.ready) {
        alert('Please wait for authentication to complete.');
        return;
      }
      
      // Disable button during processing
      const originalText = m.add.textContent;
      m.add.disabled = true;
      m.add.textContent = 'Adding...';
      
      try {
        await STORE.addToCart(p, sel, Math.max(1, Number(m.qty.value||1)));
        modal.hide();
        
        // Show success toast
        showToast(`${p.name} (${sel}) added to cart!`, 'success');
        
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      } finally {
        m.add.disabled = false;
        m.add.textContent = originalText;
      }
    };

    modal.show();
  }

  function showToast(message, type = 'success') {
    const toastId = 'dynamicToast';
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>
      `);
      toastContainer = document.querySelector('.toast-container');
    }

    const bgClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';
    toastContainer.innerHTML = `
      <div id="${toastId}" class="toast align-items-center ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    const toast = new bootstrap.Toast(document.getElementById(toastId));
    toast.show();
  }

  function wireGridClicks(container){
    container.querySelectorAll('button[data-view]').forEach(btn=>{
      btn.addEventListener('click', (e)=> {
        e.preventDefault();
        const productId = btn.getAttribute('data-view');
        console.log('Opening product modal for:', productId);
        openProductModal(productId);
      });
    });
  }

  return { productCard, wireGridClicks, openProductModal, showToast };
})();

// Make UI globally available
window.UI = UI;
