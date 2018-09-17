import update from 'immutability-helper';


const DEFAULT_LAYOUT = {
  font: 'simsun',
  fontWeight: '600',
  layoutHorizon: false,
  backgroundColor: '#ffffff',
  revert2white: false,
  showCover: false,
}

const INSTANT_LAYOUT_NAME = 'instant_layout';

function $getInstantLayout() {
  let string = localStorage.getItem(INSTANT_LAYOUT_NAME);
  if (!string) {
    return DEFAULT_LAYOUT;
  }
  return JSON.parse(string);
}
function $setInstantLayout(layout: {}) {
  localStorage.setItem(INSTANT_LAYOUT_NAME, JSON.stringify(layout));
}

import { HIDE_MAIN_NAV } from '../actions'

const layout = (layout = $getInstantLayout(), action: { type: string, prop: string, value: string }) => {
  switch (action.type) {
    case HIDE_MAIN_NAV:
      let nextLayout = update(layout, {
        [action.prop]: {
          $set: action.value
        }
      });
      $setInstantLayout(nextLayout);
      return nextLayout;

    default:

      return layout
  }
}

export default layout