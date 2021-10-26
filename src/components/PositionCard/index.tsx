import React, { useState } from 'react'
import { JSBI, Pair, Percent } from '@monsterswap/sdk'
import { Button, Text, ChevronUpIcon, ChevronDownIcon, Card, CardBody, Flex, CardProps, AddIcon } from 'uikit'
import { Link } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTotalSupply from '../../hooks/useTotalSupply'

import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed, } from '../Layout/Row'
import { BIG_INT_ZERO } from '../../config/constants'
import Dots from '../Loader/Dots'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const theme = useTheme()

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <Card style={{ background: theme.colors.purpleLight }}>
          <CardBody>
            <RowBetween style={{ gap: "10px" }}>
              <AutoColumn gap="4px" style={{ width: "50%" }}>
                <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                  <RowFixed>
                    <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                    <Text small color="textSubtle" fontFamily="Ubuntu">
                      {currency0.symbol}-{currency1.symbol} LP
                    </Text>
                  </RowFixed>
                  <RowFixed>
                    <Text fontFamily="Ubuntu">{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                  </RowFixed>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="textSubtle" small fontFamily="Ubuntu">
                    {t('Share of Pool')}:
                  </Text>
                  <Text fontFamily="Ubuntu">{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow>
              </AutoColumn>
              <AutoColumn gap="4px" style={{ width: "50%" }}>
                <FixedHeightRow>
                  <Text color="textSubtle" small fontFamily="Ubuntu">
                    {t('Pooled %asset%', { asset: currency0.symbol })}:
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text ml="6px" fontFamily="Ubuntu">{token0Deposited?.toSignificant(6)}</Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="textSubtle" small fontFamily="Ubuntu">
                    {t('Pooled %asset%', { asset: currency1.symbol })}:
                  </Text>
                  {token1Deposited ? (
                    <RowFixed>
                      <Text ml="6px" fontFamily="Ubuntu">{token1Deposited?.toSignificant(6)}</Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
              </AutoColumn>
            </RowBetween>
          </CardBody>
        </Card>
      ) : (
        <LightCard style={{ background: theme.colors.purpleLight }}>
          <Text fontSize="14px" color="#110518" fontFamily="Ubuntu" style={{ textAlign: 'left', display: "inline" }}>
            <span style={{ color: "#F0B90B", fontFamily: "Ubuntu" }}>
              *
            </span>{' '}
            <span style={{ fontFamily: "Ubuntu" }}>
              {t(
                " By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. ",
              )}
            </span>
            <span style={{ color: "#F0B90B", fontFamily: "Ubuntu" }}>
              {t(" Learn more")}
            </span>{' '}
          </Text>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, ...props }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  console.log("[totalPooltokens]", totalPoolTokens, userPoolBalance.toSignificant(4))

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined]

  return (
    <Card style={{ borderRadius: '12px' }} {...props}>
      <Flex justifyContent="space-between" role="button" onClick={() => setShowMore(!showMore)} p="16px">
        <Flex flexDirection="column">
          <Flex alignItems="center" mb="4px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text fontFamily="UbuntuBold" ml="8px" color="textBlack">
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>

        </Flex>
        <Text ml="8px" color="textBlack" fontFamily="Ubuntu">
          Manage
        </Text>
      </Flex>

      {showMore && (
        <AutoColumn gap="8px" style={{ marginTop:'-1.8em',padding: '16px' }}>
          <FixedHeightRow>
            <Text fontFamily="UbuntuBold" color="textBlack">
              Your total pool tokens
            </Text>
            {token0Deposited ? (
              <RowFixed>
                <Text fontFamily="UbuntuBold" color="textBlack" ml="6px">
                  {userPoolBalance?.toSignificant(4)}
                </Text>
              </RowFixed>

            ) : (
              '-'
            )}
          </FixedHeightRow>
          <FixedHeightRow>
            <Text fontFamily="UbuntuBold" color="textBlack">
              Pooled {currency0.symbol}
            </Text>
            {token0Deposited ? (
              <RowFixed>
                <Text fontFamily="UbuntuBold" color="textBlack" ml="6px">{token0Deposited?.toSignificant(6)}</Text>
                &nbsp;
                <CurrencyLogo size="20px" currency={currency0} />
              </RowFixed>

            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <Text fontFamily="UbuntuBold" color="textBlack">
              Pooled {currency1.symbol}
            </Text>
            {token1Deposited ? (
              <RowFixed>
                <Text fontFamily="UbuntuBold" color="textBlack" ml="6px">{token1Deposited?.toSignificant(6)}</Text>
                &nbsp;
                <CurrencyLogo size="20px" currency={currency1} />
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <Text fontFamily="UbuntuBold" color="textBlack">Share of pool</Text>
            <Text fontFamily="UbuntuBold" color="textBlack" ml="6px">
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
            <Flex justifyContent="space-between">
              <Button
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="primary"
                width="100%"
                style={{ marginRight: "0.5em" }}
              >
                Add liquidity
              </Button>
              <Button
                as={Link}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="primary"
                width="100%"
                mb="8px"
                style={{ marginLeft: "0.5em" }}
              >
                Remove liquidity
              </Button>
              
            </Flex>
          )}
        </AutoColumn>
      )}
    </Card>
  )
}
