var mangNhanVien = [];

function getEle(id){
    return document.getElementById(id);
}

//Chức năng thêm nhân viên
function ThemNhanVien(){
    var isValidForm = true;
    var checkHo = kiemTraNhap('ho','tbho','Vui lòng nhập họ') && kiemTraText('ho','tbho','Họ phải là chữ');
    isValidForm &= checkHo;
    var checkTen =  kiemTraNhap('ten','tbten','Vui lòng nhập tên') && kiemTraDoDai('ten','tbten',50,5);
    isValidForm &= checkTen;

    if(isValidForm == true){
    // B1: Lấy dữ liệu
    var maNV = getEle("msnv").value;
    var hoNV = getEle("ho").value;
    var tenNV = getEle("ten").value;
    var ngayBD = getEle("datepicker").value;
    var chucVu = getEle("chucvu").value;
    
    // B2: Tạo đối tượng NhanVien
    var nhanVien = new NhanVien(maNV, hoNV, tenNV, ngayBD, chucVu);
    nhanVien.TinhLuong();

    // B3: Bỏ NhanVien mới tạo vào mảng
    mangNhanVien.push(nhanVien);
    HienThi(mangNhanVien);        
    }
    else{
        alert('Dữ liệu chưa hợp lệ.')
    }
    
}

//Hàm hiển thị
function HienThi(mangHienThi){
    var tbody = getEle("tbodyNhanVien");
    var content = "";
    for(var i = 0; i < mangHienThi.length; i++){
        var nhanVien = mangHienThi[i];
        content += `
            <tr>
                <td>${i + 1}</td>
                <td>${nhanVien.MaNhanVien}</td>
                <td>${nhanVien.HoNhanVien} ${nhanVien.TenNhanVien}</td>
                <td>${nhanVien.ChucVu}</td>
                <td>${nhanVien.Luong}</td>
                <td>
                    <button class="btn btn-warning" 
                    onclick="layThongTinNhanVien('${nhanVien.MaNhanVien}')"
                    >Sửa</button>
                    <button class="btn btn-danger"
                    data-maNV = ${nhanVien.MaNhanVien}
                    onclick="XoaNhanVien(event)">Xóa</button>
                </td>
            </tr>
        `
    }
    tbody.innerHTML = content;
}

var layThongTinNhanVien = function(maNV){
    var nhanVienCanTim;
    for(var i = 0; i < mangNhanVien.length; i++){
        if(mangNhanVien[i].MaNhanVien === maNV){
            nhanVienCanTim = mangNhanVien[i];
            break;
        }
    }
    //gán giá trị vào form
    getEle("msnv").value = nhanVienCanTim.MaNhanVien;
    getEle("ho").value = nhanVienCanTim.HoNhanVien;
    getEle("ten").value = nhanVienCanTim.TenNhanVien ;
    getEle("datepicker").value = nhanVienCanTim.NgayBatDauLam;
    getEle("chucvu").value = nhanVienCanTim.ChucVu;
    //Disable input mã nhân viên
    getEle('msnv').setAttribute('readonly', true);
    //ẩn nút thêm, hiện nút cập nhật
    document.getElementById('btnThemNhanVien').style.display = 'none';
    document.getElementById('btn-group-edit').style.display = 'block';
} 
//JSON : sau khi chuyển thuộc tính được giữ lại, phương thức sẽ bị mất đi
function LuuThongTin(){
    //B1: Chuyển kiểu dữ liệu thành JSON
    var jsonMangNV = JSON.stringify(mangNhanVien);
    //B2: Thêm vào LS
    localStorage.setItem("DSNV", jsonMangNV);
}

//Lấy thông tin từ local Storage
function LayThongTin(){
    //B1: Lấy dữ liệu
    var jsonMangNV = localStorage.getItem("DSNV");
    //B2: Parse lại thành mảng
    mangNhanVien = JSON.parse(jsonMangNV);
    HienThi(mangNhanVien);
}

