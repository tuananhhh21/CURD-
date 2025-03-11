// Khi trang web tải xong, gọi hàm loadItems() để hiển thị danh sách đã lưu
document.addEventListener("DOMContentLoaded", function () {
    loadItems();

    // Nhấn Enter trong ô itemInput để thêm mục
    document.getElementById("itemInput").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            addItem();
        }
    });

    // Nhấn Enter trong ô searchInput không gây reload
    document.getElementById("searchInput").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault(); // Không làm gì thêm, tránh reload
        }
    });

    // Dùng Enter để "click" vào nút khi đang focus
    document.addEventListener("keydown", function (e) {
        if (e.target.tagName === "BUTTON" && e.key === "Enter") {
            e.preventDefault();
            e.target.click();
        }
    });
});

/**
 * Hàm thêm mục mới vào danh sách
 */
function addItem() {
    let input = document.getElementById("itemInput"); // Lấy ô nhập liệu
    let list = document.getElementById("itemList");   // Lấy danh sách hiển thị

    // Kiểm tra nếu ô nhập liệu rỗng thì không làm gì cả
    if (input.value.trim() === "") return;

    // Tạo một phần tử danh sách mới (li)
    let li = document.createElement("li");
    li.innerHTML = `
        <span class="item-text">${input.value}</span>
        <button class="edit-btn" onclick="editItem(this)" tabindex="0">Sửa</button>
        <button class="delete-btn" onclick="deleteItem(this)" tabindex="0">Xóa</button>
    `;

    list.appendChild(li);  // Thêm mục mới vào danh sách
    saveItems();           // Lưu danh sách vào localStorage
    updateTotalItems();    // Cập nhật tổng số mục
    input.value = "";      // Xóa nội dung trong ô nhập liệu sau khi thêm xong
}

/**
 * Hàm xóa một mục khỏi danh sách
 * @param {HTMLElement} button - Nút xóa được nhấn
 */
function deleteItem(button) {
    button.parentElement.remove(); // Xóa phần tử cha (li) chứa nút "Xóa"
    saveItems();                   // Cập nhật dữ liệu lưu trữ
    updateTotalItems();           // Cập nhật tổng số mục
}

/**
 * Hàm sửa nội dung của một mục trong danh sách
 * @param {HTMLElement} button - Nút sửa được nhấn
 */
function editItem(button) {
    let textSpan = button.parentElement.querySelector(".item-text"); // Lấy nội dung văn bản của mục
    let newValue = prompt("Sửa mục:", textSpan.textContent.trim()); // Hỏi người dùng nhập nội dung mới
    if (newValue) { // Nếu người dùng nhập dữ liệu hợp lệ
        textSpan.textContent = newValue; // Cập nhật nội dung mục
        saveItems(); // Lưu danh sách vào localStorage
    }
}

/**
 * Hàm tìm kiếm mục trong danh sách
 */
function searchItem() {
    let filter = document.getElementById("searchInput").value.toLowerCase(); // Lấy nội dung tìm kiếm
    let items = document.querySelectorAll("#itemList li"); // Lấy tất cả các mục trong danh sách
    let found = false; // Biến kiểm tra có kết quả tìm kiếm không

    items.forEach(item => {
        let text = item.querySelector(".item-text").textContent.toLowerCase(); // Lấy nội dung mục
        if (text.includes(filter)) {
            item.style.display = ""; // Hiển thị nếu tìm thấy
            found = true;
        } else {
            item.style.display = "none"; // Ẩn nếu không khớp
        }
    });

    // Xóa thông báo cũ nếu có
    let noResults = document.getElementById("noResults");
    if (noResults) noResults.remove();

    // Nếu không tìm thấy kết quả, hiển thị thông báo
    if (!found) {
        let message = document.createElement("p");
        message.id = "noResults";
        message.textContent = "Không tìm thấy kết quả.";
        document.getElementById("itemList").appendChild(message);
    }
}

/**
 * Hàm lưu danh sách vào localStorage để không bị mất khi tải lại trang
 */
function saveItems() {
    let items = [];
    // Lấy tất cả nội dung của các mục trong danh sách
    document.querySelectorAll("#itemList li .item-text").forEach(item => {
        items.push(item.textContent);
    });
    localStorage.setItem("crudItems", JSON.stringify(items)); // Lưu vào localStorage dưới dạng chuỗi JSON
}

/**
 * Hàm tải danh sách từ localStorage khi mở trang web
 */
function loadItems() {
    let items = JSON.parse(localStorage.getItem("crudItems")) || []; // Lấy dữ liệu từ localStorage hoặc mảng rỗng
    let list = document.getElementById("itemList");
    list.innerHTML = ""; // Xóa danh sách cũ trước khi tải lại

    items.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span class="item-text">${item}</span>
            <button class="edit-btn" onclick="editItem(this)" tabindex="0">Sửa</button>
            <button class="delete-btn" onclick="deleteItem(this)" tabindex="0">Xóa</button>
        `;
        list.appendChild(li); // Thêm mục vào danh sách
    });
    updateTotalItems(); // Cập nhật tổng số mục
}

/**
 * Hàm cập nhật tổng số mục trong danh sách
 */
function updateTotalItems() {
    document.getElementById("totalItems").textContent = `Tổng số mục: ${document.querySelectorAll("#itemList li").length}`;
}
