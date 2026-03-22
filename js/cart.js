/* ============================================
   Jeff Nading Miller Welder Repair — Shopping Cart
   Version: 1.0
   ============================================ */

// Cart stored in localStorage
let cart = JSON.parse(localStorage.getItem('welderCart')) || [];

function saveCart() {
    localStorage.setItem('welderCart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId, name, price, image) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, name, price: parseFloat(price), image, qty: 1 });
    }
    saveCart();
    showAddedFeedback(productId);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('visible');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }
}

function updateCartUI() {
    // Update cart count badge
    const countEl = document.getElementById('cartCount');
    if (countEl) {
        const count = getCartCount();
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'flex' : 'none';
    }

    // Update cart sidebar contents
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');

    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = `
            <div class="cart-empty">
                <div class="icon">&#128722;</div>
                <p>Your cart is empty</p>
                <a href="${getBasePath()}pages/shop.html" class="btn btn--primary btn--small mt-2">Browse Shop</a>
            </div>
        `;
        if (footerEl) footerEl.style.display = 'none';
    } else {
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img class="cart-item__img" src="${item.image}" alt="${item.name}">
                    <div class="cart-item__info">
                        <div class="cart-item__name">${item.name}</div>
                        <div class="cart-item__price">${formatCurrency(item.price)}</div>
                        <div class="cart-item__qty">
                            <button onclick="updateQty('${item.id}', -1)">-</button>
                            <span>${item.qty}</span>
                            <button onclick="updateQty('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item__remove" onclick="removeFromCart('${item.id}')" title="Remove">&times;</button>
                </div>
            `;
        });
        itemsEl.innerHTML = html;
        if (footerEl) footerEl.style.display = 'block';
        if (totalEl) totalEl.textContent = formatCurrency(getCartTotal());
    }
}

function showAddedFeedback(productId) {
    const btn = document.querySelector(`[data-product-id="${productId}"]`);
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Added!';
        btn.style.background = '#28A745';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    }
}

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../';
    }
    return '';
}

function checkout() {
    if (cart.length === 0) return;
    alert('Checkout functionality will be connected to a payment processor. For now, please contact Jeff directly with your order.\n\nCart total: ' + formatCurrency(getCartTotal()));
}

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', updateCartUI);
