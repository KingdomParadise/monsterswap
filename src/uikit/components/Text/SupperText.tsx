import styled, { DefaultTheme } from 'styled-components'
import { space, typography, layout } from 'styled-system'
import getThemeValue from '../../util/getThemeValue'
import { TextProps } from './types'

interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme)
}

const getFontSize = ({ fontSize, small }: TextProps) => {
  return small ? '10px' : fontSize || '12px'
}

const SupperText = styled.div<TextProps>`
  color: #000000;
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 1;
  border: 1px solid;
  border-radius: 20px;
  padding: 8px 12px;
  position: absolute;
  z-index: 1;
  top: 2.8em;
  margin-left: 1em;
  font-family: 'Ubuntu';
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis }) =>
    ellipsis &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}

  ${space}
  ${typography}
  ${layout}
`

SupperText.defaultProps = {
  color: 'text',
  small: false,
  ellipsis: false,
}

export default SupperText
