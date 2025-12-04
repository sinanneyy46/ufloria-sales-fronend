import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getSuppliers, updateSupplier } from "../api/supplier";
import "../styles/SupplierView.scss";
import Pattern from "../assets/images/pattern.png";

export default function SupplierView() {
  const [supplier, setSupplier] = useState(null);
  const { showToast } = useOutletContext();
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getSuppliers();
    if (res.data.length > 0) setSupplier(res.data[0]);
  };

  const save = async () => {
    await updateSupplier(supplier.id, supplier);
    showToast("Saved");
  };

  if (!supplier) return <div>Loading…</div>;

  return (
    <div className="supplier-page">
      <img src={Pattern} className="pattern pat-a" />
      <img src={Pattern} className="pattern pat-b" />
      <img src={Pattern} className="pattern pat-cent" />
      <h2 className="page-title">Supplier (Father)</h2>

      <div className="supplier-card">
        <label>Name</label>
        <input
          value={supplier.name}
          onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
        />

        <label>Phone Number</label>
        <input
          value={supplier.phone}
          onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
        />

        <label>Email (optional)</label>
        <input
          value={supplier.email}
          onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
        />

        <label>Notes</label>
        <textarea
          value={supplier.notes}
          onChange={(e) => setSupplier({ ...supplier, notes: e.target.value })}
        />

        <button onClick={save} className="btn btn-primary">
          Save
        </button>
      </div>
    </div>
  );
}
