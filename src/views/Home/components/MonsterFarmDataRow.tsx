/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react'
import styled from 'styled-components'
import { Flex } from 'uikit'
import { ReactComponent as NextIcon } from 'assets/images/NextIcon.svg'
import { ReactComponent as PrevIcon } from 'assets/images/PrevIcon.svg'

const EarnedPart = styled.div`
  position: relative;
  height: 100%;
  & h1,
  & p,
  & h2 {
    color: white;
  }
  & h2 {
    font-size: 14px;
    font-weight: 400;
    position: absolute;
    bottom: 0;
    right: 0;
    line-height: 20px;
    display: flex;
    align-items: center;
    & svg {
      margin: -2px 0 0 4px;
    }
  }
  & p {
    margin-top: 6px;
    font-weight: 700;
  }
  & > div {
    width: 20px;
    height: 20px;
    position: absolute;
  }
`

const EarnedBottomLeft = styled.div`
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  border-top-right-radius: 10px;
  top: -10px;
  right: -10px;
`

const EarnedTopRight = styled.div`
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  border-bottom-left-radius: 10px;
  bottom: -10px;
  left: -10px;
`
const StyledTitle = styled.h1<{ fontSize: string }>`
  font-size: ${(props) => props.fontSize};
  color: #4e4e9d;
  text-transform: uppercase;
`

const StyledText = styled.p<{ fontSize: string }>`
  font-family: 'Red Hat Text', sans-serif;
  font-size: ${(props) => props.fontSize};
  color: rgba(17, 5, 24, 0.6);
`

const MonsterFarmDataRow: React.FC = () => {
  
    return (
        <EarnedPart>
        <EarnedTopRight />
        <EarnedBottomLeft />
        <StyledTitle fontSize="16px">Earn up to</StyledTitle>
        <StyledText fontSize="28px">554.87%</StyledText>
        <h2>
          In Farms <NextIcon />
        </h2>
      </EarnedPart>
)
}

export default MonsterFarmDataRow