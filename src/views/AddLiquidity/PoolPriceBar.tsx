import { Currency, Percent, Price } from '@monsterswap/sdk'
import React from 'react'
import { Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from '../../components/Layout/Column'
import { AutoRow } from '../../components/Layout/Row'
import { ONE_BIPS } from '../../config/constants'
import { Field } from '../../state/mint/actions'

function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { t } = useTranslation()
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-between" gap="4px">
        <Text fontFamily="UbuntuBold"> { t('Current Rate')} </Text>
        <AutoRow width="50%" justify="flex-end">
          <Text fontFamily="UbuntuBold">{price?.toSignificant(6) ?? '-'} &nbsp;</Text>
          <Text fontSize="14px" fontFamily="UbuntuBold" pt={1}>
            {t('%assetA% per %assetB%', {
              assetA: currencies[Field.CURRENCY_B]?.symbol ?? '',
              assetB: currencies[Field.CURRENCY_A]?.symbol ?? '',
            })}
          </Text>
        </AutoRow>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar
