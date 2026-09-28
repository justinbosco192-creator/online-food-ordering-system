const foods = [
    { id: 1, name: "Margherita Pizza", category: "Pizza", price: 249, rating: 4.5, emoji: "🍕", featured: true },
    { id: 2, name: "Pepperoni Pizza", category: "Pizza", price: 329, rating: 4.7, emoji: "🍕", featured: true },
    { id: 3, name: "Cheeseburger", category: "Burgers", price: 179, rating: 4.3, emoji: "🍔", featured: true },
    { id: 4, name: "Chicken Burger", category: "Burgers", price: 199, rating: 4.6, emoji: "🍔" },
    { id: 5, name: "Alfredo Pasta", category: "Pasta", price: 269, rating: 4.4, emoji: "🍝" },
    { id: 6, name: "Arrabbiata Pasta", category: "Pasta", price: 249, rating: 4.2, emoji: "🍝" },
    { id: 7, name: "Butter Chicken", category: "Indian", price: 299, rating: 4.8, emoji: "🍛", featured: true },
    { id: 8, name: "Paneer Masala", category: "Indian", price: 259, rating: 4.5, emoji: "🍛" },
    { id: 9, name: "Chocolate Cake", category: "Desserts", price: 129, rating: 4.9, emoji: "🍰", featured: true },
    { id: 10, name: "Ice Cream", category: "Desserts", price: 99, rating: 4.1, emoji: "🍨" },
    { id: 11, name: "Lime Soda", category: "Drinks", price: 59, rating: 4.0, emoji: "🥤" },
    { id: 12, name: "Cold Coffee", category: "Drinks", price: 109, rating: 4.6, emoji: "🧋" },
    { id: 13, name: "Veg Supreme Pizza", category: "Pizza", price: 299, rating: 4.4, emoji: "🍕" },
    { id: 14, name: "BBQ Chicken Pizza", category: "Pizza", price: 349, rating: 4.6, emoji: "🍕" },
    { id: 15, name: "Veg Burger", category: "Burgers", price: 149, rating: 4.1, emoji: "🍔" },
    { id: 16, name: "Double Patty Burger", category: "Burgers", price: 259, rating: 4.7, emoji: "🍔" },
    { id: 17, name: "Mac and Cheese", category: "Pasta", price: 229, rating: 4.3, emoji: "🍝" },
    { id: 18, name: "Pesto Pasta", category: "Pasta", price: 279, rating: 4.5, emoji: "🍝" },
    { id: 19, name: "Chicken Biryani", category: "Indian", price: 289, rating: 4.9, emoji: "🍛", featured: true },
    { id: 20, name: "Veg Thali", category: "Indian", price: 199, rating: 4.2, emoji: "🍛" },
    { id: 21, name: "Brownie with Ice Cream", category: "Desserts", price: 149, rating: 4.8, emoji: "🍰" },
    { id: 22, name: "Gulab Jamun", category: "Desserts", price: 79, rating: 4.7, emoji: "🍮" },
    { id: 23, name: "Mango Shake", category: "Drinks", price: 119, rating: 4.5, emoji: "🥭" },
    { id: 24, name: "Masala Chai", category: "Drinks", price: 39, rating: 4.4, emoji: "☕" }
];

const cartStorageKey = "foodie-express-cart";
let cart = loadCart();
let toastTimer;

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
        return Array.isArray(savedCart) ? savedCart : [];
    } catch {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

const categories = [
    { name: "Pizza", emoji: "🍕" }, { name: "Burgers", emoji: "🍔" },
    { name: "Pasta", emoji: "🍝" }, { name: "Indian", emoji: "🍛" },
    { name: "Desserts", emoji: "🍰" }, { name: "Drinks", emoji: "🥤" }
];

const foodImages = {
    Pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
    Burgers: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    Pasta: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",
    Indian: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
    Desserts: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
    Drinks: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80"
};

// ---------- Start ----------
function init() {
    // Home: categories
    document.getElementById("categoryList").innerHTML = categories.map(c => `
        <button class="category-card" type="button" onclick="openCategory('${c.name}')">
            <span class="category-emoji" aria-hidden="true">${c.emoji}</span>
            <strong>${c.name}</strong><span class="category-arrow" aria-hidden="true">↗</span>
        </button>`).join("");

    // Home: featured foods
    document.getElementById("featuredList").innerHTML = foodCards(foods.filter(f => f.featured));

    renderMenu();
    updateCartCount();
}

// ---------- Show one page, hide the others ----------
function showPage(name) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("is-hidden"));
    document.getElementById("page-" + name).classList.remove("is-hidden");
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("is-current"));
    if (name === "home" || name === "menu") {
        document.querySelector(`.nav-link[onclick="showPage('${name}')"]`)?.classList.add("is-current");
    }
    window.scrollTo(0, 0);
    if (name === "cart") renderCart();
    if (name === "checkout") renderSummary();
}

