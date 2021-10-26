import React, { useRef, RefObject, useCallback, useState, useMemo } from 'react'
import { Token } from '@monsterswap/sdk'
import { Text, Button, CloseIcon, IconButton, Input } from 'uikit'
import styled from 'styled-components'
import Row, { RowBetween, RowFixed } from 'components/Layout/Row'
import { useToken } from 'hooks/Tokens'
import { useRemoveUserAddedToken } from 'state/user/hooks'
import useUserAddedTokens from 'state/user/hooks/useUserAddedTokens'
import { CurrencyLogo } from 'components/Logo'
import { getBscScanLink, isAddress } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import Column, { AutoColumn } from '../Layout/Column'
import ImportRow from './ImportRow'
import { CurrencyModalView } from './types'

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState<string>('')

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  // if they input an address, use it
  const searchToken = useToken(searchQuery)
  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%">
          <RowFixed>
            <CurrencyLogo currency={token} size="20px" /> &nbsp;
            <a href={getBscScanLink(token.address, 'address', chainId)} target="_blank" style={{ fontFamily: "UbuntuBold" }} rel="noreferrer">
              {token.symbol}
            </a>
          </RowFixed>
          <RowFixed>
            <IconButton variant="text" onClick={() => removeToken(chainId, token.address)}>
              <CloseIcon />
            </IconButton>
            {/* <a href={getBscScanLink(token.address, 'address', chainId)} /> */}
          </RowFixed>
        </RowBetween>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  const isAddressValid = searchQuery === '' || isAddress(searchQuery)

  return (
    <Wrapper style={{ minHeight: "450px" }}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <AutoColumn gap="14px">
          <Row>
            <Input
              id="token-search-input"
              scale="lg"
              placeholder="0x0000"
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              isWarning={!isAddressValid}
              fontFamily="Ubuntu"
            />
          </Row>
          {searchToken && (
            <ImportRow
              token={searchToken}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
              style={{ height: 'fit-content' }}
            />
          )}
          {tokenList}
          {!isAddressValid && <Text color="failure" fontFamily="Ubuntu">{t('Enter valid token address')}</Text>}
          <hr style={{ height: '1px', width: '100%' }} />
          <Text bold color="textSubtle" fontFamily="UbuntuBold" style={{ color: 'black', fontSize: '18px' }}>
            {userAddedTokens?.length} {userAddedTokens.length === 1 ? t('Custom Token') : t('Custom Tokens')}
          </Text>
          <hr style={{ height: '1px', width: '100%' }} />
          <Text color="textSubtle" fontFamily="UbuntuBold" style={{ color: 'grey', fontSize: '14px', marginLeft: '2em', marginRight: '2em', textAlign: 'center' }}>
            Tip : Custom tokens are stored locally in your browser
          </Text>

        </AutoColumn>

        <Footer>
          {userAddedTokens.length > 0 && (
            <Button variant="tertiary" onClick={handleRemoveAll}>
              {t('Clear all')}
            </Button>
          )}
        </Footer>
      </Column>
    </Wrapper>
  )
}
