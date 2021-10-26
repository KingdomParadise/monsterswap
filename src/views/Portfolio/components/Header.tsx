import React from 'react'
import styled from 'styled-components'
import {Image} from 'uikit'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > div {
    width: 100%;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  & h1 {
    font-size: 48px;
    line-height: 55px;
    color: #524f9e;
    text-transform: uppercase;
  }

  & h2 {
    font-size: 18px;
    line-height: 21px;
    color: #524f9e;
    text-transform: uppercase;
    margin-top: 8px;
  }

  @media (max-width: 767.98px) {
    padding-left: 40px;
    padding-right: 40px;

    & > div:nth-child(1) {
      margin-bottom: 30px;
    }
    & > div > h1:nth-child(1) {
      display: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-between;

    & > div {
      &:first-child {
        width: 50%;
      }
      &:last-child {
        width: 40%;
      }
    }
  }
`

const PortfolioHeader: React.FC = () => {
  return (
    <Container>
      <div>
        <h1>Your</h1>
        <h1>Monster Portfolio</h1>
        <h2>Keep track of your pools and farms</h2>
      </div>
      <Image src="/images/portfolio/ic-portfolio.svg" alt="Monster Swap" width={490} height={245} />
    </Container>
  )
}

export default PortfolioHeader
