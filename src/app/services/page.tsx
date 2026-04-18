import { createServerSupabase } from "@/lib/supabase-server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ServicesList } from "@/components/landing/services-list";
import type { Service, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const supabase = await createServerSupabase();
  
  const [servicesRes, categoriesRes] = await Promise.all([
    supabase.from("services").select("*, category:categories(*)").eq("is_visible", true).order("display_order"),
    supabase.from("categories").select("*").eq("is_visible", true).order("display_order"),
  ]);

  return {
    services: (servicesRes.data as Service[]) || [],
    categories: (categoriesRes.data as Category[]) || [],
  };
}

export default async function ServicesPage() {
  const { services, categories } = await getData();

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 pt-24 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Our <span className="text-[var(--accent)]">Services</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Choose from hundreds of social media marketing services
            </p>
          </div>

          <ServicesList services={services} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
