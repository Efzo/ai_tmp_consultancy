"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/actions/cms";

type User = { id: string; name: string | null; email: string; role: "OWNER" | "EDITOR" | "VIEWER" };

export default function RoleManager({ users }: { users: User[] }) {
  const [rows, setRows] = useState(users);
  const [message, setMessage] = useState("");
  const changeRole = async (userId: string, role: User["role"]) => { const result = await updateUserRole(userId, role); setMessage(result.message); if (result.success) setRows((current) => current.map((user) => user.id === userId ? { ...user, role } : user)); };
  return <div className="glass-panel overflow-x-auto"><p className="border-b border-glass p-5 text-sm text-slate-muted">Role changes are authorized server-side and recorded as audit events.</p><table className="w-full min-w-[620px] text-left"><thead className="border-b border-glass bg-white/5 text-xs uppercase tracking-widest text-slate-muted"><tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Action</th></tr></thead><tbody className="divide-y divide-glass">{rows.map((user) => <tr key={user.id}><td className="px-6 py-4"><p>{user.name ?? "Unnamed user"}</p><p className="text-xs text-slate-muted">{user.email}</p></td><td className="px-6 py-4 text-electric">{user.role}</td><td className="px-6 py-4"><select value={user.role} onChange={(event) => changeRole(user.id, event.target.value as User["role"])} className="rounded-lg border border-glass bg-midnight px-3 py-2 text-sm text-white"><option value="OWNER">Owner</option><option value="EDITOR">Editor</option><option value="VIEWER">Viewer</option></select></td></tr>)}</tbody></table>{message && <p className="p-5 text-sm text-cyan-ai">{message}</p>}</div>;
}
