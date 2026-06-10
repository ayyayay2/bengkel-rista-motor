import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
            <p className="text-[80px] font-extrabold text-[#3d5577] leading-none">
                404
            </p>

            <h1 className="mt-4 text-[32px] font-extrabold text-black">
                Halaman Tidak Ditemukan
            </h1>

            <p className="mt-4 text-[15px] text-gray-500 max-w-md">
                Maaf, halaman yang kamu cari belum tersedia atau belum dibuat
                pada sistem bengkel ini.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
                <Link
                    to="/"
                    className="bg-[#3d5577] hover:bg-[#2f4566] text-white px-6 py-3 rounded-[6px] text-[14px] font-bold transition-all"
                >
                    Kembali ke Dashboard
                </Link>

                <Link
                    to="/orders"
                    className="text-[#3d5577] text-[14px] font-bold"
                >
                    Lihat Transaksi
                </Link>
            </div>
        </div>
    );
}