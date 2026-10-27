import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; setup?: string }> }) {
  const params = await searchParams;
  return <ResetPasswordForm token={params.token ?? ""} setup={params.setup === "1"} />;
}
