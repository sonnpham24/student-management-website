--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-02-17 14:31:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 24770)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 892 (class 1247 OID 16477)
-- Name: gender_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender_enum AS ENUM (
    'Male',
    'Female'
);


ALTER TYPE public.gender_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 24759)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    is_approved boolean DEFAULT false
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24758)
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_admin_id_seq OWNER TO postgres;

--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 226
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- TOC entry 221 (class 1259 OID 16500)
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    course_id character varying(10) NOT NULL,
    name character varying(50) NOT NULL,
    credit integer NOT NULL,
    faculty_id character varying(10) NOT NULL
);


ALTER TABLE public.course OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16566)
-- Name: enroll_enroll_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enroll_enroll_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enroll_enroll_id_seq OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16490)
-- Name: enroll; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enroll (
    enroll_id integer DEFAULT nextval('public.enroll_enroll_id_seq'::regclass) NOT NULL,
    student_id integer NOT NULL,
    class_id integer NOT NULL,
    semester character varying(5) NOT NULL,
    mid_grade double precision,
    final_grade double precision,
    weight text,
    grade double precision,
    letter_grade text
);


ALTER TABLE public.enroll OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16517)
-- Name: faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty (
    faculty_id character varying(10) NOT NULL,
    name character varying(50) NOT NULL,
    phone_number character varying(15) NOT NULL,
    email character varying(50) NOT NULL,
    address text NOT NULL
);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16505)
-- Name: grade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grade (
    grade_id integer NOT NULL,
    mid_grade double precision,
    final_grade double precision,
    grade double precision
);


ALTER TABLE public.grade OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16495)
-- Name: lop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lop (
    class_id integer NOT NULL,
    course_id character varying(10) NOT NULL,
    schedule character varying(100) NOT NULL,
    room character varying(20) NOT NULL,
    semester character varying(5) NOT NULL
);


ALTER TABLE public.lop OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16481)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    student_id integer NOT NULL,
    name character varying(50) NOT NULL COLLATE pg_catalog."vi-VN-x-icu",
    gender public.gender_enum NOT NULL,
    dob date NOT NULL,
    academic_class character varying(50) NOT NULL COLLATE pg_catalog."vi-VN-x-icu",
    academic_year character varying(5) NOT NULL,
    email character varying(50) NOT NULL,
    address text NOT NULL COLLATE pg_catalog."vi-VN-x-icu",
    phone_number character varying(15) NOT NULL,
    faculty_id character varying(10) NOT NULL,
    status character varying(15) NOT NULL COLLATE pg_catalog."vi-VN-x-icu"
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16510)
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    teacher_id integer NOT NULL,
    name character varying(50) NOT NULL,
    class_id integer,
    faculty_id character varying(10) NOT NULL,
    phone_number character varying(15) NOT NULL,
    email character varying(50) NOT NULL
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- TOC entry 4711 (class 2604 OID 24762)
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- TOC entry 4898 (class 0 OID 24759)
-- Dependencies: 227
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.admins (admin_id, email, password, is_approved) VALUES (1, 'admin@example.com', '$2a$06$Nni63wWDzFQBqVDTs28Sz.9Ovf1v1fE6Q72llGBtRpYZPJu2FfHSe', true);
INSERT INTO public.admins (admin_id, email, password, is_approved) VALUES (3, 'Son.PC205220@sis.hust.edu.vn', '$2a$10$fynMfoUfGiqlwJe5LqwEKO.Z/Xh6jueMABFBcJyePMBLS50jaFvoS', true);


--
-- TOC entry 4892 (class 0 OID 16500)
-- Dependencies: 221
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.course (course_id, name, credit, faculty_id) VALUES ('IT2000', 'Nhập môn CNTT và TT', 3, 'SOICT');
INSERT INTO public.course (course_id, name, credit, faculty_id) VALUES ('MI1114', 'Giải tích 1', 3, 'FAMI');
INSERT INTO public.course (course_id, name, credit, faculty_id) VALUES ('MI1134', 'Phương trình vi phân và Chuỗi', 3, 'FAMI');
INSERT INTO public.course (course_id, name, credit, faculty_id) VALUES ('IT3292', 'Cơ sở dữ liệu', 2, 'SOICT');
INSERT INTO public.course (course_id, name, credit, faculty_id) VALUES ('IT3180', 'Nhập môn công nghệ phần mềm', 3, 'SOICT');
INSERT INTO public.course (course_id, name, credit, faculty_id) VALUES ('IT3103', 'Lập trình hướng đối tượng', 3, 'SOICT');
INSERT INTO public.course (course_id, name, credit, faculty_id) VALUES ('IT4409', 'Công nghệ Web và dịch vụ trực tuyến', 3, 'SOICT');


