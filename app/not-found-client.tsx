"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFoundClient() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you&#39;re looking for doesn&#39;t exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}