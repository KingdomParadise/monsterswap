import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import CountUp from 'react-countup'
import { Flex, Card, LinkExternal, Text, MonsterLogoIcon } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useFarms, usePollFarmsData, usePriceCakeBusd } from 'state/farms/hooks'
import { useSelector } from 'react-redux'
import { State } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import ArrowDown from 'uikit/components/Svg/Icons/ArrowDown'
import StakedLpPriceEstimate from './StakedLpPriceEstimate'
import { useTotalFarmEarningBalance } from '../hooks'

const StyledTitle = styled.h1<{ fontSize: string }>`
  font-size: ${(props) => props.fontSize};
  color: #4e4e9d;
  text-transform: uppercase;
`

const StyledCard = styled(Card) <{ bgColor?: string; bordered?: boolean }>`
  padding: 20px;
  box-shadow: ${(props) => (props.bordered ? '0 0 10px 10px rgba(78, 78, 157, 0.2)' : '0 2px 0 rgba(25, 19, 38, 0.1)')};
  border: ${(props) => (props.bordered ? '1px solid #38E3F9' : 'none')};
  background-color: ${(props) => props.bgColor || '#FFF'};
  overflow: hidden;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  h4 {
    font-size: 14px;
    line-height: 40px;
    color: #524f9e;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 49%;
  }
`
const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  position: relative;
  & p, article {
    font-family: 'Red Hat Text', sans-serif;
    color: rgba(17, 5, 24, 0.6);
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    & b {
      font-family: 'Red Hat Text', sans-serif;
      color: #4e4e9d;
    }
    & span {
      font-family: 'Red Hat Text', sans-serif;
      font-weight: normal;
    }
  }
  & > p {
    width: 50%;
  }
  & > p:last-child {
    text-align: right;
  }
  & > div {
    width: 50%;
    text-align: right;
    & > div {
      width: 100%;
      border-top: 1px solid #706974;
      padding: 8px 0 4px;
      & p {
        margin-bottom: 4px;
      }
    }
  }

  @media (max-width: 767.98px) {
    // flex-direction: column;

    // > p {
    //   width: 100%;
    //   text-align: left !important;
    // }
    // > div {
    //   width: 100%;
    //   text-align: left;
    // }
  }
`
const StyledLinkExternal = styled(LinkExternal)`
  font-size: 18px;
`
const DetailsButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 31px;
  text-transform: uppercase;
  color: #524f9e;
  cursor: pointer;
  & svg {
    margin-left: 4px;
    path {
      fill: #524f9e;
    }
  }
`

