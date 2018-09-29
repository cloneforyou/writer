import { ThunkDispatch } from 'redux-thunk';
import {
  Action, ActionCreator, AnyAction, Dispatch,

  bindActionCreators,
  ActionCreatorsMapObject
} from 'redux';

import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { STATE } from '../reducers/state';
import * as MODEL from '../../model';
import httphelper from '../util/httpHelper';

export const HIDE_MAIN_NAV = 'common/HIDE_MAIN_NAV';



// Global Types
export type ReduxThunkPromiseAction = (dispatch: Dispatch) => Promise<any>;

export enum ActionTypes {
  LOADING_STORY = '[Loading] STORIES',
  STORE_ALL_STORY_BOOKS = '[stories] STORE_ALL_STORY_BOOKS',
  CREATE_STORYBOOK = '[stories] CREATE',
  DELETE_STORYBOOK = '[stories] DELETE',
  UPDATE_STORYBOOK = '[stories] UPDATE',
  DRAG_STORYBOOK = '[stories] DRAG',
  //folder
  LOADING_FOLDER = '[Loading] FOLDER',
  STORE_FOLDERS = '[Folders] STORE_FOLDERS',
  CREATE_FOLDER = '[Folders] CREATE_FOLDER',
  DELETE_FOLDER = '[Folders] DELETE_FOLDER',
  UPDATE_FOLDER = '[Folders] UPDATE_FOLDER',
  DRAG_FOLDER = '[Folders] DRAG_FOLDER',
  DRAG_ARTICLE_TO_FOLDER = '[Articles] DRAG_ARTICLE_TO_FOLDER',
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


export type LOADING_ACTION<T> = (loading: boolean) => ({ type: T, loading: boolean });

// Actions
// -------------------------- getAll story
export const setStoryLoading: LOADING_ACTION<ActionTypes.LOADING_STORY> = (loading) => ({ type: ActionTypes.LOADING_STORY, loading })
export interface saveStorybooksAction extends Action {
  data: {
    orders: { [anyprops: string]: number }
    list: MODEL.Storybook[]
  }
}

export const saveStorybooks: ActionCreator<saveStorybooksAction> = (data) => ({ type: ActionTypes.STORE_ALL_STORY_BOOKS, data })


export type getAllStoryBooksThunked = () => Promise<any>;
export const getAllStoryBooksViaThunk: ActionCreator<ReduxThunkPromiseAction> = () => (dispatch: Dispatch) => {
  dispatch(showLoading());
  return fetch('/api/storybooks').then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(saveStorybooks(json.result))
    }
    dispatch(hideLoading());
  }, (e) => {
    dispatch(hideLoading());
    return Promise.reject(e);
  })
}


// -------------------------- create story
export interface createStoryBookAction {
  type: ActionTypes.CREATE_STORYBOOK,
  data: MODEL.Storybook
}
export const saveStorybook: ActionCreator<createStoryBookAction> = (data) => ({ type: ActionTypes.CREATE_STORYBOOK, data });
export type createStoryBookThunked = (item: any) => Promise<any>;
export const createStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  dispatch(setStoryLoading(true));
  return fetch('/api/storybooks', { method: 'put', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(saveStorybook(json.result));
    }
    dispatch(setStoryLoading(false));
  }, e => {
    dispatch(setStoryLoading(false));
    return Promise.reject(e);
  })
}

// -------------------------- delete story
export interface deleteStorybookAction {
  type: ActionTypes.DELETE_STORYBOOK,
  data: { _id: string }
}
export const deleteStorybook: ActionCreator<deleteStorybookAction> = (data) => ({ type: ActionTypes.DELETE_STORYBOOK, data });
export type deleteStoryBookThunked = (item: any) => Promise<any>;
export const deleteStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  dispatch(setStoryLoading(true));
  return fetch('/api/storybooks', { method: 'delete', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(deleteStorybook(item));
    }
    dispatch(setStoryLoading(false));
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
  dispatch(setStoryLoading(true));
  return fetch('/api/storybooks', { method: 'post', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(updateStorybook(item));
    }
    dispatch(setStoryLoading(false));
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
  dispatch(showLoading());
  return fetch('/api/storybooks', { method: 'post', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(dragStorybook(item));
    }
    dispatch(hideLoading());
  })
}
// -------------------------- get folders
export const setFolderLoading: LOADING_ACTION<ActionTypes.LOADING_FOLDER> = (loading) => ({ type: ActionTypes.LOADING_FOLDER, loading })
export interface saveFoldersAction extends Action {
  type: ActionTypes.STORE_FOLDERS,
  data: {
    orders: { [anyprops: string]: number }
    list: MODEL.Folder[]
  }
}

export const saveFolders: ActionCreator<saveFoldersAction> = (data) => ({ type: ActionTypes.STORE_FOLDERS, data })


export type getAllFoldersThunked = (id: string) => Promise<any>;
export const getAllFoldersViaThunk: ActionCreator<ReduxThunkPromiseAction> = (id: string) => (dispatch: Dispatch) => {
  dispatch(setFolderLoading(true));
  return fetch('/api/storybooks/' + id).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(saveFolders(json.result))
    }
    dispatch(setFolderLoading(false));
  })
}


// -------------------------- create folder
export interface createFolderAction {
  type: ActionTypes.CREATE_FOLDER,
  data: MODEL.Folder
}
export const saveFolder: ActionCreator<createFolderAction> = (data) => ({ type: ActionTypes.CREATE_FOLDER, data });
export type createFolderThunked = (item: any) => Promise<any>;
export const createFolderViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  dispatch(setFolderLoading(true));
  return fetch('/api/folders', { method: 'put', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(saveFolder(json.result));
    }
    dispatch(setFolderLoading(false));
  })
}

// -------------------------- delete folder
export interface deleteFolderAction {
  type: ActionTypes.DELETE_FOLDER,
  data: { _id: string }
}
export const deleteFolder: ActionCreator<deleteFolderAction> = (data) => ({ type: ActionTypes.DELETE_FOLDER, data });
export type deleteFolderThunked = (item: any) => Promise<any>;
export const deleteFolderViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  dispatch(setFolderLoading(true));
  return fetch('/api/folders', { method: 'delete', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(deleteFolder(item));
    }
    dispatch(setFolderLoading(false));
  })
}
//-------------------------- update folder
export interface updateFolderAction {
  type: ActionTypes.UPDATE_FOLDER,
  data: any
}
export const updateFolder: ActionCreator<updateFolderAction> = (data) => ({ type: ActionTypes.UPDATE_FOLDER, data });
export type updateFolderThunked = (item: any) => Promise<any>;
export const updateFolderViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  dispatch(setFolderLoading(true));
  return fetch('/api/folders', { method: 'post', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(updateFolder(item));
    }
    dispatch(setFolderLoading(false));
  })
}
//-------------------------- drag folder
export interface dragFolderAction {
  type: ActionTypes.DRAG_FOLDER,
  data: any
}
export const dragFolder: ActionCreator<dragFolderAction> = (data) => ({ type: ActionTypes.DRAG_FOLDER, data });
export type dragFolderThunked = (item: any) => Promise<any>;
export const dragFolderViaThunk: ActionCreator<ReduxThunkPromiseAction> = (item: any) => (dispatch: Dispatch) => {
  dispatch(setFolderLoading(true));
  return fetch('/api/folders', { method: 'post', body: httphelper.parseFormData(item) }).then(respnseCheck).then(json => {
    if (json.code === 200) {
      dispatch(dragFolder(item));
    }
    dispatch(setFolderLoading(false));
  })
}
