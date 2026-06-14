import {
  FeaturedProductsSection,
  HeroSection,
  HowCustomizationSection,
  ShopByCategorySection,
  TestimonialsSection,
  WhyUsSection,
} from "@/components/home";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Andhra Pickles & Homemade Food Online",
  description:
    "Order Andhra pickles online — homemade avakaya, gongura, podis, and Telugu sweets made to order. Choose oil or ghee, sugar or jaggery. Freshly prepared after you confirm.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyUsSection />
      <ShopByCategorySection />
      <FeaturedProductsSection />
      <HowCustomizationSection />
      <TestimonialsSection />
    </>
  );
}
