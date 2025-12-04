import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Toast from "./Toast";

export default function Layout() {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
  };

  return (
    <>
      <NavBar />

      <main className="page-container">
        <Outlet context={{ showToast }} />
      </main>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
