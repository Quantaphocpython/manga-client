import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold border border-primary/30">
              AI-Powered Manga Creation
            </span>
          </div>

          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Create Stunning Manga with AI
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your imagination into professional manga artwork. Generate beautiful panels, apply artistic styles, and create your manga stories in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/studio">
                Start Creating Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
