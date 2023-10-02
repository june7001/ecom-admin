"use client";
import { useRouter } from "next/navigation";
// import { UserButton } from "@clerk/nextjs";

export default function Home() {
  // Redirect to the dashboard
  useRouter().replace("/overview");
  return (
    <div>
      {/* <UserButton afterSignOutUrl="/" /> */}
    </div>
  );
}
