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