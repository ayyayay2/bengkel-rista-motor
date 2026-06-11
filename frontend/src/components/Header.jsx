import React, { useEffect, useState } from "react";
import axios from "axios";
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

    const [jumlahNotifikasi, setJumlahNotifikasi] = useState(0);
    const [stokNotifikasi, setStokNotifikasi] = useState([]);
    const [showNotifikasi, setShowNotifikasi] = useState(false);

    useEffect(() => {
        const getNotifikasiStok = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/stok-suku-cadang");

                const stokMenipis = response.data.data.filter(
                    (item) =>
                        item.status?.toLowerCase() === "menipis" ||
                        item.status?.toLowerCase() === "habis"
                );

                setJumlahNotifikasi(stokMenipis.length);
                setStokNotifikasi(stokMenipis);
            } catch (error) {
                console.error("Gagal mengambil notifikasi stok:", error);
            }
        };

        getNotifikasiStok();
    }, []);

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
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowNotifikasi(!showNotifikasi)}
                        className="relative cursor-pointer"
                    >
                        <FaBell className="text-gray-600 text-[30px]" />

                        {jumlahNotifikasi > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {jumlahNotifikasi}
                            </span>
                        )}
                    </button>

                    {showNotifikasi && (
                        <div className="absolute right-0 mt-3 w-[320px] bg-white rounded-[10px] shadow-lg border border-gray-100 z-50">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-bold text-[16px] text-gray-800">
                                    Notifikasi Stok
                                </h3>
                                <p className="text-[12px] text-gray-500">
                                    Daftar stok yang menipis atau habis
                                </p>
                            </div>

                            <div className="max-h-[260px] overflow-y-auto">
                                {stokNotifikasi.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-[14px]">
                                        Semua stok masih aman.
                                    </div>
                                ) : (
                                    stokNotifikasi.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-4 border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <p className="font-bold text-[14px] text-gray-800">
                                                        {item.nama_suku_cadang}
                                                    </p>
                                                    <p className="text-[12px] text-gray-500">
                                                        No Seri: {item.no_seri}
                                                    </p>
                                                    <p className="text-[12px] text-gray-500">
                                                        Stok tersisa: {item.stok}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                                                        item.status === "Habis"
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

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
                                onClick={() => navigate("/pengaturan")}
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