import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Showcase } from '@/components/landing/showcase';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Showcase />
      <CTA />
      <Footer />
    </>
  );
}
