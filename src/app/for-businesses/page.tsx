import AudiencePage from "@/components/AudiencePage";
import { managedPageMetadata } from "@/lib/managed-pages";
export const dynamic = "force-dynamic";
export default function BusinessOwnersPage() { return <AudiencePage slug="for-businesses" />; }
export async function generateMetadata() { return managedPageMetadata("for-businesses"); }
