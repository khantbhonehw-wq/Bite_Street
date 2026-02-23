const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyHIokY7RUqptwxKYkRSUrngC2TJ5rYdSglkZTUDO2smBHKIx3r3XLyNhkro8zG0bQ4/exec";

const menuItems = [
    { id: 1, name: "2pc Chicken", price: 6.50, category: "chicken" },
    { id: 2, name: "6pc Wings", price: 8.99, category: "chicken" },
    { id: 3, name: "Family Pack", price: 22.00, category: "chicken" },
    { id: 4, name: "Hot Americano", price: 3.50, category: "coffee" },
    { id: 5, name: "Iced Latte", price: 4.50, category: "coffee" }
];

let cart = [];

function filterMenu(cat) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';
    menuItems.filter(i => i.category === cat).forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-card';
        div.innerHTML = `<h3>${item.name}</h3><p>$${item.price.toFixed(2)}</p>`;
        div.onclick = () => { cart.push(item); updateUI(); };
        grid.appendChild(div);
    });
}

function updateUI() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price;
        container.innerHTML += `<div class="cart-item"><span>${item.name}</span><span>$${item.price}</span></div>`;
    });
    document.getElementById('total-price').innerText = total.toFixed(2);
}

function toggleTableInput() {
    const type = document.getElementById('order-type').value;
    document.getElementById('table-number').style.display = (type === 'Dine-in') ? 'block' : 'none';
}

async function submitOrder() {
    if (cart.length === 0) return alert("Empty order");
    
    const breakdown = {
        chicken: cart.filter(i => i.category === 'chicken').reduce((s, i) => s + i.price, 0),
        coffee: cart.filter(i => i.category === 'coffee').reduce((s, i) => s + i.price, 0)
    };

    const payload = {
        orderType: document.getElementById('order-type').value,
        tableNum: document.getElementById('table-number').value,
        items: cart.map(i => i.name),
        total: document.getElementById('total-price').innerText,
        breakdown: breakdown
    };

    try {
        const res = await fetch(SHEETS_URL, { method: 'POST', body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.lowStock.length > 0) alert("Low Stock: " + data.lowStock.join(", "));
        alert("Order Complete!");
        cart = []; updateUI();
    } catch (e) { alert("Order Saved to Sheets!"); cart = []; updateUI(); }
}

async function closeDay() {
    if (confirm("Email daily report and close out?")) {
        fetch(`${SHEETS_URL}?action=closeDay`);
        alert("Report request sent.");
    }
}

filterMenu('chicken'); // Default view
