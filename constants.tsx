
export const CORE_PROTOCOL_ADDRESS = '0x80a4A65e0cd7ddcD9E6ad257F0bF7D7CcE66881e';
export const WALLET_CONNECT_PROJECT_ID = 'db2fa52a63be115cb4a12cb5cbfeac86';

export const CORE_PROTOCOL_ABI = [
  "function launchToken(string name, string symbol) external",
  "function allSubTokens(uint256 index) external view returns (address)",
  "function getSubTokensCount() external view returns (uint256)",
  "event OrgLaunched(address indexed token, address indexed creator)"
] as const;

export const SUB_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalMinted() view returns (uint256)",
  "function isGraduated() view returns (bool)",
  "function virtualEthReserves() view returns (uint256)",
  "function virtualTokenReserves() view returns (uint256)",
  "function getProgress() view returns (uint256)",
  "function getCurrentPrice() view returns (uint256)",
  "function getBuyAmount(uint256 ethIn) view returns (uint256)",
  "function getSellAmount(uint256 tokenIn) view returns (uint256)",
  "function buy() payable external",
  "function sell(uint256 tokenAmount) external",
  "function balanceOf(address account) view returns (uint256)",
  "event Bought(address indexed buyer, uint256 ethAmount, uint256 feeAmount, uint256 tokenAmount)",
  "event Sold(address indexed seller, uint256 tokenAmount, uint256 feeAmount, uint256 ethAmount)"
] as const;

// Core Mainnet
export const CORE_CHAIN = {
  id: 1116,
  name: 'Core Blockchain Mainnet',
  network: 'core',
  nativeCurrency: {
    decimals: 18,
    name: 'Core',
    symbol: 'CORE',
  },
  rpcUrls: {
    public: { http: ['https://rpc.coredao.org'] },
    default: { http: ['https://rpc.coredao.org'] },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' },
  },
} as const;
