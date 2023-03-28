const API_KEY = "YOUR_API_KEY";

async function fetchCities() {
  const url = `https://api.novaposhta.ua/v2.0/json/Address/searchSettlements/?apiKey=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "modelName": "Address",
      "calledMethod": "searchSettlements",
      "methodProperties": {},
    }),
  });
  const data = await response.json();
  return data;
}

async function fetchWarehouses(cityRef) {
  const url = `https://api.novaposhta.ua/v2.0/json/AddressGeneral/getWarehouses/?apiKey=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "modelName": "AddressGeneral",
      "calledMethod": "getWarehouses",
      "methodProperties": {
        "CityRef": cityRef,
      },
    }),
  });
  const data = await response.json();
  return data;
}
// Функция, добавляющая товар в корзину
function addToCart(id) {
  const product = products.find((product) => product.id === id);

  if (!product) {
    console.error(`Product with id ${id} not found`);
    return;
  }

  const cartItem = cart.find((item) => item.id === id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart();
  updateCart();
}

// Функция, удаляющая товар из корзины
function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    console.error(`Item with id ${id} not found in cart`);
    return;
  }

  if (cart[index].quantity === 1) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity -= 1;
  }

  saveCart();
  updateCart();
}

// Функция, сохраняющая состояние корзины в LocalStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Функция, загружающая состояние корзины из LocalStorage
function loadCart() {
  const cartJson = localStorage.getItem("cart");
  if (cartJson) {
    cart = JSON.parse(cartJson);
    updateCart();
  }
}

// Функция, обновляющая содержимое корзины в HTML
function updateCart() {
  const cartTableBody = document.querySelector(".cart-table tbody");
  cartTableBody.innerHTML = "";

  if (cart.length === 0) {
    cartTableBody.innerHTML = "<tr><td colspan='4'>Корзина пуста</td></tr>";
    return;
  }

  let totalQuantity = 0;
  let totalPrice = 0;

  for (const item of cart) {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = item.name;
    tr.appendChild(nameTd);

    const priceTd = document.createElement("td");
    priceTd.textContent = item.price.toFixed(2);
    tr.appendChild(priceTd);

    const quantityTd = document.createElement("td");
    quantityTd.textContent = item.quantity;
    tr.appendChild(quantityTd);

    const subtotalTd = document.createElement("td");
    const subtotal = item.price * item.quantity;
    subtotalTd.textContent = subtotal.toFixed(2);
    tr.appendChild(subtotalTd);

    const removeTd = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    removeButton.addEventListener("click", () => removeFromCart(item.id));
    removeTd.appendChild(removeButton);
    tr.appendChild(removeTd);

    cartTableBody.appendChild(tr);

    totalQuantity += item.quantity;
    totalPrice += subtotal;
  }

  document.querySelector(".cart-total-quantity").textContent = totalQuantity;
  document.querySelector(".cart-total-price").textContent = totalPrice.toFixed(2);
}

// Загрузка состояния корзины при запуске
loadCart();
// Функция для удаления товара из корзины
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

// Функция для изменения количества товара в корзине
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

// Функция для обновления итоговой стоимости корзины
function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName(
    "cart-items"
  )[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName(
      "cart-price"
    )[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
}
// Обработчик клика на кнопку "Добавить в корзину"
function onAddToCartButtonClick(event) {
  event.preventDefault();

  // Получаем id товара
  const productId = event.target.dataset.productId;

  // Получаем количество товара
  const productQuantity = parseInt(
    document.querySelector(`#product-${productId}-quantity`).value
  );

  // Добавляем товар в корзину
  addToCart(productId, productQuantity);
}

// Функция для добавления товара в корзину
function addToCart(productId, quantity) {
  // Проверяем, есть ли уже такой товар в корзине
  const existingProduct = cart.find(
    (product) => product.id === productId
  );

  if (existingProduct) {
    // Если товар уже есть в корзине, увеличиваем его количество
    existingProduct.quantity += quantity;
  } else {
    // Если товара еще нет в корзине, добавляем его
    const newProduct = {
      id: productId,
      quantity: quantity,
    };
    cart.push(newProduct);
  }

  // Обновляем информацию о корзине
  updateCartInfo();
}

// Функция для удаления товара из корзины
function removeFromCart(productId) {
  // Находим индекс товара в корзине
  const index = cart.findIndex(
    (product) => product.id === productId
  );

  if (index !== -1) {
    // Если товар найден, удаляем его из корзины
    cart.splice(index, 1);
  }

  // Обновляем информацию о корзине
  updateCartInfo();
}

// Функция для обновления информации о корзине
function updateCartInfo() {
  // Показываем количество товаров в корзине
  const cartQuantity = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );
  cartQuantityElement.textContent = cartQuantity;

  // Показываем список товаров в корзине
  const cartList = document.createElement("ul");
  cart.forEach((product) => {
    const cartListItem = document.createElement("li");
    const cartListItemText = document.createTextNode(
      `${product.quantity} x ${products[product.id].name}`
    );
    cartListItem.appendChild(cartListItemText);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    removeButton.dataset.productId = product.id;
    removeButton.addEventListener(
      "click",
      onRemoveFromCartButtonClick
    );

    cartListItem.appendChild(removeButton);
    cartList.appendChild(cartListItem);
  });

  cartListElement.innerHTML = "";
  cartListElement.appendChild(cartList);

  // Сохраняем корзину в localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}
// функция для обновления корзины в HTML
function updateCart() {
  // получаем элементы корзины и общую стоимость заказа
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // очищаем содержимое корзины
  cartItems.innerHTML = "";

  // если корзина пуста, выводим сообщение об этом
  if (cart.length === 0) {
    const emptyCart = document.createElement("p");
    emptyCart.innerHTML = "Корзина пуста";
    cartItems.appendChild(emptyCart);
    cartTotal.innerHTML = "0 грн";
    return;
  }

  // выводим каждый товар в корзине
  cart.forEach((item) => {
    const cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const itemImg = document.createElement("img");
    itemImg.src = item.image;
    itemImg.alt = item.title;
    cartItem.appendChild(itemImg);

    const itemTitle = document.createElement("h3");
    itemTitle.innerHTML = item.title;
    cartItem.appendChild(itemTitle);

    const itemPrice = document.createElement("p");
    itemPrice.innerHTML = item.price + " грн";
    cartItem.appendChild(itemPrice);

    cartRow.appendChild(cartItem);

    const cartQty = document.createElement("div");
    cartQty.classList.add("cart-qty");

    const qtyLabel = document.createElement("label");
    qtyLabel.htmlFor = `qty-${item.id}`;
    qtyLabel.innerHTML = "Количество:";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.id = `qty-${item.id}`;
    qtyInput.value = item.qty;
    qtyInput.addEventListener("change", () => {
      updateCartQty(item.id, qtyInput.value);
      updateCart();
    });

    cartQty.appendChild(qtyLabel);
    cartQty.appendChild(qtyInput);
    cartRow.appendChild(cartQty);

    const cartItemTotal = document.createElement("p");
    cartItemTotal.classList.add("cart-item-total");
    cartItemTotal.innerHTML = item.qty * item.price + " грн";

    cartRow.appendChild(cartItemTotal);

    cartItems.appendChild(cartRow);
  });

  // выводим общую стоимость заказа
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  cartTotal.innerHTML = totalPrice + " грн";
}
