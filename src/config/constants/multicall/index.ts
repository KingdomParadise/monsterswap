import { ChainId } from '@monsterswap/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.TESTNET]: '0x036e279170a5c4e76Ef0d26Dab2753022FBC0f56',
}

// const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
//   [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
//   [ChainId.TESTNET]: '0x301907b5835a2d723Fe3e9E8C5Bc5375d5c1236A',
// }

export { MULTICALL_ABI, MULTICALL_NETWORKS }
