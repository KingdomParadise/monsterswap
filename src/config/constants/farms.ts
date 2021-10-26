import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'MONSTER',
    lpAddresses: {
      97: '0x23040c7b54112a6E6e70559d49114Ed80C41C282',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.monster,
    quoteToken: tokens.monster,
  },
  {
    pid: 1,
    lpSymbol: 'Monster-BUSD LP',
    lpAddresses: {
      97: '0xeCb3A8276980C10a8cFb178144deccC1fa9aD7C1',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.monster,
    quoteToken: tokens.busd,
  },
  {
    pid: 2,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '0x4adf9d6DE81E200d438ADE75cdafD176B394C9e8',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'Monster-BNB LP',
    lpAddresses: {
      97: '0xf585151B448b4dae58C301e7aD877fA8Dd2E2295',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.monster,
    quoteToken: tokens.wbnb,
  },
  // {
  //   pid: 251,
  //   lpSymbol: 'CAKE-BNB LP',
  //   lpAddresses: {
  //     97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
  //     56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
  //   },
  //   token: tokens.cake,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 252,
  //   lpSymbol: 'BUSD-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.wbnb,
  // },

  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
  // {
  //   pid: 435,
  //   lpSymbol: 'REVV-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x1cc18962b919ef90085a8b21f8ddc95824fbad9e',
  //   },
  //   token: tokens.revv,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 367,
  //   lpSymbol: 'BTT-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x946696344e7d4346b223e1cf77035a76690d6a73',
  //   },
  //   token: tokens.btt,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 434,
  //   lpSymbol: 'SKILL-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0xc19dfd34d3ba5816df9cbdaa02d32a9f8dc6f6fc',
  //   },
  //   token: tokens.skill,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 369,
  //   lpSymbol: 'WIN-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x894bd57afd8efc93d9171cb585d11d0977557425',
  //   },
  //   token: tokens.win,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 433,
  //   lpSymbol: 'IF-BUSD LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x7b4682D2B3f8670b125aF6AEA8d7eD2Daa43Bdc1',
  //   },
  //   token: tokens.if,
  //   quoteToken: tokens.busd,
  // }, 
]

export default farms
