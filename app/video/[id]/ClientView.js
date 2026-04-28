// app/video/[id]/ClientView.js
"use client";

import { useEffect } from "react";

export default function ClientView({ videoId }) {
  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ videoId })
    });
  }, [videoId]);

  return null;
}