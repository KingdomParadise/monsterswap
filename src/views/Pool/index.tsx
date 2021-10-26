import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Pair } from '@monsterswap/sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, InstructionMessage } from 'uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { ColumnCenter } from '../../components/Layout/Column'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

const Body = styled(CardBody)`
  
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
  console.log("[v2Pairs]", allV2PairsWithLiquidity, trackedTokenPairs)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <div style={{ marginLeft: '1em', marginRight: '1em', border: '1px solid', borderRadius: '10px', paddingTop: '1em', paddingBottom: '1em' }}>
            <Dots>{t('Loading')}</Dots>
          </div>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader subtitle={t('View Your Liquidity Positions >')} />

        <Body>
          <ColumnCenter>
            <InstructionMessage variant="warning" backColor="purpleLight">
              <div>
                <Text color="textBlack" fontFamily="UbuntuBold" fontSize="20px">
                  {t('Liquidity Provider Rewards')}
                </Text>
                <Text color="textBlack" fontFamily="Ubuntu" style={{ textAlign: 'left', display: "inline" }}>
                  <span style={{ fontFamily: "Ubuntu", fontSize:'13px' }} >
                    {t('Liquidity providers earn a free on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.')}
                  </span>
                  <span style={{ fontFamily: "Ubuntu", fontWeight: "bold", fontSize:'13px' }}>Learn more</span>
                </Text>
              </div>
            </InstructionMessage>
          </ColumnCenter>
          <Flex justifyContent="space-between" p="16px">
            <Text fontFamily="UbuntuBold" fontSize="20px" color="textBlack">
              {t('Your Liqidity Positions')}
            </Text>
            <Text color="textBlack" fontFamily="Ubuntu" style={{ textAlign: 'left', display: "inline" }}>
              <span style={{ fontFamily: "Ubuntu" }}>
                {t("Don't see a pool you joined?")}
              </span>{' '}
              <a style={{ fontFamily: "Ubuntu", fontWeight: "bold" }} href="/find">Import it</a>
            </Text>
          </Flex>
          {renderBody()}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Flex justifyContent="space-between" p="16px">
            <Button id="join-pool-button" as={Link} to="/add" width="100%" style={{ marginRight: "0.5em" }}>
              {t('Add Liquidity')}
            </Button>
            <Button id="join-pool-button"  variant="secondary" width="100%" style={{ marginLeft: "0.5em" }}>
              {t('Create a Pair')}
            </Button>
          </Flex>
        </CardFooter>
      </AppBody>
    </Page>
  )
}
