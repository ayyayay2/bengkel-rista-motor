import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
    FaArrowDown,
    FaArrowUp,
    FaDownload,
    FaMoneyBillWave,
    FaReceipt,
    FaWallet,
} from "react-icons/fa";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function Laporan() {
    const [transaksiData, setTransaksiData] = useState([]);
    const [pengeluaranData, setPengeluaranData] = useState([]);

    const [showPengeluaranForm, setShowPengeluaranForm] = useState(false);

    const [formPengeluaran, setFormPengeluaran] = useState({
        tanggal: "",
        kategori: "",
        keterangan: "",
        nominal: "",
    });

    const getLaporanData = async () => {
        try {
            const transaksiResponse = await axios.get("http://127.0.0.1:8000/api/transaksi");
            const pengeluaranResponse = await axios.get("http://127.0.0.1:8000/api/pengeluaran");

            setTransaksiData(transaksiResponse.data.data);
            setPengeluaranData(pengeluaranResponse.data.data);
        } catch (error) {
            console.error("Gagal mengambil data laporan:", error);
        }
    };

    useEffect(() => {
        getLaporanData();
    }, []);

    const formatRupiah = (angka) => {
        return `Rp. ${Number(angka).toLocaleString("id-ID")}`;
    };

    const handleDownload = () => {
        const pemasukanRows = transaksiData.map((item) => ({
            Tanggal: item.tanggal,
            Jenis: "Pemasukan",
            Kategori: "Transaksi Servis",
            Keterangan: `${item.jenis_service} - ${item.nama_pelanggan} (${item.no_polisi})`,
            Nominal: Number(item.total_biaya || 0),
        }));

        const pengeluaranRows = pengeluaranData.map((item) => ({
            Tanggal: item.tanggal,
            Jenis: "Pengeluaran",
            Kategori: item.kategori,
            Keterangan: item.keterangan || "-",
            Nominal: Number(item.nominal || 0),
        }));

        const laporanRows = [...pemasukanRows, ...pengeluaranRows];

        const ringkasanRows = [
            {
                Keterangan: "Total Pemasukan",
                Nominal: totalPemasukan,
            },
            {
                Keterangan: "Total Pengeluaran",
                Nominal: totalPengeluaran,
            },
            {
                Keterangan: "Laba Bersih",
                Nominal: labaBersih,
            },
            {
                Keterangan: "Jumlah Transaksi",
                Nominal: jumlahTransaksi,
            },
            {
                Keterangan: "Rata-rata / Hari",
                Nominal: rataRataPerHari,
            },
        ];

        const workbook = XLSX.utils.book_new();

        const worksheetRingkasan = XLSX.utils.json_to_sheet(ringkasanRows);
        const worksheetRincian = XLSX.utils.json_to_sheet(laporanRows);

        XLSX.utils.book_append_sheet(workbook, worksheetRingkasan, "Ringkasan");
        XLSX.utils.book_append_sheet(workbook, worksheetRincian, "Rincian Laporan");

        XLSX.writeFile(workbook, "laporan-keuangan-bengkel.xlsx");
    };

    const handleChangePengeluaran = (e) => {
        const { name, value } = e.target;

        setFormPengeluaran({
            ...formPengeluaran,
            [name]: value,
        });
    };

    const handleSubmitPengeluaran = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://127.0.0.1:8000/api/pengeluaran", {
                tanggal: formPengeluaran.tanggal,
                kategori: formPengeluaran.kategori,
                keterangan: formPengeluaran.keterangan,
                nominal: Number(formPengeluaran.nominal),
            });

            await getLaporanData();

            setFormPengeluaran({
                tanggal: "",
                kategori: "",
                keterangan: "",
                nominal: "",
            });

            setShowPengeluaranForm(false);
            alert("Data pengeluaran berhasil ditambahkan!");
        } catch (error) {
            console.error("Gagal menambah pengeluaran:", error);
            alert("Gagal menambah pengeluaran. Cek console ya.");
        }
    };

    const totalPemasukan = transaksiData.reduce(
        (total, item) => total + Number(item.total_biaya || 0),
        0
    );

    const totalPengeluaran = pengeluaranData.reduce(
        (total, item) => total + Number(item.nominal || 0),
        0
    );

    const labaBersih = totalPemasukan - totalPengeluaran;

    const jumlahTransaksi = transaksiData.length;

    const rataRataPerHari =
        jumlahTransaksi > 0 ? totalPemasukan / jumlahTransaksi : 0;

    const tanggalList = [
        ...new Set([
            ...transaksiData.map((item) => item.tanggal),
            ...pengeluaranData.map((item) => item.tanggal),
        ]),
    ];

    const chartData = tanggalList.map((tanggal) => {
        const pemasukan = transaksiData
            .filter((item) => item.tanggal === tanggal)
            .reduce((total, item) => total + Number(item.total_biaya || 0), 0);

        const pengeluaran = pengeluaranData
            .filter((item) => item.tanggal === tanggal)
            .reduce((total, item) => total + Number(item.nominal || 0), 0);

        return {
            tanggal,
            pemasukan,
            pengeluaran,
            laba: pemasukan - pengeluaran,
        };
    });

    const reportData = transaksiData;

    return (
        <div>
            {/* Card Ringkasan */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
                <div className="bg-white rounded-[8px] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[8px] bg-green-100 flex items-center justify-center">
                            <FaArrowUp className="text-green-500 text-[22px]" />
                        </div>
                    </div>

                    <p className="text-gray-500 text-[14px]">
                        Total Pemasukan
                    </p>

                    <h2 className="text-[24px] font-extrabold text-black mt-1">
                        {formatRupiah(totalPemasukan)}
                    </h2>
                </div>

                <div className="bg-white rounded-[8px] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[8px] bg-red-100 flex items-center justify-center">
                            <FaArrowDown className="text-red-500 text-[22px]" />
                        </div>
                    </div>

                    <p className="text-gray-500 text-[14px]">
                        Total Pengeluaran
                    </p>

                    <h2 className="text-[24px] font-extrabold text-black mt-1">
                        {formatRupiah(totalPengeluaran)}
                    </h2>
                </div>

                <div className="bg-white rounded-[8px] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[8px] bg-blue-100 flex items-center justify-center">
                            <FaWallet className="text-blue-500 text-[22px]" />
                        </div>
                    </div>

                    <p className="text-gray-500 text-[14px]">
                        Laba Bersih
                    </p>

                    <h2 className="text-[24px] font-extrabold text-black mt-1">
                        {formatRupiah(labaBersih)}
                    </h2>
                </div>

                <div className="bg-white rounded-[8px] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[8px] bg-yellow-100 flex items-center justify-center">
                            <FaReceipt className="text-yellow-500 text-[22px]" />
                        </div>
                    </div>

                    <p className="text-gray-500 text-[14px]">
                        Jumlah Transaksi
                    </p>

                    <h2 className="text-[24px] font-extrabold text-black mt-1">
                        {jumlahTransaksi}
                    </h2>
                </div>

                <div className="bg-white rounded-[8px] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[8px] bg-purple-100 flex items-center justify-center">
                            <FaMoneyBillWave className="text-purple-500 text-[22px]" />
                        </div>
                    </div>

                    <p className="text-gray-500 text-[14px]">
                        Rata-rata / Hari
                    </p>

                    <h2 className="text-[24px] font-extrabold text-black mt-1">
                        {formatRupiah(rataRataPerHari)}
                    </h2>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-[8px] p-6 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end">
                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">
                            Jenis Laporan
                        </label>

                        <select className="w-full bg-[#eef7fc] rounded-[6px] px-4 py-3 outline-none">
                            <option>Laporan Keuangan</option>
                            <option>Laporan Transaksi Servis</option>
                            <option>Laporan Stok Suku Cadang</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">
                            Periode
                        </label>

                        <select className="w-full bg-[#eef7fc] rounded-[6px] px-4 py-3 outline-none">
                            <option>Bulanan</option>
                            <option>Harian</option>
                            <option>Tahunan</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">
                            Bulan
                        </label>

                        <select className="w-full bg-[#eef7fc] rounded-[6px] px-4 py-3 outline-none">
                            <option>Januari</option>
                            <option>Februari</option>
                            <option>Maret</option>
                            <option>April</option>
                            <option>Mei</option>
                            <option>Juni</option>
                            <option>Juli</option>
                            <option>Agustus</option>
                            <option>September</option>
                            <option>Oktober</option>
                            <option>November</option>
                            <option>Desember</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">
                            Tahun
                        </label>

                        <select className="w-full bg-[#eef7fc] rounded-[6px] px-4 py-3 outline-none">
                            <option>Desember</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[15px] font-bold text-black mb-2">
                            Tahun
                        </label>

                        <select className="w-full bg-[#eef7fc] rounded-[6px] px-4 py-3 outline-none">
                            <option>2025</option>
                            <option>2026</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setShowPengeluaranForm(!showPengeluaranForm)}
                        className="bg-[#3d5577] text-white px-5 py-3 rounded-[6px] font-bold text-[14px] hover:bg-[#2f4566]"
                    >
                        + Tambah Pengeluaran
                    </button>
                    {showPengeluaranForm && (
                        <form
                            onSubmit={handleSubmitPengeluaran}
                            className="bg-white rounded-[8px] p-6 shadow-sm mb-6"
                        >
                            <h3 className="text-[20px] font-extrabold text-black mb-5">
                                Tambah Pengeluaran
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[14px] font-bold text-gray-600 mb-2">
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal"
                                        value={formPengeluaran.tanggal}
                                        onChange={handleChangePengeluaran}
                                        className="w-full border border-gray-300 rounded-[6px] px-4 py-3 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[14px] font-bold text-gray-600 mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        name="kategori"
                                        value={formPengeluaran.kategori}
                                        onChange={handleChangePengeluaran}
                                        className="w-full border border-gray-300 rounded-[6px] px-4 py-3 outline-none"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="Pembelian Suku Cadang">
                                            Pembelian Suku Cadang
                                        </option>
                                        <option value="Operasional">Operasional</option>
                                        <option value="Gaji Karyawan">Gaji Karyawan</option>
                                        <option value="Peralatan Bengkel">Peralatan Bengkel</option>
                                        <option value="Listrik/Air">Listrik/Air</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[14px] font-bold text-gray-600 mb-2">
                                        Nominal
                                    </label>
                                    <input
                                        type="number"
                                        name="nominal"
                                        value={formPengeluaran.nominal}
                                        onChange={handleChangePengeluaran}
                                        placeholder="Contoh: 500000"
                                        className="w-full border border-gray-300 rounded-[6px] px-4 py-3 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[14px] font-bold text-gray-600 mb-2">
                                        Keterangan
                                    </label>
                                    <input
                                        type="text"
                                        name="keterangan"
                                        value={formPengeluaran.keterangan}
                                        onChange={handleChangePengeluaran}
                                        placeholder="Contoh: Beli stok oli mesin"
                                        className="w-full border border-gray-300 rounded-[6px] px-4 py-3 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowPengeluaranForm(false)}
                                    className="px-5 py-3 rounded-[6px] border border-gray-300 font-bold text-gray-600"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-3 rounded-[6px] bg-[#facc15] text-black font-extrabold"
                                >
                                    Simpan Pengeluaran
                                </button>
                            </div>
                        </form>
                    )}

                    <button
                        onClick={handleDownload}
                        className="bg-[#3d5577] hover:bg-[#2f4566] text-white font-bold px-5 py-3 rounded-[6px] flex items-center justify-center gap-3"
                    >
                        <FaDownload />
                        Unduh Laporan
                    </button>
                </div>
            </div>

            {/* Grafik */}
            <div className="bg-white rounded-[8px] p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-[22px] font-extrabold text-black">
                            Grafik Keuangan
                        </h2>

                        <p className="text-gray-500 text-[14px]">
                            Perbandingan pemasukan, pengeluaran, dan laba bersih.
                        </p>
                    </div>
                </div>

                {chartData.length === 0 ? (
                    <div className="h-[320px] flex items-center justify-center text-gray-400">
                        Belum ada data grafik laporan.
                    </div>
                ) : (
                    <div className="w-full h-[320px]">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="tanggal" />
                                <YAxis
                                    tickFormatter={(value) =>
                                        `Rp ${Number(value).toLocaleString("id-ID")}`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        `Rp ${Number(value).toLocaleString("id-ID")}`
                                    }
                                />
                                <Legend />

                                <Bar
                                    dataKey="pemasukan"
                                    name="Pemasukan"
                                    fill="#22c55e"
                                    radius={[6, 6, 0, 0]}
                                />

                                <Bar
                                    dataKey="pengeluaran"
                                    name="Pengeluaran"
                                    fill="#ef4444"
                                    radius={[6, 6, 0, 0]}
                                />

                                <Bar
                                    dataKey="laba"
                                    name="Laba Bersih"
                                    fill="#3d5577"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Tabel Rincian */}
            <div className="bg-white rounded-[8px] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-[22px] font-extrabold text-black">
                        Rincian Laporan Keuangan
                    </h2>

                    <p className="text-gray-500 text-[14px]">
                        Daftar pemasukan dan pengeluaran bengkel pada periode terpilih.
                    </p>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#e5e7eb]">
                        <tr>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Tanggal
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Keterangan
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Kategori
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Pemasukan
                            </th>
                            <th className="p-4 text-[14px] font-extrabold text-black">
                                Pengeluaran
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="p-8 text-center text-gray-400 text-[15px]"
                                >
                                    Belum ada data laporan.
                                </td>
                            </tr>
                        ) : (
                            reportData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200"
                                >
                                    <td className="p-4 text-[14px] text-black">
                                        {item.tanggal}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        {item.keterangan}
                                    </td>

                                    <td className="p-4 text-[14px] text-black">
                                        <span
                                            className={`px-4 py-2 rounded-[5px] text-[11px] font-extrabold ${
                                                item.kategori === "Pemasukan"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {item.kategori}
                                        </span>
                                    </td>

                                    <td className="p-4 text-[14px] text-green-600 font-bold">
                                        {item.pemasukan > 0
                                            ? formatRupiah(item.pemasukan)
                                            : "-"}
                                    </td>

                                    <td className="p-4 text-[14px] text-red-500 font-bold">
                                        {item.pengeluaran > 0
                                            ? formatRupiah(item.pengeluaran)
                                            : "-"}
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