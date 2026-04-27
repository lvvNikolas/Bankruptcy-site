"use client";
import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

type State = "unsupported" | "loading" | "denied" | "subscribed" | "unsubscribed";

function urlBase64ToUint8Array(base64: string) {
  const pad  = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64  = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw  = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function NotificationButton() {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    // Проверяем есть ли уже подписка
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription()
    ).then((sub) => {
      setState(sub ? "subscribed" : "unsubscribed");
    }).catch(() => setState("unsubscribed"));
  }, []);

  async function subscribe() {
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          endpoint: json.endpoint,
          keys:     { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
        }),
      });

      setState("subscribed");
    } catch {
      setState("unsubscribed");
    }
  }

  async function unsubscribe() {
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method:  "DELETE",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("unsubscribed");
    } catch {
      setState("unsubscribed");
    }
  }

  if (state === "unsupported") return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 1.5rem",
      background: state === "subscribed" ? "rgba(22,163,74,.06)" : "var(--bg)",
      border: `1px solid ${state === "subscribed" ? "rgba(22,163,74,.2)" : "var(--border)"}`,
      borderRadius: "var(--radius)",
      gap: "1rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
          background: state === "subscribed" ? "rgba(22,163,74,.1)" : "var(--surface)",
          border: `1px solid ${state === "subscribed" ? "rgba(22,163,74,.2)" : "var(--border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem",
        }}>
          {state === "subscribed" ? "🔔" : "🔕"}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: ".875rem", color: "var(--text)" }}>
            {state === "subscribed" ? "Уведомления включены" : "Уведомления от юриста"}
          </div>
          <div style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: ".125rem" }}>
            {state === "subscribed"
              ? "Вы получите уведомление при новом обновлении"
              : state === "denied"
              ? "Заблокировано в настройках браузера"
              : "Получайте уведомления когда юрист добавит обновление"}
          </div>
        </div>
      </div>

      {state !== "denied" && (
        <button
          className="btn btn-ghost"
          onClick={state === "subscribed" ? unsubscribe : subscribe}
          disabled={state === "loading"}
          style={{ fontSize: ".8125rem", flexShrink: 0 }}
        >
          {state === "loading"  ? "…"          :
           state === "subscribed" ? "Отключить" : "Включить"}
        </button>
      )}
    </div>
  );
}
