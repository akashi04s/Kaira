// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart if it doesn't exist
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  
  // Update cart count in header
  updateCartCount();
  
  // Add to cart functionality for product items
  document.querySelectorAll('[data-after="Add to cart"]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productItem = this.closest('.product-item');
      const product = {
        id: productItem.dataset.id || Math.random().toString(36).substr(2, 9),
        name: productItem.querySelector('.element-title a').textContent,
        price: parseFloat(this.querySelector('span').textContent.replace('Starting ₹', '').replace(',', '')),
        image: productItem.querySelector('.product-image').src,
        quantity: 1
      };
      
      addToCart(product);
    });
  });
});

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Show added notification
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="cart-notification-content">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#check"></use>
      </svg>
      <span>${product.name} added to cart</span>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  
  document.querySelectorAll('.cart-count-badge, .cart-count').forEach(el => {
    el.textContent = count;
  });
}

// For cart page functionality
if (document.querySelector('.cart-page')) {
  document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
  });
  
  function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart-items');
    
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="text-center py-5">
          <svg width="48" height="48" viewBox="0 0 24 24" class="mb-3">
            <use xlink:href="#cart"></use>
          </svg>
          <h5 class="mb-3">Your cart is empty</h5>
          <a href="index.html" class="btn btn-dark text-uppercase">Continue Shopping</a>
        </div>
      `;
      document.querySelector('.cart-summary').style.display = 'none';
      return;
    }
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    // Update summary
    document.querySelector('.summary-details').innerHTML = `
      <div class="d-flex justify-content-between mb-2">
        <span>Subtotal</span>
        <span>₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
      </div>
      <div class="d-flex justify-content-between mb-2">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <span>Estimated Tax</span>
        <span>₹${tax.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
      </div>
      <div class="border-top pt-3 mb-4">
        <div class="d-flex justify-content-between">
          <strong>Total</strong>
          <strong>₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
        </div>
      </div>
      <div class="d-grid">
        <a href="checkout.html" class="btn btn-dark text-uppercase py-3">Proceed to Checkout</a>
      </div>
      <div class="mt-3 text-center">
        <p class="small">or <a href="index.html" class="text-dark">Continue Shopping</a></p>
      </div>
    `;
  }
}
