import React from 'react'
import styled from 'styled-components'
import Button from '../Button/Button'
import { BaseButtonProps, PolymorphicComponent, variants } from '../Button/types'
import { ButtonMenuItemProps } from './types'

interface ActiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps['as']
}
interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps['as']
}

const ActiveButton: PolymorphicComponent<ActiveButtonProps, 'button'> = styled(Button)<ActiveButtonProps>`
  background-color: #4E4E9D;
  color: white;
  font-family: 'Ubuntu';
  border-radius: 10px;
  &:hover:not(:disabled):not(:active) {
    background-color: #4E4E9D;
  }
`
const InactiveButton: PolymorphicComponent<InactiveButtonProps, 'button'> = styled(Button)<InactiveButtonProps>`
  background-color: transparent;
  color: #0D1805;
  font-family: 'Ubuntu';
  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }
`

const ButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps, 'button'> = ({
  isActive = false,
  variant = variants.PRIMARY,
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButton forwardedAs={as} variant={variant} {...props} />
  }

  return <ActiveButton forwardedAs={as} variant={variant} {...props} />
}

export default ButtonMenuItem
