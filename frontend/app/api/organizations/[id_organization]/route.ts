import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getServerSession } from "next-auth";
import IOrganizationItem from "@/shared/models/organization/IOrganizationItem";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id_organization: string }> },
) {
  const prms = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Não autorizado. Token inválido ou expirado." },
      { status: 401 },
    );
  }

  const { data, error: dbError } = await supabaseServer
    .from("organizations")
    .select()
    .eq("user_id", session.user.id)
    .eq("id", prms.id_organization)
    .single();

  if (dbError) {
    console.error("Erro no Banco:", dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
