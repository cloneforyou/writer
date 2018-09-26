import * as React from 'react';
import {
  ConnectDragSource, ConnectDropTarget, ConnectDragPreview
} from 'react-dnd';

import * as MODEL from '../../../model'

export interface IOwnProps {
  name: MODEL.Storybook['name'],
}

export interface IDragProps {
  isDragging?: boolean,
  connectDragSource?: ConnectDragSource,
  connectDragPreview?: ConnectDragPreview,
  isOver?: boolean,
  connectDropTarget?: ConnectDropTarget,
}


interface IProps extends IDragProps, IOwnProps { }

class StorybookPreview extends React.Component<IProps, {}> {
  render() {
    const { name } = this.props;
    return (
      <div className="Story-book Story-book-dragging-preview">
        <div className="Story-book-cover">
          <h1 className="ms-fontSize-xxl ms-fontWeight-regular">{name}</h1>
        </div>
      </div>);
  }
}

export default StorybookPreview