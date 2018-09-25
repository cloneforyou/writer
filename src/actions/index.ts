import { ThunkDispatch } from 'redux-thunk';
import {
  Action, ActionCreator, AnyAction, Dispatch,

  bindActionCreators,
  ActionCreatorsMapObject
} from 'redux';


import { STATE } from '../reducers/state';
import * as MODEL from '../../model';
import httphelper from '../util/httpHelper';

export const HIDE_MAIN_NAV = 'common/HIDE_MAIN_NAV';



// Global Types
export type ReduxThunkPromiseAction = (dispatch: Dispatch) => Promise<any>;

export enum ActionTypes {
  STORE_ALL_STORY_BOOKS = '[stories] STORE_ALL_STORY_BOOKS',
  CREATE_STORYBOOK = '[stories] CREATE',
  DELETE_STORYBOOK = '[stories] DELETE',
  UPDATE_STORYBOOK = '[stories] UPDATE',
  DRAG_STORYBOOK = '[stories] DRAG',
}


// Global helper

export const respnseCheck = (resp: Response): Promise<any> => {
  if (resp.status !== 200) {
    //handle error,
    console.log('errrrr--------');
    return Promise.reject('bad code')
  } else {
    return resp.json().catch(e => console.log('error!-----', e));
  }
}




// Actions
export interface saveStorybooksAction extends Action {
  data: {
    orders: { [anyprops: string]: number }
    list: MODEL.Storybook[]
  }
}

export const saveStorybooks: ActionCreator<saveStorybooksAction> = (data) => ({ type: ActionTypes.STORE_ALL_STORY_BOOKS, data })


export type getAllStoryBooksThunked = () => Promise<any>;
export const getAllStoryBooksViaThunk: ActionCreator<ReduxThunkPromiseAction> = () => (dispatch: Dispatch) => fetch('/api/storybooks').then(respnseCheck).then(json => {
  if (json.code === 200) {
    dispatch(saveStorybooks(json.result))
  }
})



export interface createStoryBookAction {
  type: ActionTypes.CREATE_STORYBOOK,
  data: MODEL.Storybook
}
export const saveStorybook: ActionCreator<createStoryBookAction> = (data) => ({ type: ActionTypes.CREATE_STORYBOOK, data });
export type createStoryBookThunked = (item: any) => Promise<any>;
export const createStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  return fetch('/api/storybooks', { method: 'put', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(saveStorybook(json.result));
    }
  })
}


export interface deleteStorybookAction {
  type: ActionTypes.DELETE_STORYBOOK,
  data: { _id: string }
}
export const deleteStorybook: ActionCreator<deleteStorybookAction> = (data) => ({ type: ActionTypes.DELETE_STORYBOOK, data });
export type deleteStoryBookThunked = (item: any) => Promise<any>;
export const deleteStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  return fetch('/api/storybooks', { method: 'delete', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(deleteStorybook(item));
    }
  })
}
//-------------------------- update story
export interface updateStorybookAction {
  type: ActionTypes.UPDATE_STORYBOOK,
  data: any
}
export const updateStorybook: ActionCreator<updateStorybookAction> = (data) => ({ type: ActionTypes.UPDATE_STORYBOOK, data });
export type updateStoryBookThunked = (item: any) => Promise<any>;
export const updateStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  return fetch('/api/storybooks', { method: 'post', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(updateStorybook(item));
    }
  })
}
//-------------------------- drag story
export interface dragStorybookAction {
  type: ActionTypes.DRAG_STORYBOOK,
  data: any
}
export const dragStorybook: ActionCreator<dragStorybookAction> = (data) => ({ type: ActionTypes.DRAG_STORYBOOK, data });
export type dragStoryBookThunked = (item: any) => Promise<any>;
export const dragStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  return fetch('/api/storybooks', { method: 'post', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(dragStorybook(item));
    }
  })
}
