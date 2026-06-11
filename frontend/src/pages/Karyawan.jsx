import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaPen, FaPlus, FaSearch} from "react-icons/fa";

export default function Karyawan() {
    const [showForm, setShowForm] = useState(false);

    const [karyawanData, setKaryawanData] = useState([]);

    const getKaryawanData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/karyawan");
            setKaryawanData(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data karyawan:", error);
        }
    };

    useEffect(() => {
        getKaryawanData();
    }, []);

    const [formData, setFormData] = useState({
        nama: "",
        jabatan: "",
        noTelp: "",
        status: "AKTIF",
    });

    const [editId, setEditId] = useState(null);
    const [selectedKaryawan, setSelectedKaryawan] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const statusStyle = {
        AKTIF: "bg-[#22c55e] text-white",
        CUTI: "bg-[#facc15] text-black",
        NONAKTIF: "bg-[#ef4444] text-white",
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
                nama: formData.nama,
                jabatan: formData.jabatan,
                no_telp: formData.noTelp,
                status: formData.status,
            };

            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/karyawan/${editId}`, payload);
                alert("Data karyawan berhasil diperbarui!");
            } else {
                await axios.post("http://127.0.0.1:8000/api/karyawan", payload);
                alert("Data karyawan berhasil ditambahkan!");
            }

            await getKaryawanData();

            setFormData({
                nama: "",
                jabatan: "",
                noTelp: "",
                status: "AKTIF",
            });

            setEditId(null);
            setShowForm(false);
        } catch (error) {
            console.error("Gagal menyimpan data karyawan:", error);
            alert("Gagal menyimpan data karyawan. Cek console ya.");
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);

        setFormData({
            nama: item.nama,
            jabatan: item.jabatan,
            noTelp: item.no_telp,
            status: item.status,
        });

        setShowForm(true);
    };

    const handleView = (item) => {
        setSelectedKaryawan(item);
        setShowDetailModal(true);
    };

    return (
        <div>
            {/* Button Tambah Karyawan */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#3d5577] hover:bg-[#2f4566] text-white font-extrabold px-6 py-4 rounded-[5px] flex items-center gap-3 text-[14px]"
                >
                    <FaPlus />
                    TAMBAH KARYAWAN BARU
                </button>
            </div>

            {/* Form Tambah Karyawan */}
            {showForm && (
                <div className="bg-white rounded-[8px] p-6 mb-6 shadow-sm">
                    <h2 className="text-[22px] font-extrabold text-black mb-5">
                        Form Tambah Karyawan
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-4 gap-5">
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Nama Karyawan"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <select
                                name="jabatan"
                                value={formData.jabatan}
                                onChange={handleChange}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            >
                                <option value="">Pilih Jabatan</option>
                                <option value="Owner">Owner</option>
                                <option value="Admin">Admin</option>
                                <option value="Kasir">Kasir</option>
                                <option value="Mekanik">Mekanik</option>
                            </select>

                            <input
                                type="text"
                                name="noTelp"
                                value={formData.noTelp}
                                onChange={handleChange}
                                placeholder="No. Telp"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            >
                                <option value="AKTIF">AKTIF</option>
                                <option value="CUTI">CUTI</option>
                                <option value="NONAKTIF">NONAKTIF</option>
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
                        Filter Jabatan
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Owner</option>
                        <option>Admin</option>
                        <option>Kasir</option>
                        <option>Mekanik</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Status
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Aktif</option>
                        <option>Cuti</option>
                        <option>Nonaktif</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Cari Nama/No. Telp
                    </label>

                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />

                        <input
                            type="text"
                            placeholder="Cari Nama/No.Telp"
                            className="w-full bg-white rounded-[8px] pl-10 pr-4 py-2 text-[16px] outline-none placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Table Karyawan */}
            <div className="bg-white rounded-[8px] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#e5e7eb]">
                        <tr>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                No ID
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Nama Karyawan
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Jabatan
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                No. Telp
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
                        {karyawanData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="p-8 text-center text-gray-400 text-[15px]"
                                >
                                    Belum ada data karyawan. Klik tombol
                                    “Tambah Karyawan Baru” untuk menambahkan data.
                                </td>
                            </tr>
                        ) : (
                            karyawanData.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-4 text-[14px] text-black">
                                        {item.id}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.nama}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.jabatan}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.no_telp}
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
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showDetailModal && selectedKaryawan && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[420px] rounded-[10px] shadow-lg p-6">
                        <h2 className="text-[22px] font-extrabold text-black mb-5">
                            Detail Karyawan
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    Nama
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedKaryawan.nama}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    Jabatan
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedKaryawan.jabatan}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    No Telepon
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedKaryawan.no_telp}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    Status
                                </p>
                                <span
                                    className={`inline-block text-[12px] font-bold px-3 py-1 rounded-full ${
                                        selectedKaryawan.status === "AKTIF"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                    }`}
                                >
                                    {selectedKaryawan.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedKaryawan(null);
                                }}
                                className="bg-[#3d5577] text-white px-5 py-2 rounded-[6px] font-bold hover:bg-[#2f4566]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}