"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { toggleRevisada } from "@/lib/admin-data";

export async function toggleRevisadaAction(id: string, revisado: boolean) {
  await requireAdmin();
  await toggleRevisada(id, revisado);
  revalidatePath("/admin/sugerencias");
}
