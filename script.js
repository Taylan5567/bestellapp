let cart = [];
let totalPrice = 0;
let minimumOrder = 20.0;

function toggleCollapse() {
  const collapseContent = document.getElementById('collapseContent');
  collapseContent.classList.toggle('open');
}

function toggleMenu() {
  const menuContent = document.getElementById('menu-content');
  menuContent.classList.toggle('active');
}

function showDishes() {
  const dishContainer = document.getElementById('dishes-container');
  dishContainer.innerHTML = "";

  dishes.forEach((dish, index) => {
    const dishElement = createItemElement(dish, index, 'dish');
    dishContainer.appendChild(dishElement);
  });
}

function showDesserts() {
  const dessertContainer = document.getElementById('desserts-container');
  dessertContainer.innerHTML = "";

  desserts.forEach((dessert, index) => {
    const dessertElement = createItemElement(dessert, index, 'dessert');
    dessertContainer.appendChild(dessertElement);
  });
}

function createItemElement(item, index, type) {
  const itemElement = document.createElement('div');
  itemElement.className = `dish-box ${type}_${index + 1}`;
  itemElement.innerHTML = `
    <div class="firstrow">
      <strong>${item.name}</strong>
      <button class="addbutton" onclick="addToCart(${index}, '${type}')">+</button>
    </div>
    <hr>
    ${item.beschreibung}<br>
    <em>${item.preis.toFixed(2)} €</em>
  `;
  return itemElement;
}

function addToCart(index, type) {
  const selectedItem = type === 'dish' ? dishes[index] : desserts[index];
  if (!selectedItem) return;

  const existingItem = cart.find(item => item.name === selectedItem.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...selectedItem, quantity: 1 });
  }

  totalPrice += selectedItem.preis;
  updateCart();
}

function changeQuantity(index, amount) {
  const item = cart[index];
  if (!item) return;

  item.quantity += amount;

  if (item.quantity < 1) {
    totalPrice -= item.preis * item.quantity;
    cart.splice(index, 1);
  } else {
    totalPrice += item.preis * amount;
  }

  updateCart();
}

function generateCartItemHTML(item, index) {
  return `
    <li class="list-group-item">
      <span>${item.name}</span>
      <div class="btn-count">
        <button class="btn btn-danger" onclick="changeQuantity(${index}, -1)">-</button>
        ${item.quantity}
        <button class="btn btn-primary" onclick="changeQuantity(${index}, 1)">+</button>
      </div>
      <em>${(item.preis * item.quantity).toFixed(2)} €</em>
    </li>`;
}

function clearCartItems(cartItems) {
  cartItems.forEach(container => (container.innerHTML = ""));
}

function updatePriceAndMinimum(totalPrice, minimumOrder) {
  const totalPriceText = `${totalPrice.toFixed(2)} €`;
  const minimumText = totalPrice < minimumOrder 
    ? `Mindestbestellung: ${minimumOrder.toFixed(2)} €` 
    : "";

  ['#total-price', '#mobile-total-price', '#minimum-order']
    .forEach((selector, i) => {
      document.querySelector(selector).textContent = i === 2 ? minimumText : totalPriceText;
    });
}

function updateMobileIndicator(totalItemsMobile) {
  const mobileCartIndicator = document.getElementById('mobile-cart-indicator');
  if (mobileCartIndicator) {
    mobileCartIndicator.textContent = `(${totalItemsMobile} Artikel)`;
  }
}

function updateCart() {
  const cartItems = [
    document.getElementById('cart-items'),
    document.getElementById('mobile-cart-items')
  ];
  clearCartItems(cartItems);

  if (!cart.length) {
    totalPrice = 0;
    updatePriceAndMinimum(totalPrice, minimumOrder);
    updateMobileIndicator(0);
    return;
  }

  let totalItemsMobile = 0;

  cart.forEach((item, index) => {
    const listItemHTML = generateCartItemHTML(item, index);
    cartItems.forEach(container => (container.innerHTML += listItemHTML));
    totalItemsMobile += item.quantity;
  });

  updatePriceAndMinimum(totalPrice, minimumOrder);
  updateMobileIndicator(totalItemsMobile);
}

function removeItem(index) {
  const item = cart[index];
  if (!item) return;

  totalPrice -= item.preis * item.quantity;
  cart.splice(index, 1);
  updateCart();
}

function finalizeOrder() {
  const dialogContainer = document.getElementById("dialog-container");
  const dialogMessage = document.getElementById("dialog-message");

  if (totalPrice >= minimumOrder) {
    dialogMessage.textContent = "Vielen Dank für Ihre Bestellung!";
    cart = [];
    totalPrice = 0;
    updateCart();
  } else {
    dialogMessage.textContent = `Die Mindestbestellung beträgt ${minimumOrder.toFixed(2)} €. Bitte fügen Sie weitere Artikel hinzu.`;
  }

  dialogContainer.classList.add("active");
}

function closeDialog() {
  const dialogContainer = document.getElementById("dialog-container");
  dialogContainer.classList.remove("active");
}

function init() {
  showDishes();
  showDesserts();
}
