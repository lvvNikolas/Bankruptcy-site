"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Doc = { id: string; name: string; url: string };

export function UploadForm({ caseId, documents }: { caseId: string; documents: Doc[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("caseId", caseId);
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/documents", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Ошибка загрузки");
      }
      setStatus("done");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Ошибка загрузки");
    }
  }

  return (
    <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
      <p className="section-label">Документы</p>

      {/* Existing documents */}
      {documents.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".375rem", marginBottom: "1rem" }}>
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".625rem",
                padding: ".5rem .75rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: ".875rem",
                color: "var(--text-2)",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: ".875rem" }}>↗</span>
              {doc.name}
            </a>
          ))}
        </div>
      )}

      {/* Upload form */}
      <div style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
        <input
          ref={fileRef}
          type="file"
          className="input"
          style={{ flex: 1, minWidth: 0 }}
          onChange={() => setStatus("idle")}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleUpload}
          disabled={status === "uploading"}
          style={{ whiteSpace: "nowrap" }}
        >
          {status === "uploading" ? "Загрузка…" : "Загрузить"}
        </button>
      </div>

      {status === "done" && (
        <p style={{ marginTop: ".5rem", fontSize: ".8125rem", color: "var(--success)" }}>
          Загружено
        </p>
      )}
      {status === "error" && (
        <p style={{ marginTop: ".5rem", fontSize: ".8125rem", color: "var(--danger)" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
