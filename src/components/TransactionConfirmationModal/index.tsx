import React, { useCallback } from 'react'
import { ChainId, Currency, Token } from '@monsterswap/sdk'
import styled from 'styled-components'
import {
  Button,
  Text,
  ErrorIcon,
  ArrowUpRoundIcon,
  MetamaskIcon,
  Flex,
  Box,
  Spinner,
  Modal,
  InjectedModalProps,
} from 'uikit'
import { registerToken } from 'utils/wallet'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { RowFixed } from '../Layout/Row'
import { AutoColumn, ColumnCenter } from '../Layout/Column'
import { getBscScanLink } from '../../utils'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
  height: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
`

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <ConfirmedIcon>
        <Spinner />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        <Text fontFamily="UbuntuBold" fontSize="22px" color="#110518">{t('Waiting For Confirmation')}</Text>
        <AutoColumn gap="12px" justify="center">
          <Text bold small textAlign="center" fontFamily="UbuntuBold">
            {pendingText}
          </Text>
        </AutoColumn>
        <Text small color="textSubtle" fontFamily="Ubuntu" textAlign="center">
          {t('Confirm this transaction in your wallet')}
        </Text>
      </AutoColumn>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  const { library } = useActiveWeb3React()

  const { t } = useTranslation()

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)

  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          <ArrowUpRoundIcon strokeWidth={0.5} width="90px" color="#EAF2F7" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <Text fontFamily="UbuntuBold" fontSize="20px" color="#110518" >{t('Transaction Submitted')}</Text>
          {chainId && hash && (
            <a href={getBscScanLink(hash, 'transaction', chainId)} target="_blank" rel="noreferrer" style={{fontFamily: 'Ubuntu', color: '#524F9E'}}>
              {t('View on BscScan')}
            </a>
          )}
          {currencyToAdd && library?.provider?.isMetaMask && (
            <Button
              variant="tertiary"
              mt="12px"
              width="fit-content"
              onClick={() => registerToken(token.address, token.symbol, token.decimals)}
            >
              <RowFixed style={{fontFamily: 'Ubuntu'}} >
                {t('Add %asset% to Metamask', { asset: currencyToAdd.symbol })}
                <MetamaskIcon width="16px" ml="6px" />
              </RowFixed>
            </Button>
          )}
          <Button onClick={onDismiss} mt="20px">
            {t('Close')}
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Wrapper>
      <Box>{topContent()}</Box>
      <Box>{bottomContent()}</Box>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <AutoColumn justify="center">
        <ErrorIcon color="failure" width="64px" />
        <Text color="failure" style={{ textAlign: 'center', fontFamily:'UbuntuBold', width: '85%' }}>
          {message}
        </Text>
      </AutoColumn>

      <Flex justifyContent="center" pt="24px">
        <Button onClick={onDismiss} style={{padding:'0em 5em'}}>{t('Dismiss')}</Button>
      </Flex>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    <Modal title={title} headerBackground="#EAF2F7" onDismiss={handleDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
