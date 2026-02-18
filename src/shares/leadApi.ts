export async function sendLead(payload: {
  name: string;
  phone: string;
  debt?: string;
  agree: boolean;
  context?: string;
  formId?: string;
  website?: string; // honeypot
}) {
  const res = await fetch("/api/lead.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Ошибка отправки");
  return data;
}