// Counter State
let counter = 0;
let step = 1;
let maxValue = 0;
let minValue = 0;
let totalOperations = 0;
let history = [];
let maxRange = 100;

// DOM Elements - make sure these exist in HTML
const counterValueEl = document.getElementById('counterValue');
const counterStatusEl = document.getElementById('counterStatus');
const progressBarEl = document.getElementById('progressBar');
const maxValueEl = document.getElementById('maxValue');
const minValueEl = document.getElementById('minValue');
const totalOpsEl = document.getElementById('totalOps');
const currentStepEl = document.getElementById('currentStep');
const historyTableEl = document.getElementById('historyTable');
const rangeInputEl = document.getElementById('rangeInput');
const rangeValueEl = document.getElementById('rangeValue');

// Initialize Counter
function initCounter() {
    // Load from localStorage if available
    const savedState = localStorage.getItem('counterState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            counter = state.counter || 0;
            step = state.step || 1;
            maxValue = state.maxValue || 0;
            minValue = state.minValue || 0;
            totalOperations = state.totalOperations || 0;
            history = state.history || [];
            maxRange = state.maxRange || 100;
        } catch (e) {
            console.error('Error loading saved state:', e);
        }
    }
    
    updateDisplay();
    updateStats();
    updateHistoryTable();
    updateRangeDisplay();
    
    // Add event listeners - check if elements exist
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (incrementBtn) incrementBtn.addEventListener('click', increment);
    if (decrementBtn) decrementBtn.addEventListener('click', decrement);
    if (resetBtn) resetBtn.addEventListener('click', resetCounter);
    
    // Step buttons
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setStep(parseInt(this.dataset.step));
        });
    });
    
    // Theme color buttons
    document.querySelectorAll('.theme-color').forEach(btn => {
        btn.addEventListener('click', function() {
            setThemeColor(this.dataset.color);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    addHistory('Counter initialized', counter, step);
}

// Update Display
function updateDisplay() {
    if (!counterValueEl || !counterStatusEl || !progressBarEl) return;
    
    counterValueEl.textContent = counter;
    if (currentStepEl) currentStepEl.textContent = step;
    
    // Update progress bar
    const progress = ((counter + maxRange) / (maxRange * 2)) * 100;
    progressBarEl.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    
    // Update status
    if (counter > 0) {
        counterStatusEl.textContent = 'Positive';
        counterStatusEl.className = 'badge bg-success fs-6';
        counterValueEl.style.color = '#28a745'; // success color
    } else if (counter < 0) {
        counterStatusEl.textContent = 'Negative';
        counterStatusEl.className = 'badge bg-danger fs-6';
        counterValueEl.style.color = '#dc3545'; // danger color
    } else {
        counterStatusEl.textContent = 'Neutral';
        counterStatusEl.className = 'badge bg-secondary fs-6';
        counterValueEl.style.color = '#343a40'; // dark color
    }
    
    // Animation
    counterValueEl.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counterValueEl.style.transform = 'scale(1)';
    }, 200);
}

// Update Statistics
function updateStats() {
    maxValue = Math.max(maxValue, counter);
    minValue = Math.min(minValue, counter);
    
    if (maxValueEl) maxValueEl.textContent = maxValue;
    if (minValueEl) minValueEl.textContent = minValue;
    if (totalOpsEl) totalOpsEl.textContent = totalOperations;
}

// Increment Counter
function increment() {
    if (counter + step <= maxRange) {
        counter += step;
        totalOperations++;
        updateDisplay();
        updateStats();
        addHistory('Increment', counter, step);
        saveState();
    } else {
        showToast('Maximum limit reached!', 'warning');
    }
}

// Decrement Counter - COMPLETE FUNCTION
function decrement() {
    if (counter - step >= -maxRange) {
        counter -= step;
        totalOperations++; // Fixed: This line was missing
        updateDisplay();
        updateStats();
        addHistory('Decrement', counter, step);
        saveState();
    } else {
        showToast('Minimum limit reached!', 'warning');
    }
}

// Reset Counter
function resetCounter() {
    counter = 0;
    totalOperations++;
    updateDisplay();
    updateStats();
    addHistory('Reset', counter, step);
    saveState();
}

// Set Step
function setStep(newStep) {
    step = newStep;
    updateDisplay();
    addHistory('Step changed', counter, step);
    saveState();
}

// Add History Entry
function addHistory(operation, value, currentStep) {
    const entry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        operation: operation,
        value: value,
        step: currentStep
    };
    
    history.unshift(entry); // Add to beginning
    if (history.length > 10) history.pop(); // Keep only last 10
    
    updateHistoryTable();
}

// Update History Table
function updateHistoryTable() {
    if (!historyTableEl) return;
    
    if (history.length === 0) {
        historyTableEl.innerHTML = '<tr><td colspan="4" class="text-center">No history yet</td></tr>';
        return;
    }
    
    let html = '';
    history.forEach(entry => {
        html += `
            <tr>
                <td>${entry.timestamp}</td>
                <td>${entry.operation}</td>
                <td>${entry.value}</td>
                <td>${entry.step}</td>
            </tr>
        `;
    });
    
    historyTableEl.innerHTML = html;
}

// Update Range Display
function updateRangeDisplay() {
    if (rangeValueEl) rangeValueEl.textContent = maxRange;
    if (rangeInputEl) {
        rangeInputEl.value = maxRange;
        rangeInputEl.addEventListener('input', function() {
            maxRange = parseInt(this.value);
            if (rangeValueEl) rangeValueEl.textContent = maxRange;
            updateDisplay();
            saveState();
        });
    }
}

// Set Theme Color
function setThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    saveState();
}

// Show Toast Notification
function showToast(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show`;
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
        if (toastContainer.children.length === 0) {
            toastContainer.remove();
        }
    }, 3000);
}

// Handle Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    switch(e.key) {
        case '+':
        case '=':
            increment();
            break;
        case '-':
        case '_':
            decrement();
            break;
        case 'r':
        case 'R':
            resetCounter();
            break;
        case 'Escape':
            // Reset step to 1
            setStep(1);
            break;
    }
}

// Save State to LocalStorage
function saveState() {
    const state = {
        counter,
        step,
        maxValue,
        minValue,
        totalOperations,
        history,
        maxRange
    };
    
    try {
        localStorage.setItem('counterState', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCounter);
       