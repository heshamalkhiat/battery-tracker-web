function getLogs() {
  return JSON.parse(localStorage.getItem("battery_logs") || "[]");
}

function saveLogs(logs) {
  localStorage.setItem("battery_logs", JSON.stringify(logs));
}

function addLog() {
  const dateInput = document.getElementById("chargeDate");
  if (!dateInput.value) {
    alert("Please enter a charge date.");
    return;
  }

  const startDate = new Date(dateInput.value);
  const dates = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const log = {
    chargeDate: dateInput.value,
    dates,
    distances: ["", "", "", ""]
  };

  const logs = getLogs();
  logs.push(log);
  saveLogs(logs);
  dateInput.value = "";
  renderLogs();
}

function updateDistance(logIndex, dayIndex, value) {
  const logs = getLogs();
  logs[logIndex].distances[dayIndex] = value;
  saveLogs(logs);
  renderLogs();
}

function deleteLog(index) {
  const logs = getLogs();
  logs.splice(index, 1);
  saveLogs(logs);
  renderLogs();
}

function renderLogs() {
  const logs = getLogs();
  const container = document.getElementById("logContainer");
  container.innerHTML = "";

  logs.forEach((log, logIndex) => {
    const card = document.createElement("div");
    card.className = "card";

    const header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = `
      <span>Charge Date: ${log.chargeDate}</span>
      <button onclick="deleteLog(${logIndex})" style="background-color:red;">Delete</button>
    `;

    card.appendChild(header);

    let total = 0;

    log.dates.forEach((date, dayIndex) => {
      const entry = document.createElement("div");
      entry.className = "day-entry";
      const val = log.distances[dayIndex];
      const km = parseInt(val) || 0;
      total += km;

      entry.innerHTML = `
        <div>Day ${dayIndex + 1}: ${date}</div>
        <input type="number" value="${val}" onchange="updateDistance(${logIndex}, ${dayIndex}, this.value)" placeholder="Distance (km)" />
      `;
      card.appendChild(entry);
    });

    const totalDiv = document.createElement("div");
    totalDiv.className = "total";
    totalDiv.textContent = `Total Distance: ${total} km`;
    card.appendChild(totalDiv);

    container.appendChild(card);
  });
}

window.onload = renderLogs;
