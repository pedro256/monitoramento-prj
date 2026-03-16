import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import IDeviceItem from "@/shared/models/devices/IDeviceItem";

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
    .from("devices")
    .select()
    .eq("organization_id",prms.id_organization);

  if (dbError) {
    console.error("Erro no Banco:", dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }


    const responseDto: IDeviceItem[] = [];
  
    data.forEach((item) => {
      responseDto.push({
        name: item.name,
        id: item.id,
        status: item._status,
        apiToken: item.api_token,
        createdAt: item.created_at,
        lastHeartbeat: item.last_heartbeat,
        location: item.location,
        model: item.model,
        organizationId: item.organization_id
      });
    });


  return NextResponse.json(responseDto);
}
