import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Monsterswap',
  description: 'The most popular AMM on BSC by user count! Earn MONSTER through yield farming.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('MonsterSwap')}`,
      }
    case '/portfolio':
      return {
        title: `${t('Portfolio')} | ${t('MonsterSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('MonsterSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('MonsterSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('MonsterSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('MonsterSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('MonsterSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('MonsterSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('MonsterSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('MonsterSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('MonsterSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('MonsterSwap')}`,
      }
    default:
      return null
  }
}
