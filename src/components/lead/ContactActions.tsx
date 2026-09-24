"use client";

import { useState } from "react";

export function ContactActions({ variant }: { variant: "lead" | "footer" }) {
  const [selected, setSelected] = useState<"Telegram" | "MAX" | null>(null);

  return (
    <div className={variant === "lead" ? "contact-links" : "footer-contacts"}>
      <div className="contact-buttons" role="group" aria-label="Способы связи в демо-версии">
        {(["Telegram", "MAX"] as const).map((channel) => (
          <button key={channel} type="button" onClick={() => setSelected(channel)}>
            {channel}
          </button>
        ))}
      </div>
      {selected && (
        <p className="contact-demo-note" role="status">
          Демо: связь через {selected} отключена. Данные не отправляются.
        </p>
      )}
    </div>
  );
}
