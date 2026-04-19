"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function AdminRootPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/auth?redirect=/kaggu");
          return;
        }
        
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (profile?.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        
        router.push("/kaggu/dashboard");
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth?redirect=/kaggu");
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router, supabase]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }
  
  return null;
}