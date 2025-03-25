// Get student ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('studentId');

// Fetch and display the student details
async function fetchStudentDetails() {
    if (!studentId) {
        alert('Không có mã số sinh viên được cung cấp.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/students/${encodeURIComponent(studentId)}`);
        if (response.ok) {
            const student = await response.json();
            displayStudentDetails(student);
            fetchStudentGrades(studentId);
        } else {
            alert('Không tìm thấy thông tin sinh viên.');
        }
    } catch (error) {
        console.error('Error fetching student details:', error);
        alert('Có lỗi xảy ra khi tải thông tin sinh viên.');
    }
}

function displayStudentDetails(student) {
    document.getElementById('student_id').textContent = student.student_id;
    document.getElementById('name').textContent = student.name;
    document.getElementById('gender').textContent = student.gender;
    document.getElementById('dob').textContent = new Date(student.dob).toLocaleDateString();
    document.getElementById('email').textContent = student.email;
    document.getElementById('academic_class').textContent = student.academic_class;
    document.getElementById('academic_year').textContent = student.academic_year;
    document.getElementById('address').textContent = student.address;
    document.getElementById('faculty_id').textContent = student.faculty_id;
    document.getElementById('status').textContent = student.status;
}

// Fetch and display student grades
async function fetchStudentGrades(studentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/enroll/student/${studentId}`);
        const data = await response.json();

        const tableBody = document.querySelector('#studentGradesTable tbody');
        tableBody.innerHTML = ''; // Clear old data

        if (data.message) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center">${data.message}</td></tr>`;
            return;
        }

        data.forEach((row) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.course_id}</td>
                <td>${row.class_id}</td>
                <td>${row.course_name}</td>
                <td>${row.mid_grade ?? '-'}</td>
                <td>${row.final_grade ?? '-'}</td>
                <td>${row.letter_grade ?? '-'}</td>
                <td>${row.semester}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching student grades:', error);
    }
}

// Navigate back to the students page
function goBack() {
    window.location.href = 'index.html';
}

// Fetch the student details when the page loads
fetchStudentDetails();
