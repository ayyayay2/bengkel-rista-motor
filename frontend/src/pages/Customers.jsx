import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaPen, FaPrint, FaPlus, FaSearch } from "react-icons/fa";

export default function Customers() {
    const [showForm, setShowForm] = useState(false);

    const [customerData, setCustomerData] = useState([]);

    const [formData, setFormData] = useState({
        nama: "",
        noTelp: "",
        noPolisi: "",
        servisTerakhir: "",
        jumlahService: "",
        status: "SELESAI",
    });

    const [editId, setEditId] = useState(null);
    const [selectedPelanggan, setSelectedPelanggan] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const getCustomerData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/pelanggan");
            setCustomerData(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data pelanggan:", error);
        }
    };

    useEffect(() => {
        getCustomerData();
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
            const payload = {
                nama: formData.nama,
                no_telp: formData.noTelp,
                no_polisi: formData.noPolisi,
                servis_terakhir: formData.servisTerakhir,
                jumlah_service: Number(formData.jumlahService || 0),
                status: formData.status,
            };

            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/pelanggan/${editId}`, payload);
                alert("Data pelanggan berhasil diperbarui!");
            } else {
                await axios.post("http://127.0.0.1:8000/api/pelanggan", payload);
                alert("Data pelanggan berhasil ditambahkan!");
            }

            await getCustomerData();

            setFormData({
                nama: "",
                noTelp: "",
                noPolisi: "",
                servisTerakhir: "",
                jumlahService: "",
                status: "ANTRE",
            });

            setEditId(null);
            setShowForm(false);
        } catch (error) {
            console.error("Gagal menyimpan data pelanggan:", error);
            alert("Gagal menyimpan data pelanggan. Cek console ya.");
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);

        setFormData({
            nama: item.nama,
            noTelp: item.no_telp,
            noPolisi: item.no_polisi,
            servisTerakhir: item.servis_terakhir || "",
            jumlahService: item.jumlah_service || 0,
            status: item.status,
        });

        setShowForm(true);
    };

    const handleView = (item) => {
        setSelectedPelanggan(item);
        setShowDetailModal(true);
    };

    return (
        <div>
            {/* Button Tambah Pelanggan */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#3d5577] hover:bg-[#2f4566] text-white font-extrabold px-6 py-4 rounded-[5px] flex items-center gap-3 text-[14px]"
                >
                    <FaPlus />
                    TAMBAH PELANGGAN BARU
                </button>
            </div>

            {/* Form Tambah Pelanggan */}
            {showForm && (
                <div className="bg-white rounded-[8px] p-6 mb-6 shadow-sm">
                    <h2 className="text-[22px] font-extrabold text-black mb-5">
                        Form Tambah Pelanggan
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-5">
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
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

                            <input
                                type="text"
                                name="servisTerakhir"
                                value={formData.servisTerakhir}
                                onChange={handleChange}
                                placeholder="Servis Terakhir"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />

                            <input
                                type="number"
                                name="jumlahService"
                                value={formData.jumlahService}
                                onChange={handleChange}
                                placeholder="Jumlah Service"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                required
                            />
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
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Kendaraan
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Mobil</option>
                        <option>Motor</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Filter Jumlah Service
                    </label>

                    <select className="w-full bg-white rounded-[8px] px-4 py-2 text-[16px] outline-none">
                        <option>Semua</option>
                        <option>Pelanggan Baru</option>
                        <option>Standar</option>
                        <option>Loyal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[18px] text-black mb-2">
                        Nama/No. Telp/No. Polisi
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

            {/* Table Pelanggan */}
            <div className="bg-white rounded-[8px] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#e5e7eb]">
                        <tr>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                ID Pelanggan
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Nama Pelanggan
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                No. Telp
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                No. Polisi
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Servis Terakhir
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Jumlah Service
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
                        {customerData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="p-8 text-center text-gray-400 text-[15px]"
                                >
                                    Belum ada data pelanggan. Klik tombol
                                    “Tambah Pelanggan Baru” untuk menambahkan data.
                                </td>
                            </tr>
                        ) : (
                            customerData.map((item) => (
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
                                        {item.no_telp}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.no_polisi}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.servis_terakhir}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.jumlah_service}
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

            {showDetailModal && selectedPelanggan && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[430px] rounded-[10px] shadow-lg p-6">
                        <h2 className="text-[22px] font-extrabold text-black mb-5">
                            Detail Pelanggan
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    Nama
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedPelanggan.nama}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    No Telepon
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedPelanggan.no_telp}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    No Polisi
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedPelanggan.no_polisi}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    Servis Terakhir
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedPelanggan.servis_terakhir || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    Jumlah Service
                                </p>
                                <p className="text-[16px] font-bold text-gray-800">
                                    {selectedPelanggan.jumlah_service}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">
                                    Status
                                </p>
                                <span
                                    className={`inline-block text-[12px] font-bold px-3 py-1 rounded-full ${
                                        selectedPelanggan.status === "SELESAI"
                                            ? "bg-green-100 text-green-600"
                                            : selectedPelanggan.status === "PROSES"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {selectedPelanggan.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedPelanggan(null);
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