import React, { useCallback, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@monsterswap/sdk'
import { Button, Text, Flex, AddRoundedIcon, CardBody, InstructionMessage, useModal } from 'uikit'
import { RouteComponentProps } from 'react-router-dom'
import AddRemoveSubNav from 'components/Menu/AddRemoveSubNav'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { useTranslation } from 'contexts/Localization'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled, { css } from 'styled-components'
import { LightCard, LightGreyCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { DoubleCurrencyLogo } from '../../components/Logo'
import { AppHeader, AppBody } from '../../components/App'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween } from '../../components/Layout/Row'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { ROUTER_ADDRESS } from '../../config/constants'
import { PairState } from '../../hooks/usePairs'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import Dots from '../../components/Loader/Dots'
import ConfirmAddModalBottom from './ConfirmAddModalBottom'
import { currencyId } from '../../utils/currencyId'
import PoolPriceBar from './PoolPriceBar'
import Page from '../Page'

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;
  position: absolute;
  left: 1.2rem;
  z-index: 999;
  top: -35px;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`


export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const { t } = useTranslation()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
    ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
      (currencyB && currencyEquals(currencyB, WETH[chainId]))),
  )

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error
  const criticalError = error && (error.includes("Insufficient") || error.includes("Invalid pair"))

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)
    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }
    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    console.log("[router]", args)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencies[Field.CURRENCY_A]?.symbol
              } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          })

          setTxHash(response.hash)
        }),
      )
      .catch((err) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error("[error]", err)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <Flex alignItems="center">
        <Text fontSize="48px" marginRight="10px" color="#110518" fontFamily="UbuntuBold">
          {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
        </Text>
        <DoubleCurrencyLogo
          currency0={currencies[Field.CURRENCY_A]}
          currency1={currencies[Field.CURRENCY_B]}
          size={30}
        />
      </Flex>
    ) : (
      <AutoColumn>
        <Flex alignItems="center">
          <Text fontSize="48px" marginRight="10px" color="#110518" fontFamily="UbuntuBold">
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </Flex>
        <Row>
          <Text fontSize="24px" color="#110518" fontFamily="UbuntuBold">
            {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}
          </Text>
        </Row>
        <Text small textAlign="left" fontStyle="italic" color="#110518" my="24px" fontFamily="UbuntuBold">
          {t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
            slippage: allowedSlippage / 100,
          })}
        </Text>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        history.replace(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.replace(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.replace(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.replace(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.replace(`/add/${currencyIdA || 'BNB'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB],
  )

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const [onPresentAddLiquidityModal] = useModal(
    <TransactionConfirmationModal
      title={noLiquidity ? t('You are creating a pool') : t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  return (
    <Page>
      <AppBody>
        <AppHeader
          subtitle={t('View Your Liquidity Positions >')}
        />
        <CardBody>
          <AutoColumn gap="20px">
            {/* {noLiquidity && (
              <ColumnCenter>
                <Message variant="warning">
                  <div>
                    <Text  fontFamily="UbuntuBold" bold mb="8px">
                      {t('You are the first liquidity provider.')}
                    </Text>
                    <Text fontFamily="UbuntuBold" mb="8px">{t('The ratio of tokens you add will set the price of this pool.')}</Text>
                    <Text fontFamily="UbuntuBold">{t('Once you are happy with the rate click supply to review.')}</Text>
                  </div>
                </Message>
              </ColumnCenter>
            )} */}
            <ColumnCenter>
              <InstructionMessage variant="warning" backColor="purpleLight">
                <div>
                  <Text color="textBlack" fontFamily="Ubuntu">
                    {t('Tip: When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.')}
                    </Text>
                </div>
              </InstructionMessage>
            </ColumnCenter>
            <ColumnCenter>
              <AddRemoveSubNav />
            </ColumnCenter>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <ColumnCenter style={{ position: 'relative' }}>
              <ArrowWrapper clickable>
                <AddRoundedIcon width="62px" />
              </ArrowWrapper>
            </ColumnCenter>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            >
              {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                <>
                  <Row width="100%" justify="center" padding="0 0 10px 0" >
                    <LightGreyCard padding="0.5rem" width="90%" borderRadius="10px" style={{ fontFamily: "Ubuntu" }}>
                      <PoolPriceBar
                        currencies={currencies}
                        poolTokenPercentage={poolTokenPercentage}
                        noLiquidity={noLiquidity}
                        price={price}
                      />
                    </LightGreyCard>
                  </Row>
                </>
              )}
            </CurrencyInputPanel>

            {addIsUnsupported ? (
              <Button disabled mb="4px">
                {t('Unsupported Asset')}
              </Button>
            ) : !account ? (
              <ConnectWalletButton buttonType="primary"/>
            ) : (
              <AutoColumn gap="md">
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <Button
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>{t('APPROVING %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                          ) : (
                            t('APPROVE %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                          )}
                        </Button>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <Button
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}
                          width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>{t('APPRIVING %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                          ) : (
                            t('APPROVE %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                          )}
                        </Button>
                      )}
                    </RowBetween>
                  )}
                <Button
                  variant={
                    !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                      ? 'danger'
                      : 'primary'
                  }
                  onClick={() => {
                    if (expertMode) {
                      onAdd()
                    } else {
                      onPresentAddLiquidityModal()
                    }
                  }}
                  disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                  style={{
                    background: (!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED) ? (criticalError ? "#E25656" : "#E9EAEB") : "#4E4E9D",
                    color: (!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED) ? (criticalError ? "#FFF" : "#BDC2C4") : "#FFF",
                    fontSize:'25px',
                    height:'60px'
                  }}
                >
                  {error ?? t('Supply')}
                </Button>
              </AutoColumn>
            )}
          </AutoColumn>
        </CardBody>
      </AppBody>
      {!addIsUnsupported ? (
        pair && !noLiquidity && pairState !== PairState.INVALID ? (
          <AutoColumn style={{ minWidth: '20rem', width: '40%', marginTop: '1rem' }}>
            <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
          </AutoColumn>
        ) : null
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
      )}
    </Page>
  )
}
