import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id_organization: string }> },) {
    const session = await getServerSession(authOptions);
    const prms = await params;


    if (!session || !session.user?.id) {
        return NextResponse.json(
            { error: "Não autorizado. Token inválido ou expirado." },
            { status: 401 },
        );
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/realtime-token`, {
        method: "POST",
        body: JSON.stringify(prms.id_organization),
    });

    if (res.status != 200) {
        console.error("Erro ao gerar token:", res);
        return NextResponse.json({ error: "Erro ao gerar token" }, { status: 500 });
    }
    const data = await res.json();
    console.log("realtime token ", data.token);
    return NextResponse.json(data);
}
