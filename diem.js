// Function to calculate grade and letter grade
function calculateGrade(midGrade, finalGrade, weight) {
    const [midWeight, finalWeight] = weight.split('-').map(w => parseFloat(w) / 100);
    const grade = (midGrade * midWeight) + (finalGrade * finalWeight);

    let letterGrade;
    if (grade < 4) {
        letterGrade = 'F';
    } else if (grade < 5) {
        letterGrade = 'D';
    } else if (grade < 5.5) {
        letterGrade = 'D+';
    } else if (grade < 6.5) {
        letterGrade = 'C';
    } else if (grade < 7) {
        letterGrade = 'C+';
    } else if (grade < 8) {
        letterGrade = 'B';
    } else if (grade < 8.5) {
        letterGrade = 'B+';
    } else if (grade < 9.5) {
        letterGrade = 'A';
    } else {
        letterGrade = 'A+';
    }

    return { grade, letterGrade };
}

// Function to fetch and display grades
async function fetchGrades(studentId = '') {
    try {
        let url = 'http://localhost:3000/api/enroll';
        if (studentId) {
            url += `?student_id=${studentId}`;
        }

        const response = await fetch(url);
        const grades = await response.json();

        const gradesTableBody = document.querySelector('#gradesTable tbody');
        gradesTableBody.innerHTML = '';

        grades.forEach(grade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${grade.student_id}</td>
                <td>${grade.class_id}</td>
                <td>${grade.course_id}</td>
                <td>${grade.mid_grade || '-'}</td>
                <td>${grade.final_grade || '-'}</td>
                <td>${grade.letter_grade || '-'}</td>
                <td>${grade.semester}</td>
                <td><button class="btn btn-warning btn-sm" onclick=scrollToTop()>Edit</button></td>
            `;
            gradesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching grades:', error);
    }
}

// Handle form submission
document.getElementById('gradeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentId = document.getElementById('student_id').value;
    const classId = document.getElementById('class_id').value;
    const midGrade = parseFloat(document.getElementById('mid_grade').value);
    const finalGrade = parseFloat(document.getElementById('final_grade').value);
    const weight = document.getElementById('weight').value;

    const { grade, letterGrade } = calculateGrade(midGrade, finalGrade, weight);

    try {
        const response = await fetch('http://localhost:3000/api/enroll/grade', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({
                student_id: studentId,
                class_id: classId,
                mid_grade: midGrade,
                final_grade: finalGrade,
                weight: weight,
                grade: grade,
                letter_grade: letterGrade
            }),
        });
    
        console.log('Response:', response); // Check what the response contains
    
        const data = await response.json();
        if (response.ok) {
            alert('Grade updated successfully!');
            fetchGrades(); // Refresh table
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error updating grade:', error);
    }    
});

// Function to scroll to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fetch grades when the page loads
fetchGrades();