export default function DashboardLoading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Header skeleton */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1rem",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
          <div className="skel" style={{ width: 30, height: 30, borderRadius: "50%" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <div className="skel" style={{ width: 140, height: 13, borderRadius: 4 }} />
            <div className="skel" style={{ width: 80, height: 10, borderRadius: 4 }} />
          </div>
        </div>
        <div className="skel" style={{ width: 52, height: 30, borderRadius: "var(--radius-sm)" }} />
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Hero card skeleton */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1a2e4a 55%, #1e3a8a 100%)",
          borderRadius: "var(--radius)",
          padding: "1.75rem 2rem",
          marginBottom: "1rem",
        }}>
          <div className="skel-dark" style={{ width: 90, height: 12, borderRadius: 4, marginBottom: ".4rem" }} />
          <div className="skel-dark" style={{ width: 160, height: 28, borderRadius: 6, marginBottom: "1.5rem" }} />
          <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
            <div>
              <div className="skel-dark" style={{ width: 80, height: 10, borderRadius: 4, marginBottom: ".4rem" }} />
              <div className="skel-dark" style={{ width: 160, height: 32, borderRadius: 6 }} />
            </div>
            <div>
              <div className="skel-dark" style={{ width: 50, height: 10, borderRadius: 4, marginBottom: ".4rem" }} />
              <div className="skel-dark" style={{ width: 110, height: 26, borderRadius: 99 }} />
            </div>
          </div>
          <div className="skel-dark" style={{ width: "100%", height: 5, borderRadius: 99 }} />
        </div>

        {/* Info card skeleton */}
        <div className="card" style={{ padding: "1.125rem 1.5rem", marginBottom: "1rem" }}>
          <div className="skel" style={{ width: 80, height: 10, borderRadius: 4, marginBottom: "1rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem .75rem" }}>
            {[140, 180, 120, 150].map((w, i) => (
              <div key={i}>
                <div className="skel" style={{ width: 50, height: 9, borderRadius: 4, marginBottom: ".3rem" }} />
                <div className="skel" style={{ width: w, height: 13, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Progress card skeleton */}
        <div className="card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
          <div className="skel" style={{ width: 90, height: 10, borderRadius: 4, marginBottom: "1.25rem" }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".375rem", flex: 1 }}>
                <div className="skel" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                <div className="skel" style={{ width: "60%", height: 9, borderRadius: 4 }} />
              </div>
            ))}
          </div>
        </div>

      </main>

      <style>{`
        .skel {
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skel-dark {
          background: linear-gradient(90deg, rgba(255,255,255,.06) 25%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.06) 75%);
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
