import * as MODEL from '../../model'

export namespace STATE {
  export interface StorybooksState {
    orders: {
      [anyProp: string]: number
    }
    list: MODEL.Storybook[]
  }

  export interface CommonState {
    name?: string
  }

  export interface RootState {

    common: CommonState,
    storybooks: StorybooksState
  }
}
