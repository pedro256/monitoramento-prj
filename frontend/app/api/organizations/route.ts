import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import IOrganizationItem from "@/shared/models/organization/IOrganizationItem";

export async function GET(req: Request) {
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
    .eq("user_id", session.user.id);

  if (dbError) {
    console.error("Erro no Banco:", dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const responseDto: IOrganizationItem[] = [];

  data.forEach((item) => {
    responseDto.push({
      email: item.email,
      name: item.name,
      id: item.id,
    });
  });

  // console.log("organizations", data);

  return NextResponse.json(responseDto);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Não autorizado. Token inválido ou expirado." },
      { status: 401 },
    );
  }
  const body = await req.json();
  const { email, name } = body;

  const { error: dbError,data} = await supabaseServer.from("organizations").insert({
    user_id: session.user.id,
    name: name,
    email: email,
  });

  if (dbError) {
    console.error("Erro no Banco:", dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }


  console.log("organizations created",data);

  return NextResponse.json([]);
}
