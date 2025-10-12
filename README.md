# 📚 NextBook – Nền tảng đọc sách chữ trực tuyến có trả phí

NextBook là một nền tảng đọc sách online được xây dựng bằng **Next.js (App Router, Fullstack)**, cho phép người dùng đọc truyện/sách, theo dõi tiến độ, nhận thông báo chương mới và hỗ trợ thanh toán gói đọc trả phí.

🔗 **Demo:** [https://next-app-hungngo269s-projects.vercel.app](https://next-app-hungngo269s-projects.vercel.app)

---

## 🚀 Tính năng nổi bật

### 👤 Người dùng
- Đọc sách trực tuyến, lưu tiến độ đọc và bookmark chương.
- Theo dõi truyện yêu thích và nhận thông báo chương mới qua **SSE (Server-Sent Events)**.
- Người dùng **miễn phí** chỉ được đọc một số đầu sách giới hạn, trong khi người dùng **trả phí (Stripe)** có thể đọc toàn bộ nội dung.
- Quản lý hồ sơ cá nhân, lịch sử đăng ký và trạng thái gói thành viên.
- Tìm kiếm, phân loại, sắp xếp sách theo thể loại, thời gian, lượt xem,...
- Xem thống kê lượt đọc, sách nổi bật nhất theo ngày / tuần / tháng.
- Giao diện **responsive**, hỗ trợ đổi **theme, font, line height, kiểu chữ**.
- Đăng nhập qua **Google OAuth** (NextAuth), tự động redirect sau khi đăng nhập.
- **Prefetch + Skeleton loading** để tối ưu tốc độ và UX/UI.
- Hệ thống **cronjob (QStash)** tự động cập nhật lượt xem mỗi 1 giờ.

### 🧑‍💻 Admin
- **CRUD** cơ bản: thêm/sửa/xoá *book*, *chapter*, *slide* hiển thị.
- Sử dụng **Quill.js editor** để chỉnh sửa nội dung chương.
- Có trang tìm kiếm, phân trang riêng cho quản trị viên.

---

## 🛠️ Tech Stack

**Frontend & Backend**
- Next.js (App Router, Fullstack)
- TypeScript  
- Tailwind CSS v4 · shadcn/ui  
- Zod (Validation)  
- NextAuth.js (Authentication)

**Database & Services**
- PostgreSQL (Neon)  
- Redis (Upstash)  
- QStash (Cronjob Scheduler)  
- Stripe (Payment Integration)  
- SSE (Real-time Notifications)
