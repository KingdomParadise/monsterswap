import React, { cloneElement, ElementType, isValidElement } from 'react'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import StyledButton from './StyledButton'
import { ButtonProps, scales, variants } from './types'

const Button = <E extends ElementType = 'button'>(props: ButtonProps<E>): JSX.Element => {
  const { startIcon, endIcon, external, className, isLoading, disabled,color, fontFamily,children, ...rest } = props
  const internalProps = external ? getExternalLinkProps() : {}
  const isDisabled = isLoading || disabled
  const classNames = className ? [className] : []

  if (isLoading) {
    classNames.push('pancake-button--loading')
  }

  if (isDisabled && !isLoading) {
    classNames.push('pancake-button--disabled')
  }

  return (
    <StyledButton
      $isLoading={isLoading}
      $color = {color}
      className={classNames.join(' ')}
      disabled={isDisabled}
      fontFamily={fontFamily}
      {...internalProps}
      {...rest}
    >
      <>
        {isValidElement(startIcon) &&
          cloneElement(startIcon, {
            mr: '0.5rem',
          })}
        {children}
        {isValidElement(endIcon) &&
          cloneElement(endIcon, {
            ml: '0.5rem',
          })}
      </>
    </StyledButton>
  )
}

Button.defaultProps = {
  isLoading: false,
  external: false,
  variant: variants.PRIMARY,
  scale: scales.MD,
  disabled: false,
  fontFamily: 'Funhouse'
}

export default Button
