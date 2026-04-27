// Service Worker для Web Push уведомлений

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Обновление по делу", {
      body:  data.body  ?? "Юрист добавил новое обновление",
      icon:  "/icon-192.png",
      badge: "/icon-192.png",
      data:  { url: data.url ?? "/dashboard" },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes("/dashboard") && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data?.url ?? "/dashboard");
    })
  );
});
