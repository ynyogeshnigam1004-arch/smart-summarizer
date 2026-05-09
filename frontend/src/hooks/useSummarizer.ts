import { useRef, useState } from "react";
import type { StructuredNotes, SummarizerState } from "../types";
import { API_URL } from "../config";

export function useSummarizer() {
  const [state, setState] = useState<SummarizerState>({ status: "idle" });
  const lastFormData = useRef<FormData | null>(null);

  async function submit(formData: FormData) {
    lastFormData.current = formData;
    setState({ status: "submitting" });

    try {
      const res = await fetch(`${API_URL}/summarize`, { method: "POST", body: formData });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: "An error occurred." }));
        setState({ status: "error", message: body.detail ?? "An error occurred.", isNetwork: false });
        return;
      }

      const notes: StructuredNotes = await res.json();
      setState({ status: "success", notes });
    } catch {
      setState({ status: "error", message: "Connection problem. Please check your network and try again.", isNetwork: true });
    }
  }

  function retry() {
    if (lastFormData.current) submit(lastFormData.current);
  }

  return { state, submit, retry };
}
