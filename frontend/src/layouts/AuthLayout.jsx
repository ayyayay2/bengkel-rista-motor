import { Outlet } from "react-router-dom";
import bengkel from "../assets/bengkel.jpg";

export default function AuthLayout() {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${bengkel})` }}
        >
            {/* Overlay warna biru gelap */}
            <div className="absolute inset-0 bg-[#233b5c]/75"></div>

            {/* Isi halaman auth */}
            <div className="relative z-10 w-full flex items-center justify-center px-4">
                <Outlet />
            </div>
        </div>
    );
}