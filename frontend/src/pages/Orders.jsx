import axios from "axios";
import { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash, FaPlus } from "react-icons/fa";

export default function Orders() {
    const [showForm, setShowForm] = useState(false);
    const [transactionData, setTransactionData] = useState([]);
    const [stokData, setStokData] = useState([]);

    const [formData, setFormData] = useState({
        jenisTransaksi: "SERVICE",
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

    const [selectedSparepartId, setSelectedSparepartId] = useState("");
    const [jumlahSparepart, setJumlahSparepart] = useState("");
    const [sparepartDipakai, setSparepartDipakai] = useState([]);

    const [editId, setEditId] = useState(null);

    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const getTransactionData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/transaksi");
            setTransactionData(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data transaksi:", error);
        }
    };

    const getStokData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/stok-suku-cadang");
            setStokData(response.data.data);
        } catch (error) {
            console.error("Gagal mengambil data stok:", error);
        }
    };

    useEffect(() => {
        getTransactionData();
        getStokData();
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

    const totalBiayaSparepart = sparepartDipakai.reduce(
        (total, item) => total + Number(item.subtotal || 0),
        0
    );

    const totalBiaya = Number(formData.biayaJasa || 0) + totalBiayaSparepart;

    const handleTambahSparepart = () => {
        if (!selectedSparepartId || !jumlahSparepart) {
            alert("Pilih sparepart dan isi jumlah terlebih dahulu.");
            return;
        }

        const sparepart = stokData.find(
            (item) => item.id === Number(selectedSparepartId)
        );

        if (!sparepart) {
            alert("Sparepart tidak ditemukan.");
            return;
        }

        const jumlah = Number(jumlahSparepart);

        if (jumlah <= 0) {
            alert("Jumlah sparepart harus lebih dari 0.");
            return;
        }

        if (sparepart.stok <= 0) {
            alert("Stok sparepart ini sudah habis.");
            return;
        }

        if (jumlah > sparepart.stok) {
            alert(`Stok tidak cukup. Stok tersedia hanya ${sparepart.stok}.`);
            return;
        }

        const sudahAda = sparepartDipakai.find(
            (item) => item.stok_suku_cadang_id === sparepart.id
        );

        if (sudahAda) {
            alert("Sparepart ini sudah ditambahkan. Hapus dulu jika ingin mengubah jumlah.");
            return;
        }

        const itemBaru = {
            stok_suku_cadang_id: sparepart.id,
            nama_suku_cadang: sparepart.nama_suku_cadang,
            harga: Number(sparepart.harga),
            jumlah,
            subtotal: Number(sparepart.harga) * jumlah,
            stok_tersedia: sparepart.stok,
        };

        setSparepartDipakai([...sparepartDipakai, itemBaru]);
        setSelectedSparepartId("");
        setJumlahSparepart("");
    };

    const handleHapusSparepart = (id) => {
        setSparepartDipakai(
            sparepartDipakai.filter((item) => item.stok_suku_cadang_id !== id)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (sparepartDipakai.length === 0) {
            alert("Pilih minimal satu sparepart terlebih dahulu.");
            return;
        }

        const isSparepartOnly = formData.jenisTransaksi === "SPAREPART";

        try {
            const payload = {
                nama_pelanggan: isSparepartOnly
                    ? "Pembeli Sparepart"
                    : formData.namaPelanggan,

                no_telp: isSparepartOnly
                    ? "-"
                    : formData.noTelp,

                no_polisi: isSparepartOnly
                    ? "-"
                    : formData.noPolisi,

                merk: isSparepartOnly
                    ? "-"
                    : formData.merk,

                tipe: isSparepartOnly
                    ? "-"
                    : formData.tipe,

                jenis_service: isSparepartOnly
                    ? "Pembelian Sparepart"
                    : formData.jenisService,

                keluhan: isSparepartOnly
                    ? "Pembelian sparepart tanpa servis"
                    : formData.keluhan,

                mekanik: isSparepartOnly
                    ? "-"
                    : formData.mekanik,

                biaya_jasa: isSparepartOnly
                    ? 0
                    : Number(formData.biayaJasa || 0),

                biaya_sparepart: totalBiayaSparepart,

                status: isSparepartOnly
                    ? "SELESAI"
                    : formData.status,

                spareparts: sparepartDipakai.map((item) => ({
                    stok_suku_cadang_id: item.stok_suku_cadang_id,
                    jumlah: item.jumlah,
                })),
            };

            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/transaksi/${editId}`, payload);
                alert("Data transaksi berhasil diperbarui!");
            } else {
                await axios.post("http://127.0.0.1:8000/api/transaksi", payload);
                alert("Data transaksi berhasil ditambahkan!");
            }

            await getTransactionData();
            await getStokData();

            setFormData({
                jenisTransaksi: "SERVICE",
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
                status: "ANTRE",
            });

            setSparepartDipakai([]);
            setSelectedSparepartId("");
            setJumlahSparepart("");

            setEditId(null);
            setShowForm(false);
        } catch (error) {
            console.error("Gagal menyimpan transaksi:", error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Gagal menyimpan transaksi. Cek console ya.");
            }
        }
    };

    const handleView = (item) => {
        setSelectedTransaksi(item);
        setShowDetailModal(true);
    };

    const handleEdit = (item) => {
        setEditId(item.id);

        setFormData({
            namaPelanggan: item.nama_pelanggan || "",
            noTelp: item.no_telp || "",
            noPolisi: item.no_polisi || "",
            merk: item.merk || "",
            tipe: item.tipe || "",
            jenisService: item.jenis_service || "",
            keluhan: item.keluhan || "",
            mekanik: item.mekanik || "",
            biayaJasa: item.biaya_jasa || "",
            biayaSparepart: item.biaya_sparepart || "",
            status: item.status || "ANTRE",
        });

        setShowForm(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/transaksi/${deleteId}`);

            await getTransactionData();

            setDeleteId(null);
            setShowDeleteModal(false);

        } catch (error) {
            console.error("Gagal menghapus transaksi:", error);
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

            {showDetailModal && selectedTransaksi && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[520px] rounded-[10px] shadow-lg p-6">
                        <h2 className="text-[22px] font-extrabold text-black mb-5">
                            Detail Transaksi
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">No Transaksi</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.no_transaksi || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Tanggal</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.tanggal || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Nama Pelanggan</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.nama_pelanggan}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">No Telepon</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.no_telp || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">No Polisi</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.no_polisi}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Kendaraan</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.merk || "-"} {selectedTransaksi.tipe || ""}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Jenis Service</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.jenis_service}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Mekanik</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.mekanik || "-"}
                                </p>
                            </div>

                            <div className="col-span-2">
                                <p className="text-[12px] text-gray-500 font-semibold">Keluhan</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.keluhan || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Biaya Jasa</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    Rp. {Number(selectedTransaksi.biaya_jasa || 0).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Biaya Sparepart</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    Rp. {Number(selectedTransaksi.biaya_sparepart || 0).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Total Biaya</p>
                                <p className="text-[16px] font-extrabold text-[#3d5577]">
                                    Rp. {Number(selectedTransaksi.total_biaya || 0).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Status</p>
                                <span
                                    className={`inline-block text-[12px] font-bold px-3 py-1 rounded-full ${
                                        selectedTransaksi.status === "SELESAI"
                                            ? "bg-green-100 text-green-600"
                                            : selectedTransaksi.status === "PROSES"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {selectedTransaksi.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedTransaksi(null);
                                }}
                                className="bg-[#3d5577] text-white px-5 py-2 rounded-[6px] font-bold hover:bg-[#2f4566]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Tambah Transaksi */}
            {showForm && (
                <div className="bg-white rounded-[8px] p-6 mb-6 shadow-sm">
                    <h2 className="font-extrabold text-[22px] mb-5 text-black">
                        Form Daftarkan Servis Baru
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* Jenis Transaksi */}
                        <h3 className="font-bold text-[#3d5577] mb-3">
                            Jenis Transaksi
                        </h3>

                        <div className="grid grid-cols-2 gap-5 mb-5">
                            <select
                                name="jenisTransaksi"
                                value={formData.jenisTransaksi}
                                onChange={handleChange}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            >
                                <option value="SERVICE">Service Kendaraan</option>
                                <option value="SPAREPART">Pembelian Sparepart</option>
                            </select>
                        </div>

                    {formData.jenisTransaksi === "SERVICE" && (
                        <>

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
                        
                        </>
                    )}

                        {/* Sparepart Digunakan */}
                        <h3 className="font-bold text-[#3d5577] mb-3">
                            Sparepart Digunakan
                        </h3>

                        <div className="grid grid-cols-3 gap-5 mb-4">
                            <select
                                value={selectedSparepartId}
                                onChange={(e) => setSelectedSparepartId(e.target.value)}
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            >
                                <option value="">Pilih Sparepart</option>
                                {stokData.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        disabled={item.stok <= 0}
                                    >
                                        {item.nama_suku_cadang} | Stok: {item.stok} | Rp. {Number(item.harga).toLocaleString("id-ID")}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                value={jumlahSparepart}
                                onChange={(e) => setJumlahSparepart(e.target.value)}
                                placeholder="Jumlah"
                                className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                            />

                            <button
                                type="button"
                                onClick={handleTambahSparepart}
                                className="bg-[#3d5577] text-white font-bold rounded-[6px] hover:bg-[#2f4566]"
                            >
                                Tambah Sparepart
                            </button>
                        </div>

                        {sparepartDipakai.length > 0 && (
                            <div className="bg-[#f8fafc] rounded-[8px] overflow-hidden mb-5">
                                <table className="w-full text-left">
                                    <thead className="bg-[#e5e7eb]">
                                        <tr>
                                            <th className="p-3 text-[13px] font-bold">Sparepart</th>
                                            <th className="p-3 text-[13px] font-bold">Harga</th>
                                            <th className="p-3 text-[13px] font-bold">Jumlah</th>
                                            <th className="p-3 text-[13px] font-bold">Subtotal</th>
                                            <th className="p-3 text-[13px] font-bold">Aksi</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sparepartDipakai.map((item) => (
                                            <tr key={item.stok_suku_cadang_id} className="border-b border-gray-200">
                                                <td className="p-3 text-[13px]">
                                                    {item.nama_suku_cadang}
                                                </td>

                                                <td className="p-3 text-[13px]">
                                                    Rp. {Number(item.harga).toLocaleString("id-ID")}
                                                </td>

                                                <td className="p-3 text-[13px]">
                                                    {item.jumlah}
                                                </td>

                                                <td className="p-3 text-[13px] font-bold">
                                                    Rp. {Number(item.subtotal).toLocaleString("id-ID")}
                                                </td>

                                                <td className="p-3 text-[13px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleHapusSparepart(item.stok_suku_cadang_id)}
                                                        className="text-red-600 font-bold hover:text-red-800"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

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

                            <div className="grid grid-cols-3 gap-5 mb-5">
                                <input
                                    type="number"
                                    name="biayaJasa"
                                    value={formData.biayaJasa}
                                    onChange={handleChange}
                                    placeholder="Biaya Jasa"
                                    className="bg-[#eef7fc] px-4 py-3 rounded-[6px] outline-none"
                                    required
                                />

                                <div className="bg-[#eef7fc] px-4 py-3 rounded-[6px]">
                                    <p className="text-[12px] text-gray-500 font-semibold">
                                        Biaya Sparepart
                                    </p>
                                    <p className="font-bold text-[#3d5577]">
                                        Rp. {totalBiayaSparepart.toLocaleString("id-ID")}
                                    </p>
                                </div>

                                <div className="bg-[#eef7fc] px-4 py-3 rounded-[6px]">
                                    <p className="text-[12px] text-gray-500 font-semibold">
                                        Total Biaya
                                    </p>
                                    <p className="font-bold text-[#3d5577]">
                                        Rp. {totalBiaya.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>
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
                                            <FaEye
                                                onClick={() => handleView(item)}
                                                className="cursor-pointer text-[#3d5577]"
                                            />

                                            <FaPen
                                                onClick={() => handleEdit(item)}
                                                className="cursor-pointer text-[#3d5577]"
                                            />

                                            <FaTrash
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showDetailModal && selectedTransaksi && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[520px] rounded-[10px] shadow-lg p-6">
                        <h2 className="text-[22px] font-extrabold text-black mb-5">
                            Detail Transaksi
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">No Transaksi</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.no_transaksi || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Tanggal</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.tanggal || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Nama Pelanggan</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.nama_pelanggan}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">No Telepon</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.no_telp || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">No Polisi</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.no_polisi}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Kendaraan</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.merk || "-"} {selectedTransaksi.tipe || ""}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Jenis Service</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.jenis_service}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Mekanik</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.mekanik || "-"}
                                </p>
                            </div>

                            <div className="col-span-2">
                                <p className="text-[12px] text-gray-500 font-semibold">Keluhan</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    {selectedTransaksi.keluhan || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Biaya Jasa</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    Rp. {Number(selectedTransaksi.biaya_jasa || 0).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Biaya Sparepart</p>
                                <p className="text-[15px] font-bold text-gray-800">
                                    Rp. {Number(selectedTransaksi.biaya_sparepart || 0).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Total Biaya</p>
                                <p className="text-[16px] font-extrabold text-[#3d5577]">
                                    Rp. {Number(selectedTransaksi.total_biaya || 0).toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-gray-500 font-semibold">Status</p>
                                <span
                                    className={`inline-block text-[12px] font-bold px-3 py-1 rounded-full ${
                                        selectedTransaksi.status === "SELESAI"
                                            ? "bg-green-100 text-green-600"
                                            : selectedTransaksi.status === "PROSES"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {selectedTransaksi.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedTransaksi(null);
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
                            Hapus Transaksi?
                        </h2>

                        <p className="text-[14px] text-gray-600 mb-6">
                            Apakah kamu yakin ingin menghapus data transaksi ini? Data yang sudah dihapus tidak dapat dikembalikan.
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