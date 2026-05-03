"use client";

import { useEffect, useState } from "react";

function Popup({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;

    const timeout = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="site-popup" role="status" aria-live="polite">
      <button className="site-popup-close" type="button" onClick={onClose} aria-label="Close">
        x
      </button>
      {message}
    </div>
  );
}

export function FakeAccountLinks({ showCreate = true }) {
  const [message, setMessage] = useState("");

  function showAccountMessage(type) {
    setMessage(
      type === "create"
        ? "ERROR: new registrations are currently disabled by admin."
        : "ERROR: login server timed out. Try again in 2007."
    );
  }

  return (
    <>
      {showCreate && (
        <>
          <button className="text-action" type="button" onClick={() => showAccountMessage("create")}>
            Create Account
          </button>
          &nbsp;|&nbsp;
        </>
      )}
      <button className="text-action" type="button" onClick={() => showAccountMessage("login")}>
        Log in
      </button>
      <Popup message={message} onClose={() => setMessage("")} />
    </>
  );
}

export function ReportButton() {
  const [message, setMessage] = useState("");

  return (
    <>
      <button
        className="era-button"
        type="button"
        onClick={() => setMessage("Report submitted. buzzkill...")}
      >
        Report
      </button>
      <Popup message={message} onClose={() => setMessage("")} />
    </>
  );
}
