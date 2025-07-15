import { ChatWidget } from './components/ChatWidget/index.js';

// Khởi tạo chat widget
const chatWidget = new ChatWidget();

// Định tuyến đơn giản cho SPA tĩnh
const routes = {
  '/': '/templates/source/home.html',
  '/about': '/templates/source/about.html',
  '/contact': '/templates/source/contact.html',
  '/products': '/templates/source/product.html',
  '/login': '/templates/source/login_register.html',
};

// Điều hướng không tải lại trang
document.addEventListener('click', e => {
  const link = e.target.closest('[data-link]');
  if (link) {
    e.preventDefault();
    history.pushState(null, '', link.getAttribute('href'));
    handleLocation();
  }
});

// Xử lý load nội dung
async function handleLocation() {
  const path = window.location.pathname;
  const route = routes[path] || '/templates/source/404.html';

  try {
    const html = await fetch(route).then(res => res.text());
    document.getElementById('app').innerHTML = html;

    // Khởi động lại chat widget sau khi nội dung được render
    chatWidget.init();

  } catch (err) {
    document.getElementById('app').innerHTML = '<h2>Không thể tải trang!</h2>';
  }
}

// Khởi động ứng dụng
document.addEventListener('DOMContentLoaded', () => {
  handleLocation();
}); 