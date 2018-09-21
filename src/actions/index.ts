import { ThunkAction } from 'redux-thunk';

export const HIDE_MAIN_NAV = 'common/HIDE_MAIN_NAV';



export const STORE_ALL_STORY_BOOKS = 'stories/STORE_ALL_STORY_BOOKS';

export const getAllStoryBooks = () => (dispatch) => fetch('/api/storybooks').then(res => res.json()).then()
