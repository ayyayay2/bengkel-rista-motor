import { FaTools, FaUser, FaLock, FaEnvelope } from "react-icons/fa";

export default function Register() {
    return (
        <div className="w-[460px] min-h-[560px] bg-white rounded-[24px] px-[48px] py-[34px] shadow-lg">
            {/* Logo dan Judul */}
            <div className="flex flex-col items-center">
                <FaTools className="text-[#143b63] text-[58px] mb-5" />

                <h1 className="text-[26px] font-extrabold text-black mb-7">
                    REGISTER
                </h1>
            </div>

            <form>
                {/* Username */}
                <div className="mb-6">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        USERNAME
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaUser className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full h-full bg-transparent outline-none border-none text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-6">
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

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        PASSWORD
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaLock className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type="password"
                            placeholder="Kata Sandi"
                            className="w-full h-full bg-transparent outline-none border-none text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                        />
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-8">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        KONFIRMASI PASSWORD
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaLock className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type="password"
                            placeholder="Konfirmasi Kata Sandi"
                            className="w-full h-full bg-transparent outline-none border-none text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                        />
                    </div>
                </div>

                {/* Button Register */}
                <button
                    type="submit"
                    className="w-[270px] h-[42px] bg-[#3d5577] hover:bg-[#2f4566] text-white rounded-[7px] font-extrabold text-[15px] block mx-auto transition-all"
                >
                    DAFTAR
                </button>

                <p className="text-center text-[#3d5577] text-[10px] mt-4">
                    Sudah punya akun? Login
                </p>
            </form>
        </div>
    );
}