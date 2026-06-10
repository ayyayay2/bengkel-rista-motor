import { useState } from "react";
import { FaBell, FaSearch, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const username = localStorage.getItem("username") || "Dullah";
    const role = localStorage.getItem("role") || "Owner";

    const pageTitles = {
        "/": "DASHBOARD",
        "/dashboard": "DASHBOARD",
        "/orders": "TRANSAKSI",
        "/customers": "PELANGGAN",
        "/kendaraan": "KENDARAAN",
        "/stok": "STOK SUKU CADANG",
        "/karyawan": "KARYAWAN",
        "/laporan": "LAPORAN",
        "/pengaturan": "PENGATURAN",
    };

    const title = pageTitles[location.pathname] || "HALAMAN";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <header className="h-[95px] bg-white flex items-center justify-between px-8">
            {/* Judul halaman */}
            <h1 className="text-[34px] font-extrabold text-black">
                {title}
            </h1>

            {/* Bagian kanan header */}
            <div className="flex items-center gap-7">
                {/* Search Bar */}
                <div className="relative w-[310px] h-[48px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-full border-2 border-[#38a3ff] pl-14 pr-4 text-[16px] outline-none bg-white"
                    />

                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-[26px]" />
                </div>

                {/* Bell */}
                <FaBell className="text-gray-600 text-[30px] cursor-pointer" />

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3"
                    >
                        <p className="font-bold text-black text-[16px]">
                            {username}
                        </p>

                        <FaUserCircle className="text-gray-300 text-[42px]" />

                        <FaChevronDown className="text-black text-[14px]" />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 top-[55px] w-[230px] bg-white rounded-[8px] shadow-lg border border-gray-100 z-50 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <p className="font-extrabold text-black text-[15px]">
                                    {username}
                                </p>
                                <p className="text-gray-400 text-[13px]">
                                    {role}
                                </p>
                            </div>

                            <button
                                onClick={() => alert("Halaman profil belum dibuat")}
                                className="w-full text-left px-5 py-3 text-[14px] hover:bg-[#eef7fc]"
                            >
                                Profil Saya
                            </button>

                            <button
                                onClick={() => navigate("/pengaturan")}
                                className="w-full text-left px-5 py-3 text-[14px] hover:bg-[#eef7fc]"
                            >
                                Pengaturan Akun
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-5 py-3 text-[14px] text-red-500 hover:bg-red-50 font-bold"
                            >
                                Keluar
                            </button>
                        </div>
                    )}
                </div>

                {/* Button Keluar */}
                <button
                    onClick={handleLogout}
                    className="border-2 border-[#3d5577] text-[#3d5577] font-bold px-6 py-2 rounded-[5px] text-[14px] hover:bg-[#3d5577] hover:text-white transition-all"
                >
                    KELUAR
                </button>
            </div>
        </header>
    );
}