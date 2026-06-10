import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaPen, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

export default function Kendaraan() {
    const [showForm, setShowForm] = useState(false);

    const [kendaraanData, setKendaraanData] = useState([]);

    const [formData, setFormData] = useState({
        platNomor: "",
        pemilik: "",
        merk: "",
        tipe: "",
        tahun: "",
        warna: "",
        servisTerakhir: "",
        status: "SELESAI",
    });

    const getKendaraanData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/kendaraan");
            setKendaraanData(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data kendaraan:", error);
        }
    };

    useEffect(() => {
        getKendaraanData();
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
            await axios.post("http://127.0.0.1:8000/api/kendaraan", {
                plat_nomor: formData.platNomor,
                pemilik: formData.pemilik,
                merk: formData.merk,
                tipe: formData.tipe,
                tahun: formData.tahun,
                warna: formData.warna,
                servis_terakhir: formData.servisTerakhir,
                status: formData.status,
            });

            await getKendaraanData();

            setFormData({
                platNomor: "",
                pemilik: "",
                merk: "",
                tipe: "",
                tahun: "",
                warna: "",
                servisTerakhir: "",
                status: "ANTRE",
            });

            setShowForm(false);
            alert("Data kendaraan berhasil ditambahkan!");
        } catch (error) {
            console.error("Gagal menambah data kendaraan:", error);
            alert("Gagal menambah data kendaraan. Cek console ya.");
        }
    };

    const handleView = (item) => {
        alert(
            `Plat Nomor: ${item.plat_nomor}\nPemilik: ${item.pemilik}\nMerk: ${item.merk}\nTipe: ${item.tipe}\nTahun: ${item.tahun}\nWarna: ${item.warna}\nServis Terakhir: ${item.servis_terakhir || "-"}\nStatus: ${item.status}`
        );
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Yakin ingin menghapus data kendaraan ini?");

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/kendaraan/${id}`);
            await getKendaraanData();
            alert("Data kendaraan berhasil dihapus!");
        } catch (error) {
            console.error("Gagal menghapus data kendaraan:", error);
            alert("Gagal menghapus data kendaraan.");
        }
    };


    return (
        <div>
            {/* Button Tambah Kendaraan */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#3d5577] hover:bg-[#2f4566] text-white font-extrabold px-6 py-4 rounded-[5px] flex items-center gap-3 text-[14px]"
                >
                    <FaPlus />
                    TAMBAH KENDARAAN BARU
                </button>
            </div>

            {/* Form Tambah Kendaraan */}
            {showForm && (
                <div className="bg-white rounded-[8px] p-6 mb-6 shadow-sm">
                    <h2 className="text-[22px] font-extrabold text-black mb-5">
                        Form Tambah Kendaraan
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-4 gap-5">
                            <input
                                type="text"
                                name="platNomor"
                                value={formData.platNomor}
                                onChange={handleChange}
                                placeholder="Plat Nomor"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="pemilik"
                                value={formData.pemilik}
                                onChange={handleChange}
                                placeholder="Nama Pemilik"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="merk"
                                value={formData.merk}
                                onChange={handleChange}
                                placeholder="Merk"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="tipe"
                                value={formData.tipe}
                                onChange={handleChange}
                                placeholder="Tipe/Model"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="number"
                                name="tahun"
                                value={formData.tahun}
                                onChange={handleChange}
                                placeholder="Tahun"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="warna"
                                value={formData.warna}
                                onChange={handleChange}
                                placeholder="Warna"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="servisTerakhir"
                                value={formData.servisTerakhir}
                                onChange={handleChange}
                                placeholder="Service Terakhir"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            >
                                <option value="SELESAI">SELESAI</option>
                                <option value="PROSES">PROSES</option>
                                <option value="ANTRE">ANTRE</option>
                            </select>
                        </div>

                        <div className="flex justify-end mt-5 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 rounded-[6px] font-bold border border-[#3d5577] text-[#3d5577]"
                            >
                                BATAL
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-3 rounded-[6px] font-bold bg-[#3d5577] text-white"
                            >
                                SIMPAN
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter */}
            <div className="grid grid-cols-3 gap-6 mb-6 w-[75%]">
                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Merk
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Toyota</option>
                        <option>Honda</option>
                        <option>Yamaha</option>
                        <option>Suzuki</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Tahun
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua Tahun</option>
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Status
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Selesai</option>
                        <option>Proses</option>
                        <option>Antre</option>
                    </select>
                </div>
            </div>

            {/* Table Kendaraan */}
            <div className="bg-white rounded-[8px] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#e5e7eb]">
                        <tr>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Plat Nomor
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Pemilik
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Merk
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Tipe/Model
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Tahun
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Warna
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Service Terakhir
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
                        {kendaraanData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="p-8 text-center text-gray-400 text-[15px]"
                                >
                                    Belum ada data kendaraan. Klik tombol
                                    “Tambah Kendaraan Baru” untuk menambahkan data.
                                </td>
                            </tr>
                        ) : (
                            kendaraanData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-4 text-[14px] text-black">
                                        {item.plat_nomor}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.pemilik}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.merk}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.tipe}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.tahun}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.warna}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.servis_terakhir}
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
                                            <FaEye
                                                onClick={() => handleView(item)}
                                                className="cursor-pointer text-[#3d5577]"
                                            />                                            
                                            <FaPen className="cursor-pointer" />
                                            <button onClick={() => handleDelete(item.id)}>
                                                <FaTrash className="cursor-pointer text-red-500 hover:text-red-700" />
                                            </button>                                        </div>
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