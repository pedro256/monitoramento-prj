import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: string;
    expiresAt?:number;
    user?:{
      id:string;
      email:string;
    }
  }
  interface User{
    id:string;
    supabaseAccessToken:string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:string;
    supabaseAccessToken:string;
    email:string;
  }
  
}