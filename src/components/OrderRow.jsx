import React, { useState, useRef, useEffect } from "react";

import Delete from "../assets/images/delete.svg";
import Edit from "../assets/images/edit.svg";
import Whatsapp from "../assets/images/whatsapp.svg";

export default function OrderRow({
  order,
  perfumes,
  onEdit,
  onDelete,
  onWhatsApp,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  /* Close menu when clicking outside */
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <tr>
      <td data-label="Date">{order.date}</td>
      <td data-label="Student">{order.student_name}</td>
      <td data-label="Perfume">{order.perfume_name}</td>
      <td data-label="Qty">{order.qty_ml} ml</td>
      <td data-label="Price">₹{order.price}</td>
      <td data-label="Status">
        <span className={`status ${order.status}`}>{order.status}</span>
      </td>

      {/* 3 DOTS MENU */}
      <td className="menu-cell" ref={ref}>
        <a className="dots-btn" onClick={() => setOpen(!open)}>
          ⋮
        </a>

        {open && (
          <div className="menu-box">
            <img
              src={Edit}
              alt="Edit"
              onClick={() => {
                setOpen(false);
                onEdit(order);
              }}
            />

            <img
              src={Delete}
              alt="Delete"
              onClick={() => {
                setOpen(false);
                onDelete(order.id);
              }}
            />

            <img
              src={Whatsapp}
              alt="WhatsApp"
              onClick={() => {
                setOpen(false);
                onWhatsApp(order);
              }}
            />
          </div>
        )}
      </td>
    </tr>
  );
}
