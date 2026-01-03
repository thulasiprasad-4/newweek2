// Program 1: Find Largest of Three Numbers
function findLargest() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const num3 = parseFloat(document.getElementById('num3').value);
    
    let largest;
    if (num1 >= num2 && num1 >= num3) {
        largest = num1;
    } else if (num2 >= num1 && num2 >= num3) {
        largest = num2;
    } else {
        largest = num3;
    }
    
    document.getElementById('result1').textContent = 
        `The largest number among ${num1}, ${num2}, and ${num3} is: ${largest}`;
    
    logToConsole(`Largest of ${num1}, ${num2}, ${num3} = ${largest}`);
}

// Program 2: Generate Multiplication Table
function generateTable() {
    const number = parseInt(document.getElementById('tableNumber').value);
    const tableResult = document.getElementById('tableResult');
    
    let tableHTML = `<h4>Multiplication Table of ${number}:</h4>`;
    
    for (let i = 1; i <= 10; i++) {
        tableHTML += `${number} × ${i} = ${number * i}<br>`;
    }
    
    tableResult.innerHTML = tableHTML;
    
    // Log to console
    console.log(`=== Table of ${number} ===`);
    for (let i = 1; i <= 10; i++) {
        console.log(`${number} x ${i} = ${number * i}`);
    }
    
    logToConsole(`Generated table of ${number}`);
}

// Helper function to log to screen console
function logToConsole(message) {
    const consoleDiv = document.getElementById('console');
    const timestamp = new Date().toLocaleTimeString();
    consoleDiv.innerHTML += `[${timestamp}] ${message}\n`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// Initialize with example values
window.onload = function() {
    findLargest();
    generateTable();
    logToConsole("Day 1: JavaScript Fundamentals initialized");
};