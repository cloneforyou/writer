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

class FolderPreview extends React.PureComponent<IProps, {}> {
  render() {
    const { name } = this.props;
    return (
      <div className={"ms-Nav-linkText linkText-40 ArticleList-item ArticleList-dragging-preview"}  >
        <p className="ArticleList-item-title">
          <span className="ArticleList-item-name">{name}</span>
          <span className="ArticleList-item-actions">&nbsp;
          </span>
        </p>
        <p className="ArticleList-item-time">2018-09-04 12:33</p>
      </ div>
    );
  }
}

export default FolderPreview