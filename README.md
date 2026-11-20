# Thiệp Cưới Online — Phong Bì Xanh Rêu & Ảnh Polaroid

Dự án React + TypeScript thiết kế theo nguyên lý **SOLID**, tách biệt hoàn toàn dữ liệu cấu hình khỏi giao diện giúp dễ dàng chỉnh sửa nội dung, thay ảnh, đổi màu hoặc nâng cấp backend.

## Trải Nghiệm Mở Thiệp
1. **Màn hình mở đầu (`MossEnvelopeScene`)**: Phong bì màu xanh rêu đính dấu sáp vàng đồng chuyển động nhẹ nhàng (floating, ánh sáng lướt, lá bạch đàn & hạt sáng bay).
2. **Nhấn vào phong bì / dấu sáp (`EmergingPolaroid`)**: Nắp phong bì mở 3D và ảnh Polaroid cô dâu chú rể từ từ nhô lên từ bên trong túi phong bì.
3. **Dừng 2 giây & Hiệu ứng mây mờ (`CloudMistTransition`)**: Sau khi ảnh nhô lên hoàn tất, giữ nguyên 2 giây (`holdAfterEmergeMs: 2000`) rồi lớp mây mờ kem – xanh xám cuộn vào và tan dần để mở ra trang thiệp cưới chính.

## Cấu Trúc SOLID & Cách Chỉnh Sửa Nhanh
- `src/config/wedding.config.ts`: Chỉnh tên cô dâu chú rể, cha mẹ hai bên, ngày cưới, lịch trình 3 buổi lễ, câu chuyện tình yêu, album ảnh Polaroid, thông tin ngân hàng mừng cưới và bật/tắt từng section (`sections`).
- `src/config/theme.config.ts`: Chỉnh bảng màu xanh rêu – kem giấy dó và thời gian các hiệu ứng (`flapOpenDurationMs`, `polaroidRiseDurationMs`, `holdAfterEmergeMs`, `cloudTransitionDurationMs`).
- `public/images/`: Thay thế các ảnh `couple-hero.jpg`, `couple-walk.jpg`, `couple-closeup.jpg`, `couple-rings.jpg` bằng ảnh thật của bạn.
- `src/services/`: Chứa các service độc lập (`CountdownService`, `CalendarService`, `LocalStorageGuestbookRepository`, `WeddingAudioService`) cài đặt theo interface trong `src/types/wedding.ts`, tiêm qua `InvitationProvider` (`src/context/InvitationContext.tsx`).

## Chạy Dự Án
```bash
npm install
npm run dev      # Chạy môi trường phát triển
npm test         # Chạy unit test (Vitest)
npm run build    # Kiểm tra TypeScript & build production
```

## Cấu Hình Thẻ Chia Sẻ Zalo / Facebook (Open Graph)
- Ảnh xem trước dạng thiệp (`1200×630`) nằm tại `public/images/og-invitation.jpg` và các thẻ `og:*` / `twitter:*` đã được khai báo trong `index.html`.
- Khi đã có tên miền chính thức, tạo file `.env` (tham khảo `.env.example`) với `VITE_SITE_URL=https://ten-mien-cua-ban` rồi chạy `npm run build` để Vite tự gắn đường dẫn tuyệt đối `https://...` cho `og:image`, `og:image:secure_url` và `og:url` (Facebook/Zalo yêu cầu URL tuyệt đối để tải thẻ xem trước ổn định).

## Đóng Gói & Chạy Bằng Docker
```bash
# Build và khởi chạy container (truy cập tại http://localhost:8080)
docker compose up -d --build

# Xem log hoặc dừng container
docker compose logs -f
docker compose down
```

## Deploy Lên Cloudflare
> Dự án là ứng dụng web tĩnh (`dist/`), nên có thể deploy thẳng lên Cloudflare miễn phí **không cần Docker**, hoặc chạy Docker qua Cloudflare Tunnel nếu tự host.

### Cách 1: Deploy trực tiếp bằng Cloudflare Workers / Pages (Khuyên dùng, nhanh nhất)
```bash
npm run build
npx wrangler login
npx wrangler deploy
```
*(Hoặc tạo Pages trên Cloudflare Dashboard: Build command `npm run build`, Build output directory `dist`).*

### Cách 2: Chạy Docker qua Cloudflare Tunnel (`cloudflared`)
```bash
docker compose up -d --build
cloudflared tunnel --url http://localhost:8080
```
