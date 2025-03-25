const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const SECRET_KEY = "20027092";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON 
app.use(session({ secret: SECRET_KEY, resave: false, saveUninitialized: true }));

// PostgreSQL configuration
const pool = new Pool({
    user: 'postgres', // Enter your PostgreSQL username 
    host: 'localhost', // Enter your PostgreSQL host
    database: 'pj1',
    password: '20027092', // Enter your password set for PostgreSQL
    port: 5432,
});

// Test route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Login Route
app.post('/login', async (req, res) => {
    console.log("Login route hit");
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM admins WHERE email = $1 AND is_approved = TRUE", [email]);

        if (result.rows.length === 0) {
            return res.status(403).json({ message: "Access Denied or Account Not Approved" });
        }

        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(password, admin.password);
        console.log("Entered Password:", password);
        console.log("Stored Hash:", admin.password);
        console.log("Password Match:", validPassword);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ admin_id: admin.admin_id, email: admin.email }, SECRET_KEY, { expiresIn: "1h" });

        req.session.token = token;
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Middleware to Check Authentication
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Received Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Unauthorized: No Bearer token found");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded Token:", decoded); 
        req.admin = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(403).json({ message: "Invalid Token" });
    }
};

// Get All Pending Admin Requests
app.get('/admin/requests', authenticate, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM admins WHERE is_approved = FALSE");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching requests" });
    }
});

// Approve an Admin (Only Approved Admins Can Do This)
app.put('/admin/approve/:id', authenticate, async (req, res) => {
    try {
        await pool.query("UPDATE admins SET is_approved = TRUE WHERE admin_id = $1", [req.params.id]);
        res.json({ message: "Admin Approved" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Approving Admin" });
    }
});

// Delete an Admin
app.delete('/admin/delete/:id', authenticate, async (req, res) => {
    try {
        await pool.query("DELETE FROM admins WHERE admin_id = $1", [req.params.id]);
        res.json({ message: "Admin Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Deleting Admin" });
    }
});

// Register a New Admin Request
app.post('/admin/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO admins (email, password) VALUES ($1, $2)", [email, hashedPassword]);
        res.json({ message: "Admin request submitted. Pending approval." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering admin" });
    }
});

// STUDENTS ROUTE
// Route to fetch all students
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM student');
        // Format the `dob` field for each student
        const formattedStudents = result.rows.map(student => ({
            ...student,
            dob: dayjs(student.dob).format('YYYY-MM-DD'), // Format DOB
        }));
        res.json(formattedStudents);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});
// Add a new student
app.post('/api/students', async (req, res) => {
    const {
        student_id,
        name,
        gender,
        dob,
        academic_year,
        academic_class,
        email,
        phone_number,
        address,
        faculty_id,
        status,
    } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO student 
            (student_id, name, gender, dob, academic_year, academic_class, email, phone_number, address, faculty_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [student_id, name, gender, dob, academic_year, academic_class, email, phone_number, address, faculty_id, status]
        );
        const newStudent = result.rows[0];
        newStudent.dob = dayjs(newStudent.dob).format('YYYY-MM-DD'); // Format the date
        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Failed to add student' });
    }
});
// Update an existing student
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const {
        name,
        gender,
        dob,
        academic_year,
        academic_class,
        email,
        phone_number,
        address,
        faculty_id,
        status,
    } = req.body;

    try {
        // Validate and format `dob` if provided
        const formattedDob = dob ? dayjs(dob).format('YYYY-MM-DD') : null;

        const query = `
            UPDATE student
            SET name = $1, gender = $2, dob = $3, academic_year = $4, academic_class = $5,
                email = $6, phone_number = $7, address = $8, faculty_id = $9, status = $10
            WHERE student_id = $11
            RETURNING *;
        `;
        const values = [
            name,
            gender,
            formattedDob,
            academic_year,
            academic_class,
            email,
            phone_number,
            address,
            faculty_id,
            status,
            id,
        ];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            res.status(404).send('Student not found');
        } else {
            const updatedStudent = result.rows[0];
            // Reformat the returned `dob` for consistency
            updatedStudent.dob = dayjs(updatedStudent.dob).format('YYYY-MM-DD');
            res.json(updatedStudent);
        }
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Error updating student');
    }
});
// Delete a student
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM student WHERE student_id = $1 RETURNING *;';
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            res.status(404).send('Student not found');
        } else {
            res.json({ message: 'Student deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
    }
});
// Fetch a single student by ID
app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM student WHERE student_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const student = result.rows[0];
        student.dob = dayjs(student.dob).format('YYYY-MM-DD'); // Format the date
        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});

