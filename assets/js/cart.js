// cart.js - renders cart page and Firebase checkout
(function(){
  const $ = s => document.querySelector(s);
  const list = $('#cartItems');
  const subtotalEl = $('#cartSubtotal');
  const checkoutBtn = $('#checkoutBtn');

  async function render(){
    // Wait for STORE to be ready
    if (typeof STORE === 'undefined' || !STORE.ready) {
      setTimeout(render, 100);
      return;
    }

    const cart = await STORE.getCart();
    if(cart.length === 0){
      list.innerHTML = '<div class="text-center text-secondary py-5">Your cart is empty.</div>';
      subtotalEl.textContent = STORE.fmt(0);
      checkoutBtn.disabled = true;
      return;
    }
    
    checkoutBtn.disabled = false;
    list.innerHTML = cart.map(i=>`
      <div class="card">
        <div class="card-body d-flex align-items-center gap-3">
          <img src="${i.img}" alt="${i.name}" style="width:64px;height:64px;object-fit:cover" class="rounded">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <div>
                <div class="fw-semibold">${i.name}</div>
                <small class="text-secondary">Size: ${i.size}</small>
              </div>
              <div class="text-nowrap">${STORE.fmt(i.price)}</div>
            </div>
            <div class="d-flex align-items-center mt-2 gap-2">
              <input type="number" min="1" value="${i.qty}" data-key="${i.key}" class="form-control form-control-sm qty-input" style="width:90px">
              <button class="btn btn-outline-danger btn-sm" data-del="${i.key}">Remove</button>
            </div>
          </div>
        </div>
      </div>`).join('');

    // Add event listeners for quantity updates
    list.querySelectorAll('.qty-input').forEach(inp=>{
      let timeout;
      inp.addEventListener('input', ()=>{
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          await STORE.updateQty(inp.dataset.key, Math.max(1, Number(inp.value||1)));
          render();
        }, 500);
      });
    });

    list.querySelectorAll('button[data-del]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{ 
        await STORE.removeItem(btn.dataset.del); 
        render(); 
      });
    });

    subtotalEl.textContent = STORE.fmt(STORE.total());
  }

  // Function to submit data via hidden form (bypasses CORS completely)
  function submitToGoogleSheets(payload) {
    try {
      // Create a hidden form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://script.google.com/macros/s/AKfycbyUNDziXoV8fIY6zCQG4Mjf7jt9EV44xdZQsrfBNRC9IfMHYuMU5WrjNH9955bMpGG0IQ/exec';
      form.target = 'hidden_iframe'; // Submit to hidden iframe
      form.style.display = 'none';

      // Add data as form fields
      const dataField = document.createElement('input');
      dataField.type = 'hidden';
      dataField.name = 'data';
      dataField.value = JSON.stringify(payload);
      form.appendChild(dataField);

      // Create hidden iframe to receive response
      let iframe = document.getElementById('hidden_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'hidden_iframe';
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      // Add form to page and submit
      document.body.appendChild(form);
      form.submit();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(form);
      }, 1000);
      
      console.log('Order data submitted to Google Sheets via form');
      
    } catch (err) {
      console.error('Form submission failed:', err);
    }
  }

  checkoutBtn?.addEventListener('click', ()=>{
    // Show checkout modal
    if(!document.getElementById('checkoutModal')){
      document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Checkout</h5>
              <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="cName" class="form-label">Student's Preferred Name</label>
                <input type="text" id="cName" class="form-control" placeholder="Preferred full name" required>
              </div>
              <div class="mb-3">
                <label for="studentGrade" class="form-label">Grade</label>
                <input
                  type="number"
                  id="studentGrade"
                  class="form-control"
                  placeholder="Grade" 
                  min="1"
                  max="12"
                  required
                  onfocus="if(this.value==1)this.value='';"
                  oninput="if(this.value>12)this.value=12"
                  onblur="if(!this.value || this.value<1)this.value=1"
                  onkeypress="return /[1-9]/.test(event.key)"
                >
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button id="placeOrderBtn" class="btn btn-primary">Place order</button>
            </div>
          </div>
        </div>
      </div>`);
    }

    const cm = new bootstrap.Modal('#checkoutModal');
    cm.show();

    document.getElementById('placeOrderBtn').onclick = async ()=>{
      const name = document.getElementById('cName').value.trim();
      const grade = document.getElementById('studentGrade').value.trim();

      if(!name || !grade){
        alert('Please complete the form.');
        return;
      }

      const gradeNum = parseInt(grade);
      if(gradeNum < 1 || gradeNum > 12){
        alert('Please enter a valid grade (1-12).');
        return;
      }

      const placeOrderBtn = document.getElementById('placeOrderBtn');
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = 'Processing...';

      try {
        // Get cart data BEFORE checkout (since checkout clears the cart)
        const cart = await STORE.getCart();
        console.log('Cart before checkout:', cart);

        const customerInfo = { name, grade: gradeNum };
        const checkoutResult = await STORE.checkout(customerInfo);
        
        console.log('Checkout result:', checkoutResult);
        
        // Check if checkout was successful
        if (!checkoutResult) {
          throw new Error('Checkout returned false/null');
        }

        // Close modal and show success
        cm.hide();
        document.getElementById('success').innerHTML = `
          <div class="alert alert-success mt-3">✅ Order confirmed. Check your email for details.</div>`;

        // --- Google Sheets integration via form submission (NO CORS ISSUES) ---
        const user = STORE.user;
        const email = user?.email || '';

        const payload = {
          customer: { email, name, grade: gradeNum },
          items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price }))
        };

        // Submit via hidden form - this completely bypasses CORS
        submitToGoogleSheets(payload);
        
        // --- End Sheets integration ---

        render(); // Clear cart display
        window.scrollTo({top:0, behavior:'smooth'});

      } catch(error){
        console.error('Checkout error:', error);
        
        // Close modal first
        cm.hide();
        
        // Show error message
        alert('Checkout failed. Please try again. Error: ' + error.message);
        
      } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place order';
      }
    };
  });

  // Listen for cart updates
  window.addEventListener('cartUpdated', render);

  // Initial render
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
