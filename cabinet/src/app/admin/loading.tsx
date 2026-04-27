export default function AdminLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div className="skel" style={{ width: 120, height: 13, borderRadius: 4 }} />
        <div className="skel" style={{ width: 80, height: 13, borderRadius: 4 }} />
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{ padding: "1.25rem 1.5rem" }}>
              <div className="skel" style={{ width: 70, height: 9, borderRadius: 4, marginBottom: ".625rem" }} />
              <div className="skel" style={{ width: 100, height: 28, borderRadius: 6 }} />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div className="skel" style={{ width: 90, height: 12, borderRadius: 4, marginBottom: "1rem" }} />
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: ".75rem 0", borderBottom: "1px solid var(--border)" }}>
              <div className="skel" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skel" style={{ width: "40%", height: 12, borderRadius: 4, marginBottom: ".375rem" }} />
                <div className="skel" style={{ width: "60%", height: 10, borderRadius: 4 }} />
              </div>
              <div className="skel" style={{ width: 80, height: 22, borderRadius: 99 }} />
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .skel {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
