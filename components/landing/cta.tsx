import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground">
            Ready to Create?
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Join thousands of manga creators using AI to bring their stories to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/studio">
                Start Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">
                Explore Features
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
