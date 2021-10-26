/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { getMonsterAddress } from 'utils/addressHelpers'
import { getBalanceNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/farms/hooks'

const StatsContent = styled.div`
  margin: 12px 0;
  & > div {
    padding: 12px;
    margin: 2px 0;
    justify-content: space-between;
    &:nth-child(2n + 1) {
      background: #f3f4f8;
      border-radius: 10px;
    }
    & p,
    & p b {
      font-family: 'Red Hat Text', sans-serif;
      font-size: 14px;
    }
    & p {
      color: rgb(17, 5, 24);
      & b {
        color: #4e4e9d;
      }
    }
  }
`
const MonsterDataRow: React.FC = () => {
    const totalSupply = useTotalSupply()
    const burnedBalance = getBalanceNumber(useBurnedBalance(getMonsterAddress()))
    const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
    const cakePriceBusd = usePriceCakeBusd()
    const mcap = cakePriceBusd.times(cakeSupply)
    console.log("[monster address]", cakePriceBusd);
    const mcapString = formatLocalisedCompactNumber(mcap.toNumber())
  
    return (
        <StatsContent>
            <Flex>
                <p>USD Market CAP</p>
                <p>
                    <b>{ Number.isNaN(Number(mcapString)) ? 0 : mcapString }</b>
                </p>
            </Flex>
            <Flex>
                <p>Monster In Circulation</p>
                <p>
                    <b>{ cakeSupply }</b>
                </p>
            </Flex>
            <Flex>
                <p>Monster Burned</p>
                <p>
                    <b>{ burnedBalance }</b>
                </p>
            </Flex>
            <Flex>
                <p>DEX Liquidity</p>
                <p>
                    <b>$1,000,000</b>
                </p>
            </Flex>
            <Flex>
                <p>Distributed Monster/Block</p>
                <p>
                    <b>11.5</b>
                </p>
            </Flex>
        </StatsContent>
    )
}

export default MonsterDataRow