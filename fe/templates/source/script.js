const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}
if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

const API_PRODUCT_URL = "http://14.225.220.60:8090/api/product"; // Địa chỉ API sản phẩm

function loadProducts() {
  fetch(API_PRODUCT_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sản phẩm");
      }
      return response.json();
    })
    .then(data => {
      const productList = document.getElementById("apiproduct-list");
      productList.innerHTML = ""; // Xóa nội dung cũ nếu có

      data.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("pro");
        productDiv.setAttribute('data-product-id', product.id); // Thêm data-product-id

        productDiv.innerHTML = `
          <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}" />
          <div class="des">
            <span>${product.brand || 'Thương hiệu'}</span>
            <h5>${product.name}</h5>
            <div class="star">⭐⭐⭐⭐⭐</div>
            <h4>${product.price ? product.price + 'đ' : 'Giá liên hệ'}</h4>
            <button class="add-to-cart">Thêm vào giỏ hàng</button>
          </div>
        `;

        productList.appendChild(productDiv);
      });

      // Lắng nghe sự kiện cho nút "Thêm vào giỏ hàng"
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      addToCartButtons.forEach(button => {
        button.addEventListener("click", (event) => {
          const productDiv = event.target.closest('.pro');
          const productId = productDiv.getAttribute('data-product-id');
          const productName = productDiv.querySelector("h5").textContent;
          const productPrice = productDiv.querySelector("h4").textContent;
          const productImage = productDiv.querySelector("img").src;

          // Lưu sản phẩm vào giỏ hàng
          addToCart(productId, productName, productPrice, productImage);
        });
      });
    })
    .catch(error => {
      console.error("Lỗi khi load sản phẩm:", error);
      document.getElementById("apiproduct-list").innerHTML = `<p style="color: red;">Lỗi khi tải sản phẩm: ${error.message}</p>`;
    });
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  if (confirm(`${name} đã được thêm vào giỏ hàng!\nBạn có muốn xem giỏ hàng không?`)) {
  window.location.href = "cart.html";
}

}


// Gọi khi trang tải xong
document.addEventListener("DOMContentLoaded", loadProducts);



// Hàm lấy giỏ hàng từ localStorage và hiển thị sản phẩm trong giỏ hàng
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartTableBody = document.querySelector("#cart table tbody");
  cartTableBody.innerHTML = ""; // Xóa các sản phẩm hiện tại trong bảng giỏ hàng

  let totalPrice = 0;
  
  cart.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><a href="#" class="remove-item" data-id="${item.id}"><i class="far fa-times-circle"></i></a></td>
      <td><img src="${item.image}" alt="${item.name}" /></td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}" /></td>
      <td>${item.price * item.quantity}đ</td>
    `;

    cartTableBody.appendChild(tr);
    totalPrice += item.price * item.quantity;
  });

  // Cập nhật tổng giỏ hàng
  const subtotal = document.querySelector("#subtotal table tr:nth-child(1) td:nth-child(2)");
  const total = document.querySelector("#subtotal table tr:nth-child(3) td:nth-child(2)");

  subtotal.textContent = totalPrice + "đ";
  total.textContent = (totalPrice + 30000) + "đ"; // Phí vận chuyển: 30.000đ
}

// Lắng nghe sự kiện thay đổi số lượng sản phẩm trong giỏ hàng
document.addEventListener("change", (e) => {
  if (e.target.classList.contains("quantity-input")) {
    const productId = e.target.getAttribute("data-id");
    const newQuantity = parseInt(e.target.value, 10);

    // Cập nhật số lượng trong giỏ hàng
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = cart.find(item => item.id === productId);
    if (product) {
      product.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    }
  }
});

// Lắng nghe sự kiện xóa sản phẩm khỏi giỏ hàng
document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-item");
  if (removeBtn) {
    e.preventDefault(); // Ngăn việc nhảy trang do href="#"
    const productId = removeBtn.getAttribute("data-id");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
  }
});


// Gọi khi trang tải xong
document.addEventListener("DOMContentLoaded", loadCart);


