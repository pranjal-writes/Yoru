'use client'
import Background from "@/components/environment/Background";
import Experience from "@/components/Experience";
import Loader from "@/components/Loader";
import { Suspense } from "react";



export default function Home() {

  return (
    <div className="h-screen w-full relative">
      <Suspense fallback={<Loader />}>
      <Experience /> 
      
      </Suspense>
      
    </ div>
    );
}
