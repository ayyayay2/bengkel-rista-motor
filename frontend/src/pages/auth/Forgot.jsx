import { FaTools, FaEnvelope } from "react-icons/fa";

export default function Forgot() {
    return (
        <div className="w-[460px] min-h-[430px] bg-white rounded-[24px] px-[48px] py-[34px] shadow-lg">
            {/* Logo dan Judul */}
            <div className="flex flex-col items-center">
                <FaTools className="text-[#143b63] text-[58px] mb-5" />

                <h1 className="text-[26px] font-extrabold text-black mb-3">
                    LUPA PASSWORD
                </h1>

                <p className="text-center text-[12px] text-gray-500 mb-7 leading-relaxed">
                    Masukkan email kamu untuk mendapatkan link reset kata sandi.
                </p>
            </div>

            <form>
                {/* Email */}
                <div className="mb-8">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        EMAIL
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaEnvelope className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full h-full bg-transparent outline-none border-none text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                        />
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-[270px] h-[42px] bg-[#3d5577] hover:bg-[#2f4566] text-white rounded-[7px] font-extrabold text-[15px] block mx-auto transition-all"
                >
                    KIRIM LINK
                </button>

                <p className="text-center text-[#3d5577] text-[10px] mt-4">
                    Kembali ke Login
                </p>
            </form>
        </div>
    );
}