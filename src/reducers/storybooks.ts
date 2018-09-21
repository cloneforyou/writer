const items = (state: ReadonlyArray<Item> = [], action: ItemsAction) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return action.items;
    case 'ADD_ITEMS':
      return state.concat(action.items);
    default:
      return state;
  }
};

export interface Storybook {
  _id: string,
  name: string,
  cover: {
    bg: string,
    color: string,
  }
}

export default items;