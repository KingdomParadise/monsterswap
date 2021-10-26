import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Card, LinkExternal, MonsterLogoIcon } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as ArrowDown } from 'assets/images/ArrowDown.svg'
import { useTotalStakedBalance } from '../hooks'

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
  & p {
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

const StakedPoolData: React.FC = () => {

  const { account } = useWeb3React()
  const poolData = useTotalStakedBalance()

  return (
    <StyledCard bordered>
      <Flex alignItems="center">
        <MonsterLogoIcon width="50px" />
        <StyledTitle fontSize="26px">Monster</StyledTitle>
      </Flex>
      <CardRow style={{ marginTop: 20 }}>
        <p>Your TVL</p>
        <p>
          <b>$53.17</b>
        </p>
      </CardRow>
      <CardRow>
        <p>Your APR</p>
        <p>
          <b>228.17%</b>
        </p>
      </CardRow>
      <CardRow>
        <p>Your Pending Rewards</p>
        <div>
          <p>
            <b>0.30</b>
          </p>
          <p>
            <span>($0.71)</span>
          </p>
        </div>
      </CardRow>
      <h4>Earnings</h4>
      <CardRow>
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
    </StyledCard>

  )
}

export default StakedPoolData;