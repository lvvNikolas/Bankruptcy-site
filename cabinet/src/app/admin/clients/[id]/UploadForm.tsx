"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Doc = { id: string; name: string; url: string };

export function UploadForm({ caseId, documents }: { caseId: string; documents: Doc[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

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

  async function handleDelete(docId: string) {
    if (!confirm("Удалить документ?")) return;
    setDeleting(docId);
    try {
      const res = await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Ошибка удаления");
      }
      router.refresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Ошибка удаления");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
      <p className="section-label">Документы</p>

      {/* Existing documents */}
      {documents.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".375rem", marginBottom: "1rem" }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                padding: ".5rem .75rem",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontSize: ".875rem",
                  color: "var(--text-2)",
                  minWidth: 0,
                }}
              >
                <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>↗</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {doc.name}
                </span>
              </a>
              <button
                onClick={() => handleDelete(doc.id)}
                disabled={deleting === doc.id}
                aria-label="Удалить документ"
                style={{
                  flexShrink: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-light)",
                  fontSize: ".875rem",
                  padding: ".25rem",
                  borderRadius: "var(--radius-sm)",
                  lineHeight: 1,
                  transition: "color .15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--danger)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-light)")}
              >
                {deleting === doc.id ? "…" : "✕"}
              </button>
            </div>
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
        <p style={{ marginTop: ".5rem", fontSize: ".8125rem", color: "var(--success)" }}>Загружено</p>
      )}
      {status === "error" && (
        <p style={{ marginTop: ".5rem", fontSize: ".8125rem", color: "var(--danger)" }}>{errorMsg}</p>
      )}
    </div>
  );
}
