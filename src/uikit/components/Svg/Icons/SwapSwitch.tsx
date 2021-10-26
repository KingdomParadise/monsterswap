import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 62 62" {...props}>
        <rect x="1.25" y="1.25" width="59.5" height="59.5" rx="29.75" fill="#4E4E9D" stroke="#524F9E" strokeWidth="2.5"/>
        <path d="M12.8333 25.6667L21 17.5L29.1667 25.6667" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 22.5V43.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50.1666 35.3314L42 43.498L33.8333 35.3314" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M42 39.498L42 18.498" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
}

export default Icon
