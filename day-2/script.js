// Student data array
let students = [
    { name: "Alice Johnson", marks: 85 },
    { name: "Bob Smith", marks: 92 },
    { name: "Charlie Brown", marks: 78 },
    { name: "Diana Prince", marks: 88 },
    { name: "Edward Norton", marks: 95 }
];

// Display all students in console and UI
function displayStudents() {
    const consoleDiv = document.getElementById('console');
    const studentListDiv = document.getElementById('studentList');
    
    // Clear previous content
    consoleDiv.innerHTML = '';
    studentListDiv.innerHTML = '';
    
    console.log("=== Student Marks List ===");
    let consoleOutput = "";
    
    students.forEach((student, index) => {
        // Console output
        console.log(`${index + 1}. ${student.name}: ${student.marks}`);
        consoleOutput += `${index + 1}. ${student.name}: ${student.marks}\n`;
        
        // UI Display
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <div>
                <div class="student-name">${student.name}</div>
                <div class="student-marks">Marks: ${student.marks}</div>
            </div>
        `;
        studentListDiv.appendChild(studentCard);
    });
    
    consoleDiv.textContent = consoleOutput;
    logToConsole("Displayed all students");
}

// Find topper
function findTopper() {
    const consoleDiv = document.getElementById('console');
    const studentListDiv = document.getElementById('studentList');
    
    let topper = students[0];
    students.forEach(student => {
        if (student.marks > topper.marks) {
            topper = student;
        }
    });
    
    // Clear and display topper
    consoleDiv.innerHTML = '';
    studentListDiv.innerHTML = '';
    
    const topperCard = document.createElement('div');
    topperCard.className = 'student-card topper';
    topperCard.innerHTML = `
        <div>
            <div class="student-name">🎉 ${topper.name} (Topper)</div>
            <div class="student-marks">🏆 Marks: ${topper.marks}</div>
        </div>
    `;
    studentListDiv.appendChild(topperCard);
    
    console.log(`🏆 Topper: ${topper.name} with ${topper.marks} marks`);
    consoleDiv.textContent = `🏆 Topper: ${topper.name}\nMarks: ${topper.marks}`;
    
    logToConsole(`Found topper: ${topper.name} (${topper.marks} marks)`);
}

// Calculate average marks
function calculateAverage() {
    const consoleDiv = document.getElementById('console');
    const studentListDiv = document.getElementById('studentList');
    
    const total = students.reduce((sum, student) => sum + student.marks, 0);
    const average = total / students.length;
    
    // Display all students with average
    displayStudents();
    
    const averageDiv = document.createElement('div');
    averageDiv.className = 'average';
    averageDiv.textContent = `Class Average: ${average.toFixed(2)}`;
    studentListDiv.appendChild(averageDiv);
    
    console.log(`📊 Class Average: ${average.toFixed(2)}`);
    consoleDiv.textContent += `\n📊 Class Average: ${average.toFixed(2)}`;
    
    logToConsole(`Calculated average: ${average.toFixed(2)}`);
}

// Add new student
function addStudent() {
    const nameInput = document.getElementById('studentName');
    const marksInput = document.getElementById('studentMarks');
    
    const name = nameInput.value.trim();
    const marks = parseInt(marksInput.value);
    
    if (!name || isNaN(marks) || marks < 0 || marks > 100) {
        alert('Please enter valid name and marks (0-100)');
        return;
    }
    
    students.push({ name, marks });
    
    // Clear inputs
    nameInput.value = '';
    marksInput.value = '';
    
    displayStudents();
    logToConsole(`Added student: ${name} (${marks} marks)`);
}

// Add random student for demo
function addRandomStudent() {
    const names = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason", "Isabella", "James"];
    const surnames = ["Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas"];
    
    const randomName = names[Math.floor(Math.random() * names.length)] + 
                      " " + surnames[Math.floor(Math.random() * surnames.length)];
    const randomMarks = Math.floor(Math.random() * 30) + 70; // 70-100
    
    students.push({ name: randomName, marks: randomMarks });
    displayStudents();
    logToConsole(`Added random student: ${randomName}`);
}

// Helper function for logging
function logToConsole(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

// Initialize on load
window.onload = function() {
    displayStudents();
    logToConsole("Day 2: Arrays & Objects initialized");
};