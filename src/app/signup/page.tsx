"use client";
import Link from "next/link";
import { useActionState } from "react";
import { register } from "../actions/auth";

export default function Page() {
 const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined
 )  
  
 return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
     <div className="w-full max-w-sm space-y-6">
      <h1 className="text-2xl font-bold text-center">Sign Up</h1>
      <p className="text-sm text-center text-gray-500">Create an account to get started</p>
      <form action={formAction} className="space-y-4">
       <div className="relative h-fit">
        <input type="email"
          name="email"
          placeholder="Email" 
          required
          className="w-full rounded-md border-2 border-gray-400 p-2 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black" 
        />
       </div>
       <div className="relative h-fit">
        <input type="password"
          name="password"
          placeholder="Password" 
          required
          minLength={8}
          className="w-full rounded-md border-2 border-gray-400 p-2 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black" 
        />
       </div>
       <button type="submit" className="w-full rounded-md bg-black p-2 text-sm text-white hover:bg-gray-800">Sign Up</button>
       <p className="text-sm text-center text-gray-500">Already have an account? <Link href="/login" className="text-blue-500 hover:text-blue-700">Login</Link></p>
       {errorMessage && (
        <p className="text-center text-sm text-red-500">{errorMessage}</p>
       )}
      </form>
     </div>
    </div>
   )
}