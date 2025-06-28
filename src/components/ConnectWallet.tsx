"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Wallet, LogOut } from 'lucide-react';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const injectedConnector = connectors.find(c => c.id === 'injected');

  const glassStyle = "text-foreground bg-background/80 backdrop-blur-sm border-border hover:bg-background/90";
  const borderStyle = "border-slate-400 dark:border-white/20 dark:hover:bg-white/20";

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={cn('font-semibold h-10 px-4 rounded-full', glassStyle, borderStyle)}>
            <Wallet className="mr-2 h-4 w-4" />
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      disabled={!injectedConnector}
      className={cn('font-semibold h-10 px-5 rounded-full', glassStyle, borderStyle)}
    >
      <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
    </Button>
  );
}
