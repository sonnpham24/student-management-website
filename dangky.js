const apiBaseUrl = 'http://localhost:3000/api';
const lopBaseUrl = 'http://localhost:3000/api/lop';  // URL to get classes

// Fetch and display enrollment list by student ID
async function searchEnrollmentsByStudent() {
    const studentId = document.getElementById('studentIdSearch').value.trim(); // Get value from the input

    if (!studentId) {
        // If no input, fetch all enrollments
        fetchEnrollments();
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/enroll?student_id=${encodeURIComponent(studentId)}`);
        if (response.ok) {
            const enrollments = await response.json();
            displayEnrollments(enrollments); // Populate the table with filtered enrollments
        } else {
            alert('Không tìm thấy đăng ký cho sinh viên này.');
            displayEnrollments([]); // Clear the table if no results found
        }
    } catch (error) {
        console.error('Error fetching enrollments by student ID:', error);
        alert('Có lỗi xảy ra khi tìm kiếm.');
    }
}

// Display enrollments in the table
function displayEnrollments(enrollments) {
    const tableBody = document.getElementById("dangkyTableBody");
    if (enrollments.length > 0) {
        tableBody.innerHTML = enrollments.map(enrollment => `
            <tr>
                <td>${enrollment.student_id}</td>
                <td>${enrollment.class_id}</td>
                <td>${enrollment.schedule || 'N/A'}</td>
                <td>${enrollment.credit}</td>
                <td>${enrollment.semester}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteEnrollment(${enrollment.enroll_id})">Xóa</button>
                </td>
            </tr>
        `).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="6">Không có đăng ký nào cho sinh viên này.</td></tr>';
    }
}

// Fetch and display all enrollments (to be used for no search condition)
async function fetchEnrollments() {
    try {
        const response = await fetch(`${apiBaseUrl}/enroll`);
        const enrollments = await response.json();
        displayEnrollments(enrollments); // Display enrollments
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        alert('Lỗi khi tải danh sách đăng ký.');
    }
}

// Fetch and display class list
async function fetchClasses() {
    try {
        const response = await fetch(`${apiBaseUrl}/lop`);
        const classes = await response.json();
        populateClassTable(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        alert('Lỗi khi tải danh sách lớp học.');
    }
}

// Search classes by ID
async function searchClassById() {
    const searchInput = document.getElementById('searchInput').value.trim();

    try {
        const response = await fetch(`${apiBaseUrl}/lop?q=${encodeURIComponent(searchInput)}`);
        const classes = await response.json();
        populateClassTable(classes);
    } catch (error) {
        console.error('Error searching class by ID:', error);
        alert('Có lỗi xảy ra khi tìm kiếm lớp.');
    }
}

// Populate Class Table
function populateClassTable(classes) {
    const tableBody = document.getElementById('classTableBody');
    if (classes.length > 0) {
        tableBody.innerHTML = classes.map(lop => `
            <tr>
                <td>${lop.class_id}</td>
                <td>${lop.course_id}</td>
                <td>${lop.course_name}</td>
                <td>${lop.schedule}</td>
                <td>${lop.room}</td>
                <td>${lop.credit}</td>
            </tr>
        `).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="6">Không có lớp học nào.</td></tr>';
    }
}

// Register a course
async function registerCourse(event) {
    event.preventDefault();

    const studentIdInput = document.getElementById('studentId');
    const semesterInput = document.getElementById('semester');
    const classIdInput = document.getElementById('classId');

    const studentId = studentIdInput.value.trim();
    const semester = semesterInput.value.trim();
    const classId = classIdInput.value.trim();

    if (!studentId || !semester || !classId) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/enroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: studentId, semester, class_id: classId }),
        });

        if (response.ok) {
            alert('Đăng ký thành công!');
            fetchEnrollments(); // Refresh enrollment list
            
            // Clear the form fields
            studentIdInput.value = '';
            semesterInput.value = '';
            classIdInput.value = '';
        } else {
            const errorMsg = await response.text();
            alert(`Đăng ký thất bại: ${errorMsg}`);
        }
    } catch (error) {
        console.error('Error registering course:', error);
        alert('Có lỗi xảy ra khi đăng ký.');
    }
}

// Function to delete an enrollment
async function deleteEnrollment(enrollId) {
    if (!confirm("Bạn có chắc muốn xóa đăng ký này?")) return; // Confirm before deleting

    try {
        const response = await fetch(`${apiBaseUrl}/enroll/${enrollId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Xóa đăng ký thành công!');
            fetchEnrollments(); // Refresh the enrollment list
        } else {
            const errorMsg = await response.text();
            alert(`Xóa đăng ký thất bại: ${errorMsg}`);
        }
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        alert('Có lỗi xảy ra khi xóa đăng ký.');
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchEnrollments();
    fetchClasses();

    // Attach event listeners for search bar
    document.getElementById('searchButton').addEventListener('click', searchClassById);
    document.getElementById('searchInput').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') searchClassById();
    });

    // Attach register course event
    document.getElementById('registerForm').addEventListener('submit', registerCourse);
});


