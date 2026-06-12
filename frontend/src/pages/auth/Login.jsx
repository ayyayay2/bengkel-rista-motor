import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { FaTools, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email: dataForm.email,
                password: dataForm.password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("username", response.data.user.name);
            localStorage.setItem("role", response.data.user.role || "Owner");

            localStorage.removeItem("pengaturanBengkel");

            setLoading(false);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login gagal:", error);

            setLoading(false);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Email atau password salah.");
            }
        }
    };

    const errorInfo = error ? (
        <div className="bg-red-100 border border-red-300 mb-5 px-4 py-3 text-sm text-red-700 rounded-lg flex items-center">
            <BsFillExclamationDiamondFill className="text-red-600 mr-2 text-lg" />
            {error}
        </div>
    ) : null;

    const loadingInfo = loading ? (
        <div className="bg-[#dfe9f7] mb-5 px-4 py-3 text-sm text-[#3d5577] rounded-lg flex items-center">
            <ImSpinner2 className="mr-2 animate-spin" />
            Mohon Tunggu...
        </div>
    ) : null;

    return (
        <div className="w-[460px] min-h-[540px] bg-white rounded-[24px] px-[48px] py-[34px] shadow-lg">
            <div className="flex flex-col items-center">
                <FaTools className="text-[#143b63] text-[58px] mb-5" />

                <h1 className="text-[26px] font-extrabold text-black mb-7">
                    LOGIN
                </h1>
            </div>

            {errorInfo}
            {loadingInfo}

            <form onSubmit={handleSubmit}>
                <div className="mb-7">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        EMAIL
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaUser className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type="email"
                            name="email"
                            value={dataForm.email}
                            autoComplete="off"
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full h-full bg-transparent outline-none border-none text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                            required
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-[12px] font-extrabold text-black mb-2">
                        PASSWORD
                    </label>

                    <div className="h-[38px] bg-[#dfe9f7] rounded-[7px] flex items-center px-3">
                        <FaLock className="text-[#3d5577] text-[18px] mr-4" />

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={dataForm.password}
                            autoComplete="new-password"
                            onChange={handleChange}
                            placeholder="Kata Sandi"
                            className="w-full h-full bg-transparent outline-none border-none text-[13px] text-[#3d5577] placeholder:text-[#b7bfca]"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#3d5577] text-[20px]"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-[270px] h-[42px] text-white rounded-[7px] font-extrabold text-[15px] block mx-auto transition-all ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#3d5577] hover:bg-[#2f4566]"
                    }`}
                >
                    {loading ? "PROCESSING..." : "MASUK"}
                </button>

                <div className="text-center mt-4">
                    <Link
                        to="/forgot"
                        className="text-[#3d5577] text-[10px] hover:underline"
                    >
                        Lupa Kata Sandi?
                    </Link>
                </div>

                <p className="text-center text-[11px] mt-5 text-gray-500">
                    Belum punya akun?{" "}
                    <Link
                        to="/register"
                        className="text-[#3d5577] font-bold hover:underline"
                    >
                        Daftar
                    </Link>
                </p>
            </form>
        </div>
    );
}