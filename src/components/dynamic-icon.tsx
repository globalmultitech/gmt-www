import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// This is a workaround because lucide-react doesn't export the IconName type
// See: https://github.com/lucide-icons/lucide/issues/1266
type IconName = keyof typeof icons;

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = icons[name as IconName];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react. Falling back to Circle icon.`);
    const FallbackIcon = icons['Circle'];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};
