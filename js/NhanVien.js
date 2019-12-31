//Định nghĩa lớp đối tượng NhanVien
function NhanVien(ma, ho, ten, ngaylam, chucvu){
    this.MaNhanVien = ma;
    this.HoNhanVien = ho;
    this.TenNhanVien = ten;
    this.NgayBatDauLam = ngaylam;
    this.LuongCoBan = 500;
    this.ChucVu = chucvu;
    this.Luong = 0;

    this.TinhLuong = function(){
        if(this.ChucVu === 'Sếp'){
            this.Luong =  this.LuongCoBan * 3;
        }
        else if(this.ChucVu === 'Trưởng phòng'){
            this.Luong = this.LuongCoBan * 2;
        }
        else if(this.ChucVu === 'Nhân viên'){
            this.Luong = this.LuongCoBan * 1;
        }
    }
}