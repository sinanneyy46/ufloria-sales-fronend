import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getPerfumes,
  createPerfume,
  updatePerfume,
  deletePerfume,
} from "../api/perfumes";
import "../styles/PerfumeList.scss";
import "../styles/Table.scss";
import Delete from "../assets/images/delete.svg";
import Edit from "../assets/images/edit.svg";
import Pattern from "../assets/images/pattern.png";

export default function PerfumeList() {
  const [perfumes, setPerfumes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price_per_ml: "",
    sample_available: true,
  });
  const [editId, setEditId] = useState(null);
  const { showToast } = useOutletContext();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getPerfumes(); // uses client
        if (!mounted) return;
        setPerfumes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("PerfumeList load failed:", err);
        setPerfumes([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const load = async () => {
    const res = await getPerfumes();
    setPerfumes(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (editId) await updatePerfume(editId, form);
    else await createPerfume(form);

    setForm({
      name: "",
      category: "",
      price_per_ml: "",
      sample_available: true,
    });
    setEditId(null);
    load();
    showToast(editId ? "Perfume updated." : "Perfume added.");
  };

  const edit = (p) => {
    setEditId(p.id);
    setForm(p);
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    await deletePerfume(id);
    load();
    showToast("Perfume deleted.");
  };

  return (
    <div className="perfume-page container">
      <img src={Pattern} className="pattern pat-a" />
      <img src={Pattern} className="pattern pat-b" />
      <img src={Pattern} className="pattern pat-cent" />
      <h2 className="page-title">Perfume List</h2>

      <form className="perfume-form" onSubmit={submit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="number"
          name="price_per_ml"
          placeholder="Price per ml"
          value={form.price_per_ml}
          onChange={(e) => setForm({ ...form, price_per_ml: e.target.value })}
          required
        />

        <label className="check">
          <input
            type="checkbox"
            checked={form.sample_available}
            onChange={(e) =>
              setForm({ ...form, sample_available: e.target.checked })
            }
          />
          Sample Available
        </label>

        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Add"}{" "}
        </button>
      </form>

      <table className="table perfume-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price/ml</th>
            <th>Sample</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {perfumes.map((p) => (
            <tr key={p.id}>
              <td data-label="Name">{p.name}</td>
              <td data-label="Category">{p.category}</td>
              <td data-label="Price/ml">₹{p.price_per_ml}</td>
              <td data-label="Sample">{p.sample_available ? "Yes" : "No"}</td>
              <td className="actions" data-label="">
                <img src={Edit} alt="Edit" onClick={() => edit(p)} />
                <img
                  src={Delete}
                  alt="Delete"
                  onClick={() => handleDelete(p.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
