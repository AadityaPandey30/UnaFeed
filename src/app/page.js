import { redirect } from "next/navigation";

export default function LandingPage() {
  // Redirects immediately to /home
  redirect("/home");
}
