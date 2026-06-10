import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { FaTools, FaUser, FaLock, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (evt) => {
        const { name, value } = evt.target;

        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        setTimeout(() => {
            localStorage.setItem("token", "dummy-token");
            localStorage.setItem("username", dataForm.email || "Owner");
            localStorage.setItem("role", "Owner");

            setLoading(false);
            navigate("/dashboard");
        }, 800);
    };

    const errorInfo = error ? (
        <div className="bg-red-100 border border-red-300 mb-5 px-4 py-3 text-sm text-red-700 
        rounded-lg flex items-center">
            <BsFillExclamationDiamondFill className="text-red-600 mr-2 text-lg" />
            {error}
        </div>
    ) : null;

    const loadingInfo = loading ? (
        <div className="bg-[#dfe9f7] mb-5 px-4 py-3 text-sm text-[#3d5577] 
        rounded-lg flex items-center">
            <ImSpinner2 className="mr-2 animate-spin" />
            Mohon Tunggu...
        </div>
    ) : null;

    return (
        <div className="w-[460px] min-h-[520px] bg-white rounded-[24px] px-[48px] py-[34px] shadow-lg">
            {/* Logo dan Judul */}
            <div className="flex flex-col items-center">
                <FaTools className="text-[#143b63] text-[58px] mb-5" />

                <h1 className="text-[26px] font-extrabold text-black mb-7">
                    LOGIN
                </h1>
            </div>

            {errorInfo}
            {loadingInfo}

            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-7">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        USERNAME
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaUser className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type="text"
                            name="email"
                            autoComplete="off"
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full h-full bg-transparent outline-none
                             border-none text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                            required
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="mb-10">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        PASSWORD
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaLock className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            onChange={handleChange}
                            placeholder="Kata Sandi"
                            className="w-full h-full bg-transparent outline-none border-none
                             text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                            required
                        />

                        <FaEyeSlash className="text-[#3d5577] text-[20px]" />
                    </div>
                </div>

                {/* Button Login */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-[270px] h-[42px] text-white rounded-[7px]
                         font-extrabold text-[15px] block mx-auto transition-all ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#3d5577] hover:bg-[#2f4566]"
                    }`}
                >
                    {loading ? "PROCESSING..." : "MASUK"}
                </button>

                <p className="text-center text-[#3d5577] text-[10px] mt-4">
                    Lupa Kata Sandi?
                </p>
            </form>
        </div>
    );
}