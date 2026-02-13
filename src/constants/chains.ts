import { Chain } from 'viem';

/**
 * Polkadot Hub TestNet configuration
 */
export const polkadotHubTestnet: Chain = {
  id: 420420417,
  name: 'Polkadot Hub TestNet',
  nativeCurrency: {
    name: 'Paseo',
    symbol: 'PAS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://eth-rpc-testnet.polkadot.io/'],
    },
    public: {
      http: ['https://eth-rpc-testnet.polkadot.io/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-testnet.polkadot.io/',
    },
  },
  testnet: true,
};

export const SUPPORTED_CHAINS = [polkadotHubTestnet];
export const DEFAULT_CHAIN = polkadotHubTestnet;
