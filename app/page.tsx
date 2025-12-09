import { auth } from "@/auth";
import { LandingPageContent } from "@/components/landing-page-content";

export default async function LandingPage() {
  const session = await auth();
  return <LandingPageContent user={session?.user} />;
}
