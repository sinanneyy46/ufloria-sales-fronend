import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";

// pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PerfumeList from "./pages/PerfumeList";
import OrderForm from "./pages/OrderForm";
import SupplierView from "./pages/SupplierView";

import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected area */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="perfumes" element={<PerfumeList />} />
          <Route path="supplier" element={<SupplierView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
