import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaPen, FaPrint, FaPlus } from "react-icons/fa";

export default function Orders() {
    const [showForm, setShowForm] = useState(false);
    const [transactionData, setTransactionData] = useState([]);

    const [formData, setFormData] = useState({
        noPolisi: "",
        namaPelanggan: "",
        noTelp: "",
        merk: "",
        tipe: "",
        jenisService: "",
        keluhan: "",
        mekanik: "",
        biayaJasa: "",
        biayaSparepart: "",
        status: "ANTRE",
    });

    const getTransactionData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/transaksi");
            setTransactionData(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data transaksi:", error);
        }
    };

    useEffect(() => {
        getTransactionData();
    }, []);

    const statusStyle = {
        SELESAI: "bg-[#22c55e] text-white",
        PROSES: "bg-[#facc15] text-black",
        ANTRE: "bg-[#6b7280] text-white",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://127.0.0.1:8000/api/transaksi", {
                nama_pelanggan: formData.namaPelanggan,
                no_telp: formData.noTelp,
                no_polisi: formData.noPolisi,
                merk: formData.merk,
                tipe: formData.tipe,
                jenis_service: formData.jenisService,
                keluhan: formData.keluhan,
                mekanik: formData.mekanik,
                biaya_jasa: Number(formData.biayaJasa),
                biaya_sparepart: Number(formData.biayaSparepart),
                status: formData.status,
            });

            await getTransactionData();

            setFormData({
                namaPelanggan: "",
                noTelp: "",
                noPolisi: "",
                merk: "",
                tipe: "",
                jenisService: "",
                keluhan: "",
                mekanik: "",
                biayaJasa: "",
                biayaSparepart: "",
                status: "PROSES",
            });

            setShowForm(false);
            alert("Data transaksi berhasil ditambahkan!");
        } catch (error) {
            console.error("Gagal menambah transaksi:", error);
            alert("Gagal menambah transaksi. Cek console ya.");
        }
    };

    return (
        <div>
            {/* Button Tambah Transaksi */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#3d5577] hover:bg-[#2f4566] text-white font-extrabold px-6 py-4 rounded-[5px] flex items-center gap-3 text-[14px]"
                >
                    <FaPlus />
                    TAMBAH TRANSAKSI BARU
                </button>
            </div>

            {/* Form Tambah Transaksi */}
            {showForm && (
                <div className="bg-white rounded-[8px] p-6 mb-6 shadow-sm">
                    <h2 className="font-extrabold text-[22px] mb-5 text-black">
                        Form Daftarkan Servis Baru
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Data Pelanggan */}
                        <h3 className="font-bold text-[#3d5577] mb-3">
                            Data Pelanggan
                        </h3>

                        <div className="grid grid-cols-3 gap-5 mb-5">
                            <input
                                type="text"
                                name="namaPelanggan"
                                value={formData.namaPelanggan}
                                onChange={handleChange}
                                placeholder="Nama Pelanggan"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="noTelp"
                                value={formData.noTelp}
                                onChange={handleChange}
                                placeholder="No. Telp"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="noPolisi"
                                value={formData.noPolisi}
                                onChange={handleChange}
                                placeholder="No. Polisi"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />
                        </div>

                        {/* Data Kendaraan */}
                        <h3 className="font-bold text-[#3d5577] mb-3">
                            Data Kendaraan
                        </h3>

                        <div className="grid grid-cols-2 gap-5 mb-5">
                            <input
                                type="text"
                                name="merk"
                                value={formData.merk}
                                onChange={handleChange}
                                placeholder="Merk Kendaraan"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            />

                            <input
                                type="text"
                                name="tipe"
                                value={formData.tipe}
                                onChange={handleChange}
                                placeholder="Tipe/Model Kendaraan"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            />
                        </div>

                        {/* Data Servis */}
                        <h3 className="font-bold text-[#3d5577] mb-3">
                            Data Servis
                        </h3>

                        <div className="grid grid-cols-3 gap-5 mb-5">
                            <input
                                type="text"
                                name="jenisService"
                                value={formData.jenisService}
                                onChange={handleChange}
                                placeholder="Jenis Service"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="mekanik"
                                value={formData.mekanik}
                                onChange={handleChange}
                                placeholder="Nama Mekanik"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            >
                                <option value="ANTRE">ANTRE</option>
                                <option value="PROSES">PROSES</option>
                                <option value="SELESAI">SELESAI</option>
                            </select>
                        </div>

                        <textarea
                            name="keluhan"
                            value={formData.keluhan}
                            onChange={handleChange}
                            placeholder="Keluhan kendaraan"
                            className="w-full bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none mb-5"
                            rows="3"
                        ></textarea>

                        {/* Data Biaya */}
                        <h3 className="font-bold text-[#3d5577] mb-3">
                            Data Biaya
                        </h3>

                        <div className="grid grid-cols-2 gap-5 mb-5">
                            <input
                                type="number"
                                name="biayaJasa"
                                value={formData.biayaJasa}
                                onChange={handleChange}
                                placeholder="Biaya Jasa"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="number"
                                name="biayaSparepart"
                                value={formData.biayaSparepart}
                                onChange={handleChange}
                                placeholder="Biaya Sparepart"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 rounded-[6px] font-bold border border-[#3d5577] text-[#3d5577]"
                            >
                                BATAL
                            </button>

                            <button
                                type="submit"
                                className="px-8 py-3 rounded-[6px] font-bold bg-[#3d5577] text-white"
                            >
                                SIMPAN
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="block text-[20px] text-black mb-2">
                        Filter Bulan
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[17px] outline-none">
                        <option>Oktober 2025</option>
                        <option>November 2025</option>
                        <option>Desember 2025</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[20px] text-black mb-2">
                        Filter Layanan
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[17px] outline-none">
                        <option>Semua Layanan</option>
                        <option>Service ringan</option>
                        <option>Service berat</option>
                        <option>Ganti oli</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[20px] text-black mb-2">
                        Filter Status
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[17px] outline-none">
                        <option>Selesai</option>
                        <option>Proses</option>
                        <option>Antre</option>
                    </select>
                </div>
            </div>

            {/* Table Transaksi */}
            <div className="bg-white rounded-[8px] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#e5e7eb]">
                        <tr>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Tanggal
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                No Transaksi
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                No Polisi
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Pelanggan
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Jenis Service
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Mekanik
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Total
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Status
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactionData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="p-8 text-center text-gray-400 text-[15px]"
                                >
                                    Belum ada data transaksi. Klik tombol
                                    “Tambah Transaksi Baru” untuk menambahkan data.
                                </td>
                            </tr>
                        ) : (
                            transactionData.map((item) => (
                                <tr
                                    key={item.no_transaksi}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-4 text-[14px] text-black">
                                        {item.tanggal}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.no_transaksi}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.no_polisi}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.nama_pelanggan}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.jenis_service}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.mekanik}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.total_biaya}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-4 py-2 rounded-[5px] text-[11px] font-extrabold ${
                                                statusStyle[item.status]
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-3 text-[#3d5577] text-[16px]">
                                            <FaEye className="cursor-pointer" />
                                            <FaPen className="cursor-pointer" />
                                            <FaPrint className="cursor-pointer" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}