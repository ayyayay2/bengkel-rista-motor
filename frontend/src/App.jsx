import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "./components/Loading";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Orders = lazy(() => import("./pages/Orders"));
const Customers = lazy(() => import("./pages/Customers"));
const Kendaraan = lazy(() => import("./pages/Kendaraan"));
const Stok = lazy(() => import("./pages/Stok"));
const Karyawan = lazy(() => import("./pages/Karyawan"));
const Laporan = lazy(() => import("./pages/Laporan"));
const Pengaturan = lazy(() => import("./pages/Pengaturan"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/kendaraan" element={<Kendaraan />} />
          <Route path="/stok" element={<Stok />} />
          <Route path="/karyawan" element={<Karyawan />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;