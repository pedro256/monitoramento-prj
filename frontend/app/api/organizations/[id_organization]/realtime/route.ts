import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
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

    const token = await getToken({
        req: req as any,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (token == null) {
        return NextResponse.json(
            { error: "Não autorizado. Token inválido ou expirado." },
            { status: 401 },
        );
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/realtime-token`, {
        method: "POST",
        body: JSON.stringify(prms.id_organization),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.supabaseAccessToken}`,
        },
    });

    if (res.status != 200) {
        const resp = await res.text();
        console.error("Resposta do backend:", resp);
        return NextResponse.json({ error: "Erro ao gerar token" }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data);
}
