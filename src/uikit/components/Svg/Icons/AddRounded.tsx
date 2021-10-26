import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
    return (
        <Svg viewBox="0 0 62 62" {...props}>
            <rect x="1.25" y="1.25" width="59.5" height="59.5" rx="29.75" fill="#4E4E9D" stroke="#524F9E" strokeWidth="2.5" />
            <path d="M40 31H22" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M31 22V40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    )
}

export default Icon
