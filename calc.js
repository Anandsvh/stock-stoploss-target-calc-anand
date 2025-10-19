function calculate() {
  const sanitize = s => (s || "").toString().trim().replace(/\s+/g, "").replace(/,/g, ".");

  const isSell = document.getElementById('tradeToggle').checked; // false=buy, true=sell
  const tradeType = isSell ? "sell" : "buy";

  const entryPriceValue = sanitize(document.getElementById('entryPrice').value);
  const lossPercentValue = sanitize(document.getElementById('lossPercent').value);
  const targetPercentValue = sanitize(document.getElementById('targetPercent').value);
  const quantityValue = sanitize(document.getElementById('quantity').value);
  const allError = document.getElementById('allError');

  const numericRe = /^(\d+(\.\d*)?|\.\d+)$/;

  if (!numericRe.test(entryPriceValue) || !numericRe.test(lossPercentValue) ||
    !numericRe.test(targetPercentValue) || !numericRe.test(quantityValue)) {
    allError.innerHTML = "⚠️ Please enter valid positive numbers (Ex: 100, 0.5, .75).";
    return;
  }

  const entryPrice = parseFloat(entryPriceValue);
  const lossPercent = parseFloat(lossPercentValue);
  const targetPercent = parseFloat(targetPercentValue);
  const quantity = parseFloat(quantityValue);

  if ([entryPrice, lossPercent, targetPercent, quantity].some(isNaN)) {
    allError.innerHTML = "⚠️ Please fill in all fields with valid numbers.";
    return;
  }

  // ✅ Validation ranges
  if (lossPercent < 0.05 || lossPercent > 10) {
    allError.innerHTML = "⚠️ Stoploss % must be between 0.05 and 10.";
    return;
  }

  if (quantity < 1 || quantity > 25000) {
    allError.innerHTML = "⚠️ Quantity must be an integer between 1 to 25,000";
    return;
  }

  if (targetPercent < 0.05 || targetPercent > 50) {
    allError.innerHTML = "⚠️ Target % must be between 0.05 and 50.";
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
    <p>Capital Req: <span class='capital'>₹${(entryPrice * quantity).toLocaleString('en-IN')}</span></p>
    <p>Stoploss Price<span class="colone">:</span> ₹${stoplossPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="stop-loss">(-₹${stoplossDiff.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span></p>
    <p>Target Price<span class="colone">:</span> ₹${targetPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="target-price">(+₹${targetDiff.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span></p>
    <hr>
    <p>Profit<span class="colone">:</span> <span class="target-price">+₹${totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
    <p>Loss<span class="colone">:</span> <span class="stop-loss">-₹${totalLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
  `;

  allError.innerHTML = "";
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
  document.getElementById('allError').innerHTML = '';
}

function calculatePercentage() {
  const part = parseFloat(document.getElementById("part").value);
  const TotalValue = document.getElementById("total").value;
  const total = parseFloat(TotalValue.replace(/,/g, ''));
  const resultDiv = document.getElementById("totalResult");

  if (isNaN(part) || isNaN(total) || total === 0) {
    resultDiv.innerText = "⚠️ Please enter valid numbers.";
    resultDiv.classList.add('total-err');
    return;
  }
  resultDiv.classList.remove('total-err');

  const percentage = (part / total) * 100;
  resultDiv.innerHTML = `${part} is <b>${percentage.toFixed(2)}%</b> of ${TotalValue}`;
}

function calculateValue() {
  const percent = parseFloat(document.getElementById("percentValue").value);
  const TotalValue = document.getElementById("baseValue").value;
  const total = parseFloat(TotalValue.replace(/,/g, ''));
  const resultDiv = document.getElementById("valueResult");

  if (isNaN(percent) || isNaN(total)) {
    resultDiv.innerText = "⚠️ Please enter valid numbers.";
    resultDiv.classList.add('total-err');
    return;
  }
  resultDiv.classList.remove('total-err');
  const value = (percent / 100) * total;
  resultDiv.innerHTML = `${percent}% of ${TotalValue} is <b>${value.toFixed(2)}</b>`;
}

// Function to format numbers with commas
function formatNumberInput(el) {
  let value = el.value;

  // Remove all commas
  value = value.replace(/,/g, '');

  // Split integer and decimal part
  let [integerPart, decimalPart] = value.split('.');

  // Remove any non-digit characters from integer part
  integerPart = integerPart.replace(/[^\d]/g, '');

  // Add commas to integer part
  if (integerPart) {
    integerPart = Number(integerPart).toLocaleString('en-IN');
  }

  // Combine integer and decimal part
  el.value = decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;
}

// Attach the function to all inputs with class "format-number"
document.addEventListener('input', function (e) {
  if (e.target.classList.contains('format-number')) {
    formatNumberInput(e.target);
  }
});