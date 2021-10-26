import React from 'react'
import styled, { keyframes } from 'styled-components'
import { SpinnerProps } from './types'

const rotate = keyframes`
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const dash = keyframes`
  0%, 25% {
    stroke-dashoffset: 280;
    transform: rotate(0);
  }
  50%, 75% {
    stroke-dashoffset: 75;
    transform: rotate(45deg);
  }
  100% {
    stroke-dashoffset: 280;
    transform: rotate(360deg);
  }
`

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const SVG = styled.svg`
  animation: ${rotate} 2s linear infinite;
  z-index: 2;
  margin: -25px 0 0 -25px; 
  max-width: 128px;

  & .path {
    animation: ${dash} 1.5s ease-in-out infinite;
    stroke: #38E3F9;
    display: block;
    stroke-linecap: round;
    stroke-dasharray: 283;
    stroke-dashoffset: 280;
    transform-origin: 50% 50%;
  }
`;



const Spinner: React.FC<SpinnerProps> = ({ size = 128, width = '128px', height = '128px' }) => {
  return (
    <Container>
      <SVG viewBox={`0 0 ${size} ${size}`} width={width} height={height} >
        <circle className="path" cx={size / 2} cy={size / 2} r="50" fill="none" strokeWidth="5" />
      </SVG>
    </Container>
  )
}

export default Spinner
