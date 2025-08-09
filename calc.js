function calculate() {
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const lossPercent = parseFloat(document.getElementById('lossPercent').value);
    const targetPercent = parseFloat(document.getElementById('targetPercent').value);

    if (isNaN(entryPrice) || isNaN(lossPercent) || isNaN(targetPercent)) {
        alert("Please fill in all fields with valid numbers.");
        return;
    }

    const stoplossPrice = entryPrice - (entryPrice * lossPercent / 100);
    const targetPrice = entryPrice + (entryPrice * targetPercent / 100);

    const stoplossDiff = entryPrice - stoplossPrice;
    const targetDiff = targetPrice - entryPrice;

    document.getElementById('result').innerHTML = `
    <p>Stoploss Price<span class="colone">:</span> ₹${stoplossPrice.toFixed(2)} <span class="stop-loss">(-₹${stoplossDiff.toFixed(2)})</span></p>
    <p>Target Price<span class="colone">:</span> ₹${targetPrice.toFixed(2)} <span class="target-price">(+₹${targetDiff.toFixed(2)})</span></p>
  `;
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log("Service Worker Registered"));
}