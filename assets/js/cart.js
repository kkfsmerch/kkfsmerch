(function(){
  const $ = s=>document.querySelector(s);
  const list = $('#cartItems');
  const subtotalEl = $('#cartSubtotal');
  const checkoutBtn = $('#checkoutBtn');
  const msg = document.getElementById('processingMsg');
  
  // Replace this with your actual Google Apps Script web app URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx45JiKg0xbacVfBL0Uw0NI5BWTR3Xzm9HDNk6T16ke8-gx6Jhse5JF3oCJqFMejpLEzg/exec';

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

    // Add event listeners with debouncing for quantity updates
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

  // Function to send order data to Google Sheets
  async function sendToGoogleSheets(orderData) {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        mode: 'no-cors' // Required for Google Apps Script
      });
      
      // Note: With 'no-cors' mode, we can't read the response
      // But the request will still be sent to Google Apps Script
      console.log('Order data sent to Google Sheets');
      return true;
    } catch (error) {
      console.error('Error sending to Google Sheets:', error);
      return false;
    }
  }

  checkoutBtn?.addEventListener('click', ()=>{
    // Simple checkout modal
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
                <label for="studentGrade (If you are staff then you can just choose a random grade.)" class="form-label">Grade</label>
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
                    onkeypress="return /[0-9]/.test(event.key)"
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

      // Validate grade
      const gradeNum = parseInt(grade);
      if (gradeNum < 1 || gradeNum > 12) {
        alert('Please enter a valid grade (1-12).');
        return;
      }

      // Disable button during processing
      const placeOrderBtn = document.getElementById('placeOrderBtn');
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = 'Processing...';
      msg.style.display = 'block';

      try {
        // Get current cart before checkout
        const currentCart = await STORE.getCart();
        
        if (currentCart.length === 0) {
          alert('Your cart is empty.');
          return;
        }

        // Get current user
        const currentUser = STORE.user;
        if (!currentUser) {
          alert('User not authenticated.');
          return;
        }

        const orderTotal = STORE.total();

        // Prepare data for Google Sheets
        const orderData = {
          email: currentUser.email,
          customerName: name,
          customerGrade: gradeNum,
          cart: currentCart.map(item => ({
            name: item.name,
            size: item.size,
            qty: item.qty,
            price: item.price
          })),
          orderTotal: orderTotal,
          timestamp: new Date().toISOString()
        };

        console.log('Sending order data to Google Sheets:', orderData);

        // Send to Google Sheets FIRST
        const sheetsSuccess = await sendToGoogleSheets(orderData);
        
        if (!sheetsSuccess) {
          alert('Order failed to process. Please try again.');
          return;
        }

        // Now complete the checkout (this clears the cart)
        const customerInfo = { name, grade: gradeNum };
        const order = await STORE.checkout(customerInfo);
        
        msg.style.display = 'none';
        
        if (order) {
          cm.hide();
          document.getElementById('success').innerHTML = `
            <div class="alert alert-success mt-3">
              ✅ Order confirmed!
              ${!sheetsSuccess ? '<br><small class="text-warning">Note: There was an issue saving to our records, but your order is confirmed.</small>' : ''}
            </div>`;
          
          render(); // Re-render to show empty cart
          window.scrollTo({top:0, behavior:'smooth'});
        } else {
          alert('Checkout failed. Please try again.');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Checkout failed. Please try again.');
      } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place order';
      }
    };
  });

  // Listen for cart updates
  window.addEventListener('cartUpdated', render);

  // Initial render when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
