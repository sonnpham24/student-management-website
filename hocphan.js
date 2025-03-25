const apiBaseUrl = 'http://localhost:3000/api/courses';

// Fetch and display courses
async function fetchCourses() {
    try {
        const response = await fetch(apiBaseUrl);
        const courses = await response.json();
        populateCourseTable(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Lỗi khi tải dữ liệu học phần.');
    }
}

// Populate Course Table
function populateCourseTable(courses) {
    const tableBody = document.getElementById("courseTableBody");
    tableBody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.course_id}</td>
            <td>${course.name}</td>
            <td>${course.credit}</td>
            <td>${course.faculty_id}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editCourse('${course.course_id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course.course_id}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}
    

// Reset form fields
function resetForm() {
    document.getElementById('courseForm').reset();
    document.getElementById('course_id').readOnly = false;
}

// Add or update a course
document.getElementById('courseForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const courseId = document.getElementById('course_id').value;
    const courseData = {
        course_id: courseId,
        name: document.getElementById('name').value,
        credit: document.getElementById('credit').value,
        faculty_id: document.getElementById('faculty_id').value,
    };

    try {
        const method = document.getElementById('course_id').readOnly ? 'PUT' : 'POST';
        const url = method === 'PUT' ? `${apiBaseUrl}/${courseId}` : apiBaseUrl;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        });

        if (response.ok) {
            alert('Học phần đã được lưu thành công!');
            fetchCourses();
            const modal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
            modal.hide();
        } else {
            alert('Lỗi khi lưu học phần.');
        }
    } catch (error) {
        console.error('Error saving course:', error);
        alert('Lỗi khi lưu học phần.');
    }
});

// Edit a course
async function editCourse(courseId) {
    try {
        const response = await fetch(`${apiBaseUrl}/${courseId}`);
        const course = await response.json();

        document.getElementById('course_id').value = course.course_id;
        document.getElementById('course_id').readOnly = true;
        document.getElementById('name').value = course.name;
        document.getElementById('credit').value = course.credit;
        document.getElementById('faculty_id').value = course.faculty_id;

        const modal = new bootstrap.Modal(document.getElementById('courseModal'));
        modal.show();
    } catch (error) {
        console.error('Error editing course:', error);
        alert('Lỗi khi tải thông tin học phần.');
    }
}

// Delete a course
async function deleteCourse(courseId) {
    if (confirm('Bạn có chắc chắn muốn xóa học phần này?')) {
        try {
            const response = await fetch(`${apiBaseUrl}/${courseId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Học phần đã được xóa thành công!');
                fetchCourses();
            } else {
                alert('Lỗi khi xóa học phần.');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Lỗi khi xóa học phần.');
        }
    }
}

// Load courses on page load
document.addEventListener('DOMContentLoaded', fetchCourses);

// Search courses by ID
async function searchCourseById() {
    const courseId = document.getElementById('searchInput').value.trim();

    if (!courseId) {
        // If no input, reload the full course list
        fetchCourses();
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(courseId)}`);
        if (response.ok) {
            const course = await response.json();
            populateCourseTable([course]); // Pass an array with a single course
        } else {
            alert('Không tìm thấy học phần với mã này.');
            populateCourseTable([]); // Clear the table
        }
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        alert('Có lỗi xảy ra khi tìm kiếm học phần.');
    }
}