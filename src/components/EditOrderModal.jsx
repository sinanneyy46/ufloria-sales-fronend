import "../styles/Modal.scss";
import React, { useState } from "react";

import Close from "../assets/images/close.svg";
import Arrow from "../assets/images/arrow.svg";

export default function EditOrderModal({ order, perfumes, onClose, onSave }) {
  const [form, setForm] = useState(order);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    // Auto recalc price when perfume or qty changes
    if (name === "perfume" || name === "qty_ml") {
      const p = perfumes.find((x) => x.id == updated.perfume);
      if (p && updated.qty_ml) {
        updated.price = (p.price_per_ml * updated.qty_ml).toFixed(2);
      }
    }

    setForm(updated);
  };

  const save = () => onSave(form);

  return (
    <div className="modal-back">
      <div className="modal">
        <img src={Close} className="close-btn" onClick={onClose} alt="Close" />

        <h3>Edit Order</h3>

        <label>Student</label>
        <input
          name="student_name"
          value={form.student_name}
          onChange={handleChange}
        />

        <label>Perfume</label>
        <div className="dropdown">
          <select name="perfume" value={form.perfume} onChange={handleChange}>
            {perfumes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <img src={Arrow} className="select-arrow" alt="Arrow" />
        </div>
        <label>Qty (ml)</label>
        <input
          name="qty_ml"
          type="number"
          value={form.qty_ml}
          onChange={handleChange}
        />

        <label>Total Price</label>
        <input readOnly value={`₹${form.price}`} />

        <label>Status</label>
        <div className="dropdown">
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="ordered">Ordered</option>
            <option value="delivered">Delivered</option>
            <option value="paid">Paid</option>
          </select>
          <img src={Arrow} className="select-arrow" alt="Arrow" />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
