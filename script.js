document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';

  document.getElementById('loader').style.display = 'block';

  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    const items = JSON.parse(savedCart);
    displayCartItems(items);
    calculateCartTotals(items);
    document.getElementById('loader').style.display = 'none'; 
  } else {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        displayCartItems(data.items);
        calculateCartTotals(data.items);
        localStorage.setItem('cartItems', JSON.stringify(data.items)); 
        document.getElementById('loader').style.display = 'none'; 
      })
      .catch(error => {
        console.error('Error fetching cart data:', error);
        document.getElementById('loader').style.display = 'none'; 
      });
  }

  function displayCartItems(items) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; 

    items.forEach((item, index) => {
      const itemRow = document.createElement('tr');
      itemRow.innerHTML = `
        <td><img src="${item.image}" alt="${item.title}" width="108px" height="105px"></td>
        <td>${item.title}</td>
        <td>₹${(item.price / 100).toLocaleString()}</td>
        <td><input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input" style="color: #9f9f9f;"></td>
        <td class="item-subtotal">₹${(item.line_price / 100).toLocaleString()}</td>
        <td><i class="fas fa-trash trash-icon" data-index="${index}" style="color: #b88e2f; font-size: 20px; cursor: pointer;"></i></td>
      `;
      cartItemsContainer.appendChild(itemRow);
    });

    attachQuantityUpdateHandlers(items);
    attachRemoveItemHandlers(items);
  }

  function attachQuantityUpdateHandlers(items) {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
      input.addEventListener('input', function() {
        const index = this.dataset.index;
        const newQuantity = parseInt(this.value);
        items[index].quantity = newQuantity;
        items[index].line_price = newQuantity * items[index].price;
        updateCart(items); 
      });
    });
  }

  function attachRemoveItemHandlers(items) {
    const trashIcons = document.querySelectorAll('.trash-icon');
    trashIcons.forEach(icon => {
      icon.addEventListener('click', function() {
        const index = this.dataset.index;
        items.splice(index, 1); 
        updateCart(items); 
      });
    });
  }

  function updateCart(items) {
    displayCartItems(items);
    calculateCartTotals(items);
    localStorage.setItem('cartItems', JSON.stringify(items)); 
  }

  function calculateCartTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + item.line_price, 0);
    document.getElementById('subtotal-price').textContent = `₹${(subtotal / 100).toLocaleString()}`;
    document.getElementById('total-price').textContent = `₹${(subtotal / 100).toLocaleString()}`;
  }

  
  document.getElementById('checkout-btn').addEventListener('click', () => {
    localStorage.removeItem('cartItems');
    displayCartItems([]); 
    calculateCartTotals([]); 
  });
});