// COURSE ROUTES
// Route to fetch all courses
app.get('/api/courses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM course');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Error fetching courses');
    }
});
// Add a new course
app.post('/api/courses', async (req, res) => {
    const { course_id, name, credit, faculty_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO course (course_id, name, credit, faculty_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [course_id, name, credit, faculty_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Failed to add course' });
    }
});
// Update an existing class
app.put('/api/lop/:id', async (req, res) => {
    const { id } = req.params; // class_id from the URL
    const { course_id, schedule, room, semester } = req.body;

    try {
        // Update query for the `lop` table
        const query = `
            UPDATE lop
            SET course_id = $1, schedule = $2, room = $3, semester = $4
            WHERE class_id = $5
            RETURNING *;
        `;
        const values = [course_id, schedule, room, semester, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            // No rows were updated, class_id not found
            res.status(404).send('Class not found');
        } else {
            // Return the updated class
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).send('Error updating class');
    }
});
// Delete a course
app.delete('/api/courses/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM course WHERE course_id = $1 RETURNING *;';
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            res.status(404).send('Course not found');
        } else {
            res.json({ message: 'Course deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send('Error deleting course');
    }
});
// Fetch a single course by ID
app.get('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM course WHERE course_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// CLASS ROUTE
// Route to fetch classes (supports search by class_id, course_id, course_name)
app.get('/api/lop', async (req, res) => {
    try {
        const { q } = req.query; // Get search query

        let query = `
            SELECT 
                l.class_id,
                l.course_id, 
                c.name AS course_name, 
                l.schedule, 
                l.room, 
                l.semester,
                c.credit,
                COALESCE(ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS teachers
            FROM lop l
            JOIN course c ON l.course_id = c.course_id
            LEFT JOIN teacher t ON l.class_id = t.class_id
        `;

        const queryParams = [];
        if (q) {
            query += ` WHERE CAST(l.class_id AS TEXT) ILIKE $1 OR c.name ILIKE $1 OR l.course_id ILIKE $1`;  // Search by class_id OR course_name OR course_id
            queryParams.push(`%${q}%`);
        }

        query += ` GROUP BY l.class_id, c.name, c.credit;`;

        const result = await pool.query(query, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy lớp học nào' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching lop:', error);
        res.status(500).send('Lỗi máy chủ khi tải lớp học');
    }
});
// Add a new class
app.post('/api/lop', async (req, res) => {
    const { class_id, course_id, schedule, room, semester } = req.body;

    try {
        // Insert the new class into the lop table
        const lopQuery = `
            INSERT INTO lop (class_id, course_id, schedule, room, semester)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const lopResult = await pool.query(lopQuery, [class_id, course_id, schedule, room, semester]);
        const newClass = lopResult.rows[0];

        // Return the newly created class with an empty teachers list
        res.status(201).json({
            class: newClass,
            teachers: [], // No teachers assigned yet
        });
    } catch (error) {
        console.error('Error adding lop:', error);
        res.status(500).send('Error adding lop');
    }
});
// Route to fetch a specific class by class_id for editing
app.get('/api/lop/:class_id', async (req, res) => {
    const { class_id } = req.params;
    console.log(`Fetching class with class_id: ${class_id}`);

    try {
        // Corrected SQL query
        const query = `
            SELECT 
                l.class_id,
                l.course_id, 
                c.name AS course_name, 
                l.schedule, 
                l.room, 
                l.semester,
                c.credit,
                COALESCE(ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS teachers
            FROM lop l
            JOIN course c ON l.course_id = c.course_id
            LEFT JOIN teacher t ON l.class_id = t.class_id
            WHERE l.class_id = $1
            GROUP BY l.class_id, c.name, c.credit;
        `;
        
        // Ensure class_id is treated as an integer if needed
        const result = await pool.query(query, [parseInt(class_id)]);

        if (result.rows.length === 0) {
            console.log("Class not found in database");
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Database Query Error:', error);
        res.status(500).json({ message: 'Error fetching class', error: error.message });
    }
});
// Update an existing class
app.put('/api/lop/:class_id', async (req, res) => {
    const { class_id } = req.params;
    const { course_id, schedule, room, semester } = req.body;

    try {
        const query = `
            UPDATE lop
            SET course_id = $1, schedule = $2, room = $3, semester = $4
            WHERE class_id = $5
            RETURNING *;
        `;
        const values = [course_id, schedule, room, semester, class_id];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json({ message: 'Class updated successfully', class: result.rows[0] });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ message: 'Error updating class' });
    }
});
// Delete a class
app.delete('/api/lop/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM lop WHERE class_id = $1 RETURNING *;';
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            res.status(404).send('Class not found');
        } else {
            res.json({ message: 'Class deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).send('Error deleting class');
    }
});

// TEACHER ROUTE
// Route to fetch all teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM teacher');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).send('Error fetching teachers');
    }
});
// Add a new teacher
app.post('/api/teachers', async (req, res) => {
    const { teacher_id, name, email, phone_number, faculty_id, class_id } = req.body;

    try {
        const query = `
            INSERT INTO teacher (teacher_id, name, email, phone_number, faculty_id, class_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [teacher_id, name, email, phone_number, faculty_id, class_id];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding teacher:', error);
        res.status(500).json({ error: 'Failed to add teacher' });
    }
});
// Update an existing teacher
app.put('/api/teachers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone_number, faculty_id, class_id } = req.body;

    try {
        const query = `
            UPDATE teacher
            SET name = $1, email = $2, phone_number = $3, faculty_id = $4, class_id = $5
            WHERE teacher_id = $6
            RETURNING *;
        `;
        const values = [name, email, phone_number, faculty_id, class_id, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            res.status(404).send('Teacher not found');
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).send('Error updating teacher');
    }
});
// Delete a teacher
app.delete('/api/teachers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM teacher WHERE teacher_id = $1 RETURNING *;';
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            res.status(404).send('Teacher not found');
        } else {
            res.json({ message: 'Teacher deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).send('Error deleting teacher');
    }
});
// Fetch a single teacher by ID
app.get('/api/teachers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM teacher WHERE teacher_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ error: 'Failed to fetch teacher' });
    }
});

// ENROLL ROUTE
// Get all enrollments or search by student_id
app.get('/api/enroll', async (req, res) => {
    const { student_id } = req.query;

    let query = `
        SELECT 
            e.enroll_id, e.student_id, e.class_id, e.semester, 
            e.mid_grade, e.final_grade, e.weight, e.grade, e.letter_grade,
            c.schedule, co.credit, c.course_id
        FROM enroll e
        LEFT JOIN lop c ON e.class_id = c.class_id
        LEFT JOIN course co ON c.course_id = co.course_id
    `;

    // If student_id is provided, filter by student_id
    if (student_id) {
        query += ` WHERE e.student_id = $1`;
    }

    try {
        const result = await pool.query(query, student_id ? [student_id] : []);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).send('Error fetching enrollments');
    }
});
// Register for a class
app.post('/api/enroll', async (req, res) => {
    const { student_id, semester, class_id } = req.body;

    if (!student_id || !semester || !class_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Get course_id and schedule of the class being registered
        const classQuery = `
            SELECT course_id, schedule FROM lop WHERE class_id = $1;
        `;
        const classResult = await pool.query(classQuery, [class_id]);

        if (classResult.rows.length === 0) {
            return res.status(400).json({ error: 'Lớp học không tồn tại.' });
        }

        const { course_id, schedule } = classResult.rows[0];

        // Check if the student is already enrolled in the same course
        const duplicateCourseQuery = `
            SELECT 1 FROM enroll 
            JOIN lop ON enroll.class_id = lop.class_id
            WHERE enroll.student_id = $1 
            AND enroll.semester = $2 
            AND lop.course_id = $3;
        `;
        const duplicateCourseResult = await pool.query(duplicateCourseQuery, [student_id, semester, course_id]);

        if (duplicateCourseResult.rows.length > 0) {
            return res.status(400).json({ error: 'Bạn đã đăng ký môn học này rồi.' });
        }

        // Check for schedule conflicts
        const scheduleConflictQuery = `
            SELECT 1 FROM enroll 
            JOIN lop ON enroll.class_id = lop.class_id
            WHERE enroll.student_id = $1 
            AND enroll.semester = $2 
            AND lop.schedule = $3;
        `;
        const scheduleConflictResult = await pool.query(scheduleConflictQuery, [student_id, semester, schedule]);

        if (scheduleConflictResult.rows.length > 0) {
            return res.status(400).json({ error: 'Lịch học bị trùng với lớp đã đăng ký.' });
        }

        // No conflicts, proceed with registration
        const enrollQuery = `
            INSERT INTO enroll (student_id, semester, class_id)
            VALUES ($1, $2, $3)
            RETURNING enroll_id;
        `;
        const enrollResult = await pool.query(enrollQuery, [student_id, semester, class_id]);

        res.status(201).json({
            message: 'Đăng ký thành công!',
            enroll_id: enrollResult.rows[0].enroll_id,
        });

    } catch (error) {
        console.error('Error registering for a class:', error);
        res.status(500).json({ error: 'Lỗi khi đăng ký lớp học' });
    }
});
// DELETE an enrollment by enroll_id
app.delete('/api/enroll/:enroll_id', async (req, res) => {
    const { enroll_id } = req.params;

    try {
        const query = `DELETE FROM enroll WHERE enroll_id = $1 RETURNING *;`;
        const result = await pool.query(query, [enroll_id]);

        if (result.rowCount > 0) {
            res.json({ message: 'Enrollment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Enrollment not found' });
        }
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        res.status(500).json({ error: 'Error deleting enrollment' });
    }
});
// Update student grades
app.post('/api/enroll/grade', async (req, res) => {
    console.log('POST request received for /api/enroll/grade');
    const { student_id, class_id, mid_grade, final_grade, weight } = req.body;

    if (!student_id || !class_id || isNaN(mid_grade) || isNaN(final_grade) || !weight) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate the final grade
    let weightMid, weightFinal;
    switch (weight) {
        case "30-70":
            weightMid = 0.3;
            weightFinal = 0.7;
            break;
        case "40-60":
            weightMid = 0.4;
            weightFinal = 0.6;
            break;
        case "50-50":
            weightMid = 0.5;
            weightFinal = 0.5;
            break;
        default:
            return res.status(400).json({ message: "Invalid weight format" });
    }

    const grade = Math.round(((mid_grade * weightMid) + (final_grade * weightFinal)) * 100) / 100;

    // Determine the letter grade
    let letterGrade;
    if (grade < 4) letterGrade = "F";
    else if (grade < 5) letterGrade = "D";
    else if (grade < 5.5) letterGrade = "D+";
    else if (grade < 6.5) letterGrade = "C";
    else if (grade < 7) letterGrade = "C+";
    else if (grade < 8) letterGrade = "B";
    else if (grade < 8.5) letterGrade = "B+";
    else if (grade < 9.5) letterGrade = "A";
    else letterGrade = "A+";

    try {
        const query = `
            UPDATE enroll
            SET mid_grade = $1, final_grade = $2, weight = $3, grade = $4, letter_grade = $5
            WHERE student_id = $6 AND class_id = $7
            RETURNING *;
        `;
        const values = [mid_grade, final_grade, weight, grade, letterGrade, student_id, class_id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.json({ message: "Grade updated successfully", updated: result.rows[0] });
    } catch (error) {
        console.error("Error updating grade:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Get student grades by id
app.get('/api/enroll/student/:student_id', async (req, res) => {
    const { student_id } = req.params;

    try {
        const query = `
            SELECT 
                e.class_id, 
                c.course_id, 
                co.name AS course_name, 
                e.mid_grade, 
                e.final_grade, 
                e.letter_grade, 
                e.semester 
            FROM enroll e
            JOIN lop c ON e.class_id = c.class_id
            JOIN course co ON c.course_id = co.course_id
            WHERE e.student_id = $1
            ORDER BY e.semester DESC;
        `;

        const result = await pool.query(query, [student_id]);

        if (result.rows.length === 0) {
            return res.json({ message: 'Sinh viên chưa đăng ký học phần nào.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching student enrollments:', error);
        res.status(500).send('Lỗi khi lấy thông tin học tập.');
    }
});

app.options('/api/enroll/grade', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Origin', '*'); // Adjust to your needs
    res.status(200).end();
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");  // Adjust origin as necessary
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    // Allow preflight requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
