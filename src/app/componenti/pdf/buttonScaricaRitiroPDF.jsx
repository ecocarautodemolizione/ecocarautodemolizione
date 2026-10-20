"use client";

import { FaFileDownload } from "react-icons/fa";

export default function ButtonScaricaRitiroPDF({ payload }) {
  
  const handleDownload = async () => {
    const res = await fetch("/api/ritiroVeicolo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? "Errore nel download del PDF");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const fileName = `${payload?.targa}-${payload?.uuidRitiroVeicolo}.pdf`;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="p-2 bg-brand/70 rounded-md hover:bg-brand">
      <FaFileDownload/>
    </button>
  );
}
