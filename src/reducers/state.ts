import * as MODEL from '../../model'

export namespace STATE {
  export interface StorybooksState {
    loading: boolean,
    orders: {
      [anyProp: string]: number
    }
    list: MODEL.Storybook[]
  }

  export interface CommonState {
    loading: boolean
    name?: string
  }


  export interface FoldersState {
    loading: boolean,
    orders: {
      [anyProp: string]: number
    }
    list: MODEL.Folder[]
  }
  export interface ArticlesState {
    loading: boolean,
    orders: {
      [anyProp: string]: number
    }
    list: MODEL.Folder[]
  }
  export interface RootState {
    articles: ArticlesState,
    common: CommonState,
    storybooks: StorybooksState,
    folders: FoldersState
  }

}
