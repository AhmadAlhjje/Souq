"use client";

import { useEffect } from "react";

// دالة لتوليد session_id بديلة عن crypto.randomUUID()
function generateSessionId() {
  return "session-" + Math.random().toString(36).substring(2, 15);
}

const SessionManager = () => {
  useEffect(() => {
    console.log("SessionManager mounted ✅");

    const sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      const newSessionId = generateSessionId(); // توليد ID
      localStorage.setItem("session_id", newSessionId);

      // تأكيد أن التخزين صار
      console.log("New session_id created and stored:", newSessionId);
      console.log("Check localStorage directly:", localStorage.getItem("session_id"));
    } else {
      console.log("Existing session_id:", sessionId);
    }
  }, []);

  return null;
};

export default SessionManager;
