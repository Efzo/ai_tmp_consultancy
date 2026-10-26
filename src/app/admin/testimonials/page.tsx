import { AdminModule } from "@/components/admin/AdminModule";
import TestimonialEditor from "@/components/admin/TestimonialEditor";
import { getTestimonials } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await getTestimonials();
  return <AdminModule title="Client Testimonials" description="Manage approved client feedback and decide which quotes appear on the homepage." status={`${testimonials.filter((item) => item.isPublished).length} published`}><TestimonialEditor testimonials={testimonials} /></AdminModule>;
}
