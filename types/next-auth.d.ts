import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: string;
    user?:{
      id:string;
      email:string;
    }
    error?:string;
  }
  interface User{
    id:string;
    supabaseAccessToken:string;
    expiresAt?:number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:string;
    supabaseAccessToken:string;
    email:string;
    expiresAt?:number;
    error?:string;
  }
  
}