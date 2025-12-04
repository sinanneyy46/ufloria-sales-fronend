import React, { useEffect } from "react";
import "../styles/Toast.scss";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  );
}
