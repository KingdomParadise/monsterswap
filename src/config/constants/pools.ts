import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.monster,
    earningToken: tokens.monster,
    contractAddress: {
      97: '0xcc9C6E8162450588FC336576438FB20624E4415C',
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
  },
  // {
  //   sousId: 198,
  //   stakingToken: tokens.monster,
  //   earningToken: tokens.trx,
  //   contractAddress: {
  //     97: '',
  //     56: '0xb2b62f88ab82ed0bb4ab4da60d9dc9acf9e816e5',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 3,
  //   tokenPerBlock: '9.6643',
  // },
  // {
  //   sousId: 198,
  //   stakingToken: tokens.monster,
  //   earningToken: tokens.btse,
  //   contractAddress: {
  //     97: '',
  //     56: '0xb2b62f88ab82ed0bb4ab4da60d9dc9acf9e816e5',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 2,
  //   tokenPerBlock: '9.6643',
  // },
  // {
  //   sousId: 201,
  //   stakingToken: tokens.monster,
  //   earningToken: tokens.axs,
  //   contractAddress: {
  //     97: '',
  //     56: '0xBB472601B3CB32723d0755094BA80B73F67f2AF3',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 4,
  //   tokenPerBlock: '0.00744',
  // },
]

export default pools
