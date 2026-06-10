import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex bg-[#eef7fc]">
            {/* Sidebar kiri */}
            <Sidebar />

            {/* Area kanan */}
            <div className="flex-1 min-h-screen">
                <Header />

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}