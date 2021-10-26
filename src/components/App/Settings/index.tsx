import React from 'react'
import { Button, SettingIcon, NotificationDot, useModal } from 'uikit'
import { useExpertModeManager } from 'state/user/hooks'
import SettingsModal from './SettingsModal'

export default function SettingsTab() {
  
  const [onPresentSettingsModal] = useModal(<SettingsModal />)
  const [expertMode] = useExpertModeManager()

  return (
    <NotificationDot show={expertMode}>
      <Button variant="text" p={0} onClick={onPresentSettingsModal} id="open-settings-dialog-button">
        <SettingIcon color="#4E4E9D" width="30px" />
      </Button>
    </NotificationDot>
  )
}
