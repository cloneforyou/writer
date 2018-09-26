import * as React from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import { DRAG_TYPES } from '../../constants/types';
import {
  DragSource, DropTarget,
  DragSourceConnector, DragSourceSpec,
  ConnectDragSource, DragSourceCollector,
  DragSourceMonitor, DropTargetMonitor,
  DropTargetConnector, ConnectDropTarget, ConnectDragPreview
} from 'react-dnd';
import * as PropTypes from 'prop-types';
import * as MODEL from '../../../model'
import { Nav, INavProps, INavLinkGroup, INavLink, } from 'office-ui-fabric-react/lib/Nav';
import { IRenderFunction } from '@uifabric/utilities';
import { IconButton, IButtonProps, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { getEmptyImage } from 'react-dnd-html5-backend'
import { Icon, IconType } from 'office-ui-fabric-react/lib/Icon';
import { Spinner, SpinnerSize, ISpinnerProps } from 'office-ui-fabric-react/lib/Spinner';
import './index.less';

export interface IOwnProps extends ISpinnerProps {
  spining: boolean;
}

const ContienrStyle: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  width: '100%',
  height: '100%',
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,.05)',
}


export class Loading extends React.Component<IOwnProps> {

  render() {
    const { spining, children, style, label, ariaLabel } = this.props;
    let spinnerProp: ISpinnerProps = { label, ariaLabel };
    if (spining) {
      if (children) {
        return (
          <div className="MySpinningContainer" style={style}>
            <div className="Spinner-container" style={ContienrStyle} >
              <Spinner {...spinnerProp} />
            </div>
            {this.props.children}
          </div>)
      } else {
        return (
          <div className="Spinner-container" style={ContienrStyle}>
            <Spinner {...spinnerProp} />
          </div>)
      }
    }

    return children || null;
  }
}


export default Loading;