import React from 'react'
import { PancakeStack, PancakeInput, PancakeLabel } from './StyledPancakeToggle'
import { PancakeToggleProps, scales } from './types'

const PancakeToggle: React.FC<PancakeToggleProps> = ({ checked, scale = scales.MD, ...props }) => (
  <PancakeStack scale={scale}>
    <PancakeInput id={props.id || 'pancake-toggle'} scale={scale} type="checkbox" checked={checked} {...props} />
    <PancakeLabel scale={scale} checked={checked} htmlFor={props.id || 'pancake-toggle'}>

      <div className="pancakes">
        <div className="pancake">{checked ? 'Off' : 'On'}</div>
      </div>
      {
        checked
          ?
          <div className="pancake_on">On</div>
          :
          <div className="pancake_off">Off</div>
      }

    </PancakeLabel>
  </PancakeStack>
)

PancakeToggle.defaultProps = {
  scale: scales.MD,
}

export default PancakeToggle
