import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { BottomTabBar, FloatingNav } from "@/components/shared/floating-nav";
import { Footer } from "@/components/shared/public-home-client";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { data: profile } = await (await createClient())
    .from("profil_kelurahan")
    .select("alamat, telepon")
    .maybeSingle();

  return (
    <AuroraBackground>
      <FloatingNav />
      {children}
      <Footer profile={profile} />
      <BottomTabBar />
    </AuroraBackground>
  );
}
