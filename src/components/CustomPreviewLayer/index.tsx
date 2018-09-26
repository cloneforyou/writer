import * as React from 'react'
import { DragLayer, XYCoord } from 'react-dnd'
import { DRAG_TYPES } from '../../constants/types'

import StorybookPreview from './Storybook.preview';
import FolderPreview from './Folder.preview';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

function getItemStyles(props: CustomDragLayerProps) {
  const { initialOffset, currentOffset } = props
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  let { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

export interface CustomDragLayerProps {
  item?: any
  itemType?: string
  initialOffset?: XYCoord
  currentOffset?: XYCoord
  isDragging?: boolean
}

const CustomDragLayer: React.SFC<CustomDragLayerProps> = props => {
  const { item, itemType, isDragging } = props

  function renderItem() {
    switch (itemType) {
      case DRAG_TYPES.BOOK:
        return <StorybookPreview name={item.name} />
      case DRAG_TYPES.FOLDER:
        return <FolderPreview name={item.name} />
      default:
        return null
    }
  }

  if (!isDragging) {
    return null
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(props)}>{renderItem()}</div>
    </div>
  )
}

export default DragLayer<CustomDragLayerProps>(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))(CustomDragLayer)