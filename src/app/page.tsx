import BaseLayout from "@/components/layout/BaseLayout";
import LandingPageComponent from "@/components/page_components/landing_page/LandingPageComponent";
import Section1 from "@/components/page_components/landing_page/Section1";
import { Card } from "@heroui/card";
import { Spinner } from "@nextui-org/spinner";
import { Suspense } from "react";

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Card className="p-6 shadow-lg flex flex-col items-center gap-4 bg-content1/90">
          <Spinner
            size="lg"
            color="primary"
            label="Loading..."
            className="animate-pulse"
          />
          <p className="text-sm text-default-500 animate-pulse">
            Preparing your experience...
          </p>
        </Card>
      </div>}>
      <BaseLayout>
        <Section1 />
        <LandingPageComponent />
      </BaseLayout>
    </Suspense>
  );
}
