import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import ModulesSection from "@/components/landing/ModulesSection";
import SolutionsSection from "@/components/landing/SolutionsSection";
import StoreShowcaseSection from "@/components/landing/StoreShowcaseSection";
import GrowthSection from "@/components/landing/GrowthSection";
import ESGSection from "@/components/landing/ESGSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import SectionCTA from "@/components/landing/SectionCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <FeaturesSection />
        <SectionCTA />
        <PainPointsSection />
        <SectionCTA />
        <ModulesSection />
        <SectionCTA />
        <SolutionsSection />
        <SectionCTA />
        <StoreShowcaseSection />
        <SectionCTA />
        <GrowthSection />
        <SectionCTA />
        <ESGSection />
        <SectionCTA />
        <TestimonialsSection />
        <SectionCTA />
        <FAQSection />
        <SectionCTA />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
