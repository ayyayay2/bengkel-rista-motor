import { useState } from "react";
import {
    FaDatabase,
    FaSave,
    FaUserCog,
    FaShieldAlt,
    FaStore,
    FaInfoCircle,
} from "react-icons/fa";

export default function Pengaturan() {
    const defaultSettings = {
        namaBengkel: "Rista Motor Service Duri",
        alamat: "Jl. Soekarno-Hatta, Duri",
        telepon: "(0765) 123-456",
        email: "admin@ristamotor.id",
        owner: "Dullah",
        statusDefault: "ANTRE",
        batasStok: "5",
        jamBuka: "08.00",
        jamTutup: "17.00",
        metodePembayaran: "Tunai & Transfer",
        notifikasi: "Stok menipis & transaksi selesai",
        mataUang: "Rupiah (IDR)",
    };

    const [formData, setFormData] = useState(() => {
        const savedSettings = localStorage.getItem("pengaturanBengkel");

        if (savedSettings) {
            return JSON.parse(savedSettings);
        }

        return defaultSettings;
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        localStorage.setItem("pengaturanBengkel", JSON.stringify(formData));

        alert("Perubahan pengaturan berhasil disimpan!");
    };

    const handleBackup = () => {
        alert("Fitur backup data belum tersedia karena belum terhubung database.");
    };

    const handleKelolaAkun = () => {
        alert("Halaman kelola akun belum dibuat.");
    };

    return (
        <div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
                {/* Card utama pengaturan */}
                <div className="bg-white rounded-[8px] shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                            {/* Pengaturan Umum */}
                            <div>
                                <h2 className="text-[22px] font-extrabold text-black mb-5 pb-4 border-b border-gray-200">
                                    PENGATURAN UMUM
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Nama Bengkel
                                        </label>

                                        <input
                                            type="text"
                                            name="namaBengkel"
                                            value={formData.namaBengkel}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Alamat
                                        </label>

                                        <input
                                            type="text"
                                            name="alamat"
                                            value={formData.alamat}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Nomor Telepon
                                        </label>

                                        <input
                                            type="text"
                                            name="telepon"
                                            value={formData.telepon}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Email Kontak
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Nama Owner
                                        </label>

                                        <input
                                            type="text"
                                            name="owner"
                                            value={formData.owner}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pengaturan Operasional */}
                            <div>
                                <h2 className="text-[22px] font-extrabold text-black mb-5 pb-4 border-b border-gray-200">
                                    PENGATURAN OPERASIONAL
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Status Transaksi Default
                                        </label>

                                        <select
                                            name="statusDefault"
                                            value={formData.statusDefault}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        >
                                            <option value="ANTRE">Antre</option>
                                            <option value="PROSES">Proses</option>
                                            <option value="SELESAI">Selesai</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Batas Minimum Stok
                                        </label>

                                        <input
                                            type="number"
                                            name="batasStok"
                                            value={formData.batasStok}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Jam Operasional
                                        </label>

                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="jamBuka"
                                                value={formData.jamBuka}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                            />

                                            <input
                                                type="text"
                                                name="jamTutup"
                                                value={formData.jamTutup}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Metode Pembayaran
                                        </label>

                                        <select
                                            name="metodePembayaran"
                                            value={formData.metodePembayaran}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        >
                                            <option>Tunai & Transfer</option>
                                            <option>Tunai</option>
                                            <option>Transfer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Notifikasi
                                        </label>

                                        <select
                                            name="notifikasi"
                                            value={formData.notifikasi}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        >
                                            <option>Stok menipis & transaksi selesai</option>
                                            <option>Stok menipis saja</option>
                                            <option>Transaksi selesai saja</option>
                                            <option>Nonaktif</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[15px] font-bold text-black mb-2">
                                            Satuan Mata Uang
                                        </label>

                                        <select
                                            name="mataUang"
                                            value={formData.mataUang}
                                            onChange={handleChange}
                                            className="w-full bg-white border border-gray-300 rounded-[6px] px-4 py-3 outline-none focus:border-[#3d5577]"
                                        >
                                            <option>Rupiah (IDR)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Button Simpan */}
                        <div className="border-t border-gray-100 p-6">
                            <button
                                type="submit"
                                className="w-full bg-[#3d5577] hover:bg-[#2f4566] text-white font-extrabold py-4 rounded-[6px] flex items-center justify-center gap-3"
                            >
                                <FaSave />
                                SIMPAN PERUBAHAN
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar kanan pengaturan */}
                <div className="space-y-6">
                    {/* Ringkasan Sistem */}
                    <div className="bg-white rounded-[8px] p-6 shadow-sm">
                        <h2 className="text-[20px] font-extrabold text-black mb-5">
                            Ringkasan Sistem
                        </h2>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <FaShieldAlt className="text-[#3d5577] text-[24px]" />

                                <div>
                                    <p className="text-gray-500 text-[13px]">
                                        Role
                                    </p>
                                    <p className="font-bold text-black">
                                        Owner
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <FaStore className="text-[#3d5577] text-[24px]" />

                                <div>
                                    <p className="text-gray-500 text-[13px]">
                                        Cabang
                                    </p>
                                    <p className="font-bold text-black">
                                        Duri
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <FaInfoCircle className="text-[#3d5577] text-[24px]" />

                                <div>
                                    <p className="text-gray-500 text-[13px]">
                                        Versi Sistem
                                    </p>
                                    <p className="font-bold text-black">
                                        v1.0
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Sistem */}
                    <div className="bg-white rounded-[8px] p-6 shadow-sm">
                        <h2 className="text-[20px] font-extrabold text-black mb-5">
                            Informasi Sistem
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-[14px] text-gray-500">
                                    Nama Sistem
                                </span>
                                <span className="text-[14px] font-bold text-gray-800">
                                    Sistem Informasi Bengkel
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-[14px] text-gray-500">
                                    Bengkel
                                </span>
                                <span className="text-[14px] font-bold text-gray-800">
                                    Rista Motor
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-[14px] text-gray-500">
                                    Versi
                                </span>
                                <span className="text-[14px] font-bold text-gray-800">
                                    1.0.0
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-[14px] text-gray-500">
                                    Database
                                </span>
                                <span className="text-[14px] font-bold text-gray-800">
                                    MySQL
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-gray-500">
                                    Status Sistem
                                </span>
                                <span className="bg-green-100 text-green-600 text-[12px] font-bold px-3 py-1 rounded-full">
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}