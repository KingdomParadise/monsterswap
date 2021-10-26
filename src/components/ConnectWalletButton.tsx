import React from 'react'
import { Button, useWalletModal } from 'uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const { btnText } = props;
  let { buttonType } = props;

  if (!buttonType) {
    buttonType = `${btnText ? 'secondary' : 'success'}`
  }
  return (
    <Button onClick={onPresentConnectModal} {...props} variant={buttonType}>
      {btnText || t('Connect')}
    </Button>
  )
}

export default ConnectWalletButton
