// billing.js

// We expose this object globally so app.js can talk to it
window.BillingSystem = {
    
    showModal: function(cartData) {
        // 1. Generate Metadata
        document.getElementById('bill-number').textContent = Math.floor(100000 + Math.random() * 900000);
        document.getElementById('bill-date').textContent = new Date().toLocaleString();

        // 2. Populate Bill Items
        const tbody = document.getElementById('bill-items-body');
        tbody.innerHTML = '';
        
        let grandTotal = 0;

        cartData.forEach(item => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>x${item.quantity}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('bill-grand-total').textContent = `₹${grandTotal.toFixed(2)}`;

        // 3. Show the floating Modal
        document.getElementById('bill-modal').style.display = 'flex';
    },

    closeModal: function() {
        document.getElementById('bill-modal').style.display = 'none';
    },

    printReceipt: function() {
        window.print();
    }
};

// Hook up the buttons inside the modal once the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-modal-close').addEventListener('click', () => window.BillingSystem.closeModal());
    document.getElementById('btn-modal-print').addEventListener('click', () => window.BillingSystem.printReceipt());
});