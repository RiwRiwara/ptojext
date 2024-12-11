import BaseLayout from "@/components/layout/BaseLayout";
import LandingPageComponent from "@/components/page_components/landing_page/LandingPageComponent";
import Section1 from "@/components/page_components/landing_page/Section1";

export default function LandingPage() {
  return (
    <BaseLayout>
      <Section1 />
      <LandingPageComponent />
    </BaseLayout>
  );
}
