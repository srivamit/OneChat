import { ChatLayout } from '@/components/chat/chat-layout';
import type { User } from '@/types';

const currentUser: User = {
  id: 'user1',
  name: 'You',
  avatarUrl: 'https://placehold.co/100x100/7B8FA1/FFFFFF.png',
  isOnline: true,
};

const recipientUser: User = {
  id: 'user2',
  name: 'Alice',
  avatarUrl: 'https://placehold.co/100x100/98A680/FFFFFF.png',
  isOnline: true,
};

export default function Home() {
  return (
    <div className="relative flex h-svh w-full items-center justify-center bg-background p-2 sm:p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px]"></div>
      <ChatLayout
        currentUser={currentUser}
        recipientUser={recipientUser}
      />
    </div>
  );
}