//Cập nhật nhân viên 
var capNhatNhanVien = function(){
    //Lấy thông tin vừa sửa
    var maNV = getEle("msnv").value;
    var hoNV = getEle("ho").value;
    var tenNV = getEle("ten").value;
    var ngayBD = getEle("datepicker").value;
    var chucVu = getEle("chucvu").value;
    var nhanVien = new NhanVien(maNV, hoNV, tenNV, ngayBD, chucVu);
    nhanVien.TinhLuong();
    //Dựa theo mã, tìm vị trí của nhân viên trong danh sách
    for(var i = 0; i < mangNhanVien.length; i++){
        if(mangNhanVien[i].MaNhanVien === maNV){
            mangNhanVien[i] = nhanVien;
            break;
        }
    }
    //Render lại giao diện
    HienThi(mangNhanVien);
    //Gỡ readonly
    getEle('msnv').removeAttribute('readonly');
    //Ẩn div btn-group-edit, hiện lại nút thêm
    document.getElementById('btnThemNhanVien').style.display = 'block';
    document.getElementById('btn-group-edit').style.display = 'none';
}

//Xóa Nhân Vien 

//B1: Tìm được id cần xóa
function findIndex(id){
    //var index = -1;
    for(var i = 0 ; i < mangNhanVien.length; i++){
        if(mangNhanVien[i].MaNhanVien === id){
            return i;
        }
    }
    return -1;
}

//B2: Xóa thât sự
function XoaNhanVien(event){
    // console.log(event);
    //Lấy giá trị mã nhân viên từ thuộc tính data-MaNV
    //Lấy thông qua sự kiện event
    var button_target = event.target; // Nơi xảy ra sự kiện
    var maNhanVien = button_target.getAttribute("data-MaNV");
    var index = findIndex(maNhanVien);
    if(index !== -1){
        mangNhanVien.splice(index, 1);
        HienThi();
    }
}

//Tìm kiếm nhân viên

/* Tìm kiếm theo mã */
// function TimKiemTheoMa(){
//     var DSCanTim = [];
//     //B1: Lấy được mã nhân viên
//     var maNV = getEle("timKiem").value;
//     var index = findIndex(maNV);
//     //B2: Tìm được thì push vào mảng DSCanTim
//     if(index !== -1){
//         DSCanTim.push(mangNhanVien[index]);
//         HienThi(DSCanTim);
//     }
// }

//Tìm kiếm theo mã hoặc tên
var timKiemNhanVien = function(){
    var danhSachTimKiem = [];
    var keyword = getEle("timKiem").value;
    for(var i = 0; i< mangNhanVien.length; i++){
        var hoTen = mangNhanVien[i].HoNhanVien + mangNhanVien[i].TenNhanVien;
        if(mangNhanVien[i].MaNhanVien === keyword || hoTen.toLowerCase().indexOf(keyword.toLowerCase().trim()) !== -1){
            danhSachTimKiem.push(mangNhanVien[i]);
        }
    }
    HienThi(danhSachTimKiem);
}


//Validation
var kiemTraNhap = function(idInput,idSpan,message){
    //Lấy được input = dom tới input lấy value
    var value = getEle(idInput).value;
    //Kiểm tra độ dài của input, nếu > 0 => true, ẩn thông báo, ngược lại => false, hiện thông báo
    if(value.length > 0 ){    
        getEle(idSpan).style.display = "none";
        return true;
    }
    getEle(idSpan).style.display = "block";
    getEle(idSpan).innerHTML = message;
    return false;
}

var kiemTraDoDai = function(idInput,idSpan,max,min){
    //Lấy được input = dom tới input lấy value
    var value = getEle(idInput).value;

    if(value.length > max || value.length < min){
        getEle(idSpan).style.display = "block";
        getEle(idSpan).innerHTML = `Độ dài yêu cầu từ ${min} tới ${max} kí tự`;
        return false;
    }
    getEle(idSpan).style.display = "none";
    return true;
}

var kiemTraText = function(idInput,idSpan,mess){
    //Lấy được input = dom tới input lấy value
    var value = getEle(idInput).value;

    //Tạo ra biểu thức chính quy để kiểm tra value đầu vào
    var pattern = new RegExp("^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẾ" +
    "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợế" +
    "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$")

    //Kiểm tra value dựa trên pattern
    if(pattern.test(value)){
        getEle(idSpan).style.display = "none";
        return true;
    }
    getEle(idSpan).style.display = "block";
    getEle(idSpan).innerHTML = mess;
    return false;
}
