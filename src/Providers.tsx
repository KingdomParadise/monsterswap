import React from 'react'
import { MoralisProvider } from "react-moralis";
import { ModalProvider, light, dark } from 'uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { useThemeManager } from 'state/user/hooks'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ToastsProvider } from 'contexts/ToastsContext'
import store from 'state'

const ThemeProviderWrapper = (props) => {
  const [isDark] = useThemeManager()
  return <ThemeProvider theme={isDark ? dark : light} {...props} />
}

const Providers: React.FC = ({ children }) => {
  const appId = process.env.REACT_APP_MORALIS_APP_ID
  const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ToastsProvider>
          <HelmetProvider>
            <ThemeProviderWrapper>
              <LanguageProvider>
                <RefreshContextProvider>
                  <ModalProvider>
                    <MoralisProvider appId={ appId } serverUrl={ serverUrl } >{children}</MoralisProvider>
                  </ModalProvider>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeProviderWrapper>
          </HelmetProvider>
        </ToastsProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
