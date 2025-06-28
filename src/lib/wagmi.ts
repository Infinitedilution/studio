import { http, createConfig, defineChain } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const sonic = defineChain({
  id: 146,
  name: 'Sonic',
  nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.soniclabs.com'] },
  },
  blockExplorers: {
    default: { name: 'SonicScan', url: 'https://sonicscan.org' },
  },
});

export const config = createConfig({
  chains: [sonic],
  connectors: [injected()],
  transports: {
    [sonic.id]: http(),
  },
  ssr: true,
});
