interface HeroSectionProps {
  title: string;
  description: string;
}

export function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-lg opacity-90">{description}</p>
      </div>
    </div>
  );
}
