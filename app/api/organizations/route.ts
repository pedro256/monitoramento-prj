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
            { status: 401 }
        );
    }

    const { data, error: dbError } = await supabaseServer
        .from("organizations")
        .select()
        .eq("user_id", session.user.id);

    if (dbError) {
        console.error("Erro no Banco:", dbError);
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        );
    }


    const responseDto:IOrganizationItem[] = [];

    data.forEach(item=>{
        console.log(item)
        responseDto.push({
            email: item.email,
            name: item.name,
            id: item.id
        })
    })

    console.log("organizations", data)

    return NextResponse.json([
        { id: "1", name: "Sistecc Industrial", email: "contato@sistecc.com" },
        { id: "2", name: "Alpha Logística", email: "admin@alpha.io" },
    ]as IOrganizationItem[]);
}