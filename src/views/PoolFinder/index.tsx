import React, { useCallback, useEffect, useState } from 'react'
import { Currency, ETHER, JSBI, TokenAmount } from '@monsterswap/sdk'
import { Button, ChevronDownIcon, Text, AddIcon, useModal, InstructionMessage } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import { CurrencyLogo } from '../../components/Logo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Layout/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../hooks/usePairs'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import StyledInternalLink from '../../components/Links'
import { currencyId } from '../../utils/currencyId'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border: 1px solid !important;
  border-radius: 10px;
  padding-right:auto;
`

export default function PoolFinder() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
      pair &&
      JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
      JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)),
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <LightCard padding="45px 10px" style={{ background: '#ACB0D3' }}>
      <Text textAlign="center" color="textBlack" fontFamily="UbuntuBold" fontSize="20px">
        {!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
      </Text>
    </LightCard>
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Page>
      <AppBody>
        {currency0 && currency1 ? (
          <AppHeader title={t('import Pool')} importFlag="find" backTo="/pool" />
        ) :
          (
            <AppHeader title={t('Manage')} importFlag="find" backTo="/pool" />
          )
        }
        <AutoColumn style={{ padding: '1rem' }} gap="md">
          <InstructionMessage variant="warning" backColor='yellowLight'>
            <Text color="textBlack" fontFamily="Ubuntu" fontSize="18px">
              {t("Tip: Use this tool to find pairs that don't automatically appear in the interface")}
            </Text>
          </InstructionMessage>
        </AutoColumn>
        <AutoColumn style={{ padding: '1rem' }} gap="md">
          <StyledButton
            endIcon={<ChevronDownIcon />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN0)
            }}
          >
            {currency0 ? (
              <Row>
                <CurrencyLogo currency={currency0} />
                <Text ml="8px" fontFamily="UbuntuBold">{currency0.symbol}</Text>
              </Row>
            ) : (
              <Text ml="8px" fontFamily="UbuntuBold" style={{paddingRight:"27em"}} >{t('Select a Token')}</Text>
            )}
          </StyledButton>

          <ColumnCenter>
            <AddIcon />
          </ColumnCenter>

          <StyledButton
            endIcon={<ChevronDownIcon />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN1)
            }}
          >
            {currency1 ? (
              <Row>
                <CurrencyLogo currency={currency1} />
                <Text ml="8px" fontFamily="UbuntuBold">{currency1.symbol}</Text>
              </Row>
            ) : (
              <Text as={Row} fontFamily="UbuntuBold" style={{paddingRight:"27em"}} >{t('Select a Token')}</Text>
            )}
          </StyledButton>

          {hasPosition && (
            <ColumnCenter
              style={{ justifyItems: 'center', backgroundColor: '', padding: '12px 0px', borderRadius: '12px' }}
            >
              <Text textAlign="center" fontFamily="UbuntuBold">{t('Pool Found!')}</Text>
              <StyledInternalLink to="/pool">
                <Text textAlign="center" fontFamily="UbuntuBold">{t('Manage this pool.')}</Text>
              </StyledInternalLink>
            </ColumnCenter>
          )}

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <MinimalPositionCard pair={pair} />
              ) : (
                <LightCard padding="45px 10px" style={{background: '#ACB0D3'}}>
                  <AutoColumn gap="sm" justify="center">
                    <Text textAlign="center" fontFamily="UbuntuBold">{t('You don’t have liquidity in this pool yet.')}</Text>
                    <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                      <Text textAlign="center" fontFamily="UbuntuBold">{t('Add Liquidity')}</Text>
                    </StyledInternalLink>
                  </AutoColumn>
                </LightCard>
              )
            ) : validPairNoLiquidity ? (
              <LightCard padding="45px 10px" style={{background: '#ACB0D3'}}>
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center" fontFamily="UbuntuBold">{t('No pool found.')}</Text>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    {t('Create pool.')}
                  </StyledInternalLink>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.INVALID ? (
              <LightCard padding="45px 10px" style={{background: '#ACB0D3'}}>
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center" fontWeight={500} fontFamily="UbuntuBold">
                    {t('Invalid pair.')}
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.LOADING ? (
              <LightCard padding="45px 10px" style={{background: '#ACB0D3'}}>
                <AutoColumn gap="sm" justify="center" >
                  <Text textAlign="center" fontFamily="UbuntuBold">
                    {t('Loading')}
                    <Dots />
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : null
          ) : (
            prerequisiteMessage
          )}
        </AutoColumn>

        {/* <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        /> */}
      </AppBody>
    </Page>
  )
}
