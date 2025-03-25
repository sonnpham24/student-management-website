const apiBaseUrl = 'http://localhost:3000/api/lop';
const courseBaseUrl = 'http://localhost:3000/api/courses';  // URL to get courses
const teacherBaseUrl = 'http://localhost:3000/api/teachers';  // URL to get teachers

// Fetch and display classes
async function fetchClasses() {
    try {
        const response = await fetch(apiBaseUrl);
        const classes = await response.json();

        // Directly use the fetched class data as the backend already provides all necessary details
        populateClassTable(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        alert('Lỗi khi tải dữ liệu lớp.');
    }
}

// Populate Class Table
function populateClassTable(classes) {
    const tableBody = document.getElementById("classTableBody");
    tableBody.innerHTML = classes.map(lop => `
        <tr>
            <td>${lop.class_id}</td>
            <td>${lop.course_name}</td>
            <td>${lop.schedule}</td>
            <td>${lop.room}</td>
            <td>${lop.semester}</td>
            <td>${lop.teachers}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editClass('${lop.class_id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteClass('${lop.class_id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}
    
// Reset form fields
function resetForm() {
    document.getElementById('classForm').reset();
    document.getElementById('class_id').readOnly = false;
}

// Add or update a class
document.getElementById('classForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const classId = document.getElementById('class_id').value;
    const classData = {
        class_id: classId,
        course_id: document.getElementById('course_id').value,
        schedule: document.getElementById('schedule').value,
        room: document.getElementById('room').value,
        semester: document.getElementById('semester').value,
    };

    try {
        const method = document.getElementById('class_id').readOnly ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `${apiBaseUrl}/${classId}` : `${apiBaseUrl}`;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(classData),
        });

        if (response.ok) {
            alert('Lớp đã được lưu thành công!');
            fetchClasses();
            const modal = bootstrap.Modal.getInstance(document.getElementById('classModal'));
            modal.hide();
        } else {
            alert('Lỗi khi lưu lớp.');
        }
    } catch (error) {
        console.error('Error saving class:', error);
        alert('Lỗi khi lưu lớp.');
    }
});

// Edit a class
async function editClass(classId) {
    try {
        console.log(`Editing class with ID: ${classId}`); // Debugging
        const response = await fetch(`http://localhost:3000/api/lop/${classId}`); // Ensure URL is correct

        if (!response.ok) {
            throw new Error('Lỗi khi tải thông tin lớp');
        }

        const lop = await response.json();

        // Populate form fields
        document.getElementById('class_id').value = lop.class_id;
        document.getElementById('class_id').readOnly = true;
        document.getElementById('course_id').value = lop.course_id;
        document.getElementById('schedule').value = lop.schedule;
        document.getElementById('room').value = lop.room;
        document.getElementById('semester').value = lop.semester;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('classModal'));
        modal.show();
    } catch (error) {
        console.error('Error editing class:', error);
        alert('Lỗi khi tải thông tin lớp.');
    }
}

// Delete a class
async function deleteClass(classId) {
    if (confirm('Bạn có chắc chắn muốn xóa lớp này?')) {
        try {
            const response = await fetch(`${apiBaseUrl}/${classId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Lớp đã được xóa thành công!');
                fetchClasses();
            } else {
                alert('Lỗi khi xóa lớp.');
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            alert('Lỗi khi xóa lớp.');
        }
    }
}

// Load classes on page load
document.addEventListener('DOMContentLoaded', fetchClasses);

// Search classes by ID
async function searchClassById() {
    const classId = document.getElementById('searchInput').value.trim();

    if (!classId) {
        // If no input, reload the full class list
        fetchClasses();
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(classId)}`);
        if (response.ok) {
            const lop = await response.json();
            populateClassTable([lop]); // Pass an array with a single class
        } else {
            alert('Không tìm thấy lớp với mã này.');
            populateClassTable([]); // Clear the table
        }
    } catch (error) {
        console.error('Error fetching class by ID:', error);
        alert('Có lỗi xảy ra khi tìm kiếm lớp.');
    }
}