import React, { useState } from 'react'
import { Token, Currency } from '@monsterswap/sdk'
import { Button, Text, ErrorIcon, Flex, Message, Checkbox, Tag, Grid } from 'uikit'
import { AutoColumn } from 'components/Layout/Column'
import { useAddUserToken } from 'state/user/hooks'
import { getBscScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { useTranslation } from 'contexts/Localization'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  return (
    <AutoColumn gap="lg">
      {tokens.map((token) => {
        const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
        const address = token.address
          ? token.address
          : null
        return (
          <>
            <Grid key={token.address} gridTemplateRows="1fr 1fr" gridGap="4px">
              <Flex alignItems="center">
                <CurrencyLogo currency={token} size="24px" style={{ opacity: '0.6' }} />
                <Text fontFamily="UbuntuBold" color="primary">{token.symbol}</Text>
                <Text mr="8px" color="textSubtle" fontFamily="UbuntuBold">&nbsp;&nbsp;&nbsp;&nbsp;{token.name}</Text>
              </Flex>
              {chainId && (
                <Flex justifyContent="space-between" width="100%">
                  <Text mr="4px" fontSize='14px' fontFamily='UbuntuBold' color="secondary">{address}</Text>
                  {/* <a href={getBscScanLink(token.address, 'address', chainId)} target="_blank" rel="noreferrer">
                  ({t('View on BscScan')})
                </a> */}
                </Flex>
              )}
              {list !== undefined && (
                <Tag
                  variant="success"
                  outline
                  scale="sm"
                  startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
                >
                  {t('via')} {list.name}
                </Tag>
              )}
            </Grid>
            {list === undefined && (
              <Tag variant="failure" outline scale="sm" width='50%' marginTop='-1em' background="#efb7b7b3" padding='3em 2em' startIcon={<ErrorIcon color="failure" width="22px" />}>
                {t('Unknown Service')}
              </Tag>
            )}
          </>
        )
      })}
      <Flex alignItems="center" marginLeft="auto" marginRight="auto" marginTop="-1em">
        <ErrorIcon mr="18px" width="4em" color="failure" />
      </Flex>
      <Text bold fontFamily="UbuntuBold" color='failure' textAlign="center" fontSize="20px" marginTop="-1em">
        {t(
          'Trade at your own risk!',
        )}
      </Text>
      <Text bold fontFamily="UbuntuBold" color='failure' textAlign="center" fontSize="14px" marginLeft='3em' marginRight="3em" marginTop="-1em">
        {t(
          'Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects.',
        )}
      </Text>
      <Text bold fontFamily="UbuntuBold" color='failure' textAlign="center" fontSize="15px" marginLeft='1em' marginRight="1em" marginTop="-1em">
        {t(
          'If you purchase this token, you may not be able to sell it back.',
        )}
      </Text>
      <Flex alignItems="center" marginLeft="auto" marginRight="auto" marginTop="-1em" onClick={() => setConfirmed(!confirmed)}>
        <Checkbox
          scale="sm"
          name="confirmed"
          type="checkbox"
          style={{ border: "1px solid #ED4B9E" }}
          checked={confirmed}
          onChange={() => setConfirmed(!confirmed)}
        />
        <Text ml="8px" fontFamily="UbuntuBold" color='failure' style={{ userSelect: 'none' }}>
          {t('I understand')}
        </Text>
      </Flex>
      <Button
        variant="primary"
        disabled={!confirmed}
        onClick={() => {
          tokens.map((token) => addToken(token))
          if (handleCurrencySelect) {
            handleCurrencySelect(tokens[0])
          }
        }}
        className=".token-dismiss-button"
      >
        {t('Import')}
      </Button>
    </AutoColumn>
  )
}

export default ImportToken
