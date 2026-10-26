import ManagedLegalPage from "@/components/ManagedLegalPage";
import { managedPageMetadata } from "@/lib/managed-pages";
export default function Page() { return <ManagedLegalPage slug="terms" />; }
export async function generateMetadata() { return managedPageMetadata("terms"); }
