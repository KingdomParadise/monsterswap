import React from 'react'
import { Currency, Pair } from '@monsterswap/sdk'
import { Button, ChevronDownIcon, Text, SupperText, useModal, Flex } from 'uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { RowBetween } from '../Layout/Row'
import { Input as NumericalInput } from './NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: ${({ selected }) => (selected ? '1rem 0.5rem 1rem 1rem' : '1rem 0.75rem 1rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0 0.5rem;
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
`
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`
const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.purpleLight};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`
interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onUserInputNumberValue?: (value: number) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  showText?: string
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean,
  children?: React.ReactNode
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onUserInputNumberValue,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  showText = "",
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  children,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()
  const translatedLabel = label || t('Input')

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )
  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {/* {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontSize="14px">{translatedLabel}</Text>
              {account && (
                <Text onClick={onMax} fontSize="14px" style={{ display: 'inline', cursor: 'pointer' }}>
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? t('Balance: %amount%', { amount: selectedCurrencyBalance?.toSignificant(6) ?? '' })
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )} */}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {showText === "" ? (
            <CurrencySelectButton
              selected={!!currency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  onPresentCurrencyModal()
                }
              }}
            >
              <Flex alignItems="center" justifyContent="space-between">
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={55} margin />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="55px" style={{ marginRight: '8px' }} />
                ) : null}
                {pair ? (
                  <Text id="pair">
                    {account && currency && (
                      <RowBetween>
                        <Text fontSize="10px" fontFamily="UbuntuBold">{translatedLabel}</Text>
                      </RowBetween>
                    )}
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text id="pair"
                    color = "textBlack"
                    fontFamily="UbuntuBold"
                    fontSize="22px"
                    width={(currency && currency.symbol ? '' : "5.5em")}
                    bold>
                    {account && currency && (
                      <RowBetween>
                        <Text fontSize="10px" fontFamily="UbuntuBold">{translatedLabel}</Text>
                      </RowBetween>
                    )}
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                      : currency?.symbol) || t('Select a currency')}
                  </Text>
                )}
                {!disableCurrencySelect && <ChevronDownIcon />}
              </Flex>
            </CurrencySelectButton>
          ) : (
            <Text id="pair" fontFamily="UbuntuBold" fontSize="22px" bold>
              {t('Amount to Remove')}
            </Text>
          )}
          {!hideInput && (
            <>
              {showText === "" ? (
                <>
                  {showMaxButton ?
                    <div style={{ width: '60%' }}>
                      <SupperText onClick={onMax} >
                        {t('Max')}
                      </SupperText>
                      <NumericalInput
                        className="token-amount-input"
                        value={value}
                        style={{ paddingLeft: '3em',paddingRight:'123px' }}
                        onUserInput={(val) => {
                          onUserInput(val)
                        }}
                      />
                      {account && (
                        <Text onClick={onMax} fontSize="14px" fontFamily="UbuntuBold" style={{ display: 'inline', cursor: 'pointer',position:'absolute',right:'1em',top:'2.8em', color:'#000000'}}>
                          {!hideBalance && !!currency && selectedCurrencyBalance
                            ? t('Balance: %amount%', { amount: selectedCurrencyBalance?.toSignificant(6) ?? '' })
                            : ' -'}
                        </Text>
                      )}
                    </div>
                    :
                    <div style={{ width: '60%' }}>
                      <NumericalInput
                        className="token-amount-input"
                        value={value}
                        style={{paddingRight:'123px' }}
                        onUserInput={(val) => {
                          onUserInput(val)
                        }}
                      />
                      {account && (
                        <Text onClick={onMax} fontSize="14px" fontFamily="UbuntuBold" style={{ display: 'inline', cursor: 'pointer',position:'absolute',right:'1em',top:'2.8em', color:'#000000'}}>
                          {!hideBalance && !!currency && selectedCurrencyBalance
                            ? t('Balance: %amount%', { amount: selectedCurrencyBalance?.toSignificant(6) ?? '' })
                            : ' -'}
                        </Text>
                      )}
                    </div>
                  }

                </>
              ) : (
                <>
                  {showMaxButton ?
                    <div style={{ width: '60%' }}>
                      <SupperText onClick={onMax} >
                        {t('Max')}
                      </SupperText>
                      <NumericalInput
                        className="token-amount-input"
                        value={value}
                        style={{ paddingLeft: '3em',paddingRight:'123px' }}
                        onUserInput={(val) => {
                          onUserInputNumberValue(Number(val))
                        }}
                      />
                      {account && (
                        <Text onClick={onMax} fontSize="14px" fontFamily="UbuntuBold" style={{ display: 'inline', cursor: 'pointer',position:'absolute',right:'1em',top:'2.8em', color:'#000000'}}>
                          {!hideBalance && !!currency && selectedCurrencyBalance
                            ? t('Balance: %amount%', { amount: selectedCurrencyBalance?.toSignificant(6) ?? '' })
                            : ' -'}
                        </Text>
                      )}
                    </div>
                    :
                    <div style={{ width: '60%' }}>
                      <NumericalInput
                        className="token-amount-input"
                        value={value}
                        style={{paddingRight:'123px' }}
                        onUserInput={(val) => {
                          onUserInputNumberValue(Number(val))
                        }}
                      />
                      {account && (
                        <Text onClick={onMax} fontSize="14px" fontFamily="UbuntuBold" style={{ display: 'inline', cursor: 'pointer',position:'absolute',right:'1em',top:'2.8em', color:'#000000'}}>
                          {!hideBalance && !!currency && selectedCurrencyBalance
                            ? t('Balance: %amount%', { amount: selectedCurrencyBalance?.toSignificant(6) ?? '' })
                            : ' -'}
                        </Text>
                      )}
                    </div>
                  }
                </>
              )}
            </>
          )}
        </InputRow>
        {children}
      </Container>
    </InputPanel>
  )
}
