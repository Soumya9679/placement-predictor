/**
 * Placement Prediction Dashboard Controller
 * Connects to the FastAPI /predict endpoint and displays prediction results.
 */

// State
const state = {
  totalPredictions: 0,
  history: [],
  apiEndpoint: getInitialEndpoint()
};

// DOM Elements
const form = document.getElementById('predictionForm');
const iqInput = document.getElementById('iq');
const cgpaInput = document.getElementById('cgpa');
const submitBtn = document.getElementById('submitBtn');
const alertBox = document.getElementById('alertBox');
const alertText = document.getElementById('alertText');

const resultContainer = document.getElementById('resultContainer');
const rawResponseContainer = document.getElementById('rawResponseContainer');
const rawResponseCode = document.getElementById('rawResponseCode');

const kpiTotal = document.getElementById('kpiTotal');
const kpiLastResult = document.getElementById('kpiLastResult');
const historyTableBody = document.getElementById('historyTableBody');
const emptyHistoryMsg = document.getElementById('emptyHistory');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const apiStatusDot = document.getElementById('apiStatusDot');
const apiStatusText = document.getElementById('apiStatusText');
const settingsToggle = document.getElementById('settingsToggle');
const endpointContainer = document.getElementById('endpointContainer');
const endpointInput = document.getElementById('endpointInput');
const saveEndpointBtn = document.getElementById('saveEndpointBtn');

// Auto-detect default endpoint
function getInitialEndpoint() {
  const saved = localStorage.getItem('placement_api_endpoint');
  if (saved) return saved;
  
  // If served from the FastAPI server itself (local or deployed)
  if (window.location.protocol.startsWith('http')) {
    return `${window.location.origin}/predict`;
  }
  // Fallback if opened directly as a file (file://)
  return 'http://127.0.0.1:8000/predict';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  endpointInput.value = state.apiEndpoint;
  checkApiHealth();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Form submission
  form.addEventListener('submit', handlePrediction);

  // Endpoint settings toggle
  settingsToggle.addEventListener('click', () => {
    endpointContainer.classList.toggle('open');
  });

  // Save custom endpoint
  saveEndpointBtn.addEventListener('click', () => {
    const val = endpointInput.value.trim();
    if (val) {
      state.apiEndpoint = val;
      localStorage.setItem('placement_api_endpoint', val);
      showAlert(`API endpoint updated to ${val}`, 'info');
      checkApiHealth();
    }
  });

  // Preset buttons
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const iq = btn.dataset.iq;
      const cgpa = btn.dataset.cgpa;
      if (iq && cgpa) {
        iqInput.value = iq;
        cgpaInput.value = cgpa;
        hideAlert();
      }
    });
  });

  // Clear history
  clearHistoryBtn.addEventListener('click', () => {
    state.history = [];
    renderHistory();
  });
}

// API Health Check
async function checkApiHealth() {
  try {
    apiStatusText.textContent = 'Connecting...';
    apiStatusDot.className = 'status-dot';

    const origin = new URL(state.apiEndpoint).origin;
    const response = await fetch(`${origin}/docs`, { method: 'HEAD', mode: 'no-cors' });
    
    apiStatusDot.className = 'status-dot online';
    apiStatusText.textContent = 'API Ready';
  } catch (err) {
    apiStatusDot.className = 'status-dot error';
    apiStatusText.textContent = 'API Offline';
  }
}

// Show/Hide Alert Banner
function showAlert(message) {
  alertText.textContent = message;
  alertBox.classList.add('visible');
}

function hideAlert() {
  alertBox.classList.remove('visible');
  alertText.textContent = '';
}

// Handle Form Submission
async function handlePrediction(e) {
  e.preventDefault();
  hideAlert();

  const iqVal = parseInt(iqInput.value, 10);
  const cgpaVal = parseFloat(cgpaInput.value);

  // Client Validation
  if (isNaN(iqVal) || iqVal < 40 || iqVal > 250) {
    showAlert('Please enter a valid IQ value (typically between 50 and 200).');
    iqInput.focus();
    return;
  }

  if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
    showAlert('Please enter a valid CGPA value between 0.00 and 10.00.');
    cgpaInput.focus();
    return;
  }

  const payload = {
    iq: iqVal,
    cgpa: cgpaVal
  };

  // Set Loading State
  setLoading(true);
  const startTime = performance.now();

  try {
    const response = await fetch(state.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const elapsedMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Server returned error status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract placement result (handles {"Placement": "..."} or {"placement": "..."})
    const placementResult = data.Placement || data.placement || 'Unknown';

    // Update state
    state.totalPredictions++;
    kpiTotal.textContent = state.totalPredictions;
    kpiLastResult.textContent = placementResult;
    apiStatusDot.className = 'status-dot online';
    apiStatusText.textContent = 'API Ready';

    // Update Display
    displayResult({
      iq: iqVal,
      cgpa: cgpaVal.toFixed(2),
      placement: placementResult,
      latency: elapsedMs,
      timestamp: new Date().toLocaleTimeString(),
      rawJson: data
    });

    // Add to history
    state.history.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      iq: iqVal,
      cgpa: cgpaVal.toFixed(2),
      result: placementResult
    });
    renderHistory();

  } catch (error) {
    console.error('Prediction request failed:', error);
    apiStatusDot.className = 'status-dot error';
    apiStatusText.textContent = 'API Error';
    
    let msg = `Request failed: ${error.message}.`;
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      msg = `Unable to connect to "${state.apiEndpoint}". Please ensure your FastAPI server is running with 'uvicorn main:app --reload'.`;
    }
    showAlert(msg);
  } finally {
    setLoading(false);
  }
}

// Display Prediction Result in Dashboard Card
function displayResult(item) {
  const isPlaced = item.placement.toLowerCase() === 'placed';
  const badgeClass = isPlaced ? 'placed' : 'not-placed';
  const badgeIcon = isPlaced ? '&#10003;' : '&#10005;';

  resultContainer.innerHTML = `
    <div class="prediction-active">
      <div class="status-badge-container">
        <div>
          <span class="badge-tag ${badgeClass}">
            <span style="font-size: 1.2rem; line-height: 1;">${badgeIcon}</span>
            <span>${item.placement}</span>
          </span>
        </div>
        <div class="result-meta-time">
          ${item.timestamp} &bull; ${item.latency}ms
        </div>
      </div>

      <div class="result-specs">
        <div class="spec-box">
          <div class="spec-label">Assessed IQ</div>
          <div class="spec-value">${item.iq}</div>
        </div>
        <div class="spec-box">
          <div class="spec-label">Assessed CGPA</div>
          <div class="spec-value">${item.cgpa}</div>
        </div>
      </div>
    </div>
  `;

  // Display raw API JSON response
  rawResponseContainer.style.display = 'block';
  rawResponseCode.textContent = JSON.stringify(item.rawJson, null, 2);
}

// Render History Table
function renderHistory() {
  if (state.history.length === 0) {
    historyTableBody.innerHTML = '';
    emptyHistoryMsg.style.display = 'block';
    return;
  }

  emptyHistoryMsg.style.display = 'none';
  historyTableBody.innerHTML = state.history.map(row => {
    const isPlaced = row.result.toLowerCase() === 'placed';
    const pillClass = isPlaced ? 'placed' : 'not-placed';
    return `
      <tr>
        <td>${row.time}</td>
        <td><strong>${row.iq}</strong></td>
        <td><strong>${row.cgpa}</strong></td>
        <td>
          <span class="cell-pill ${pillClass}">
            ${row.result}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// Toggle loading spinner
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.classList.add('loading');
  } else {
    submitBtn.classList.remove('loading');
  }
}
