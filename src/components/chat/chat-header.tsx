import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';
import { Phone, Video, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  recipientUser: User;
}

export const ChatHeader = ({ recipientUser }: ChatHeaderProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-10 w-10 border-2 border-transparent">
            <AvatarImage src={recipientUser.avatarUrl} alt={recipientUser.name} data-ai-hint="woman portrait" />
            <AvatarFallback>{getInitials(recipientUser.name)}</AvatarFallback>
          </Avatar>
          {recipientUser.isOnline && (
            <div className="absolute bottom-0 right-0 flex items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="absolute h-3 w-3 animate-pulse-ring rounded-full bg-green-500" />
            </div>
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{recipientUser.name}</p>
          <p className="text-sm text-muted-foreground">{recipientUser.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Phone className="h-5 w-5" />
          <span className="sr-only">Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Video className="h-5 w-5" />
          <span className="sr-only">Video Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">More Options</span>
        </Button>
      </div>
    </div>
  );
};
