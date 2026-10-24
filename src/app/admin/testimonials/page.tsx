import { AdminModule, SetupCard } from "@/components/admin/AdminModule";

export default function TestimonialsAdminPage() { return <AdminModule title="Testimonials" description="Manage approved client feedback and attribution." status="No records"><SetupCard title="No testimonials published" body="Only add verifiable testimonials with client approval, attribution, and permission to publish." action="Add after approval" /></AdminModule>; }
