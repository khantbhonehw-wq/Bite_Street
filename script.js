const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyHIokY7RUqptwxKYkRSUrngC2TJ5rYdSglkZTUDO2smBHKIx3r3XLyNhkro8zG0bQ4/exec";

let menuItems = []; // Now starts empty
let cart = [];

// 1. Fetch Menu from Google Sheets on Load
async function loadMenu() {
try {
const response = await fetch(`${SHEETS_URL}?action=getMenu`);
menuItems = await response.json();
filterMenu('chicken'); // Load chicken by default once data arrives
} catch (error) {
"console.error(""Error loading menu:"", error);"
"alert(""Failed to load menu from Google Sheets."");"
}
}

function filterMenu(cat) {
const grid = document.getElementById('menu-grid');
grid.innerHTML = '';

const filtered = menuItems.filter(i => i.category === cat);
filtered.forEach(item => {
const div = document.createElement('div');
div.className = 'menu-card';
div.innerHTML = `<h3>${item.name}</h3><p>$${item.price.toFixed(2)}</p>`;
div.onclick = () => addToCart(item);
grid.appendChild(div);
});
}

function addToCart(item) {
cart.push(item);
updateUI();
}

function updateUI() {
const container = document.getElementById('cart-items');
let total = 0;
container.innerHTML = '';
cart.forEach((item, idx) => {
total += item.price;
container.innerHTML += `
"<div class=""cart-item"">"
<span>${item.name}</span>
<span>$${item.price.toFixed(2)}</span>
</div>`;
});
document.getElementById('total-price').innerText = total.toFixed(2);
}

// Kitchen View Logic (Simple Redirect for now)
function openKitchenView() {
window.open(`https://docs.google.com/spreadsheets/d/${YOUR_SHEET_ID}/edit#gid=ORDERS_ID`, '_blank');
}

// Initial Load
loadMenu();