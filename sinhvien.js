const apiBaseUrl = 'http://localhost:3000/api/students';

// Fetch and display students
async function fetchStudents() {
    try {
        const response = await fetch(apiBaseUrl);
        const students = await response.json();
        populateStudentTable(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        alert('Lỗi khi tải dữ liệu sinh viên.');
    }
}

// Populate Student Table
function populateStudentTable(students) {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = students.map(student => `
        <tr>
            <td>${student.student_id}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.dob}</td>
            <td>${student.academic_class}</td>
            <td>${student.email}</td>
            <td>${student.faculty_id}</td>
            <td>${student.status}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewStudent('${student.student_id}')">Xem</button>
                <button class="btn btn-sm btn-warning" onclick="editStudent('${student.student_id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student.student_id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// Reset form fields
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('student_id').readOnly = false;
}

// Add or update a student
document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentId = document.getElementById('student_id').value;
    const studentData = {
        student_id: studentId,
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        academic_year: document.getElementById('academic_year').value,
        academic_class: document.getElementById('academic_class').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone_number').value,
        address: document.getElementById('address').value,
        faculty_id: document.getElementById('faculty_id').value,
        status: document.getElementById('status').value,
    };

    try {
        const method = document.getElementById('student_id').readOnly ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `${apiBaseUrl}/${studentId}` : apiBaseUrl;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });

        if (response.ok) {
            alert('Sinh viên đã được lưu thành công!');
            fetchStudents();
            const modal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
            modal.hide();
        } else {
            alert('Lỗi khi lưu sinh viên.');
        }
    } catch (error) {
        console.error('Error saving student:', error);
        alert('Lỗi khi lưu sinh viên.');
    }
});

// Edit a student
async function editStudent(studentId) {
    try {
        const response = await fetch(`${apiBaseUrl}/${studentId}`);
        const student = await response.json();

        document.getElementById('student_id').value = student.student_id;
        document.getElementById('student_id').readOnly = true;
        document.getElementById('name').value = student.name;
        document.getElementById('gender').value = student.gender;
        document.getElementById('dob').value = student.dob;
        document.getElementById('academic_year').value = student.academic_year;
        document.getElementById('academic_class').value = student.academic_class;
        document.getElementById('email').value = student.email;
        document.getElementById('phone_number').value = student.phone_number;
        document.getElementById('address').value = student.address;
        document.getElementById('faculty_id').value = student.faculty_id;
        document.getElementById('status').value = student.status;

        const modal = new bootstrap.Modal(document.getElementById('studentModal'));
        modal.show();
    } catch (error) {
        console.error('Error editing student:', error);
        alert('Lỗi khi tải thông tin sinh viên.');
    }
}

// Delete a student
async function deleteStudent(studentId) {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
        try {
            const response = await fetch(`${apiBaseUrl}/${studentId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Sinh viên đã được xóa thành công!');
                fetchStudents();
            } else {
                alert('Lỗi khi xóa sinh viên.');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Lỗi khi xóa sinh viên.');
        }
    }
}

// Load students on page load
document.addEventListener('DOMContentLoaded', fetchStudents);

// Search students by ID
async function searchStudentById() {
    const studentId = document.getElementById('searchInput').value.trim();

    if (!studentId) {
        // If no input, reload the full student list
        fetchStudents();
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(studentId)}`);
        if (response.ok) {
            const student = await response.json();
            populateStudentTable([student]); // Pass an array with a single student
        } else {
            alert('Không tìm thấy sinh viên với mã số này.');
            populateStudentTable([]); // Clear the table
        }
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        alert('Có lỗi xảy ra khi tìm kiếm sinh viên.');
    }
}

// View student in detail
function viewStudent(studentId) {
    // Redirect to ttsv.html with the student ID in the URL query
    window.location.href = `ttsv.html?studentId=${studentId}`;
}

