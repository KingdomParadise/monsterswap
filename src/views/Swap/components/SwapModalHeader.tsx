import React, { useMemo } from 'react'
import { Trade, TradeType } from '@monsterswap/sdk'
import { Button, Text, ErrorIcon, ArrowDownIcon } from 'uikit'
import { Field } from 'state/swap/actions'
import { isAddress, shortenAddress } from 'utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="40px" style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize="30px"
            fontFamily="UbuntuBold"
            fontWeight = "bold"
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="30px" fontFamily="UbuntuBold" fontWeight = "bold" ml="10px">
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownIcon width="16px" ml="4px" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="40px" style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize="30px"
            fontFamily="UbuntuBold"
            fontWeight = "bold"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? 'primary'
                : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="30px" fontFamily="UbuntuBold" fontWeight = "bold" ml="10px">
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold> Price Updated</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>Accept</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px', width:'25em' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%',fontSize:'15px', fontFamily: 'UbuntuBold',
          fontStyle:'italic' }}>
            {`Output is estimated. You will receive at least `}
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            {' or the transaction will revert.'}
          </Text>
        ) : (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%', fontSize:'15px', fontFamily: 'UbuntuBold',
          fontStyle:'italic' }}>
            {`Input is estimated. You will sell at most `}
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            {' or the transaction will revert.'}
          </Text>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
