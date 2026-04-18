import { createServerSupabase } from "@/lib/supabase-server";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { ServicesPreview } from "@/components/landing/services-preview";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { Footer } from "@/components/layout/footer";
import type { Service, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = await createServerSupabase();
  
  const [servicesRes, categoriesRes] = await Promise.all([
    supabase.from("services").select("*, category:categories(*)").eq("is_visible", true).eq("is_featured", true).limit(8),
    supabase.from("categories").select("*").eq("is_visible", true).order("display_order"),
  ]);

  return {
    featuredServices: (servicesRes.data as Service[]) || [],
    categories: (categoriesRes.data as Category[]) || [],
  };
}

export default async function HomePage() {
  const { featuredServices, categories } = await getData();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <ServicesPreview services={featuredServices} categories={categories} />
      <Features />
      <Footer />
    </main>
  );
}
