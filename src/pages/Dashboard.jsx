import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getOrders, deleteOrder, updateOrder } from "../api/orders";
import { getPerfumes } from "../api/perfumes";
import NewOrderModal from "../components/NewOrderModal";
import OrderRow from "../components/OrderRow";
import client from "../api/client";
import "../styles/Dashboard.scss";
import "../styles/Table.scss";
import EditOrderModal from "../components/EditOrderModal";
import Pattern from "../assets/images/pattern.png";
import Filter from "../assets/images/filter.svg";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [perfumes, setPerfumes] = useState([]);
  const [fatherNumber, setFatherNumber] = useState("");
  const [template, setTemplate] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  const [filter, setFilter] = useState({
    perfume: "",
    student: "",
    date: "",
  });

  // new: mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const toggleMobileFilters = () => setShowMobileFilters((v) => !v);

  const { showToast } = useOutletContext();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const o = await getOrders();
    setOrders(o.data);

    const p = await getPerfumes();
    setPerfumes(p.data);

    const s = await client.get("suppliers/");
    console.log("SUPPLIER API RESPONSE:", s.data);
    console.log("FATHER PHONE RAW:", s.data[0]?.phone);
    console.log("TOKEN:", localStorage.getItem("token"));
    if (s.data.length > 0) {
      const phone = (s.data[0].phone || "").replace(/\D/g, "");
      setFatherNumber(phone);
    }

    const t = await client.get("template/1/");
    setTemplate(t.data.template_text);
  };

  // Edit handling
  const startEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };
  // Save edit
  const saveEdit = async (data) => {
    await updateOrder(data.id, data);
    setShowModal(false);
    loadData(); // reload table
    showToast("Order updated.");
  };
  // Delete handling
  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    await deleteOrder(id);
    loadData();
    showToast("Order deleted.");
  };

  // WhatsApp
  const sendWhatsApp = (order) => {
    if (!fatherNumber) {
      showToast("Father phone number missing", "error");
      return;
    }

    // Clean number
    const phone = fatherNumber.replace(/\D/g, "");

    console.log("TEMPLATE:", template);
    console.log("STUDENT:", order.student_name);
    console.log("PERFUME:", order.perfume_name);
    console.log("QTY:", order.qty_ml);
    console.log("PRICE:", order.price);

    // Build message
    const msg = template
      .replace("{student}", order.student_name)
      .replace("{perfume}", order.perfume_name)
      .replace("{qty}", order.qty_ml)
      .replace("{price}", order.price);

    // Encode message
    const encoded = encodeURIComponent(msg);

    // Correct WhatsApp link
    const url = `https://wa.me/${phone}?text=${encoded}`;

    window.open(url, "_blank");
    showToast("WhatsApp message sent.");
  };

  /* FILTERING */
  const filtered = orders.filter((o) => {
    const byPerfume = filter.perfume
      ? o.perfume_name.toLowerCase().includes(filter.perfume.toLowerCase())
      : true;
    const byStudent = filter.student
      ? o.student_name.toLowerCase().includes(filter.student.toLowerCase())
      : true;
    const byDate = filter.date ? o.date === filter.date : true;
    return byPerfume && byStudent && byDate;
  });

  return (
    <div className="dashboard container">
      <img src={Pattern} className="pattern pat-a" />
      <img src={Pattern} className="pattern pat-b" />
      <img src={Pattern} className="pattern pat-cent" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <h2 className="page-title">Orders</h2>
        <div className="dash-actions">
          <img
            src={Filter}
            alt="Filter"
            className="filter"
            onClick={toggleMobileFilters} // <-- wired toggle
            aria-expanded={showMobileFilters}
            role="button"
          />
          <button
            className="btn btn-primary"
            onClick={() => setShowNewModal(true)}
          >
            <span className="plus">+</span> New Order
          </button>
        </div>
      </div>
      {/* Filters */}

      <div className="filters">
        <input
          placeholder="Filter by perfume"
          value={filter.perfume}
          onChange={(e) => setFilter({ ...filter, perfume: e.target.value })}
        />
        <input
          placeholder="Filter by student"
          value={filter.student}
          onChange={(e) => setFilter({ ...filter, student: e.target.value })}
        />
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      {/* mobile filters — add active class when toggled */}
      <div className={`mobile-filters ${showMobileFilters ? "active" : ""}`}>
        <input
          placeholder="Filter by perfume"
          value={filter.perfume}
          onChange={(e) => setFilter({ ...filter, perfume: e.target.value })}
        />
        <input
          placeholder="Filter by student"
          value={filter.student}
          onChange={(e) => setFilter({ ...filter, student: e.target.value })}
        />
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>
      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Perfume</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" className="empty">
                No orders
              </td>
            </tr>
          )}

          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              perfumes={perfumes}
              onEdit={startEdit}
              onDelete={handleDelete}
              onWhatsApp={sendWhatsApp}
            />
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {showModal && (
        <EditOrderModal
          order={editingOrder}
          perfumes={perfumes}
          onClose={() => setShowModal(false)}
          onSave={saveEdit}
        />
      )}
      {showNewModal && (
        <NewOrderModal
          perfumes={perfumes}
          fatherNumber={fatherNumber}
          template={template}
          onClose={() => setShowNewModal(false)}
          onSaved={() => {
            setShowNewModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
