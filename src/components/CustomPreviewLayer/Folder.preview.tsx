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

class FolderPreview extends React.Component<IProps, {}> {
  render() {
    const { name } = this.props;
    return (
      <div className="Folder-dragging-preview">
        <div className="linkText-40">{name}</div>
      </div>);
  }
}

export default FolderPreview