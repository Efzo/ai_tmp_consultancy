import { AdminModule, SetupCard } from "@/components/admin/AdminModule";

export default function AuditLogsAdminPage() { return <AdminModule title="Audit logs" description="Track publishing, lead, user, and security actions." status="Database model required"><SetupCard title="Audit history is not connected" body="Add an AuditEvent model and persist actor, action, target, timestamp, and request metadata before production launch." action="Review data model" /></AdminModule>; }
