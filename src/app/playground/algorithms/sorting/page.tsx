"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { HeroUIProvider } from "@heroui/react";

const sortsAlgo = [
  { key: "binary-sort", label: "Binary sort" },
  { key: "bubble-sort", label: "Bubble Sort" },

];


export default function About() {
  return (
    <BaseLayout>
      <HeroUIProvider className=" flex flex-col justify-start h-screen gap-8 p-2 text-center">
        <h1 className="uppercase text-3xl font-bold mt-3">Sorting</h1>

        <div>
          <Select className="max-w-xs" label="Select sort algorithm">
            {sortsAlgo.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* =========================== Content ===========================  */}
        <div className="flex flex-col gap-4">

          <div>

          </div>

        </div>
        
      </HeroUIProvider>
    </BaseLayout>
  );
}
