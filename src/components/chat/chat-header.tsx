import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types';

interface ChatHeaderProps {
  recipientUser: User;
}

export const ChatHeader = ({ recipientUser }: ChatHeaderProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-center p-4 border-b">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={recipientUser.avatarUrl} alt={recipientUser.name} data-ai-hint="woman portrait" />
          <AvatarFallback>{getInitials(recipientUser.name)}</AvatarFallback>
        </Avatar>
        {recipientUser.isOnline && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
        )}
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-foreground">{recipientUser.name}</p>
        <p className="text-sm text-muted-foreground">{recipientUser.isOnline ? 'Online' : 'Offline'}</p>
      </div>
    </div>
  );
};
