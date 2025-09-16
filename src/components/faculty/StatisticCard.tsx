import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  color?: 'default' | 'green' | 'yellow' | 'red' | 'blue';
}

const colorClasses = {
  default: {
    icon: 'text-primary',
    iconBg: 'bg-primary/10',
    value: 'text-foreground'
  },
  green: {
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
    value: 'text-green-600'
  },
  yellow: {
    icon: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    value: 'text-yellow-600'
  },
  red: {
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
    value: 'text-red-600'
  },
  blue: {
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
    value: 'text-blue-600'
  }
};

export function StatisticCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = 'default' 
}: StatisticCardProps) {
  const colors = colorClasses[color];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${colors.value}`}>
              {value}
            </p>
            {change && (
              <p className={`text-xs mt-1 ${
                change.trend === 'up' ? 'text-green-600' :
                change.trend === 'down' ? 'text-red-600' :
                'text-muted-foreground'
              }`}>
                {change.value}
              </p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}