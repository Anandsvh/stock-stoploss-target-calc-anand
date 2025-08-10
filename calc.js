function calculate() {
  const sanitize = s => (s || "").toString().trim().replace(/\s+/g, "").replace(/,/g, ".");

  const isSell = document.getElementById('tradeToggle').checked; // false=buy, true=sell
  const tradeType = isSell ? "sell" : "buy";

  const entryPriceValue = sanitize(document.getElementById('entryPrice').value);
  const lossPercentValue = sanitize(document.getElementById('lossPercent').value);
  const targetPercentValue = sanitize(document.getElementById('targetPercent').value);
  const quantityValue = sanitize(document.getElementById('quantity').value);

  const numericRe = /^(\d+(\.\d*)?|\.\d+)$/;

  if (!numericRe.test(entryPriceValue) || !numericRe.test(lossPercentValue) ||
    !numericRe.test(targetPercentValue) || !numericRe.test(quantityValue)) {
    alert("Please enter valid positive numbers (examples: 100, 0.5, .75).");
    return;
  }

  const entryPrice = parseFloat(entryPriceValue);
  const lossPercent = parseFloat(lossPercentValue);
  const targetPercent = parseFloat(targetPercentValue);
  const quantity = parseFloat(quantityValue);

  if ([entryPrice, lossPercent, targetPercent, quantity].some(isNaN)) {
    alert("Please fill in all fields with valid numbers.");
    return;
  }

  // ✅ Validation ranges
  if (lossPercent < 0.05 || lossPercent > 10) {
    alert("Stoploss % must be between 0.05 and 10.");
    return;
  }

  if (targetPercent < 0.05 || targetPercent > 50) {
    alert("Target % must be between 0.05 and 50.");
    return;
  }

  let stoplossPrice, targetPrice, stoplossDiff, targetDiff;

  if (tradeType === "buy") {
    stoplossPrice = entryPrice * (1 - lossPercent / 100);
    targetPrice = entryPrice * (1 + targetPercent / 100);
    stoplossDiff = entryPrice - stoplossPrice;
    targetDiff = targetPrice - entryPrice;
  } else {
    stoplossPrice = entryPrice * (1 + lossPercent / 100);
    targetPrice = entryPrice * (1 - targetPercent / 100);
    stoplossDiff = stoplossPrice - entryPrice;
    targetDiff = entryPrice - targetPrice;
  }

  const totalProfit = quantity * targetDiff;
  const totalLoss = quantity * stoplossDiff;

  document.getElementById('result').innerHTML = `
    <p><b>Mode:</b><span class=${tradeType === "buy" ? 'color-buy' : 'color-sell'}> ${tradeType.toUpperCase()}</span></p>
    <p>Capital Req: ₹${(entryPrice * quantity).toFixed(2)}</p>
    <p>Stoploss Price<span class="colone">:</span> ₹${stoplossPrice.toFixed(2)} <span class="stop-loss">(-₹${stoplossDiff.toFixed(2)})</span></p>
    <p>Target Price<span class="colone">:</span> ₹${targetPrice.toFixed(2)} <span class="target-price">(+₹${targetDiff.toFixed(2)})</span></p>
    <hr>
    <p>Profit<span class="colone">:</span> <span class="target-price">+₹${totalProfit.toFixed(2)}</span></p>
    <p>Loss<span class="colone">:</span> <span class="stop-loss">-₹${totalLoss.toFixed(2)}</span></p>
  `;

}

function updateButtonColor() {
  const btn = document.getElementById('btnCalc');
  const title = document.getElementById('appTitle');
  const isSell = document.getElementById('tradeToggle').checked;

  if (isSell) {
    btn.classList.add('sell-mode');
    title.classList.add('sell-mode');
  } else {
    btn.classList.remove('sell-mode');
    title.classList.remove('sell-mode');
  }

  document.getElementById('result').innerHTML = '';
}
