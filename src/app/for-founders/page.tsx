import AudiencePage from "@/components/AudiencePage";
import { managedPageMetadata } from "@/lib/managed-pages";
export const dynamic = "force-dynamic";
export default function FoundersPage() { return <AudiencePage slug="for-founders" />; }
export async function generateMetadata() { return managedPageMetadata("for-founders"); }
