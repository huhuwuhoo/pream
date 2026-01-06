
export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  totalMinted: bigint;
  progress: number;
  isGraduated: boolean;
  price: bigint;
  virtualEth: bigint;
  virtualTokens: bigint;
}

export enum AppView {
  LIST = 'LIST',
  LAUNCH = 'LAUNCH',
  DETAIL = 'DETAIL'
}

export interface Trade {
  type: 'BUY' | 'SELL';
  amount: string;
  eth: string;
  timestamp: number;
  txHash: string;
}
