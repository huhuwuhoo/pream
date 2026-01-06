
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { baseSepolia } from '@reown/appkit/networks';
import { http } from 'viem';
import { PROJECT_ID } from './constants';

const networks = [baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
  projectId: PROJECT_ID,
  networks,
  transports: {
    // 强制使用 Base Sepolia 的 RPC，防止回退到主网配置
    [baseSepolia.id]: http('https://sepolia.base.org')
  }
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: PROJECT_ID,
  defaultNetwork: baseSepolia, // 强制默认网络为 Base Sepolia
  features: {
    analytics: true,
    swaps: false, // 测试网关闭内置 swap 避免干扰
  }
});
