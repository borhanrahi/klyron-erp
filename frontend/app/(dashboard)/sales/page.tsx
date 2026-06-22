"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SalesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/sales/orders");
  }, [router]);
  return null;
}
