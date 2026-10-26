"use client";
import { useState } from "react";
import { updateContactDetails } from "@/app/actions/cms";
import type { ContactDetails } from "@/lib/site-settings";
export default function ContactDetailsEditor({ details }: { details: ContactDetails }) {
  const [value, setValue] = useState(details);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return <section className="glass-panel p-6 space-y-4"><h2 className="text-xl font-bold">Public contact information</h2><label className="block">Business contact email<input type="email" value={value.email} onChange={(event) => setValue({ ...value, email: event.target.value })} className="block w-full mt-2 p-3 bg-midnight border border-glass rounded" /></label><label className="block">Availability or contact note<textarea value={value.availability} onChange={(event) => setValue({ ...value, availability: event.target.value })} className="block w-full mt-2 p-3 bg-midnight border border-glass rounded" /></label><button className="btn-secondary" disabled={busy} onClick={async () => { setBusy(true); try { setMessage((await updateContactDetails(value)).message); } catch { setMessage("Contact information could not be saved."); } finally { setBusy(false); } }}>Save contact information</button><p role="status">{message}</p></section>;
}
