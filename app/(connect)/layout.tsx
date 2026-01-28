import type { Metadata } from "next";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { genVariable } from "@/lib/config/genVariable";

export const metadata: Metadata = {
  title: genVariable.app.name,
  description: genVariable.app.description,
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <div className="w-full max-w-md p-8 bg-[#232946] rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <span className="text-3xl font-bold text-[#00d084]">Kubera</span>
        </div> */}
        {children}
      {/* </div> */}
    </>
  );
}
