class BillingApp {
    constructor() {
        // 1. STATE: Our single source of truth
        this.menuItems = [
            { id: 1, name: 'Masala Dosa', price: 95, category: 'South Indian' },
            { id: 2, name: 'Veg Biryani', price: 160, category: 'Main Course' },
            { id: 3, name: 'Paneer Roll', price: 110, category: 'Starters' },
            { id: 4, name: 'Samosa', price: 25, category: 'Starters' },
            { id: 5, name: 'Filter Coffee', price: 45, category: 'Beverages' },
            { id: 6, name: 'Fresh Lime Soda', price: 55, category: 'Beverages' }
        ];
        
        this.cart = []; // Will hold objects like: { id: 1, name: '...', price: 95, quantity: 2 }

        // Boot up the UI
        this.init();
    }

    init() {
        this.renderMenu();
        this.renderCart(); // Render empty state initially
        this.setupEventListeners();
    }

    // --- MENU LOGIC ---
    renderMenu() {
        const container = document.getElementById('menu-container');
        container.innerHTML = ''; 
        
        this.menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.innerHTML = `
                <h4>${item.name}</h4>
                <span class="price">₹${item.price}</span>
            `;
            
            // Add click listener to push this item to the cart
            card.addEventListener('click', () => this.addToCart(item));
            container.appendChild(card);
        });
    }

    // --- CART LOGIC ---
    addToCart(menuItem) {
        // Check if item is already in the cart
        const existingItem = this.cart.find(cartItem => cartItem.id === menuItem.id);

        if (existingItem) {
            existingItem.quantity += 1; // Increment if it exists
        } else {
            // Add new item with a starting quantity of 1
            this.cart.push({ ...menuItem, quantity: 1 });
        }

        // State has changed, so we trigger a UI re-render
        this.renderCart();
    }

    updateQuantity(itemId, change) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            this.cart[itemIndex].quantity += change;

            // Remove item if quantity drops to 0
            if (this.cart[itemIndex].quantity <= 0) {
                this.cart.splice(itemIndex, 1);
            }
        }
        
        this.renderCart();
    }

    renderCart() {
        const container = document.getElementById('cart-container');
        const countBadge = document.getElementById('cart-count');
        const totalDisplay = document.getElementById('cart-total');

        // 1. Calculate Totals using Array.reduce
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 2. Update Headers/Footers
        countBadge.textContent = `${totalItems} items`;
        totalDisplay.textContent = `₹${totalPrice.toFixed(2)}`;

        // 3. Render Cart Items UI
        if (this.cart.length === 0) {
            container.innerHTML = `<p class="empty-state">Your order is empty. Add an item from the menu.</p>`;
            return;
        }

        container.innerHTML = ''; // Clear container

        this.cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            
            cartItemEl.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price * item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus">+</button>
                </div>
            `;

            // Attach event listeners for the + and - buttons
            cartItemEl.querySelector('.minus').addEventListener('click', () => this.updateQuantity(item.id, -1));
            cartItemEl.querySelector('.plus').addEventListener('click', () => this.updateQuantity(item.id, 1));

            container.appendChild(cartItemEl);
        });
    }

    // --- EVENT LISTENERS & DECOUPLED HANDOFF ---
    setupEventListeners() {
        // Clear order logic stays here
        document.getElementById('btn-clear').addEventListener('click', () => this.clearCart()); 
        
        // Proceed to Bill now hands the data off to billing.js
        document.getElementById('btn-proceed').addEventListener('click', () => {
            if (this.cart.length === 0) {
                alert("Cart is empty! Add items before proceeding.");
                return;
            }
            // Hand off the array to the global modal system
            window.BillingSystem.showModal(this.cart);
        });
    }

    clearCart() {
        if (this.cart.length === 0) return; 
        if (confirm('Are you sure you want to clear the entire order?')) {
            this.cart = []; 
            this.renderCart(); 
        }
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new BillingApp();
});