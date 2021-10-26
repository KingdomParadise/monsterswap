import React from 'react'
import styled from 'styled-components'
import { variant as systemVariant, space } from 'styled-system'
import { WarningIcon, ErrorIcon } from '../Svg'
import { Box } from '../Box'
import { InstructionMessageProps } from './types'
import variants from './theme'

const Icons = {
  warning: WarningIcon,
  danger: ErrorIcon,
}

const MessageContainer = styled.div<InstructionMessageProps>`
  display: flex;
  background-color: ${({ theme, backColor }) => backColor === 'yellowLight' ? theme.colors.yelloLight : theme.colors.purpleLight };
  padding: 16px;
  border-radius: 10px;
  ${space}
`

const InstructionMessage: React.FC<InstructionMessageProps> = ({ children, variant, ...props }) => {
//   const Icon = Icons[variant]
  return (
    <MessageContainer variant={variant} {...props}>
      {/* <Box mr="12px">{icon ?? <Icon color={variants[variant].borderColor} width="24px" />}</Box> */}
      {children}
    </MessageContainer>
  )
}

export default InstructionMessage
