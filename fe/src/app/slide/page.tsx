'use client';

import React from 'react';

const SlidePage = () => {
  const slideStyles: React.CSSProperties = {
    height: '100vh',
    scrollSnapAlign: 'start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 4rem',
    position: 'relative',
    fontSize: '1.2rem',
    fontFamily: 'sans-serif',
    textAlign: 'center',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: '1rem',
    borderBottom: '4px solid #F59E0B',
    paddingBottom: '0.5rem',
  };
  
  const h2Styles: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: '1.5rem',
    marginBottom: '1rem',
  };

  const ulStyles: React.CSSProperties = {
    listStyleType: 'disc',
    textAlign: 'left',
    maxWidth: '800px',
    margin: '0 auto',
  };
  
  const liStyles: React.CSSProperties = {
    marginBottom: '0.75rem',
  };

  const footerStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.9rem',
    color: '#6B7280',
  };
  
  const tableStyles: React.CSSProperties = {
    borderCollapse: 'collapse',
    width: '90%',
    maxWidth: '1000px',
    marginTop: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const thStyles: React.CSSProperties = {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'center',
  };

  const tdStyles: React.CSSProperties = {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
  };

  // NEW STYLES & DIAGRAM HELPERS
  const imageStyles: React.CSSProperties = {
    maxWidth: '900px',
    width: '90%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginTop: '1rem',
  };

  // Mermaid diagrams (rendered via quickchart.io)
  const useCaseDiagram = `graph TD;\n    User(Người dùng)-->UC1[Đăng ký / Đăng nhập];\n    User-->UC2[Duyệt sản phẩm];\n    User-->UC3[Thêm vào giỏ hàng];\n    User-->UC4[Thanh toán];\n    Admin(Quản trị viên)-->UC5[Quản lý sản phẩm];\n    Admin-->UC6[Quản lý đơn hàng];`;

  const archDiagram = `graph TD;\n    Browser[Trình duyệt]-->Frontend[Next.js 14];\n    Frontend-->Backend[Spring Boot 3];\n    Backend-->|JPA|Database[(MySQL)];\n    Backend-->Stripe[Thanh toán];`;

  const erdDiagram = `erDiagram\n      CUSTOMER ||--o{ ORDERS : places\n      CUSTOMER ||--o{ CART : owns\n      PRODUCT }o--o{ CART_ITEM : contains\n      PRODUCT }o--o{ ORDER_DETAIL : details\n      ORDERS ||--|{ ORDER_DETAIL : comprises\n      CART ||--|{ CART_ITEM : includes`;

  const diagramUrl = (diagram: string) =>
    `https://quickchart.io/mermaid?c=${encodeURIComponent(diagram)}`;

  // Burndown Chart (QuickChart)
  const burndownChartConfig = {
    type: 'line',
    data: {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [
        {
          label: 'Ideal',
          data: [18, 16, 14, 12, 10, 8, 6, 4, 2, 0],
          borderColor: 'rgba(16,185,129,1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Actual',
          data: [18, 18, 16, 14, 11, 8, 5, 3, 1, 0],
          borderColor: 'rgba(234,88,12,1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { position: 'bottom' } },
    },
  };

  const burndownChartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(burndownChartConfig))}`;

  const containerStyle: React.CSSProperties = {
      scrollSnapType: 'y mandatory',
      height: '100vh',
      overflowY: 'scroll',
      backgroundColor: '#F9FAFB'
  };

  return (
    <div style={containerStyle}>
      
      {/* Slide 1: Title Slide */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#1a202c' }}>
          BÁO CÁO ĐỒ ÁN CÔNG NGHỆ PHẦN MỀM
        </h1>
        <p style={{ ...h2Styles, color: '#F59E0B', border: 'none' }}>
          Dự án: BeeLife Ventures
        </p>
        <p style={{ fontSize: '1.5rem', marginTop: '1.5rem', color: '#4a5568' }}>
          Nền tảng Thương mại điện tử cho ngành Nuôi ong Thông minh
        </p>
        <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '1.2rem' }}>
          <p><strong>Nhóm thực hiện:</strong> Trần Minh Điền, Nguyễn Văn Hoàng, Nguyễn Lê Duy</p>
          <p><strong>GVHD:</strong> [Tên giảng viên]</p>
          <p>Trà Vinh, tháng 9 năm 2024</p>
        </div>
        <div style={footerStyles}>Slide 1 / 18</div>
      </section>

      {/* Slide 2: L1 - Introduction & Context */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>1. Giới thiệu & Bối cảnh</h1>
        <h2 style={h2Styles}>Vấn đề của ngành Nuôi ong Truyền thống</h2>
        <ul style={ulStyles}>
          <li style={liStyles}>Khó khăn trong việc theo dõi sức khỏe và quản lý đàn ong, dẫn đến rủi ro về bệnh tật và sụt giảm năng suất.</li>
          <li style={liStyles}>Thiếu kênh phân phối hiện đại, khó tiếp cận trực tiếp người tiêu dùng, phụ thuộc vào thương lái.</li>
          <li style={liStyles}>Người tiêu dùng thiếu thông tin để kiểm chứng chất lượng và nguồn gốc sản phẩm mật ong.</li>
        </ul>
        <h2 style={h2Styles}>Sự cần thiết của Giải pháp Công nghệ</h2>
        <ul style={ulStyles}>
            <li style={liStyles}>Cần một nền tảng tập trung để giải quyết các vấn đề trên, ứng dụng công nghệ để tăng cường hiệu quả và minh bạch cho ngành ong.</li>
        </ul>
        <div style={footerStyles}>Slide 2 / 18</div>
      </section>

      {/* Slide 3: L6 - Nhu cầu và phần mềm đám mây */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>2. Nhu cầu Phần mềm dựa trên Đám mây</h1>
        <h2 style={h2Styles}>Xu hướng & Động lực</h2>
        <ul style={ulStyles}>
          <li style={liStyles}><strong>Khả năng mở rộng linh hoạt:</strong> Tăng/giảm tài nguyên theo lưu lượng truy cập cao điểm (mùa mật ong).</li>
          <li style={liStyles}><strong>Chi phí tối ưu:</strong> Chi trả theo mức sử dụng, giảm chi phí đầu tư hạ tầng ban đầu.</li>
          <li style={liStyles}><strong>Độ tin cậy:</strong> Các nhà cung cấp đám mây cung cấp SLA cao, giảm downtime.</li>
          <li style={liStyles}><strong>Tích hợp dịch vụ:</strong> Dễ dàng kết nối CDN, hệ thống thanh toán, AI/ML để phân tích sức khỏe đàn ong.</li>
        </ul>
        <h2 style={h2Styles}>Mô hình Microservices</h2>
        <p style={{ maxWidth: '800px' }}>Hệ thống BeeLife Ventures được định hướng <strong>Microservices</strong>: mỗi dịch vụ đảm nhiệm một Bounded Context (User, Product, Order), giao tiếp qua RESTful API. Điều này đảm bảo <em>triển khai độc lập</em> và <em>mở rộng linh hoạt</em>.</p>
        <div style={footerStyles}>Slide 3 / 18</div>
      </section>

      {/* Slide 4: L2 - Software Development Models */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>3. Các Mô hình Phát triển Phần mềm</h1>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Mô hình</th>
              <th style={thStyles}>Đặc điểm</th>
              <th style={thStyles}>Ưu / Nhược điểm</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyles}>Waterfall</td><td style={tdStyles}>Tuần tự, giai đoạn rõ ràng</td><td style={tdStyles}>Dễ quản lý nhưng kém linh hoạt</td></tr>
            <tr><td style={tdStyles}>V-Model</td><td style={tdStyles}>Mở rộng Waterfall, nhấn mạnh kiểm thử song song</td><td style={tdStyles}>Tập trung QA nhưng vẫn cứng nhắc</td></tr>
            <tr><td style={tdStyles}>Spiral</td><td style={tdStyles}>Lặp với đánh giá rủi ro</td><td style={tdStyles}>Quản lý rủi ro tốt nhưng phức tạp</td></tr>
            <tr><td style={tdStyles}>Agile/Scrum</td><td style={tdStyles}>Gia tăng, giao hàng liên tục</td><td style={tdStyles}>Linh hoạt, phản hồi nhanh nhưng cần cam kết cao</td></tr>
          </tbody>
        </table>
        <div style={footerStyles}>Slide 4 / 18</div>
      </section>

      {/* Slide 5: L1 - Project Goals & Scope */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>4. Mục tiêu & Phạm vi Dự án</h1>
        <h2 style={h2Styles}>Mục tiêu chính</h2>
        <ul style={ulStyles}>
            <li style={liStyles}>Xây dựng một nền tảng thương mại điện tử hoàn chỉnh, kết nối người nuôi ong và người tiêu dùng.</li>
            <li style={liStyles}>Áp dụng các công nghệ phần mềm hiện đại, đặc biệt là kiến trúc dựa trên đám mây để đảm bảo khả năng mở rộng.</li>
            <li style={liStyles}>Cung cấp các công cụ quản lý cơ bản cho người bán và trải nghiệm mua sắm tiện lợi cho người mua.</li>
        </ul>
        <h2 style={h2Styles}>Phạm vi dự án</h2>
        <ul style={ulStyles}>
            <li style={liStyles}><strong>Trong phạm vi (In-scope):</strong> Các chức năng thương mại điện tử cốt lõi (quản lý sản phẩm, giỏ hàng, đặt hàng), quản lý người dùng, và bảng điều khiển cho quản trị viên.</li>
            <li style={liStyles}><strong>Ngoài phạm vi (Out-of-scope):</strong> Các tính năng nâng cao như phân tích dữ liệu đàn ong bằng AI, tích hợp thiết bị IoT sẽ là định hướng phát triển trong tương lai.</li>
        </ul>
        <div style={footerStyles}>Slide 5 / 18</div>
      </section>

      {/* Slide 6: L2 - Use Cases */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>5. Các Use Case Chính</h1>
        <h2 style={h2Styles}>Danh sách Use Case</h2>
        <ul style={ulStyles}>
          <li style={liStyles}>Đăng ký / Đăng nhập</li>
          <li style={liStyles}>Duyệt và tìm kiếm sản phẩm</li>
          <li style={liStyles}>Thêm sản phẩm vào giỏ hàng</li>
          <li style={liStyles}>Thanh toán đơn hàng</li>
          <li style={liStyles}>Quản trị viên quản lý sản phẩm</li>
          <li style={liStyles}>Quản trị viên quản lý đơn hàng</li>
        </ul>
        <h2 style={h2Styles}>Sơ đồ Use Case</h2>
        <img src={diagramUrl(useCaseDiagram)} alt="Use Case Diagram" style={imageStyles} />
        <div style={footerStyles}>Slide 6 / 18</div>
      </section>

      {/* Slide 7: L3 - Agile/Scrum Introduction */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>6. Mô hình phát triển Agile/Scrum</h1>
        <h2 style={h2Styles}>Lý do lựa chọn Agile</h2>
        <ul style={ulStyles}>
          <li style={liStyles}><strong>Linh hoạt:</strong> Cho phép thay đổi và thích ứng với các yêu cầu mới một cách dễ dàng trong quá trình phát triển.</li>
          <li style={liStyles}><strong>Tăng tính hợp tác:</strong> Thúc đẩy sự tương tác liên tục giữa các thành viên trong nhóm và với các bên liên quan.</li>
          <li style={liStyles}><strong>Giao hàng nhanh:</strong> Cung cấp sản phẩm hoạt động được sau mỗi chu kỳ ngắn (Sprint), giúp nhận phản hồi sớm.</li>
        </ul>
        <h2 style={h2Styles}>Quy trình Scrum của dự án</h2>
        <ul style={ulStyles}>
            <li style={liStyles}><strong>Product Backlog:</strong> Toàn bộ các yêu cầu, tính năng của dự án được quản lý tại một nơi.</li>
            <li style={liStyles}><strong>Sprint Planning:</strong> Lập kế hoạch công việc cho mỗi Sprint (kéo dài 2 tuần).</li>
            <li style={liStyles}><strong>Daily Stand-up:</strong> Họp ngắn hàng ngày để cập nhật tiến độ và giải quyết khó khăn.</li>
            <li style={liStyles}><strong>Sprint Review & Retrospective:</strong> Demo sản phẩm và rút kinh nghiệm sau mỗi Sprint.</li>
        </ul>
        <div style={footerStyles}>Slide 7 / 18</div>
      </section>

      {/* Slide 8: L3 - Project Planning & Epics */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>7. Kế hoạch Dự án & Phân chia Epic</h1>
        <p style={{ maxWidth: '800px' }}>Toàn bộ công việc được cấu trúc thành các Epic lớn, sau đó được chia nhỏ thành các User Story và Task trong Product Backlog trên Jira.</p>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Epic</th>
              <th style={thStyles}>Mô tả</th>
              <th style={thStyles}>Story Points</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tdStyles}>Phân tích & Thiết kế</td><td style={tdStyles}>Phân tích yêu cầu, thiết kế kiến trúc, CSDL, API, và UI/UX.</td><td style={{...tdStyles, textAlign: 'center'}}>14</td></tr>
            <tr><td style={tdStyles}>Phát triển Backend</td><td style={tdStyles}>Xây dựng các service, API, logic nghiệp vụ, và bảo mật.</td><td style={{...tdStyles, textAlign: 'center'}}>13</td></tr>
            <tr><td style={tdStyles}>Phát triển Frontend</td><td style={tdStyles}>Xây dựng giao diện người dùng, tích hợp API, quản lý trạng thái.</td><td style={{...tdStyles, textAlign: 'center'}}>12</td></tr>
            <tr><td style={tdStyles}>DevOps & CI/CD</td><td style={tdStyles}>Thiết lập môi trường, Docker, CI/CD, và triển khai tự động.</td><td style={{...tdStyles, textAlign: 'center'}}>11</td></tr>
            <tr><td style={tdStyles}>Kiểm thử & Hoàn thiện</td><td style={tdStyles}>Kiểm thử tích hợp, sửa lỗi, tối ưu và hoàn thiện tài liệu.</td><td style={{...tdStyles, textAlign: 'center'}}>6</td></tr>
          </tbody>
        </table>
        <div style={footerStyles}>Slide 8 / 18</div>
      </section>

      {/* Slide 9: L3 - Sprints & Burndown Chart */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>8. Phân chia Sprint & Tiến độ</h1>
        <h2 style={h2Styles}>Kế hoạch các Sprint</h2>
        <ul style={ulStyles}>
            <li style={liStyles}><strong>Sprint 1:</strong> Nền tảng & Thiết kế - Tập trung vào phân tích, thiết kế và thiết lập môi trường.</li>
            <li style={liStyles}><strong>Sprint 2:</strong> Phát triển Cốt lõi - Xây dựng các tính năng chính của backend và frontend.</li>
            <li style={liStyles}><strong>Sprint 3:</strong> Hoàn thiện & Tự động hóa - Viết test, hoàn thiện tính năng và thiết lập CI/CD.</li>
            <li style={liStyles}><strong>Sprint 4:</strong> Kiểm thử & Triển khai - Kiểm thử tích hợp toàn hệ thống và triển khai sản phẩm.</li>
        </ul>
        <h2 style={h2Styles}>Biểu đồ Burndown Chart (Ví dụ Sprint 1)</h2>
        <p style={{ maxWidth: '800px' }}>Biểu đồ Burndown giúp theo dõi tiến độ công việc còn lại so với kế hoạch, đảm bảo dự án đi đúng hướng.</p>
        {/* Biểu đồ Burndown */}
        <img src={burndownChartUrl} alt="Burndown Chart" style={imageStyles} />
        <div style={footerStyles}>Slide 9 / 18</div>
      </section>

      {/* Slide 10: L4 - System Architecture */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>9. Kiến trúc Hệ thống Tổng thể</h1>
        <p style={{ maxWidth: '800px' }}>Hệ thống được thiết kế theo kiến trúc Client-Server, một mô hình linh hoạt và phổ biến, được triển khai trên nền tảng đám mây.</p>
        <img src={diagramUrl(archDiagram)} alt="System Architecture Diagram" style={imageStyles} />
        <p style={{ maxWidth: '800px', marginTop: '1rem' }}>Sự tách biệt này giúp hai đội ngũ frontend và backend có thể phát triển độc lập, dễ dàng bảo trì và nâng cấp từng phần.</p>
        <div style={footerStyles}>Slide 10 / 18</div>
      </section>

      {/* Slide 11: L4 - Backend Design */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>10. Thiết kế Backend</h1>
        <h2 style={h2Styles}>Công nghệ: Spring Boot & Java 17</h2>
        <p>Lựa chọn Spring Boot vì hệ sinh thái mạnh mẽ, hỗ trợ xây dựng ứng dụng nhanh chóng và bảo mật.</p>
        <h2 style={h2Styles}>Cấu trúc các tầng (Layers)</h2>
        <ul style={ulStyles}>
            <li style={liStyles}><strong>Controller Layer:</strong> Tiếp nhận các yêu cầu HTTP từ client, gọi các service tương ứng. Đây là cổng vào của hệ thống.</li>
            <li style={liStyles}><strong>Service Layer:</strong> Chứa toàn bộ logic nghiệp vụ của ứng dụng (ví dụ: xử lý đơn hàng, tính toán giỏ hàng).</li>
            <li style={liStyles}><strong>Repository Layer:</strong> Chịu trách nhiệm truy vấn và tương tác với cơ sở dữ liệu thông qua Spring Data JPA.</li>
            <li style={liStyles}><strong>Security Layer:</strong> Tích hợp Spring Security để xử lý xác thực (Authentication) và phân quyền (Authorization) bằng JWT.</li>
        </ul>
        <div style={footerStyles}>Slide 11 / 18</div>
      </section>

      {/* Slide 12: L4 - Frontend Design */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>11. Thiết kế Frontend</h1>
        <h2 style={h2Styles}>Công nghệ: Next.js & TypeScript</h2>
        <p>Sử dụng Next.js để tận dụng Server-Side Rendering (SSR) giúp cải thiện hiệu năng và SEO. TypeScript giúp mã nguồn trở nên an toàn và dễ bảo trì hơn.</p>
        <h2 style={h2Styles}>Cấu trúc thư mục chính</h2>
        <ul style={ulStyles}>
            <li style={liStyles}><strong>`app/`:</strong> Cấu trúc định tuyến dựa trên thư mục của Next.js 14 (App Router).</li>
            <li style={liStyles}><strong>`components/`:</strong> Chứa các React component có thể tái sử dụng (ví dụ: Button, Card).</li>
            <li style={liStyles}><strong>`hooks/`:</strong> Chứa các custom hook để quản lý logic phức tạp (ví dụ: `useAuth`, `useCart`).</li>
            <li style={liStyles}><strong>`services/`:</strong> Tầng giao tiếp với API của backend, xử lý các yêu cầu HTTP.</li>
            <li style={liStyles}><strong>`contexts/`:</strong> Quản lý trạng thái toàn cục của ứng dụng (ví dụ: thông tin người dùng, giỏ hàng).</li>
        </ul>
        <div style={footerStyles}>Slide 12 / 18</div>
      </section>

      {/* Slide 13: L4 - Database & API Design */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>12. Thiết kế CSDL và API</h1>
        <h2 style={h2Styles}>Thiết kế Cơ sở dữ liệu (ERD)</h2>
        <p>Mô hình ERD xác định 7 thực thể chính, bao gồm User, Customer, Product, Cart, Order và các bảng liên quan, đảm bảo tính toàn vẹn và nhất quán của dữ liệu.</p>
        <img src={diagramUrl(erdDiagram)} alt="ERD Diagram" style={imageStyles} />
        <h2 style={h2Styles}>Thiết kế RESTful API</h2>
        <p>API được thiết kế theo chuẩn REST, sử dụng các phương thức HTTP (GET, POST, PUT, DELETE) một cách hợp lý để định nghĩa các hành động trên tài nguyên.</p>
        <ul style={ulStyles}>
            <li style={liStyles}><strong>Ví dụ:</strong> `GET /api/products` để lấy danh sách sản phẩm, `POST /api/cart/add` để thêm sản phẩm vào giỏ hàng.</li>
            <li style={liStyles}>Sử dụng Swagger để tạo tài liệu API tự động, giúp frontend và backend dễ dàng làm việc đồng bộ.</li>
        </ul>
        <div style={footerStyles}>Slide 13 / 18</div>
      </section>

      {/* Slide 14: L7 - Tools & Technologies */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>13. Công nghệ và Công cụ sử dụng</h1>
        <table style={tableStyles}>
            <thead>
                <tr><th style={thStyles}>Hạng mục</th><th style={thStyles}>Công nghệ / Công cụ</th></tr>
            </thead>
            <tbody>
                <tr><td style={tdStyles}>Backend</td><td style={tdStyles}>Java 17, Spring Boot, Spring Security, JWT</td></tr>
                <tr><td style={tdStyles}>Frontend</td><td style={tdStyles}>Next.js 14, React, TypeScript, Tailwind CSS</td></tr>
                <tr><td style={tdStyles}>Cơ sở dữ liệu</td><td style={tdStyles}>MySQL 8.0</td></tr>
                <tr><td style={tdStyles}>Quản lý dự án</td><td style={tdStyles}>Jira, Figma</td></tr>
                <tr><td style={tdStyles}>DevOps</td><td style={tdStyles}>Docker, Docker Compose, GitHub, GitHub Actions</td></tr>
                <tr><td style={tdStyles}>Kiểm thử</td><td style={tdStyles}>JUnit, Jest, React Testing Library, Postman</td></tr>
                 <tr><td style={tdStyles}>Tài liệu API</td><td style={tdStyles}>Swagger / OpenAPI 3</td></tr>
            </tbody>
        </table>
        <div style={footerStyles}>Slide 14 / 18</div>
      </section>

      {/* Slide 15: L7 - DevOps & CI/CD */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>14. DevOps & Quy trình CI/CD</h1>
        <h2 style={h2Styles}>Quy trình Tích hợp và Triển khai liên tục</h2>
        <p>Quy trình CI/CD được xây dựng bằng GitHub Actions để tự động hóa hoàn toàn việc đưa sản phẩm đến tay người dùng.</p>
        <ol style={ulStyles}>
          <li style={liStyles}><strong>1. Push Code:</strong> Lập trình viên đẩy mã nguồn lên nhánh `develop` hoặc tạo Pull Request vào `main`.</li>
          <li style={liStyles}><strong>2. Build & Test (CI):</strong> GitHub Actions tự động kích hoạt, tiến hành build và chạy unit test cho cả frontend và backend.</li>
          <li style={liStyles}><strong>3. Build Docker Image:</strong> Nếu các bài test thành công, hệ thống sẽ build các Docker image cho ứng dụng.</li>
          <li style={liStyles}><strong>4. Deploy (CD):</strong> Nếu commit được đẩy lên nhánh `main`, workflow sẽ tự động triển khai các image mới lên VPS, khởi động lại ứng dụng với phiên bản mới nhất.</li>
        </ol>
        <p><strong>Kết quả:</strong> Giảm thiểu lỗi do con người, tăng tốc độ triển khai và đảm bảo chất lượng ổn định.</p>
        <div style={footerStyles}>Slide 15 / 18</div>
      </section>

      {/* Slide 16: L5 - Security */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>15. An toàn và Bảo mật</h1>
        <h2 style={h2Styles}>Các biện pháp bảo mật chính</h2>
        <ul style={ulStyles}>
          <li style={liStyles}>
            <strong>Xác thực bằng JWT:</strong> Sử dụng JSON Web Token để xác thực người dùng sau khi đăng nhập. Token này được gửi kèm trong mỗi yêu cầu tới các tài nguyên được bảo vệ.
          </li>
          <li style={liStyles}>
            <strong>Phân quyền dựa trên vai trò (RBAC):</strong> Hệ thống định nghĩa hai vai trò chính là `USER` và `ADMIN`. Các API quan trọng (ví dụ: quản lý người dùng, sản phẩm) chỉ có thể được truy cập bởi `ADMIN`.
          </li>
          <li style={liStyles}>
            <strong>Mã hóa mật khẩu:</strong> Mật khẩu người dùng không được lưu trữ dưới dạng văn bản gốc. Thay vào đó, chúng được băm (hash) bằng thuật toán BCrypt trước khi lưu vào cơ sở dữ liệu.
          </li>
           <li style={liStyles}>
            <strong>Giao thức HTTPS:</strong> Toàn bộ dữ liệu truyền giữa client và server được mã hóa bằng HTTPS, ngăn chặn tấn công nghe lén (man-in-the-middle).
          </li>
        </ul>
        <div style={footerStyles}>Slide 16 / 18</div>
      </section>

      {/* Slide 17: L5 - Quality Assurance */}
      <section style={{ ...slideStyles, backgroundColor: '#F0FDF4' }}>
        <h1 style={titleStyles}>16. Đảm bảo chất lượng (QA)</h1>
        <h2 style={h2Styles}>Chiến lược Kiểm thử</h2>
        <p>Áp dụng mô hình Kim tự tháp Kiểm thử để tối ưu hóa hiệu quả và tốc độ.</p>
        <ul style={ulStyles}>
          <li style={liStyles}><strong>Unit Test (80%):</strong> Kiểm tra các hàm và component riêng lẻ. Sử dụng Jest cho frontend và JUnit cho backend. Độ bao phủ mã nguồn đạt trên 78%.</li>
          <li style={liStyles}><strong>Integration Test (15%):</strong> Kiểm tra sự tương tác giữa các thành phần, ví dụ như frontend gọi API backend.</li>
          <li style={liStyles}><strong>End-to-End Test (5%):</strong> Kiểm tra các luồng nghiệp vụ hoàn chỉnh từ góc độ người dùng (thực hiện thủ công).</li>
          <li style={liStyles}><strong>API Testing:</strong> Sử dụng Postman để kiểm tra chi tiết từng endpoint, bao gồm các trường hợp thành công, thất bại và biên.</li>
        </ul>
        <div style={footerStyles}>Slide 17 / 18</div>
      </section>

      {/* Slide 18: L8 - Teamwork & Q&A */}
      <section style={{ ...slideStyles, backgroundColor: '#ffffff' }}>
        <h1 style={titleStyles}>17. Kỹ năng làm việc nhóm & Tổng kết</h1>
        <h2 style={h2Styles}>Phân công và Hợp tác</h2>
        <ul style={ulStyles}>
          <li style={liStyles}><strong>Trần Minh Điền:</strong> DevOps & Backend.</li>
          <li style={liStyles}><strong>Nguyễn Văn Hoàng:</strong> Backend Lead.</li>
          <li style={liStyles}><strong>Nguyễn Lê Duy:</strong> Frontend Lead.</li>
        </ul>
         <p>Nhóm đã hợp tác hiệu quả thông qua các công cụ Jira, GitHub và Slack, với quy trình làm việc rõ ràng, giúp dự án hoàn thành đúng tiến độ và chất lượng.</p>
        <div style={{ marginTop: '2rem' }}>
          <h1 style={{ ...titleStyles, fontSize: '2.8rem', border: 'none' }}>Q & A</h1>
          <p style={{ fontSize: '1.8rem' }}>Cảm ơn đã lắng nghe!</p>
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#6B7280' }}>Trà Vinh, ngày … tháng 9 năm 2024<br/>GV CHẤM BÁO CÁO</p>
        </div>
        <div style={footerStyles}>Slide 18 / 18</div>
      </section>

    </div>
  );
};

export default SlidePage; 