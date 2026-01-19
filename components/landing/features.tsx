import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Multiple Styles',
    description: 'Choose from Shonen, Shoujo, Seinen, Josei, and more artistic styles.',
    icon: '✨',
  },
  {
    title: 'Professional Inking',
    description: 'Apply G-Pen, Brush, Digital, Calligraphy, and other inking techniques.',
    icon: '🖌️',
  },
  {
    title: 'Screentone Effects',
    description: 'Add depth with adjustable screentone density for realistic shadows.',
    icon: '🎨',
  },
  {
    title: 'Flexible Layouts',
    description: 'Single, Double, Triple, Grid, and Dramatic Spread panel layouts.',
    icon: '📐',
  },
  {
    title: 'Color & B/W',
    description: 'Create stunning color illustrations or classic black and white manga.',
    icon: '🎭',
  },
  {
    title: 'Export to PDF',
    description: 'Save and print your manga projects for professional quality output.',
    icon: '📄',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to create professional manga artwork
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="font-sans text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
