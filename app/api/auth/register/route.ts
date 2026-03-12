import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, password, name } = body;


  const { data, error } = await supabaseServer.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
   
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  const userId = data.user.id;

  
  const { error: dbError } = await supabaseServer
    .from("organizations")
    .insert({
      id: userId,
      name: name,
      email: email,
    });

  if (dbError) {
     console.error(dbError)
    return NextResponse.json(
      { error: dbError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Usuário criado",
    user: data.user,
  });
}