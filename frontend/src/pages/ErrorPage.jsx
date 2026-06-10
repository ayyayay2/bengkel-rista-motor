import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorPage({
    code = "ERROR",
    desc = "Terjadi kesalahan saat memuat halaman.",
    img,
}) {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
            {img ? (
                <img
                    src={img}
                    alt="Error Illustration"
                    className="w-64 mb-6 opacity-80"
                />
            ) : (
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <FaExclamationTriangle className="text-red-500 text-[42px]" />
                </div>
            )}

            <h1 className="text-[70px] font-extrabold text-red-500 mb-2">
                {code}
            </h1>

            <h2 className="text-[24px] font-extrabold text-black mb-4">
                {desc}
            </h2>

            <p className="text-gray-500 mb-6">
                Silakan kembali ke dashboard untuk melanjutkan penggunaan sistem.
            </p>

            <button
                onClick={() => navigate("/")}
                className="bg-[#3d5577] hover:bg-[#2f4566] text-white px-8 py-3 rounded-[6px] font-bold transition-all"
            >
                Kembali ke Dashboard
            </button>
        </div>
    );
}