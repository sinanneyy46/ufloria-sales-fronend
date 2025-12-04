import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import client from "../api/client";
import { getPerfumes } from "../api/perfumes";
import { createOrder } from "../api/orders";
import "../styles/OrderForm.scss";

export default function OrderForm() {
  const [perfumes, setPerfumes] = useState([]);
  const [fatherNumber, setFatherNumber] = useState("");
  const [template, setTemplate] = useState("");

  const [form, setForm] = useState({
    student_name: "",
    perfume: "",
    qty_ml: "",
    price: 0,
  });

  const [preview, setPreview] = useState("");
  const { showToast } = useOutletContext();

  useEffect(() => {
    loadPerfumes();
    loadSupplier();
    console.log("Loaded father number:", fatherNumber);
    loadTemplate();
  }, []);

  // Load perfumes
  const loadPerfumes = async () => {
    const res = await getPerfumes();
    setPerfumes(res.data);
  };

  // Load father number (first supplier)
  const loadSupplier = async () => {
    try {
      const res = await client.get("suppliers/");
      const suppliers = res.data;

      if (!suppliers.length) {
        setFatherNumber("");
        return;
      }

      // pick first supplier that HAS a phone number
      const valid = suppliers.find(
        (s) => s.phone && s.phone.trim().length >= 7
      );

      setFatherNumber(valid ? valid.phone.trim() : "");
    } catch (e) {
      console.error("Supplier load error", e);
      setFatherNumber("");
    }
  };

  // Load WhatsApp template
  const loadTemplate = async () => {
    try {
      const res = await client.get("template/1/");
      setTemplate(res.data.template_text);
    } catch {
      setTemplate("");
      console.warn("Template missing. Check admin.");
    }
  };

  // Handle input updates + price calc + live preview
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (
      (name === "perfume" || name === "qty_ml") &&
      updated.perfume &&
      updated.qty_ml
    ) {
      const perfume = perfumes.find((p) => p.id == updated.perfume);
      if (perfume) {
        updated.price = (updated.qty_ml * perfume.price_per_ml).toFixed(2);
      }
    }

    setForm(updated);
    generatePreview(updated);
  };

  // Builds live WhatsApp preview text
  const generatePreview = (data) => {
    if (!template) return setPreview("");

    const perfumeObj = perfumes.find((p) => p.id == data.perfume);

    const filled = template
      .replace("{student}", data.student_name || "")
      .replace("{perfume}", perfumeObj?.name || "")
      .replace("{qty}", data.qty_ml || "")
      .replace("{price}", data.price || "");

    setPreview(filled);
  };

  // Save order to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_name || !form.perfume || !form.qty_ml) {
      showToast("Please fill all fields");
      return;
    }

    await createOrder(form);
    showToast("Order saved!");

    setForm({
      student_name: "",
      perfume: "",
      qty_ml: "",
      price: 0,
    });
    setPreview("");
  };

  // Send WhatsApp message
  const sendWhatsApp = () => {
    if (!fatherNumber) {
      showToast("Father phone number missing");
      return;
    }

    const phone = fatherNumber.replace(/\D/g, "");

    const perfumeObj = perfumes.find((p) => p.id == form.perfume);

    const msg = template
      .replace("{student}", form.student_name)
      .replace("{perfume}", perfumeObj?.name)
      .replace("{qty}", form.qty_ml)
      .replace("{price}", form.price);

    const encoded = encodeURIComponent(msg);

    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  // Copy preview to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(preview);
    showToast("Copied to clipboard!");
  };

  return (
    <div className="order-page">
      <h2 className="page-title">New Order</h2>

      <form className="order-form" onSubmit={handleSubmit}>
        <input
          name="student_name"
          placeholder="Student name"
          value={form.student_name}
          onChange={handleChange}
          required
        />

        <select
          name="perfume"
          value={form.perfume}
          onChange={handleChange}
          required
        >
          <option value="">Select perfume</option>
          {perfumes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ₹{p.price_per_ml}/ml
            </option>
          ))}
        </select>

        <input
          type="number"
          name="qty_ml"
          placeholder="Quantity in ml"
          value={form.qty_ml}
          onChange={handleChange}
          required
        />

        <input readOnly value={`₹${form.price}`} />

        <button type="submit" className="btn btn-primary">
          Save Order
        </button>

        <button
          type="button"
          className="btn btn-whatsapp whatsapp-btn"
          disabled={!preview.trim()}
          onClick={sendWhatsApp}
        >
          Send to Father (WhatsApp)
        </button>
      </form>

      {/* Live WhatsApp Preview Box */}
      {preview && (
        <div className="preview-box">
          <div className="preview-header">WhatsApp Preview</div>
          <pre className="preview-text">{preview}</pre>

          <button
            className="btn btn-secondary copy-btn"
            onClick={copyToClipboard}
          >
            Copy Message
          </button>
        </div>
      )}
    </div>
  );
}
