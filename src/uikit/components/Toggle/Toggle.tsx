import React from 'react'
import StyledToggle, { Input, Handle } from './StyledToggle'
import { ToggleProps, scales } from './types'

const Toggle: React.FC<ToggleProps> = ({ checked, scale = scales.MD, ...props }) => {
  const isChecked = !!checked

  return (
    <StyledToggle checked={isChecked} scale={scale}>
      <Input checked={checked} scale={scale} {...props} type="checkbox" />
      <Handle scale={scale} style={{background:"#F3BA2B"}}/>
      <div style={{fontFamily:'UbuntuBold', paddingLeft:'13px', paddingRight:'7px',color:'white'}}>On</div> 
      <div style={{fontFamily:'UbuntuBold', color:'#938e96'}}>Off</div>
      
    </StyledToggle>
  )
}

Toggle.defaultProps = {
  scale: scales.MD,
}

export default Toggle
