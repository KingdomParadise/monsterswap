import { useMemo } from 'react'
import useActiveWeb3React from "hooks/useActiveWeb3React"
import { usePools } from "state/pools/hooks"
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { useFarms, usePollFarmsData } from 'state/farms/hooks'
import BigNumber from 'bignumber.js'


export const useTotalStakedBalance = () => {
  const { account } = useActiveWeb3React()
  const { pools: poolData, userDataLoaded } = usePools(account)
  console.log("[poolData]", poolData)
  const getTvl = useMemo(() => {
    if (userDataLoaded) {
      const sumPool = poolData.reduce((sum, item) => {
        return {
          ...sum,
          userData: { ...sum.userData, stakingTokenBalance: sum.userData.stakingTokenBalance.plus(item.userData.stakingTokenBalance) }
        }
      })
      return sumPool.userData.stakingTokenBalance
    }
    return BIG_ZERO
  }, [poolData, userDataLoaded])
  return getBalanceNumber(getTvl)
}

export const useTotalFarmEarningBalance = () => {
  const { data: farmData, userDataLoaded } = useFarms()
  usePollFarmsData()
  console.log("[farmData]", farmData)
  const getTotalFarmData = useMemo(() => {
    if( userDataLoaded ) {
        const sumPool = farmData.reduce((sum, item) => {
            return {
                ...sum,
                userData: { 
                    ...sum.userData,
                    earnings: new BigNumber(sum.userData.earnings).plus(new BigNumber(item.userData.earnings)).toString(),
                }
            }
        })
        return new BigNumber(sumPool.userData.earnings)
    }
    return  BIG_ZERO
  }, [farmData, userDataLoaded]);
  return  getTotalFarmData
}