const StakedFarmData: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false)
  const totalEarning = useTotalFarmEarningBalance()
  const cakePriceBusd = usePriceCakeBusd()
  const previousValueForAPR = useRef(0)
  const previousValueForTVL = useRef(0)
  const previousValueForEarnings = useRef(0)
  const previousValueForEarningsPrice = useRef(0)
  const { lpPriceData } = useSelector((state: State) => state.portfolio)

  const { data: farmData, userDataLoaded } = useFarms()
  usePollFarmsData()

  const GetTotalFarmData = useMemo(() => {
    if (userDataLoaded) {
      const customComp = farmData.map((farm) => {
        return (
          <div key={farm.pid}>
            <StakedLpPriceEstimate lpSymbol={farm.lpSymbol} stakedAmount={new BigNumber(farm.userData.stakedBalance)} />
          </div>
        )
      })
      return customComp
    }
    return null
  }, [farmData, userDataLoaded]);

  const totalLpPrice = useMemo(() => {
    if (lpPriceData.length > 0) {

      let getTVL = BIG_ZERO;
      lpPriceData.map((item) => {
        if (!new BigNumber(item.stakedLpPrice).isNaN()) {
          getTVL = getTVL.plus(new BigNumber(item.stakedLpPrice))
        }
        return item;
      })
      return getBalanceNumber(new BigNumber(getTVL))
    }
    return 0
  }, [lpPriceData]);

  const apr = (new BigNumber(totalLpPrice).plus(totalEarning.times(cakePriceBusd))).times(new BigNumber(100)).dividedBy(new BigNumber(totalLpPrice))

  useEffect(() => {
    previousValueForTVL.current = totalLpPrice
    previousValueForEarnings.current = getBalanceNumber(totalEarning)
    previousValueForEarningsPrice.current = getBalanceNumber(totalEarning.times(cakePriceBusd))
    previousValueForAPR.current = getBalanceNumber(apr)
  }, [lpPriceData, totalLpPrice, totalEarning, cakePriceBusd, apr])

  return (
    <StyledCard bordered>
      <Flex alignItems="center">
        <MonsterLogoIcon width="50px" />
        <StyledTitle fontSize="26px">Monster-LP</StyledTitle>
      </Flex>
      {GetTotalFarmData}
      <CardRow style={{ marginTop: 20 }}>
        <p>Your TVL</p>
        <article>
          <Text fontSize="14px" bold
            color="#4e4e9d">
            <CountUp
              start={previousValueForTVL.current}
              end={totalLpPrice}
              prefix="$"
              suffix=""
              decimals={2}
              duration={1}
              separator=","
            >
              {({ countUpRef }) => (
                <span style={{ fontWeight: "bolder" }} ref={countUpRef} />
              )}
            </CountUp>
          </Text>
        </article>
      </CardRow>
      <CardRow>
        <p>Your APR</p>
        <article>
          <Text fontSize="14px" bold
            color="#4e4e9d">
            <CountUp
              start={previousValueForTVL.current}
              end={getBalanceNumber(apr)}
              prefix=""
              suffix="%"
              decimals={2}
              duration={1}
              separator=","
            >
              {({ countUpRef }) => (
                <span style={{ fontWeight: "bolder" }} ref={countUpRef} />
              )}
            </CountUp>
          </Text>
        </article>
      </CardRow>
      <CardRow>
        <p>Your Pending Rewards</p>
        <div>
          <article>
            <Text fontSize="14px" bold
              color="#4e4e9d">
              <CountUp
                start={previousValueForEarnings.current}
                end={ getBalanceNumber(totalEarning) }
                prefix=""
                suffix=""
                decimals={2}
                duration={1}
                separator=""
              >
                {({ countUpRef }) => (
                  <span style={{ fontWeight: "bolder" }} ref={countUpRef} />
                )}
              </CountUp>
            </Text>
          </article>
          <article>
            <Text fontSize="14px" bold
              color="#4e4e9d">
              <CountUp
                start={previousValueForEarnings.current}
                end={ getBalanceNumber(totalEarning.times(cakePriceBusd)) }
                prefix="($"
                suffix=")"
                decimals={2}
                duration={1}
                separator=""
              >
                {({ countUpRef }) => (
                  <span style={{ fontWeight: "bolder" }} ref={countUpRef} />
                )}
              </CountUp>
            </Text>
          </article>
        </div>
      </CardRow>
      <Flex justifyContent="center">
          <DetailsButton
            onClick={() => {
              setShowDetails(!showDetails)
            }}
          >
            Details <ArrowDown />
          </DetailsButton>
        </Flex>
        {showDetails && (
          <>
            <StyledTitle fontSize="26px">Earnings</StyledTitle>
            <CardRow style={{ marginTop: 16 }}>
              <p>Daily</p>
              <p>
                <b>$0.05</b>
              </p>
            </CardRow>
            <CardRow>
              <p>Weekly</p>
              <p>
                <b>$0.0333</b>
              </p>
            </CardRow>
            <CardRow>
              <p>Monthly</p>
              <p>
                <b>$1.43</b>
              </p>
            </CardRow>
            <CardRow>
              <p>Yearly</p>
              <p>
                <b>$17.41</b>
              </p>
            </CardRow>
            <Flex justifyContent="center" style={{ marginTop: 20 }}>
              <StyledLinkExternal color="#524F9E" href="https://www.google.com">
                View on BSCScan
              </StyledLinkExternal>
            </Flex>
          </>
        )}
    </StyledCard>

  )
}

export default StakedFarmData;