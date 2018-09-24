import { combineReducers } from 'redux'

import common from './common';
import storybooks from './storybooks'
let writer = combineReducers({
  common,
  storybooks,
})
// store
export default writer;