--
-- TOC entry 4890 (class 0 OID 16490)
-- Dependencies: 219
-- Data for Name: enroll; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.enroll (enroll_id, student_id, class_id, semester, mid_grade, final_grade, weight, grade, letter_grade) VALUES (9, 20210001, 151963, '20241', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.enroll (enroll_id, student_id, class_id, semester, mid_grade, final_grade, weight, grade, letter_grade) VALUES (3, 20205220, 152086, '20241', 5, 5, '50-50', 5, 'D+');
INSERT INTO public.enroll (enroll_id, student_id, class_id, semester, mid_grade, final_grade, weight, grade, letter_grade) VALUES (11, 20205220, 151963, '20241', 8.5, 7, '30-70', 7.45, 'B');
INSERT INTO public.enroll (enroll_id, student_id, class_id, semester, mid_grade, final_grade, weight, grade, letter_grade) VALUES (6, 20205220, 152061, '20241', 8, 7, '30-70', 7.3, 'B');


--
-- TOC entry 4895 (class 0 OID 16517)
-- Dependencies: 224
-- Data for Name: faculty; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SOICT', 'Trường Công nghệ thông tin và Truyền thông', '02438692463', 'vp@soict.hust.edu.vn', 'P. 505 – Nhà B1 – Đại học Bách khoa Hà Nội - Số 1 Đại Cồ Việt – Hai Bà Trưng – Hà Nội');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('FAMI', 'Khoa Toán - Tin', '04 3869 2137', 'fami@hust.edu.vn', 'Phòng 106 - Tòa nhà D3 01 Đại Cồ Việt - Quận Hai Bà Trưng - Hà Nội');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SME', 'Trường Cơ Khí', '024 38 696 165', 'sme@hust.edu.vn', 'Phòng C7-614M Số 1 Dai  Co Viet – Hai Ba Trung-Ha Noi');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SEEE', 'Trường Điện - Điện tử', '024 3869 4242', 'seee@hust.edu.vn', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SMSE', 'Trường Vật Liệu', '08 6548 5665', 'smse@hust.edu.vn', 'P.308-C10, ĐHBKHN');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SCLS', 'Trường Hóa và Khoa học Sự sống', '024 3868 2470', 'scls@hust.edu.vn', 'P202 - C4, ĐH BKHN');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SEM', 'Trường Kinh tế', '024 3869 2304', 'sem@hust.edu.vn', 'Dai Co Viet, Hai Ba Trung, Hanoi');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('FED', 'Khoa Khoa học và Công nghệ Giáo dục', '043 8682450', 'fed@hust.edu.vn', 'Phòng 302B nhà D3-5 Trường Đại học Bách khoa Hà Nội');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SEP', 'Viện Vật lý Kỹ thuật', '024 3869 3350', 'sep@hust.edu.vn', 'Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội, Hanoi, Vietnam');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('SOFL', 'Khoa Ngoại ngữ', '0812 177 337', 'sofl@hust.edu.vn', 'M312 – C7 - Đại học Bách khoa Hà Nội - Số 1, Đường Đại Cồ Việt, Hà Nội');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('GDQP', 'Khoa Giáo dục Quốc phòng - An ninh', '024 3869 2031', 'gdqp@hust.edu.vn', 'C10-302 ĐHBKHN');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('GDTC', 'Khoa Giáo dục thể chất', '024 3868 4922', 'gdtc@hust.edu.vn', 'Tầng 2 – Nhà thi đấu Bách Khoa');
INSERT INTO public.faculty (faculty_id, name, phone_number, email, address) VALUES ('DPT', 'Khoa Lý luận Chính trị', '024 3869 2105', 'dpt@hust.edu.vn', 'D3 – 306 ĐHBKHN');


--
-- TOC entry 4893 (class 0 OID 16505)
-- Dependencies: 222
-- Data for Name: grade; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4891 (class 0 OID 16495)
-- Dependencies: 220
-- Data for Name: lop; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (152086, 'MI1114', 'Thứ 2, 10h15-11h45', 'D9-403', '20241');
INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (152259, 'IT3180', 'Thứ 3, 6h45-10h5', 'C7-212', '20241');
INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (152061, 'IT2000', 'Thứ 5, 16h-17h30', 'GD-B1', '20241');
INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (151963, 'IT3103', 'Thứ 5, 6h45-9h10', 'D9-401', '20241');
INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (744525, 'IT3103', 'Thứ 7, 12h30-15h', 'B1-303', '20241');
INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (152085, 'MI1114', 'Thứ 4, 12h30-14h', 'D9-501', '20241');
INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (744450, 'IT2000', 'Thứ 6, 6h45-11h45', 'B1-203', '20241');
INSERT INTO public.lop (class_id, course_id, schedule, room, semester) VALUES (151900, 'IT4409', 'Thứ 6, 14h10-17h30', 'D9-502', '20241');


