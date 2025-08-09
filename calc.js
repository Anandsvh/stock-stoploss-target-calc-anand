 function calculate() {
  // sanitize: trim, remove spaces, convert commas to dot
  const sanitize = s => (s || "").toString().trim().replace(/\s+/g, "").replace(/,/g, ".");

  const entryPriceValue = sanitize(document.getElementById('entryPrice').value);
  const lossPercentValue = sanitize(document.getElementById('lossPercent').value);
  const targetPercentValue = sanitize(document.getElementById('targetPercent').value);

  // Accept formats like: 100  |  0.5  |  .75
  const numericRe = /^(\d+(\.\d*)?|\.\d+)$/;

  if (!numericRe.test(entryPriceValue) || !numericRe.test(lossPercentValue) || !numericRe.test(targetPercentValue)) {
    alert("Please enter valid positive numbers (examples: 100, 0.5, .75).");
    return;
  }

  const entryPrice = parseFloat(entryPriceValue);
  const lossPercent = parseFloat(lossPercentValue);
  const targetPercent = parseFloat(targetPercentValue);

  if (isNaN(entryPrice) || isNaN(lossPercent) || isNaN(targetPercent)) {
    alert("Please fill in all fields with valid numbers.");
    return;
  }

  // Compute using higher internal precision, then format for display
  const stoplossPrice = Number((entryPrice * (1 - lossPercent / 100)).toFixed(10));
  const targetPrice   = Number((entryPrice * (1 + targetPercent / 100)).toFixed(10));

  const stoplossDiff = entryPrice - stoplossPrice;
  const targetDiff   = targetPrice - entryPrice;

  document.getElementById('result').innerHTML = `
    <p>Target Price<span class="colone">:</span> ₹${targetPrice.toFixed(2)} <span class="target-price">(+₹${targetDiff.toFixed(2)})</span></p>
    <p>Stoploss Price<span class="colone">:</span> ₹${stoplossPrice.toFixed(2)} <span class="stop-loss">(-₹${stoplossDiff.toFixed(2)})</span></p>
  `;
}

// Register Service Worker (keep as-is)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registered"));
}
