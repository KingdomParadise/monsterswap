import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType } from '@monsterswap/sdk'
import { Button, Text, AutoRenewIcon } from 'uikit'
import { Field } from 'state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

const SwapModalFooterContainer = styled(AutoColumn)`
  padding: 16px 0px;
  line-height:2em;
`

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
          <Text fontSize="17px" fontFamily ="UbuntuBold" >Price</Text>
          <Text
            fontSize="17px"
            fontFamily ="UbuntuBold"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            <p style = {{fontFamily:"UbuntuBold"}}>
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)} style={{border:'1px solid', background:'#b5aeb5'}}>
              <AutoRenewIcon width="17px" />
            </StyledBalanceMaxMini>
            </p>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="17px" fontFamily ="UbuntuBold">
              {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </Text>
            <QuestionHelper
              text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
              ml="4px"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="17px" fontFamily ="UbuntuBold">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="17px" fontFamily ="UbuntuBold" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="17px" fontFamily ="UbuntuBold">Price Impact</Text>
            <QuestionHelper text="The difference between the market price and your price due to trade size." ml="4px" />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="17px" fontFamily ="UbuntuBold">Liquidity Provider Fee</Text>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">For each trade a 0.25% fee is paid</Text>
                  <Text>- 0.17% to LP token holders</Text>
                  <Text>- 0.03% to the Treasury</Text>
                  <Text>- 0.05% towards CAKE buyback and burn</Text>
                </>
              }
              ml="4px"
            />
          </RowFixed>
          <Text fontSize="17px" fontFamily ="UbuntuBold">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
          style={{fontSize:'23px'}}
        >
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
