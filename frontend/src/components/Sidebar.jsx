import { NavLink } from "react-router-dom";
import {
    FaTools,
    FaTachometerAlt,
    FaExchangeAlt,
    FaUsers,
    FaCar,
    FaShoppingCart,
    FaUserFriends,
    FaClipboardList,
    FaCog,
} from "react-icons/fa";

export default function Sidebar() {
    const menus = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FaTachometerAlt />,
        },
        {
            name: "Transaksi",
            path: "/orders",
            icon: <FaExchangeAlt />,
        },
        {
            name: "Pelanggan",
            path: "/customers",
            icon: <FaUsers />,
        },
        {
            name: "Kendaraan",
            path: "/kendaraan",
            icon: <FaCar />,
        },
        {
            name: "Stok Suku Cadang",
            path: "/stok",
            icon: <FaShoppingCart />,
        },
        {
            name: "Karyawan",
            path: "/karyawan",
            icon: <FaUserFriends />,
        },
        {
            name: "Laporan",
            path: "/laporan",
            icon: <FaClipboardList />,
        },
        {
            name: "Pengaturan",
            path: "/pengaturan",
            icon: <FaCog />,
        },
    ];

    const menuClass = ({ isActive }) =>
        `flex items-center gap-4 px-6 py-4 text-[17px] transition-all
        ${
            isActive
                ? "bg-[#2f4566] text-white border-l-4 border-[#facc15] font-bold"
                : "text-white hover:bg-[#2f4566] border-l-4 border-transparent"
        }`;

    return (
        <aside className="w-[255px] min-h-screen bg-[#3d5577] text-white">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-8">
                <FaTools className="text-[#facc15] text-[34px]" />

                <h1 className="text-[28px] font-extrabold tracking-wide">
                    BENGKEL
                </h1>
            </div>

            {/* Menu */}
            <nav className="mt-6">
                {menus.map((menu) => (
                    <NavLink
                        key={menu.name}
                        to={menu.path}
                        className={menuClass}
                    >
                        <span className="text-[22px]">
                            {menu.icon}
                        </span>

                        <span>
                            {menu.name}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}