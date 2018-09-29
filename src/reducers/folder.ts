/// <reference path="./state.ts" />
import * as MODEL from '../../model';

import update from 'immutability-helper';
import { Reducer, Action, AnyAction } from 'redux';

import { ActionTypes, saveStorybooksAction } from '../actions'
import { STATE } from './state';
import { DRAG_TYPES } from '../constants/types';

const INITIAL_STATE: STATE.FoldersState = {
  loading: false,
  orders: {},
  list: []
}


const folders_reducer: Reducer<STATE.FoldersState, AnyAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.LOADING_FOLDER: {
      let nextstate = update(state, {
        loading: {
          $set: action.loading as boolean
        }
      });
      return nextstate;
    }
    case ActionTypes.STORE_FOLDERS:
      let data = action.data;

      //sort folders
      let orders = data.orders;
      data.list.sort((a: MODEL.Folder, b: MODEL.Folder) => orders[a._id] - orders[b._id]);

      let nextstate = update(state, {
        orders: {
          $set: data.orders
        },
        list: {
          $set: data.list
        }
      });
      return nextstate;

    case ActionTypes.CREATE_FOLDER: {
      let data: MODEL.Folder = action.data;
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

    case ActionTypes.DELETE_FOLDER: {
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

    case ActionTypes.UPDATE_FOLDER: {
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

    case ActionTypes.DRAG_FOLDER: {
      let data: { type: DRAG_TYPES.ARTICLE | DRAG_TYPES.FOLDER, source: string, target: string } = action.data;

      if (data.type === DRAG_TYPES.FOLDER) {
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
      } else {
        //Do nothing
        return state;
      }


    }
    default:
      return state;
  }
};

export default folders_reducer;