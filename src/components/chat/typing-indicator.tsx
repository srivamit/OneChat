import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types';

interface TypingIndicatorProps {
  recipientUser: User;
}

export const TypingIndicator = ({ recipientUser }: TypingIndicatorProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-end gap-2 animate-message-in">
      <div className="w-8 shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={recipientUser.avatarUrl} alt={recipientUser.name} data-ai-hint="woman portrait" />
          <AvatarFallback>{getInitials(recipientUser.name)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex items-center space-x-1.5 rounded-xl bg-secondary px-4 py-3 shadow-md rounded-bl-sm">
        <span className="h-2 w-2 animate-typing-bubble rounded-full bg-muted-foreground" style={{ animationDelay: '0s' }} />
        <span className="h-2 w-2 animate-typing-bubble rounded-full bg-muted-foreground" style={{ animationDelay: '0.2s' }} />
        <span className="h-2 w-2 animate-typing-bubble rounded-full bg-muted-foreground" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};
