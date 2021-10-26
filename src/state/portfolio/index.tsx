import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PortfolioState } from 'state/types'

const initialState: PortfolioState = {
  lpPriceData: [],
  userDataLoaded: false
}

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setLpPrice: (state, action) => {
      if (state.lpPriceData.length > 0) {
        const f = state.lpPriceData.findIndex((item) => item.lpSymbol === action.payload.lpSymbol)
        if (f !== -1) {
          state.lpPriceData[f] = { ...state.lpPriceData[f], stakedLpPrice: action.payload.stakedLpPrice }
        } else {
          state.lpPriceData.push({
            lpSymbol: action.payload.lpSymbol,
            stakedLpPrice: action.payload.stakedLpPrice,
          })
        }
      } else {
        state.lpPriceData.push({
          lpSymbol: action.payload.lpSymbol,
          stakedLpPrice: action.payload.stakedLpPrice,
        })
      }
    },
  },
})

// Actions
export const { setLpPrice } = portfolioSlice.actions

export default portfolioSlice.reducer
