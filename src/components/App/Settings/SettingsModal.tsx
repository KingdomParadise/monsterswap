import React, { useState, useEffect } from 'react'
import { Button, Text, PancakeToggle, Flex, Message, Modal, ModalBody, InjectedModalProps } from 'uikit'
import {
  useAudioModeManager,
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  useUserToggleChart,
  useUserChartSizeLarge,
} from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'

import { useSwapActionHandlers } from 'state/swap/hooks'
import { AutoColumn } from '../../Layout/Column'
import QuestionHelper from '../../QuestionHelper'
import { RowBetween, RowFixed } from '../../Layout/Row'
import TransactionSettings from './TransactionSettings'

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [ttl, setTtl] = useUserTransactionTTL()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [toggleChart, setToggleChart] = useUserToggleChart()
  const [chartSizeLarge, setChartSizeLarge] = useUserChartSizeLarge()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  const { onChangeRecipient } = useSwapActionHandlers()
  const [modalPosition, setModalPosition]=useState([])
  const { t } = useTranslation()
  useEffect(()=>{
    const setButton = document.getElementById('open-settings-dialog-button').getBoundingClientRect()
    setModalPosition([setButton.bottom,window.innerWidth-setButton.right]);
  },[])
  if (showConfirmExpertModal) {
    return (
      <Modal
        title={t('Are you sure?')}
        onBack={() => setShowConfirmExpertModal(false)}
        onDismiss={onDismiss}
        style={{ maxWidth: '420px' }}
      >
        <ModalBody>
            <Text fontFamily='Ubuntu' style={{color:'black', fontSize:'19px'}}>
              {t(
                "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
              )}
            </Text>
            <br/>
          <Text mb="24px" style={{fontFamily:'fangsong' ,color:'black', fontSize:'19px', fontWeight:'bold', textTransform:'uppercase'}}>{t('Only use this mode if you know what you’re doing.')}</Text>
          <Button
            variant="danger"
            id="confirm-expert-mode"
            style={{background:'#e25656'}}
            onClick={() => {
              // eslint-disable-next-line no-alert
              if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                toggleExpertMode()
                setShowConfirmExpertModal(false)
              }
            }}
          >
            {t('Turn On Expert Mode')}
          </Button>
        </ModalBody>
      </Modal>
    )
  }

  return (
    <Modal id="setting-modal" title={t('Transaction Settings')} style={{position:'absolute',maxWidth:'500px', right: modalPosition[1], top:modalPosition[0]}} headerBackground="#EAF2F7" onDismiss={onDismiss}>
      <ModalBody style={{overflow: "hidden"}}>
        <AutoColumn gap="md" style={{ padding: '0 1rem 1rem 1rem' }}>
          <TransactionSettings
            rawSlippage={userSlippageTolerance}
            setRawSlippage={setUserslippageTolerance}
            deadline={ttl}
            setDeadline={setTtl}
          />
          <Text color="#110518" bold fontSize="22px" mt="32px" fontFamily="UbuntuBold">
            {t('Interface Settings')}
          </Text>
          <RowBetween>
            <RowFixed>
              <Text color="#110518" fontSize="15px" fontFamily="UbuntuBold">{t('Toggle Chart')}</Text>
            </RowFixed>
            <PancakeToggle
              id="toggle-chart-button"
              checked={toggleChart}
              onChange={() => {
                setToggleChart(!toggleChart)
              }}
            />
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text color="#110518" fontSize="15px" fontFamily="UbuntuBold">{t('Toggle Chart Size Large')}</Text>
            </RowFixed>
            <PancakeToggle
              id="toggle-chart-size-large-button"
              checked={chartSizeLarge}
              onChange={() => {
                setChartSizeLarge(!chartSizeLarge)
              }}
            />
          </RowBetween>
          {/* <RowBetween>
            <RowFixed>
              <Text fontSize="18px" fontFamily="UbuntuBold">{t('Audio')}</Text>
            </RowFixed>
            <PancakeToggle checked={audioPlay} onChange={toggleSetAudioMode} />
          </RowBetween> */}
          <RowBetween>
            <RowFixed>
              <Text color="#110518" fontSize="15px" fontFamily="UbuntuBold">{t('Toggle Expert Mode')}</Text>
            </RowFixed>
            <PancakeToggle
              id="toggle-expert-mode-button"
              checked={expertMode}
              onChange={
                expertMode
                  ? () => {
                      onChangeRecipient(null)
                      toggleExpertMode()
                    }
                  : () => setShowConfirmExpertModal(true)
              }
            />
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <Text color="#110518" fontSize="15px" fontFamily="UbuntuBold">{t('Disable Multihops')}</Text>
            </RowFixed>
            <PancakeToggle
              id="toggle-disable-multihop-button"
              checked={singleHopOnly}
              onChange={() => {
                setSingleHopOnly(!singleHopOnly)
              }}
            />
          </RowBetween>
        </AutoColumn>
      </ModalBody>
    </Modal>
  )
}

export default SettingsModal
