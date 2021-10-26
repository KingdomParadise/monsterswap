import { Currency, CurrencyAmount, Fraction, Percent } from '@monsterswap/sdk'
import React from 'react'
import { Button, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { RowBetween, RowFixed } from '../../components/Layout/Row'
import { CurrencyLogo } from '../../components/Logo'
import { Field } from '../../state/mint/actions'

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  return (
    <>
      <RowBetween>
        <Text fontFamily="UbuntuBold" color="#110518">{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Text>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <Text fontFamily="UbuntuBold" color="#110518">{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Text fontFamily="UbuntuBold" color="#110518">{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Text>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <Text fontFamily="UbuntuBold" color="#110518">{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Text fontFamily="UbuntuBold" color="#110518">{t('Rates')}</Text>
        <Text fontFamily="UbuntuBold" color="#110518">
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </Text>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <Text fontFamily="UbuntuBold" color="#110518">
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </Text>
      </RowBetween>
      <RowBetween>
        <Text fontFamily="UbuntuBold" color="#110518">{t('Share of Pool')}:</Text>
        <Text fontFamily="UbuntuBold" color="#110518">{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
      </RowBetween>
      <Button onClick={onAdd} mt="20px" width="100%">
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
      </Button>
    </>
  )
}

export default ConfirmAddModalBottom
