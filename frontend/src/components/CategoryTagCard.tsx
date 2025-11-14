import { Card, CardContent } from './ui/card';
import { cn } from '../utils/cn';
import { LucideProps, Tag, Utensils, ShoppingBag, Wrench, Heart, Book } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface CategoryTagCardProps {
  category: { id: string; name: string };
  isSelected: boolean;
  onClick: () => void;
}

const iconMap: { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> } = {
  Restaurants: Utensils,
  Shops: ShoppingBag,
  Services: Wrench,
  Health: Heart,
  Education: Book,
};

export function CategoryTagCard({ category, isSelected, onClick }: CategoryTagCardProps) {
  const Icon = iconMap[category.name] || Tag;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected ? 'bg-primary text-primary-foreground' : 'bg-white'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Icon className="h-6 w-6" />
        <span className="font-semibold">{category.name}</span>
      </CardContent>
    </Card>
  );
}
