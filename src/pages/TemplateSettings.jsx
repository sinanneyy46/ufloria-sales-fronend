import React, { useEffect, useState } from "react";
import { getTemplate, updateTemplate } from "../api/template";
import "../styles/Template.scss";

export default function TemplateSettings() {
  const [text, setText] = useState("");

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const res = await getTemplate();
      setText(res.data.template_text);
    } catch {
      alert("Template not found. Make sure record ID=1 exists.");
    }
  };

  const save = async () => {
    await updateTemplate({ template_text: text });
    alert("Template updated");
  };

  return (
    <div className="template-page">
      <h2>WhatsApp Message Template</h2>

      <p>
        Use placeholders: <b>{"{student} {perfume} {qty} {price}"}</b>
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <button onClick={save}>Save Template</button>
    </div>
  );
}
