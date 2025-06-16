let logs = JSON.parse(localStorage.getItem("battery_logs")) || [];

function addLog() {
  const chargeDate = document.getElementById("chargeDate").value;
  if (!chargeDate) {
    alert("Please enter a charge date.");
    return;
  }
  const baseDate = new Date(chargeDate);
  const dates = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  logs.push({ chargeDate, dates, distances: ["", "", "", ""] });
  saveLogs();
  renderLogs();
}

function updateDistance(logIndex, dayIndex, value) {
  logs[logIndex].distances[dayIndex] = value;
  saveLogs();
  renderLogs();
}

function saveLogs() {
  localStorage.setItem("battery_logs", JSON.stringify(logs));
}

function renderLogs() {
  const container = document.getElementById("logs");
  container.innerHTML = "";
  logs.forEach((log, logIndex) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>Charge Date: ${log.chargeDate}</h3>`;
    let total = 0;
    for (let i = 0; i < 4; i++) {
      const val = parseInt(log.distances[i]) || 0;
      total += val;
      card.innerHTML += `
        <div>Day ${i + 1} (${log.dates[i]}):</div>
        <input type="number" value="${log.distances[i]}" onchange="updateDistance(${logIndex}, ${i}, this.value)" />
      `;
    }
    card.innerHTML += `<div class="total">Total Distance: ${total} km</div>`;
    container.appendChild(card);
  });
}

window.onload = renderLogs;