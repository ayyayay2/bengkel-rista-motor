import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

export default function Stok() {
    const [showForm, setShowForm] = useState(false);

    const [stokData, setStokData] = useState([]);

    const getStokData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/stok-suku-cadang");
            setStokData(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data stok:", error);
        }
    };

    useEffect(() => {
        getStokData();
    }, []);

    const [formData, setFormData] = useState({
        noSeri: "",
        namaSukuCadang: "",
        kategori: "",
        harga: "",
        stok: "",
        status: "Tersedia",
    });

    const [editId, setEditId] = useState(null);

    const [selectedStok, setSelectedStok] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const statusStyle = {
        Tersedia: "bg-[#22c55e] text-white",
        Menipis: "bg-[#facc15] text-black",
        Habis: "bg-[#ef4444] text-white",
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
            const payload = {
                no_seri: formData.noSeri,
                nama_suku_cadang: formData.namaSukuCadang,
                kategori: formData.kategori,
                harga: Number(formData.harga),
                stok: Number(formData.stok),
                stok_minimum: 5,
            };

            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/stok-suku-cadang/${editId}`, payload);
                alert("Data stok berhasil diperbarui!");
            } else {
                await axios.post("http://127.0.0.1:8000/api/stok-suku-cadang", payload);
                alert("Data stok berhasil ditambahkan!");
            }

            await getStokData();

            setFormData({
                noSeri: "",
                namaSukuCadang: "",
                kategori: "",
                harga: "",
                stok: "",
                status: "Tersedia",
            });

            setEditId(null);
            setShowForm(false);
        } catch (error) {
            console.error("Gagal menyimpan data stok:", error);
            alert("Gagal menyimpan data stok. Cek console ya.");
        }
    };

    const handleView = (item) => {
        setSelectedStok(item);
        setShowDetailModal(true);
    };

    const handleEdit = (item) => {
        setEditId(item.id);

        setFormData({
            noSeri: item.no_seri,
            namaSukuCadang: item.nama_suku_cadang,
            kategori: item.kategori,
            harga: item.harga,
            stok: item.stok,
            status: item.status,
        });

        setShowForm(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/stok-suku-cadang/${deleteId}`);

            await getStokData();

            setDeleteId(null);
            setShowDeleteModal(false);

            alert("Data stok berhasil dihapus!");
        } catch (error) {
            console.error("Gagal menghapus data stok:", error);
            alert("Gagal menghapus data stok.");
        }
    };

    return (
        <div>
            {/* Button Tambah Suku Cadang */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#3d5577] hover:bg-[#2f4566] text-white font-extrabold px-6 py-4 rounded-[5px] flex items-center gap-3 text-[14px]"
                >
                    <FaPlus />
                    TAMBAH SUKU CADANG BARU
                </button>
            </div>

            {/* Form Tambah Suku Cadang */}
            {showForm && (
                <div className="bg-white rounded-[8px] p-6 mb-6 shadow-sm">
                    <h2 className="text-[22px] font-extrabold text-black mb-5">
                        Form Tambah Suku Cadang
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-5">
                            <input
                                type="text"
                                name="noSeri"
                                value={formData.noSeri}
                                onChange={handleChange}
                                placeholder="No Seri"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="text"
                                name="namaSukuCadang"
                                value={formData.namaSukuCadang}
                                onChange={handleChange}
                                placeholder="Nama Suku Cadang"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <select
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleChange}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="Mesin">Mesin</option>
                                <option value="Pengereman">Pengereman</option>
                                <option value="Kelistrikan">Kelistrikan</option>
                                <option value="Oli">Oli</option>
                                <option value="Ban">Ban</option>
                            </select>

                            <input
                                type="number"
                                name="harga"
                                value={formData.harga}
                                onChange={handleChange}
                                placeholder="Harga"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="number"
                                name="stok"
                                value={formData.stok}
                                onChange={handleChange}
                                placeholder="Stok"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            >
                                <option value="Tersedia">Tersedia</option>
                                <option value="Menipis">Menipis</option>
                                <option value="Habis">Habis</option>
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
            <div className="grid grid-cols-3 gap-6 mb-6 w-[78%]">
                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Kategori
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Mesin</option>
                        <option>Pengereman</option>
                        <option>Kelistrikan</option>
                        <option>Oli</option>
                        <option>Ban</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Status
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Tersedia</option>
                        <option>Menipis</option>
                        <option>Habis</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Cari Suku Cadang/No. Seri
                    </label>

                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />

                        <input
                            type="text"
                            placeholder="Cari Suku Cadang/No.Seri"
                            className="w-full bg-white rounded-[8px] pl-10 pr-4 py-2 text-[16px] outline-none placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Table Stok Suku Cadang */}
            <div className="bg-white rounded-[8px] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#e5e7eb]">
                        <tr>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                NO Seri
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Nama Suku Cadang
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Kategori
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Harga
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Stok
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
                        {stokData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="p-8 text-center text-gray-400 text-[15px]"
                                >
                                    Belum ada data suku cadang. Klik tombol
                                    “Tambah Suku Cadang Baru” untuk menambahkan data.
                                </td>
                            </tr>
                        ) : (
                            stokData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-4 text-[14px] text-black">
                                        {item.no_seri}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.nama_suku_cadang}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.kategori}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.harga}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.stok}
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
                                        <div className="flex gap-3 text-[16px]">
                                            <FaEye
                                                onClick={() => handleView(item)}
                                                className="cursor-pointer text-[#3d5577]"
                                            />

                                            <FaPen
                                                onClick={() => handleEdit(item)}
                                                className="cursor-pointer text-[#3d5577]"
                                            />

                                            <button onClick={() => handleDelete(item.id)}>
                                                <FaTrash className="cursor-pointer text-red-500 hover:text-red-700" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {showDetailModal && selectedStok && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[450px] rounded-[10px] shadow-lg p-6">
                        <h2 className="text-[22px] font-extrabold text-black mb-5">
                            Detail Stok Suku Cadang
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">No Seri</p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedStok.no_seri}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Nama Suku Cadang</p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedStok.nama_suku_cadang}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Kategori</p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedStok.kategori}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Harga</p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    Rp. {Number(selectedStok.harga || 0).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Stok</p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedStok.stok}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Status</p>
                                <span
                                    className={`inline-block text-[12px] font-bold px-3 py-1 rounded-full ${
                                        selectedStok.status === "Habis"
                                            ? "bg-red-100 text-red-600"
                                            : selectedStok.status === "Menipis"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-green-100 text-green-600"
                                    }`}
                                >
                                    {selectedStok.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedStok(null);
                                }}
                                className="bg-[#3d5577] text-white px-5 py-2 rounded-[6px] font-bold hover:bg-[#2f4566]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[420px] rounded-[10px] shadow-lg p-6">
                        <h2 className="text-[22px] font-extrabold text-black mb-3">
                            Hapus Stok?
                        </h2>

                        <p className="text-[14px] text-gray-600 mb-6">
                            Apakah kamu yakin ingin menghapus data stok ini? Data yang sudah dihapus tidak dapat dikembalikan.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteId(null);
                                }}
                                className="px-5 py-2 rounded-[6px] border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
                            >
                                Batal
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-5 py-2 rounded-[6px] bg-red-600 text-white font-bold hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}