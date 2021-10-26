import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Card } from 'uikit'
import { useWeb3React } from '@web3-react/core'
// import useTheme from 'hooks/useTheme'
import { PortfolioHeader, StakedFarmData, StakedPoolData } from './components'
import { CardButton } from '../Home/components'

const Container = styled.div`
  max-width: 1200px;
  margin: 83px auto;
  
  & > div {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      flex-direction: row;
    }
  }

  @media (max-width: 767.98px) {
    margin: 40px auto;
    padding-left: 10px;
    padding-right: 10px;
  }
`

const MainPart = styled.div`
  margin-top: 32px;
`

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
const CardLogo = styled.div`
  width: 40px;
  height: 40px;
  background: #454282;
  border-radius: 8px;
  margin-right: 8px;
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

const Portfolio: React.FC = () => {
  // const { theme } = useTheme()
  const { account } = useWeb3React()

  return (
    <Container>
      <PortfolioHeader />
      <MainPart>
        {account ? (
          <Flex flexWrap="wrap" justifyContent="space-between">
            <StyledCard>
              <StyledTitle fontSize="26px">Monster Portfolio</StyledTitle>
              <CardRow style={{ marginTop: 20 }}>
                <p>TVL ALL Pools</p>
                <p>
                  <b>$67.91</b>
                </p>
              </CardRow>
              <CardRow>
                <p>Monster Holdings</p>
                <p>
                  <b>0.00</b>
                </p>
              </CardRow>
              <CardRow>
                <p>Monster Price</p>
                <p>
                  <b>$2.34</b>
                </p>
              </CardRow>
              <CardRow>
                <p>Your Monster Earnings ($)</p>
                <div>
                  <div>
                    <p>
                      <b>Daily: 0.16</b>
                    </p>
                    <p>
                      <b>$0.38</b>
                    </p>
                  </div>
                  <div>
                    <p>
                      <b>Weekly: 1.14</b>
                    </p>
                    <p>
                      <b>$2.66</b>
                    </p>
                  </div>
                  <div>
                    <p>
                      <b>Monthly: 4.88</b>
                    </p>
                    <p>
                      <b>$11.40</b>
                    </p>
                  </div>
                  <div>
                    <p>
                      <b>Yearly: 59.33</b>
                    </p>
                    <p>
                      <b>$138.73</b>
                    </p>
                  </div>
                </div>
              </CardRow>
              <CardRow>
                <p>Your APR (%)</p>
                <div>
                  <div>
                    <p>
                      <b>Daily 0.56%</b>
                    </p>
                    <p>
                      <b>Weekly 3.92%</b>
                    </p>
                    <p>
                      <b>Monthly 16.79%</b>
                    </p>
                    <p>
                      <b>Yearly 204.27%</b>
                    </p>
                  </div>
                </div>
              </CardRow>
            </StyledCard>
            <StakedPoolData />
            <StakedFarmData />
          </Flex>
        ) : (
          <CardButton bgColor="#4e4e9d">Unlock Wallet</CardButton>
        )}
      </MainPart>
    </Container>
  )
}

export default Portfolio
