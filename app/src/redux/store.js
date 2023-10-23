import { configureStore } from '@reduxjs/toolkit'
import storyReducer from './newsItemsSlice'

const store = configureStore({
  reducer: storyReducer,

})


export default store