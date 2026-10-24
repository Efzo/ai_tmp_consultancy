import { AdminModule } from "@/components/admin/AdminModule";
import Link from "next/link";

export default function BookingsAdminPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const configured = Boolean(bookingUrl);

  return <AdminModule title="Bookings" description="Review the consultation scheduling configuration." status={configured ? "Configured" : "Needs provider URL"}>
    <div className="glass-panel p-8">
      <h2 className="text-xl font-bold">{configured ? "Booking provider connected" : "Connect Calendly or Cal.com"}</h2>
      <p className="mt-3 text-slate-muted">
        {configured ? <>The public booking page is using <code className="text-electric">{bookingUrl}</code>. Provider confirmations, reminders, timezones, rescheduling, and cancellation policies remain managed by the selected provider.</> : <>Set <code className="text-electric">NEXT_PUBLIC_BOOKING_URL</code> to activate the public booking page. Provider confirmations, reminders, timezones, rescheduling, and cancellation policies remain managed by the selected provider.</>}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {configured && <a href={bookingUrl} target="_blank" rel="noreferrer" className="btn-primary">Open provider link</a>}
        <Link href="/book" className="btn-secondary">Preview public booking page</Link>
      </div>
    </div>
  </AdminModule>;
}
