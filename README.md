TRANG WEB QUẢN LÝ SINH VIÊN

Quản lý sinh viên, thông tin học tập (đăng ký học, kết quả học tập,... - nghiệp vụ giống như quản lý sinh viên của Đại học Bách Khoa Hà Nội.

Các tính năng: (i) kết nối với csdl, (ii) thực hiện các chức năng thêm/sửa/xóa sinh viên/học phần/lớp học (iii) thực hiện chức năng đăng ký học phần, (iv) ghi nhận kết quả học tập.

Các công nghệ sử dụng: HTML, CSS, Bootstrap, NodeJS, ExpressJS framework, PostgreSQL.

IDE: Visual Studio Code.

HƯỚNG DẪN TẢI, CHẠY VÀ SỬ DỤNG:
- Tải các phần mềm cần thiết: Visual Studio Code, PostgreSQL, NodeJS (LTS version).
1. Tải Node.js: Chạy installer và làm theo hướng dẫn của chương trình, tích vào lựa chọn install npm (Node Package Manager) trong quá trình setup
2. Mở terminal:
  node -v (nên output phiên bản Node.js vừa cài đặt)
  npm -v (nên output phiên bản npm)
3. Chuyển đến thư mục đã/định chứa project:
  cd path/to/student-management-website
4. Khởi tạo Node.js project: Chạy trong Terminal ở thư mục đang chứa project:
  npm init -y
5. Các bước tiếp theo sẽ cài đặt các phụ thuộc bắt buộc của Node.js, bắt đầu với Express.js, một web framework cho Node.js:
  npm install express
pg (PostgreSQL driver): Install pg to interact with PostgreSQL:
  npm install pg
CORS: Install CORS (Cross-Origin Resource Sharing) middleware to handle requests from your frontend:
  npm install cors
dayjs: to fix the date formatting in the API response:
  npm install dayjs
Nodemon (optional): If you want the server to automatically restart when you make changes, install nodemon:
  npm install -g nodemon
  Run the server with: nodemon server.js
6. Kết nối với cơ sở dữ liệu PostgreSQL:
  Mở server.js trong VSC
  Ở phần PostgreSQL configuration, thay thế sau phần "user:" và "password:" bằng tên và mật khẩu PostgreSQL của bạn
7. Chạy website:
  Trong VSC, chọn login.html, nhấn chuột phải, chọn "Open with Live Server", sẽ chuyển đến trang đăng nhập
  Tài khoản đăng nhập và mật khẩu mặc định (Admin): Son.PC205220@sis.hust.edu.vn - 123456
8. Hướng dẫn sử dụng:
   
  
  
