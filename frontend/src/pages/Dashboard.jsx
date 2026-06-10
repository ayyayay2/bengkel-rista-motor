import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaExchangeAlt,
    FaUsers,
    FaCar,
    FaTools,
    FaCalendarAlt,
    FaStore,
} from "react-icons/fa";

import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";


const monthlyIncome = [];

const serviceStatus = [];

const statusColors = ["#facc15", "#3b82f6", "#22c55e"];

const recentTransactions = [];

const lowStockData = [];

export default function Dashboard() {
    const navigate = useNavigate();

    const [transaksiData, setTransaksiData] = useState([]);

    const [pelangganData, setPelangganData] = useState([]);

    const [kendaraanData, setKendaraanData] = useState([]);

    const [stokData, setStokData] = useState([]);

    const getDashboardData = async () => {
        try {
            const transaksiResponse = await axios.get("http://127.0.0.1:8000/api/transaksi");
            const pelangganResponse = await axios.get("http://127.0.0.1:8000/api/pelanggan");
            const kendaraanResponse = await axios.get("http://127.0.0.1:8000/api/kendaraan");
            const stokResponse = await axios.get("http://127.0.0.1:8000/api/stok-suku-cadang");

            setTransaksiData(transaksiResponse.data.data);
            setPelangganData(pelangganResponse.data.data);
            setKendaraanData(kendaraanResponse.data.data);
            setStokData(stokResponse.data.data);
        } catch (error) {
            console.error("Gagal mengambil data dashboard:", error);
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    const currentTime = new Date();

    const formattedDate = currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const formattedTime = currentTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const cardStyle =
        "flex items-center p-6 bg-white rounded-[8px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300";

    const iconBase =
        "text-[24px] text-white rounded-[8px] p-4 mr-5 flex items-center justify-center";

    const formatJuta = (value) => {
        return `${value / 1000000} jt`;
    };

    const statusBadge = (status) => {
        if (status === "Selesai") {
            return "bg-green-100 text-green-600";
        }

        if (status === "Proses") {
            return "bg-blue-100 text-blue-600";
        }

        return "bg-yellow-100 text-yellow-600";
    };

    const totalTransaksi = transaksiData.length;
    const totalPelanggan = pelangganData.length;
    const totalKendaraan = kendaraanData.length;

    const serviceSelesai = transaksiData.filter(
        (item) => item.status === "SELESAI" || item.status === "Selesai"
    ).length;

    const stokMenipis = stokData.filter(
        (item) => item.status === "Menipis" || item.status === "Habis"
    );

    const transaksiTerbaru = transaksiData.slice(0, 5);

    const totalPemasukan = transaksiData.reduce(
        (total, item) => total + Number(item.total_biaya || 0),
        0
    );

    const monthlyIncome = transaksiData.map((item) => ({
        bulan: item.tanggal,
        pendapatan: Number(item.total_biaya || 0),
    }));

    const serviceStatus = [
        {
            name: "Antre",
            value: transaksiData.filter((item) => item.status === "ANTRE").length,
        },
        {
            name: "Proses",
            value: transaksiData.filter((item) => item.status === "PROSES").length,
        },
        {
            name: "Selesai",
            value: transaksiData.filter((item) => item.status === "SELESAI").length,
        },
    ];

    const totalStatusServis = serviceStatus.reduce(
        (total, item) => total + item.value,
        0
    );

    return (
        <div>
            {/* Card Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className={cardStyle}>
                    <div className={`${iconBase} bg-[#3d5577]`}>
                        <FaExchangeAlt />
                    </div>

                    <div>
                        <h3 className="text-[28px] font-extrabold text-black">
                            {totalTransaksi}
                        </h3>
                        <p className="text-[14px] text-gray-500">
                            Total Transaksi
                        </p>
                    </div>
                </div>

                <div className={cardStyle}>
                    <div className={`${iconBase} bg-[#22c55e]`}>
                        <FaUsers />
                    </div>

                    <div>
                        <h3 className="text-[28px] font-extrabold text-black">
                            {totalPelanggan}
                        </h3>
                        <p className="text-[14px] text-gray-500">
                            Total Pelanggan
                        </p>
                    </div>
                </div>

                <div className={cardStyle}>
                    <div className={`${iconBase} bg-[#facc15]`}>
                        <FaCar />
                    </div>

                    <div>
                        <h3 className="text-[28px] font-extrabold text-black">
                            {totalKendaraan}
                        </h3>
                        <p className="text-[14px] text-gray-500">
                            Kendaraan Servis
                        </p>
                    </div>
                </div>

                <div className={cardStyle}>
                    <div className={`${iconBase} bg-[#ef4444]`}>
                        <FaTools />
                    </div>

                    <div>
                        <h3 className="text-[28px] font-extrabold text-black">
                            {serviceSelesai}
                        </h3>
                        <p className="text-[14px] text-gray-500">
                            Service Selesai
                        </p>
                    </div>
                </div>
            </div>

            {/* Welcome Card */}
            <div className="bg-white rounded-[8px] p-6 shadow-sm mb-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-[#eef7fc] flex items-center justify-center">
                        <FaStore className="text-[#3d5577] text-[30px]" />
                    </div>

                    <div>
                        <h2 className="text-[24px] font-extrabold text-black mb-2">
                            Selamat Datang di Sistem Bengkel
                        </h2>

                        <p className="text-gray-500 text-[15px] leading-relaxed">
                            Kelola transaksi, pelanggan, kendaraan, stok suku
                            cadang, karyawan, dan laporan bengkel dengan mudah
                            dan efisien.
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-4 text-[#3d5577]">
                    <FaCalendarAlt className="text-[28px]" />

                    <div>
                        <p className="font-bold text-black capitalize">
                            {formattedDate}
                        </p>
                        <p className="text-gray-500 text-[14px]">
                            {formattedTime} WIB
                        </p>
                    </div>
                </div>
            </div>

            {/* Grafik dan Status */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6 mb-6">
                {/* Grafik Pendapatan */}
                <div className="bg-white rounded-[8px] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-[22px] font-extrabold text-black">
                            Grafik Pendapatan Bulanan
                        </h2>

                        <select className="bg-white border border-gray-300 rounded-[6px] px-3 py-2 text-[14px] outline-none">
                            <option>6 Bulan Terakhir</option>
                            <option>12 Bulan Terakhir</option>
                        </select>
                    </div>

                    <div className="w-full h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyIncome}>
                                <XAxis dataKey="bulan" />
                                <YAxis tickFormatter={formatJuta} />
                                <Tooltip
                                    formatter={(value) =>
                                        `Rp. ${value.toLocaleString("id-ID")}`
                                    }
                                />
                                <Bar
                                    dataKey="pendapatan"
                                    fill="#3b82f6"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Servis */}
                <div className="bg-white rounded-[8px] p-6 shadow-sm">
                    <h2 className="text-[22px] font-extrabold text-black mb-5">
                        Status Servis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="w-full h-[240px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={serviceStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={2}
                                    >
                                        {serviceStatus.map((entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={statusColors[index]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-[32px] font-extrabold text-black">
                                    {totalStatusServis}
                                </h3>
                                <p className="text-gray-500 text-[14px]">
                                    Total Status Servis
                                </p>
                            </div>

                            {serviceStatus.map((item, index) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    statusColors[index],
                                            }}
                                        ></span>

                                        <p className="text-[15px] text-gray-600">
                                            {item.name}
                                        </p>
                                    </div>

                                    <p className="font-bold text-black">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaksi Terbaru dan Stok Menipis */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Transaksi Terbaru */}
                <div className="bg-white rounded-[8px] p-6 shadow-sm">
                    <h2 className="text-[22px] font-extrabold text-black mb-5">
                        Transaksi Terbaru
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        No Transaksi
                                    </th>
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        No Polisi
                                    </th>
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        Pelanggan
                                    </th>
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        Status
                                    </th>
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        Tanggal
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {transaksiTerbaru.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-8 text-center text-gray-400 text-[14px]"
                                        >
                                            Belum ada transaksi terbaru.
                                        </td>
                                    </tr>
                                ) : (
                                    transaksiTerbaru.map((item) => (
                                        <tr
                                            key={item.no_transaksi}
                                            className="border-b border-gray-100"
                                        >
                                            <td className="py-3 text-[14px] text-black">
                                                {item.no_transaksi}
                                            </td>
                                            <td className="py-3 text-[14px] text-black">
                                                {item.no_polisi}
                                            </td>
                                            <td className="py-3 text-[14px] text-black">
                                                {item.nama_pelanggan}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-[5px] text-[11px] font-bold ${statusBadge(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-[14px] text-gray-500">
                                                {item.tanggal}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <button
                        onClick={() => navigate("/orders")}
                        className="text-[#3d5577] font-bold text-[14px] mt-5"
                    >
                        Lihat semua transaksi →
                    </button>
                </div>

                {/* Stok Menipis */}
                <div className="bg-white rounded-[8px] p-6 shadow-sm">
                    <h2 className="text-[22px] font-extrabold text-black mb-5">
                        Stok Menipis
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        Nama Suku Cadang
                                    </th>
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        Stok Tersedia
                                    </th>
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        Satuan
                                    </th>
                                    <th className="pb-3 text-[13px] font-bold text-gray-500">
                                        Minimal Stok
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {stokMenipis.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="py-8 text-center text-gray-400 text-[14px]"
                                        >
                                            Belum ada data stok menipis.
                                        </td>
                                    </tr>
                                ) : (
                                stokMenipis.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-100"
                                    >
                                        <td className="py-3 text-[14px] text-black">
                                            <div className="flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                {item.nama_suku_cadang}
                                            </div>
                                        </td>

                                        <td className="py-3 text-[14px] text-red-500 font-bold">
                                            {item.stok}
                                        </td>

                                        <td className="py-3 text-[14px] text-black">
                                            Pcs
                                        </td>

                                        <td className="py-3 text-[14px] text-black">
                                            {item.stok_minimum}
                                        </td>
                                    </tr>
                                ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <button
                        onClick={() => navigate("/stok")}
                        className="text-[#3d5577] font-bold text-[14px] mt-5"
                    >
                        Lihat semua stok →
                    </button>
                </div>
            </div>
        </div>
    );
}