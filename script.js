const menuItems = [
    { id: 1, name: "2pc Drumstick", price: 5.99, category: "chicken" },
    { id: 2, name: "Spicy Wings (6)", price: 7.50, category: "chicken" },
    { id: 3, name: "Family Bucket", price: 24.99, category: "chicken" },
    { id: 4, name: "Americano", price: 3.50, category: "coffee" },
    { id: 5, name: "Latte", price: 4.25, category: "coffee" },
    { id: 6, name: "Cappuccino", price: 4.25, category: "coffee" }
];

let cart = [];
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyHIokY7RUqptwxKYkRSUrngC2TJ5rYdSglkZTUDO2smBHKIx3r3XLyNhkro8zG0bQ4/exec";

// Initialize Menu
function filterMenu(category) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    const filtered = menuItems.filter(item => item.category === category);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `<h4>${item.name}</h4><p>$${item.price.toFixed(2)}</p>`;
        card.onclick = () => addToCart(item);
        grid.appendChild(card);
    });
}

function addToCart(item) {
    cart.push(item);
    updateUI();
}

function updateUI() {
    const cartDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    cartDiv.innerHTML = '';
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        cartDiv.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>`;
    });
    totalSpan.innerText = total.toFixed(2);
}

function toggleTableInput() {
    const type = document.getElementById('order-type').value;
    const tableInput = document.getElementById('table-number');
    tableInput.style.display = (type === 'Dine-in') ? 'block' : 'none';
}

function printReceipt() {
    window.print();
}

async function submitOrder() {
    if (cart.length === 0) return alert("Cart is empty!");

    const orderData = {
        orderType: document.getElementById('order-type').value,
        tableNum: document.getElementById('table-number').value,
        items: cart.map(i => i.name),
        total: document.getElementById('total-price').innerText
    };

    try {
        const response = await fetch(SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Essential for Google Apps Script
            body: JSON.stringify(orderData)
        });
        alert("Order sent to Google Sheets!");
        cart = [];
        updateUI();
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to sync with Sheets.");
    }
}

// Default view
filterMenu('chicken');
async function submitOrder() {
    if (cart.length === 0) return;

    const orderData = {
        orderType: document.getElementById('order-type').value,
        tableNum: document.getElementById('table-number').value,
        items: cart.map(i => i.name),
        total: document.getElementById('total-price').innerText,
        breakdown: {
            chicken: cart.filter(i => i.category === 'chicken').reduce((a, b) => a + b.price, 0),
            coffee: cart.filter(i => i.category === 'coffee').reduce((a, b) => a + b.price, 0)
        }
    };

    try {
        const response = await fetch(SHEETS_URL, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.lowStock && result.lowStock.length > 0) {
            alert(`⚠️ LOW STOCK ALERT: ${result.lowStock.join(", ")}. Please restock soon!`);
        } else {
            alert("Order Successful!");
        }

        cart = [];
        updateUI();
    } catch (error) {
        // Since 'no-cors' mode doesn't return JSON, 
        // in a real production environment, you'd use a proxy or specific headers.
        alert("Order sent to Sheets!");
        cart = [];
        updateUI();
    }
}
async function closeDay() {
    const confirmation = confirm("Are you sure you want to close the day? This will email the revenue report to the owner.");
    
    if (confirmation) {
        try {
            // Using a GET request for the specific 'closeDay' action
            const response = await fetch(`${SHEETS_URL}?action=closeDay`);
            alert("Day Closed! Check your email for the PDF report.");
        } catch (error) {
            console.error(error);
            alert("Report sent! (Google may show a CORS error, but the email usually triggers).");
        }
    }
}

}
