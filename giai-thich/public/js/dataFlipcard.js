// Hàm hiển thị modal danh sách lịch sử tìm kiếm
function hienThiModalLichSuTimKiem() {
  // Lấy danh sách từ vựng đã lưu từ localStorage
  const tuVungFlipCardDaLuu = JSON.parse(localStorage.getItem('tuVungDuocChon')) || [];

  // Tạo modal
  const modal = document.createElement('div');
  modal.classList.add(
    'fixed', 'top-0', 'left-0', 'w-full', 'h-full',
    'bg-black', 'bg-opacity-50', 'flex', 'items-center',
    'justify-center', 'z-10'
  );
  modal.id = 'modalLichSuTimKiem';

  // Tạo nội dung modal
  const content = document.createElement('div');
  content.classList.add(
    'bg-white', 'p-6', 'rounded-lg', 'shadow-lg',
    'max-w-4xl', 'h-full', 'flex', 'flex-col', // Tăng chiều rộng modal và thêm flex-col
    'sm:max-w-xl', // Responsive: Giảm chiều rộng trên màn hình nhỏ
    'md:max-w-3xl'  // Responsive: Tăng chiều rộng trên màn hình trung bình
  );

  // Tạo header modal (tiêu đề)
  const header = document.createElement('div');
  header.classList.add('flex', 'justify-between', 'items-center', 'mb-4');

  // Tiêu đề modal
  const title = document.createElement('h2');
  title.classList.add('text-xl', 'font-bold');
  title.textContent = 'Lịch sử tìm kiếm';
  header.appendChild(title);

  content.appendChild(header);

  // Tạo phần chứa table (có thể scroll)
  const tableContainer = document.createElement('div');
  tableContainer.classList.add('overflow-y-auto', 'flex-grow');

  // Tạo table
  const table = document.createElement('table');
  table.classList.add('table-auto', 'w-full');
  tableContainer.appendChild(table);

  // Tạo header table
  const thead = table.createTHead();
  const headerRow = thead.insertRow();

  // Thêm các cột header cho table
  ['', 'Từ vựng', 'Cách đọc', 'Nghĩa tiếng Việt'].forEach(headerText => {
    const headerCell = headerRow.insertCell();
    headerCell.textContent = headerText;
    headerCell.classList.add(
      'py-3', 'px-6', 'text-left', 'bg-gray-200',
      'text-gray-600', 'uppercase', 'text-sm', 'leading-normal'
    );
  });

  // Tạo ô checkbox "Chọn tất cả" trong header table
  const selectAllCell = headerRow.cells[0]; // Lấy ô đầu tiên (cột "Chọn")
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.id = 'selectAllCheckbox';
  selectAllCheckbox.classList.add('mr-2');
  selectAllCell.appendChild(selectAllCheckbox);

  // Tạo body table
  const tbody = table.createTBody();
  tbody.classList.add('text-gray-800', 'text-sm', 'font-light');

  // Lưu trữ các checkbox của từ vựng
  const checkboxes = [];

  // Duyệt qua từng từ vựng trong lịch sử tìm kiếm
  lichSuTimKiemData.forEach(item => {
    const row = tbody.insertRow();
    row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-100');

    // Tạo ô checkbox
    const checkboxCell = row.insertCell();
    checkboxCell.classList.add('py-3', 'px-6', 'text-center');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = item.tu;
    checkbox.classList.add('mr-2');

    // Kiểm tra xem từ vựng đã được lưu trong localStorage hay chưa
    const daDuocLuu = tuVungFlipCardDaLuu.some(tuVung => tuVung.tu === item.tu);
    checkbox.checked = daDuocLuu;

    checkboxCell.appendChild(checkbox);

    // Thêm checkbox vào mảng checkboxes
    checkboxes.push(checkbox);

    // Tạo các ô dữ liệu
    const tuCell = row.insertCell();
    tuCell.textContent = item.tu;
    tuCell.classList.add('py-3', 'px-6', 'text-left');

    const cachDocCell = row.insertCell();
    cachDocCell.textContent = item.data.cach_doc;
    cachDocCell.classList.add('py-3', 'px-6', 'text-left');

    const nghiaCell = row.insertCell();
    nghiaCell.textContent = item.data.nghia_tieng_viet;
    nghiaCell.classList.add('py-3', 'px-6', 'text-left');

    // Thêm sự kiện change cho checkbox của từng từ vựng
    checkbox.addEventListener('change', () => {
      // Nếu có bất kỳ checkbox nào không được chọn, bỏ chọn checkbox "Chọn tất cả"
      if (!checkbox.checked) {
        selectAllCheckbox.checked = false;
      }

      // Kiểm tra xem tất cả checkbox của từ vựng đã được chọn hay chưa
      const allChecked = checkboxes.every(checkbox => checkbox.checked);
      // Nếu tất cả đã được chọn, chọn checkbox "Chọn tất cả"
      if (allChecked) {
        selectAllCheckbox.checked = true;
      }
    });
  });

  // Thêm sự kiện change cho checkbox "Chọn tất cả"
  selectAllCheckbox.addEventListener('change', () => {
    // Chọn/bỏ chọn tất cả checkbox của từ vựng dựa vào trạng thái của checkbox "Chọn tất cả"
    checkboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  content.appendChild(tableContainer);

  // Tạo footer modal (nút Lưu và nút Đóng)
  const footer = document.createElement('div');
  footer.classList.add('flex', 'justify-start', 'items-center', 'mt-4'); // Sử dụng flexbox để căn chỉnh các phần tử

  // Nút đóng modal
  const closeButtonFooter = document.createElement('button');
  closeButtonFooter.classList.add(
    'px-4', 'py-2', 'bg-blue-500', 'hover:bg-blue-600',
    'text-white', 'font-bold', 'rounded-md'
  );
  closeButtonFooter.textContent = 'Đóng';
  closeButtonFooter.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  footer.appendChild(closeButtonFooter);

  // Nút Lưu
  const saveButton = document.createElement('button');
  saveButton.classList.add(
    'px-4', 'py-2', 'bg-green-500', 'hover:bg-green-600',
    'text-white', 'font-bold', 'rounded-md', 'ml-2' // Thêm margin-left
  );
  saveButton.textContent = 'Lưu';
  saveButton.addEventListener('click', () => {
    luuTuVungDuocChon();
    // Đóng modal sau khi lưu
  });
  footer.appendChild(saveButton);

  content.appendChild(footer);

  // Thêm nội dung vào modal và hiển thị modal
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Hàm lưu từ vựng được chọn vào localStorage
function luuTuVungDuocChon() {
    const checkboxes = document.querySelectorAll('#modalLichSuTimKiem input[type="checkbox"]');
    const tuVungDuocChon = [];

    // Duyệt qua từng checkbox
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Tìm kiếm đối tượng JSON tương ứng trong lichSuTimKiemData
            const tuVung = lichSuTimKiemData.find(item => item.tu === checkbox.value);
            if (tuVung) {
                tuVungDuocChon.push(tuVung);
            }
        }
    });

    // Lưu tuVungDuocChon vào localStorage
    localStorage.setItem('tuVungDuocChon', JSON.stringify(tuVungDuocChon));

    // Hiển thị thông báo
    alert('Đã lưu từ vựng được chọn!');
    const modal = document.getElementById('modalLichSuTimKiem');
    document.body.removeChild(modal);
    danhSachTuVungDaLuu = tuVungDuocChon;
    updateFlashcardContent(danhSachTuVungDaLuu[currentCardIndex].data);
}

// Thêm sự kiện click cho nút hiển thị lịch sử tìm kiếm
document.getElementById('btnHienThiLichSu').addEventListener('click', hienThiModalLichSuTimKiem);