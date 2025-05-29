import { HeroSection } from "@/components/blocks/hero-section-1"
import { FeaturesSection } from "@/components/ui/features-section";
import { PricingSection } from "@/components/blocks/pricing-section"
import { defaultTiers } from "@/data/pricing";
import { About3 } from "@/components/ui/about-3";
import { CTASection } from "@/components/blocks/cta-action";
import { FaqSection } from "@/components/blocks/faq";
import { faqItems } from "@/data/faq";
import { Testimonials } from "@/components/blocks/testimonials";

export default function Home() {
  return (
    <div className="">
    
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <About3 />
        {/* <WhyUsSection /> */}

        <PricingSection tiers={defaultTiers} />
        <Testimonials />
        <FaqSection  title="Frequently Asked Questions" items={faqItems}/>
        {/* <TestimonialsSection /> */}
        <CTASection />
      </main>
  

    </div>
  );
}