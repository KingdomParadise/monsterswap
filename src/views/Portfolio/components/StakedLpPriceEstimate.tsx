import React, { useEffect } from 'react'
import { useAppDispatch } from 'state'
import BigNumber from 'bignumber.js'

import { useLpTokenPrice } from 'state/farms/hooks'
import { setLpPrice } from 'state/portfolio'

const StakedLpPriceEstimate: React.FC<{lpSymbol: string, stakedAmount: BigNumber} > = ({lpSymbol, stakedAmount}) => {
  const dispatch = useAppDispatch()
  const lpTempPrice = useLpTokenPrice(lpSymbol)
  useEffect(() => {
    dispatch(setLpPrice({ lpSymbol, stakedLpPrice: lpTempPrice.times(stakedAmount).toJSON() }))
  }, [lpSymbol, lpTempPrice, stakedAmount, dispatch])

  return (
    <></>
  )
}

export default StakedLpPriceEstimate;