// ---------- Food cards ----------
function foodCards(list) {
    if (list.length === 0) return `<div class="empty-state"><strong>Nothing on the menu just yet.</strong>Try another search or category.</div>`;
    return list.map(f => `
        <article class="food-card">
            <div class="food-image-wrap">
                <img class="food-image" src="${foodImages[f.category]}" alt="${f.name}" loading="lazy" />
                <span class="food-emoji" aria-hidden="true">${f.emoji}</span>
            </div>
            <div class="food-card-body">
                <div class="food-card-meta"><span class="food-category">${f.category}</span><span class="rating">★ ${f.rating.toFixed(1)}</span></div>
                <h3>${f.name}</h3>
                <div class="food-card-bottom"><span class="price">₹${f.price}</span>
                    <button class="add-button" type="button" onclick="addToCart(${f.id})">Add to bag <span aria-hidden="true">+</span></button>
                </div>
            </div>
        </article>`).join("");
}

// ---------- Cart actions ----------
function addToCart(id) {
    const food = foods.find(item => item.id === id);
    if (!food) return;

    const item = cart.find(cartItem => cartItem.foodId === id);
    if (item) {
        item.quantity++;
        item.total = item.price * item.quantity;
    } else {
        cart.push({ foodId: food.id, name: food.name, emoji: food.emoji, price: food.price, quantity: 1, total: food.price });
    }
    saveCart();
    updateCartCount();
    showToast("Added to your bag");
}

