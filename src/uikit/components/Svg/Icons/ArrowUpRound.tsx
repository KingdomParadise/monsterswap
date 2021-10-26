import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 77 77" {...props}>
        <rect x="1.5" y="1.5" width="74" height="74" rx="37" stroke="#524F9E" strokeWidth="3"/>
        <path d="M24 38L38 24L52 38" stroke="#524F9E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M38 24V54" stroke="#524F9E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
}

export default Icon
