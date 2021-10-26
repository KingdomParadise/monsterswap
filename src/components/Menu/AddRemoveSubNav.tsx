import React from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'uikit'
import { useTranslation } from 'contexts/Localization'

const StyledNav = styled.nav`
  margin-bottom: 0px;
  width: 100%;
`

const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes('/pool') ||
    pathname.includes('/create') ||
    pathname.includes('/add') ||
    pathname.includes('/find') ||
    pathname.includes('/liquidity')
  ) {
    return 0
  }
  return 1
}

interface IAddRemoveNav {
  currencyIdA: string
  currencyIdB: string
}

const AddRemoveNav = () => {
  const location = useLocation()
  const { currencyIdA, currencyIdB } = useParams<IAddRemoveNav>()
  const { t } = useTranslation()
  return (
    <>
    { currencyIdA && currencyIdB && currencyIdA !== 'undefined' && currencyIdB !== 'undefined' && 
      <StyledNav>
        <ButtonMenu activeIndex={getActiveIndex(location.pathname)} fullWidth variant="subtle">
          <ButtonMenuItem id="swap-nav-link" to={`/add/${currencyIdA}/${currencyIdB}`} as={Link}>
            {t('Add')}
          </ButtonMenuItem>
          <ButtonMenuItem id="pool-nav-link" to={`/remove/${currencyIdA}/${currencyIdB}`} as={Link}>
            {t('Remove')}
          </ButtonMenuItem>
        </ButtonMenu>
      </StyledNav>
    }
    </>
  )
}

export default AddRemoveNav
