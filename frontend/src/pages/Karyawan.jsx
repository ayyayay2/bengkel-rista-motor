import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaPen, FaPrint, FaPlus, FaSearch, FaTrash} from "react-icons/fa";

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
            await axios.post("http://127.0.0.1:8000/api/karyawan", {
                nama: formData.nama,
                jabatan: formData.jabatan,
                no_telp: formData.noTelp,
                status: formData.status,
            });

            await getKaryawanData();

            setFormData({
                nama: "",
                jabatan: "",
                noTelp: "",
                status: "AKTIF",
            });

            setShowForm(false);
            alert("Data karyawan berhasil ditambahkan!");
        } catch (error) {
            console.error("Gagal menambah data karyawan:", error);
            alert("Gagal menambah data karyawan. Cek console ya.");
        }
    };

    const handleView = (item) => {
        alert(
            `Nama: ${item.nama}\nNo Telp: ${item.no_telp}\nNo Polisi: ${item.no_polisi}\nStatus: ${item.status}`
        );
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Yakin ingin menghapus data karyawan ini?");

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/karyawan/${id}`);
            await getKaryawanData();
            alert("Data karyawan berhasil dihapus!");
        } catch (error) {
            console.error("Gagal menghapus data karyawan:", error);
            alert("Gagal menghapus data karyawan.");
        }
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
                                            <FaPen className="cursor-pointer text-[#3d5577]" />

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
        </div>
    );
}