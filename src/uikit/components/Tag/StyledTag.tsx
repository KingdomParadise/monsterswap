import styled, { DefaultTheme } from 'styled-components'
import { space, variant } from 'styled-system'
import { Colors } from '../../theme/types'
import { scaleVariants, styleVariants } from './theme'
import { TagProps, variants } from './types'

interface ThemedProps extends TagProps {
  theme: DefaultTheme
}

const getOutlineStyles = ({ outline, theme, variant: variantKey = variants.PRIMARY, width, background }: ThemedProps) => {
  if (outline) {
    const themeColorKey = styleVariants[variantKey].backgroundColor as keyof Colors
    const color = theme.colors[themeColorKey]

    return `
      color: ${color};
      background: ${background === 'null' ? 'transparent' : background};
      border: ${background === 'null' ? '2px solid' : ''};
      border-color: ${color};
      width: ${width};
    `
  }

  return ''
}

export const StyledTag = styled.div<ThemedProps>`
  align-items: center;
  border-radius: 10px;
  color: #ffffff;
  display: inline-flex;
  font-weight: 400;
  white-space: nowrap;
  font-family:'UbuntuBold';
  text-aligh:'center';
  & > svg {
    fill: currentColor;
  }

  ${variant({
  prop: 'scale',
  variants: scaleVariants,
})}
  ${variant({
  variants: styleVariants,
})}
  ${space}

  ${getOutlineStyles}
`

export default null
