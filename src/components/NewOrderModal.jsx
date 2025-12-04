import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/Modal.scss";
import Close from "../assets/images/close.svg";
import { createOrder } from "../api/orders";

/**
 * Props:
 *  - perfumes: array
 *  - onClose: fn
 *  - onSaved: fn -> called after successful create
 *  - fatherNumber: string (raw)
 *  - template: string (template_text)
 */
export default function NewOrderModal({
  perfumes = [],
  onClose,
  onSaved,
  fatherNumber,
  template = "",
}) {
  const [form, setForm] = useState({
    student_name: "",
    perfume: "",
    qty_ml: "",
    price: 0,
    status: "pending",
  });
  const { showToast } = useOutletContext();

  useEffect(() => {
    // preselect first perfume if available
    if (!form.perfume && perfumes.length > 0) {
      setForm((f) => ({ ...f, perfume: perfumes[0].id }));
    }
    // eslint-disable-next-line
  }, [perfumes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (name === "perfume" || name === "qty_ml") {
      const p = perfumes.find((x) => x.id == updated.perfume);
      if (p && updated.qty_ml) {
        updated.price = (p.price_per_ml * updated.qty_ml).toFixed(2);
      } else updated.price = 0;
    }

    setForm(updated);
  };

  const saveOrder = async () => {
    if (!form.student_name || !form.perfume || !form.qty_ml) {
      showToast("Fill student, perfume and qty.");
      return;
    }

    try {
      await createOrder({
        student_name: form.student_name,
        perfume: form.perfume,
        qty_ml: form.qty_ml,
        price: form.price,
        status: form.status,
      });
      onSaved && onSaved();
      onClose();
      showToast("Order saved.");
    } catch (err) {
      console.error(err);
      showToast("Failed to save order.");
    }
  };

  const sendWhatsApp = () => {
    if (!fatherNumber) {
      showToast("Father phone number missing in Supplier page");
      return;
    }
    if (!form.student_name || !form.perfume || !form.qty_ml) {
      showToast("Fill order details first.");
      return;
    }

    const perfumeObj = perfumes.find((p) => p.id == form.perfume);
    const msg = (template || "")
      .replace("{student}", form.student_name)
      .replace("{perfume}", perfumeObj?.name || "")
      .replace("{qty}", form.qty_ml)
      .replace("{price}", form.price);

    const clean = fatherNumber.replace(/\D/g, "");
    window.open(
      `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const copyMsg = () => {
    const perfumeObj = perfumes.find((p) => p.id == form.perfume);
    const msg = (template || "")
      .replace("{student}", form.student_name)
      .replace("{perfume}", perfumeObj?.name || "")
      .replace("{qty}", form.qty_ml)
      .replace("{price}", form.price);
    navigator.clipboard.writeText(msg);
    showToast("Message copied");
  };

  return (
    <div className="modal-back">
      <div className="modal">
        <img src={Close} className="close-btn" onClick={onClose} alt="Close" />

        <h3>New Order</h3>

        <label>Student</label>
        <input
          name="student_name"
          value={form.student_name}
          onChange={handleChange}
          placeholder="Student name"
        />

        <label>Perfume</label>
        <select name="perfume" value={form.perfume} onChange={handleChange}>
          <option value="">Select perfume</option>
          {perfumes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ₹{p.price_per_ml}/ml
            </option>
          ))}
        </select>

        <label>Qty (ml)</label>
        <input
          name="qty_ml"
          type="number"
          value={form.qty_ml}
          onChange={handleChange}
          placeholder="e.g. 5"
        />

        <label>Total Price</label>
        <input readOnly value={`₹${form.price}`} />

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-secondary" onClick={copyMsg} type="button">
            Copy Message
          </button>

          <button
            className="btn btn-whatsapp"
            onClick={sendWhatsApp}
            type="button"
          >
            Send WhatsApp
          </button>

          <div style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={saveOrder} type="button">
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}
