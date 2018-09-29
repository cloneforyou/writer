import * as MODEL from '../../model';

import update from 'immutability-helper';
import { Reducer, Action, AnyAction } from 'redux';

import { ActionTypes, saveStorybooksAction } from '../actions/index'
import { STATE } from './state';
import { DRAG_TYPES } from '../constants/types';

const INITIAL_STATE: STATE.StorybooksState = {
  loading: false,
  orders: {},
  list: []
}



const storybooks_reducer: Reducer<STATE.StorybooksState, AnyAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.LOADING_STORY: {

      let nextstate = update(state, {
        loading: {
          $set: action.loading as boolean
        }
      });
      return nextstate;
    }
    case ActionTypes.STORE_ALL_STORY_BOOKS:
      let data = (<saveStorybooksAction>action).data;

      //sort storybooks
      let orders = data.orders;
      data.list.sort((a: MODEL.Storybook, b: MODEL.Storybook) => orders[a._id] - orders[b._id]);

      let nextstate = update(state, {
        orders: {
          $set: data.orders
        },
        list: {
          $set: data.list
        }
      });
      return nextstate;

    case ActionTypes.CREATE_STORYBOOK: {
      let data: MODEL.Storybook = action.data;
      let id = data._id;
      // resort orders
      let $orders = JSON.parse(JSON.stringify(state.orders));
      for (let key in $orders) {
        $orders[key] += 1;
      }
      $orders[id] = 0;

      let nextstate = update(state, {
        orders: {
          $set: $orders
        },
        list: {
          $unshift: [data]
        }
      });
      return nextstate;
    }

    case ActionTypes.DELETE_STORYBOOK: {
      let data = action.data;
      let id: string = data._id;
      // resort orders
      let $orders = JSON.parse(JSON.stringify(state.orders));
      let orderToUpdate: number = $orders[id];

      for (let key in $orders) {
        if ($orders[key] > orderToUpdate) {
          $orders[key] -= 1;
        }
      }
      delete $orders[id];

      let nextstate = update(state, {
        orders: {
          $set: $orders
        },
        list: {
          $splice: [[orderToUpdate, 1]]
        }
      });
      return nextstate;
    }

    case ActionTypes.UPDATE_STORYBOOK: {
      let data = action.data;
      let id: string = data._id;
      // resort orders
      let $orders = JSON.parse(JSON.stringify(state.orders));
      let orderToUpdate: number = $orders[id];

      let nextstate = update(state, {
        list: {
          [orderToUpdate]: {
            $merge: data
          }
        }
      });
      return nextstate;
    }

    case ActionTypes.DRAG_STORYBOOK: {
      let data: { source: string, target: string } = action.data;

      // orgin orders
      let $orders = state.orders;
      let sourceIndex: number = $orders[data.source];
      let targetIndex: number = $orders[data.target];

      let $list = state.list.slice();

      let item = $list.splice(sourceIndex, 1)[0];

      $list.splice(targetIndex, 0, item);


      //rebuild $orders
      $orders = {};
      $list.forEach((item, index) => {
        $orders[item._id] = index;
      })
      let nextstate = update(state, {
        orders: {
          $set: $orders
        },
        list: {
          $set: $list
        }
      });
      return nextstate;
    }
    default:
      return state;
  }
};

export default storybooks_reducer;