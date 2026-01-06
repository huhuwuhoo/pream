
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { baseSepolia } from '@reown/appkit/networks';
import { PROJECT_ID } from './constants';

const networks = [baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
  projectId: PROJECT_ID,
  networks
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: PROJECT_ID,
  features: {
    analytics: true
  }
});
