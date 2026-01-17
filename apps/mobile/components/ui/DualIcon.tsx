import { SymbolView, type SymbolViewProps, type SymbolWeight } from 'expo-symbols';
import {
  // Theme icons
  PawPrint,
  Search,
  Flame,
  Map,
  BookOpen,
  Heart,
  Home,
  Sparkles,
  Book,
  // Tone icons
  Sun,
  Moon,
  Compass,
  Wand2,
  Lightbulb,
  Smile,
  Music,
  // Filter icon
  SlidersHorizontal,
  // Profile icons
  User,
  CreditCard,
  Pencil,
  ChevronRight,
  ChevronLeft,
  Check,
  Bell,
  Globe,
  MessageCircle,
  Star,
  FileText,
  Lock,
  Crown,
  LogOut,
  Trash2,
  // Reader icons
  X,
  MoreVertical,
  List,
  // Explore icons
  Play,
  Palette,
  GraduationCap,
  Clock,
} from 'lucide-react-native';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';

// Map Lucide icon names to components
const LUCIDE_ICONS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  // Theme icons
  PawPrint,
  Search,
  Flame,
  Map,
  BookOpen,
  Heart,
  Home,
  Sparkles,
  Book,
  // Tone icons
  Sun,
  Moon,
  Compass,
  Wand2,
  Lightbulb,
  Smile,
  Music,
  // Filter icon
  SlidersHorizontal,
  // Profile icons
  User,
  CreditCard,
  Pencil,
  ChevronRight,
  ChevronLeft,
  Check,
  Bell,
  Globe,
  MessageCircle,
  Star,
  FileText,
  Lock,
  Crown,
  LogOut,
  Trash2,
  // Reader icons
  X,
  MoreVertical,
  List,
  // Explore icons
  Play,
  Palette,
  GraduationCap,
  Clock,
};

export interface IconConfig {
  sfSymbol: string;
  lucide: string;
}

interface DualIconProps {
  icon: IconConfig;
  size?: number;
  color: string;
  weight?: SymbolWeight;
}

/**
 * Icon component that renders SF Symbols on iOS 26+ and Lucide icons as fallback.
 * Takes an icon config with both sfSymbol and lucide names.
 */
export const DualIcon: React.FC<DualIconProps> = ({
  icon,
  size = 24,
  color,
  weight = 'medium',
}) => {
  const { hasGlassSupport } = useLiquidGlass();

  if (hasGlassSupport) {
    return (
      <SymbolView
        name={icon.sfSymbol as SymbolViewProps['name']}
        size={size}
        tintColor={color}
        weight={weight}
      />
    );
  }

  const LucideIcon = LUCIDE_ICONS[icon.lucide] || Book;
  return <LucideIcon size={size} color={color} />;
};

export default DualIcon;
