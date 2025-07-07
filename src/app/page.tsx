'use client';

import { useSocket } from '@/context/SocketProvider';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { currentUser, onlineUsers } = useSocket();

  const otherUsers = onlineUsers.filter(user => user.id !== currentUser?.id);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!currentUser) {
    return (
      <div className="relative flex h-svh w-full items-center justify-center bg-background p-4">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px]"></div>
        <Card className="w-full max-w-md animate-pulse">
          <CardHeader>
            <CardTitle>Connecting...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex h-svh w-full items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_0.5px,transparent_0.5px)] [background-size:16px_16px]"></div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Who's Online?</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                You are <span className="font-semibold text-primary">{currentUser.name}</span>.
              </p>
            </div>
            <Badge variant="outline">{onlineUsers.length} Online</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {otherUsers.length > 0 ? (
              otherUsers.map((user) => (
                <Link
                  href={`/chat/${user.id}`}
                  key={user.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-transparent">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground p-4">
                Looks like you're the only one here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
