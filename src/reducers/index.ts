import { combineReducers } from 'redux'
import { loadingBarReducer } from 'react-redux-loading-bar'

import common from './common';
import storybooks from './storybooks'
import folders from './folder';
let writer = combineReducers({
  common,
  storybooks,
  folders,
  loadingBar: loadingBarReducer,
})
// store
export default writer;