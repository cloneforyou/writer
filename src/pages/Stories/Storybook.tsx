import * as React from 'react';
import classnames from 'classnames';
import { DRAG_TYPES } from '../../constants/types';
import {
  DragSource, DropTarget,
  DragSourceConnector, DragSourceSpec,
  ConnectDragSource, DragSourceCollector,
  DragSourceMonitor, DropTargetMonitor,
  DropTargetConnector, ConnectDropTarget, ConnectDragPreview
} from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend'
import * as MODEL from '../../../model'
import { IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';

export interface IOwnProps {
  handleActionClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) => boolean | void,
  book: MODEL.Storybook,
  onDrop: (source: string, target: string) => void,
  onClick: (book: MODEL.Storybook) => void,
}

export interface IDragProps {
  isDragging?: boolean,
  connectDragSource?: ConnectDragSource,
  connectDragPreview?: ConnectDragPreview,
  isOver?: boolean,
  connectDropTarget?: ConnectDropTarget,
}
const bookSource: DragSourceSpec<IProps, { _id: string, name: string }> = {
  beginDrag(props: IProps) {
    return { _id: props.book._id, name: props.book.name };
  }
};
const bookTarget = {
  drop(props: IProps, monitor: DropTargetMonitor) {
    let item = monitor.getItem();
    let target = props.book._id;
    if (item._id !== target) {
      props.onDrop(item._id, target);
    }
  }
};
const collectSource = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

function collectTarget(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}
interface IProps extends IDragProps, IOwnProps { }

class Storybook extends React.PureComponent<IProps, {}> {
  componentDidMount() {
    const { connectDragPreview } = this.props;
    if (connectDragPreview) {
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      })
    }
  }
  render() {
    const { handleActionClick, book, isDragging, isOver, connectDragSource, connectDragPreview, connectDropTarget, onClick } = this.props;

    return connectDropTarget!(connectDragSource!(
      <div key={book._id}
        onClick={() => onClick(book)}
        className={classnames("Story-book", {
          "Story-book-over": isOver,
          "Story-book-dragging": isDragging
        })}>
        <div className="Story-book-actions">
          {isDragging ? null : <IconButton
            title="菜单"
            ariaLabel="菜单"
            menuProps={{
              onItemClick: handleActionClick,
              items: [
                {
                  key: 'color',
                  text: '修改背景颜色',
                  data: book,
                  iconProps: { iconName: 'Color' }
                },
                {
                  key: 'rename',
                  text: '重命名',
                  data: book,
                  iconProps: { iconName: 'Rename' }
                },
                {
                  key: 'delete',
                  text: '删除',
                  data: book,
                  iconProps: { iconName: 'Delete' }
                }
              ],
              directionalHintFixed: true
            }} />}
        </div>
        <div className="Story-book-cover">
          <h1 className="ms-fontSize-xxl ms-fontWeight-regular">{book.name}</h1>
        </div>
      </div>))

  }
}

export default DragSource(DRAG_TYPES.BOOK, bookSource, collectSource)(DropTarget(DRAG_TYPES.BOOK, bookTarget, collectTarget)(Storybook))