--
-- TOC entry 4889 (class 0 OID 16481)
-- Dependencies: 218
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student (student_id, name, gender, dob, academic_class, academic_year, email, address, phone_number, faculty_id, status) VALUES (20210001, 'Lê Thị B', 'Female', '2003-03-03', 'Công nghệ thông tin Việt-Nhật K66', '2021', 'lethib@example.com', '16 Trần Hưng Đạo, Phan Chu Trinh, Hoàn Kiếm, Hà Nội', '0987654321', 'SOICT', 'Học');
INSERT INTO public.student (student_id, name, gender, dob, academic_class, academic_year, email, address, phone_number, faculty_id, status) VALUES (20201010, 'Nguyễn Văn A', 'Male', '2002-01-01', 'Khoa học máy tính 01', '2020', 'nguyenvana@example.com', '01 Trần Đại Nghĩa', '0912345678', 'SOICT', 'Học');
INSERT INTO public.student (student_id, name, gender, dob, academic_class, academic_year, email, address, phone_number, faculty_id, status) VALUES (20205220, 'Phạm Công Sơn', 'Male', '2002-07-29', 'Công nghệ thông tin Việt-Pháp K65', '2020', 'Son.PC205220@sis.hust.edu.vn', 'T2 Times City, 458 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội', '091233456', 'SOICT', 'Học');


--
-- TOC entry 4894 (class 0 OID 16510)
-- Dependencies: 223
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (1, 'Nguyễn Đức Tiến', 152061, 'SOICT', '0900000001', 'tien.nguyenduc@hust.edu.vn');
INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (2, 'Trịnh Ngọc Hải', 152085, 'FAMI', '0900000002', 'hai.trinhngoc@hust.edu.vn');
INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (3, 'Bùi Thị Mai Anh', 152259, 'SOICT', '0900000003', 'anh.buithimai@hust.edu.vn');
INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (4, 'Nguyễn Tuấn Dũng', 151963, 'SOICT', '0900000004', 'dung.nguyentuan@hust.edu.vn');
INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (5, 'Phạm Thanh Liêm', 744450, 'SOICT', '0900000005', 'liem.phamthanh@hust.edu.vn');
INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (6, 'Phạm Huy Hoàng', 151900, 'SOICT', '0900000006', 'hoang.phamhuy@hust.edu.vn');
INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (7, 'Nguyễn Sơn Tùng', 744525, 'SOICT', '0900000007', 'tung.nguyenson@hust.edu.vn');
INSERT INTO public.teacher (teacher_id, name, class_id, faculty_id, phone_number, email) VALUES (8, 'Lê Văn Tứ', 152086, 'FAMI', '0900000008', 'tu.levan@hust.edu.vn');


--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 226
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 3, true);


--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 225
-- Name: enroll_enroll_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enroll_enroll_id_seq', 12, true);


--
-- TOC entry 4734 (class 2606 OID 24769)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 4736 (class 2606 OID 24767)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 4720 (class 2606 OID 16499)
-- Name: lop class_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lop
    ADD CONSTRAINT class_pkey PRIMARY KEY (class_id);


--
-- TOC entry 4722 (class 2606 OID 16504)
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_id);


--
-- TOC entry 4718 (class 2606 OID 16494)
-- Name: enroll enroll_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enroll
    ADD CONSTRAINT enroll_pkey PRIMARY KEY (enroll_id);


--
-- TOC entry 4730 (class 2606 OID 16525)
-- Name: faculty faculty_phone_number_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_phone_number_email_key UNIQUE (phone_number, email);


--
-- TOC entry 4732 (class 2606 OID 16523)
-- Name: faculty faculty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_pkey PRIMARY KEY (faculty_id);


--
-- TOC entry 4724 (class 2606 OID 16509)
-- Name: grade grade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_pkey PRIMARY KEY (grade_id);


--
-- TOC entry 4714 (class 2606 OID 16489)
-- Name: student student_email_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_email_phone_number_key UNIQUE (email, phone_number);


--
-- TOC entry 4716 (class 2606 OID 16487)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (student_id);


--
-- TOC entry 4726 (class 2606 OID 16516)
-- Name: teacher teacher_phone_number_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_phone_number_email_key UNIQUE (phone_number, email);


--
-- TOC entry 4728 (class 2606 OID 16514)
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (teacher_id);


--
-- TOC entry 4740 (class 2606 OID 16546)
-- Name: lop class_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lop
    ADD CONSTRAINT class_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id) NOT VALID;


--
-- TOC entry 4741 (class 2606 OID 16551)
-- Name: course course_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(faculty_id) NOT VALID;


--
-- TOC entry 4738 (class 2606 OID 16536)
-- Name: enroll enroll_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enroll
    ADD CONSTRAINT enroll_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.lop(class_id) NOT VALID;


--
-- TOC entry 4739 (class 2606 OID 16531)
-- Name: enroll enroll_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enroll
    ADD CONSTRAINT enroll_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id) NOT VALID;


--
-- TOC entry 4737 (class 2606 OID 16526)
-- Name: student student_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(faculty_id) NOT VALID;


--
-- TOC entry 4742 (class 2606 OID 16556)
-- Name: teacher teacher_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.lop(class_id) NOT VALID;


--
-- TOC entry 4743 (class 2606 OID 16561)
-- Name: teacher teacher_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculty(faculty_id) NOT VALID;


-- Completed on 2025-02-17 14:31:38

--
-- PostgreSQL database dump complete
--