function changeQty(id, delta) {
    const item = cart.find(cartItem => cartItem.foodId === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(cartItem => cartItem.foodId !== id);
    else item.total = item.price * item.quantity;
    saveCart();
    updateCartCount();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(item => item.foodId !== id);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    document.getElementById("cartCount").textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// ---------- Cart page ----------
function renderCart() {
    const area = document.getElementById("cartArea");

    if (cart.length === 0) {
        area.innerHTML = `<div class="empty-cart"><div class="empty-cart-mark" aria-hidden="true">🛍️</div>
            <h2>Your bag is waiting.</h2><p>Fill it with something delicious.</p>
            <button class="primary-button" type="button" onclick="showPage('menu')">Browse the menu <span aria-hidden="true">→</span></button></div>`;
        return;
    }

    const total = cart.reduce((sum, i) => sum + i.total, 0);

    area.innerHTML = `<div class="cart-layout">
        <div class="cart-items">${cart.map(i => `
            <article class="cart-item">
                <div class="cart-item-emoji" aria-hidden="true">${i.emoji}</div>
                <div><h3>${i.name}</h3><p>₹${i.price} each</p></div>
                <div class="cart-item-actions">
                    <button class="qty-button" type="button" aria-label="Decrease ${i.name} quantity" onclick="changeQty(${i.foodId}, -1)">−</button>
                    <strong>${i.quantity}</strong>
                    <button class="qty-button" type="button" aria-label="Increase ${i.name} quantity" onclick="changeQty(${i.foodId}, 1)">+</button>
                    <span class="cart-line-total">₹${i.total}</span>
                    <button class="remove-button" type="button" aria-label="Remove ${i.name}" onclick="removeItem(${i.foodId})">×</button>
                </div>
            </article>`).join("")}</div>
        <aside class="order-panel"><h2>Your order</h2>
            <div class="order-total"><span>Total</span><strong>₹${total}</strong></div>
            <button class="primary-button full-button" type="button" onclick="showPage('checkout')">Continue to checkout <span aria-hidden="true">→</span></button>
        </aside>
    </div>`;
}

// ---------- Checkout page ----------
function renderSummary() {
    const total = cart.reduce((sum, i) => sum + i.total, 0);
    document.getElementById("orderSummary").innerHTML = `
        <h2>Order summary</h2>
        ${cart.map(i => `<div class="summary-row"><span>${i.name} × ${i.quantity}</span><strong>₹${i.total}</strong></div>`).join("")}
        <div class="order-total"><span>Total</span><strong>₹${total}</strong></div>
        <p class="secure-note">Cash on delivery · Made fresh for you</p>`;
}

function placeOrder() {
    const order = {
        customerName: document.getElementById("custName").value.trim(),
        phone: document.getElementById("custPhone").value.trim(),
        address: document.getElementById("custAddress").value.trim()
    };

    const error = document.getElementById("checkoutError");
    if (cart.length === 0) {
        error.textContent = "Your cart is empty.";
        return;
    }
    if (!order.customerName) {
        error.textContent = "Please enter your name.";
        return;
    }
    if (!order.address) {
        error.textContent = "Please enter your address.";
        return;
    }
    if (!/^\d{10}$/.test(order.phone)) {
        error.textContent = "Phone number must be 10 digits.";
        return;
    }

    error.textContent = "";
    const result = {
        ...order,
        orderId: `FD${Math.floor(100000 + Math.random() * 900000)}`,
        items: cart.map(item => ({ ...item })),
        total: cart.reduce((sum, item) => sum + item.total, 0)
    };
    cart = [];
    saveCart();
    updateCartCount();
    showSuccess(result);
}

// ---------- Success page ----------
function showSuccess(o) {
    document.getElementById("successArea").innerHTML = `
        <div class="success-icon" aria-hidden="true">✓</div>
        <h2>Order placed. Good things are coming.</h2>
        <p>Thanks, <strong>${o.customerName}</strong>. Your food is being prepared.</p>
        <div class="success-id">Order ${o.orderId}</div>
        <div class="success-details">${o.address}<br />${o.phone}<br />Estimated delivery: 30–40 minutes</div>
        <div class="success-items">${o.items.map(i => `<div class="summary-row"><span>${i.name} × ${i.quantity}</span><strong>₹${i.total}</strong></div>`).join("")}
            <div class="summary-row"><strong>Total</strong><strong>₹${o.total}</strong></div></div>
        <button class="primary-button" type="button" onclick="showPage('home')">Back to the good stuff <span aria-hidden="true">→</span></button>`;
    showPage("success");
}
// ---------- Menu page ----------
let selectedCategory = "";   // "" means All

function renderPills() {
    const all = `<button class="pill ${selectedCategory === "" ? "active" : ""}" type="button" aria-pressed="${selectedCategory === ""}" onclick="setCategory('')">All</button>`;
    document.getElementById("menuPills").innerHTML = all + categories.map(c => `
        <button class="pill ${selectedCategory === c.name ? "active" : ""}" type="button" aria-pressed="${selectedCategory === c.name}"
              onclick="setCategory('${c.name}')">${c.emoji} ${c.name}</button>`).join("");
}

function setCategory(name) {
    selectedCategory = name;
    renderMenu();
}

function renderMenu() {
    const text = document.getElementById("menuSearch").value.toLowerCase();
    const sort = document.getElementById("menuSort").value;

    // 1. filter by search text + category
    let result = foods.filter(f =>
        f.name.toLowerCase().includes(text) &&
        (selectedCategory === "" || f.category === selectedCategory));

    // 2. sort
    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    // 3. show
    renderPills();
    document.getElementById("menuCount").textContent = `Showing ${result.length} item(s)`;
    document.getElementById("menuList").innerHTML = foodCards(result);
}

function searchFromHome() {
    document.getElementById("menuSearch").value = document.getElementById("homeSearch").value;
    selectedCategory = "";
    renderMenu();
    showPage("menu");
}

function openCategory(name) {
    document.getElementById("menuSearch").value = "";
    selectedCategory = name;
    renderMenu();
    showPage("menu");
}
init();