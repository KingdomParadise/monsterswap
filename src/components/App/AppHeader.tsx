import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon } from 'uikit'
import { Link } from 'react-router-dom'
import SubNav from 'components/Menu/SubNav'
import Settings from './Settings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title?: string
  subtitle?: string
  helper?: string
  backTo?: string
  noConfig?: boolean
  importFlag?: string
}

const AppHeaderContainer = styled(Flex)`
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  font-family: 'Ubuntu';
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false, importFlag = 'null' }) => {
  return (
    <AppHeaderContainer>
      {importFlag === 'null' ?
        <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
          <Flex flexDirection="column">
            {title &&
              <Heading as="h2" mb="8px" style={{ fontFamily: "UbuntuBold", color: "black" }}>
                {title}
              </Heading>
            }
            <Flex alignItems="center">
              {helper && <QuestionHelper text={helper} mr="4px" />}
              {subtitle &&
                <Text as={Link} to={backTo} fontFamily="UbuntuBold" color="textBlack" marginBottom="1em" fontSize="14px">
                  {subtitle}
                </Text>
              }
            </Flex>
            <SubNav />
          </Flex>
        </Flex>
        :
        <>
          <IconButton variant="text" as={Link} to={backTo} area-label="go back" style={{marginTop:'1em'}}  mr="8px">
            <ArrowBackIcon color="primary" />
          </IconButton>
          {title &&
            <Heading as="h2" mb="8px" style={{ fontFamily: "UbuntuBold", textAlign: 'center',marginLeft:'auto',marginRight:'auto',marginTop:'0.8em',color: "black" }}>
              {title}
            </Heading>
          }
        </>
      }

      {!noConfig && (
        <Flex>
          <Settings />
          {/* <Transactions /> */}
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
