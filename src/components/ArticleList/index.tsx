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
import { IconButton, IButtonProps, DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { getEmptyImage } from 'react-dnd-html5-backend'
import { Icon, IconType } from 'office-ui-fabric-react/lib/Icon';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import Loading from '../Loading';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import './index.less';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { STATE } from '../../reducers/state';
import { MapStateToProps, MapDispatchToPropsParam, connect, DispatchProp, MapDispatchToProps } from 'react-redux';
import { ActionCreatorsMapObject, ActionCreator, bindActionCreators, Dispatch } from 'redux';
import { ReduxThunkPromiseAction, getAllFoldersThunked, createFolderThunked, deleteFolderThunked, updateFolderThunked, dragFolderThunked, getAllFoldersViaThunk, createFolderViaThunk, updateFolderViaThunk, deleteFolderViaThunk, dragFolderViaThunk } from '../../actions';



type onDropFunction = (type: DRAG_TYPES.FOLDER | DRAG_TYPES.ARTICLE, source: string, target: string) => void;
export interface IDragLinkOwnProps {
  handleActionClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) => boolean | void,
  link: INavLink,
  onDrop: onDropFunction,
  onClick: (ev?: React.MouseEvent<HTMLElement>, link?: INavLink) => void,
}

export interface IDragProps {
  isDragging?: boolean,
  connectDragSource?: ConnectDragSource,
  connectDragPreview?: ConnectDragPreview,
  isOver?: boolean,
  connectDropTarget?: ConnectDropTarget,
}
interface IDragItem { _id: string, name: string }
const folderSource: DragSourceSpec<DragableArticleOwnProps, IDragItem> = {
  beginDrag(props: DragableArticleOwnProps) {
    // props.beginDrag(props.book._id)
    return { _id: props.link.key!, name: props.link.name };
  }
};
const folderTarget = {
  drop(props: DragableArticleOwnProps, monitor: DropTargetMonitor) {
    let item: IDragItem = monitor.getItem();
    let itemType = monitor.getItemType() as DRAG_TYPES.ARTICLE | DRAG_TYPES.FOLDER;
    console.log(item, itemType);
    props.onDrop(itemType, item._id, props.link.key!);
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
interface DragableArticleOwnProps extends IDragProps, IDragLinkOwnProps { }

export class DragableArticle extends React.PureComponent<DragableArticleOwnProps> {
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
    const { link, isDragging, isOver, connectDragSource, connectDropTarget, onClick, handleActionClick } = this.props;
    return connectDropTarget!(connectDragSource!(
      <div className={classnames("ms-Nav-linkText linkText-40 ArticleList-item", {
        "ArticleList-item-drag-over": isOver,
        "ArticleList-item-drag-dragging": isDragging
      })}
        title={link.name}
      >
        <div className="ArticleList-item-dragCover"></div>
        <p className="ArticleList-item-title">
          <span className="ArticleList-item-name">{isOver ? (isDragging ? '取消移动' : '移动到这里') : link.name}</span>
          <IconButton
            title="菜单"
            className="ArticleList-item-actions"
            ariaLabel="菜单"
            menuProps={{
              onItemClick: handleActionClick,
              items: [
                {
                  key: 'export',
                  text: '导出',
                  data: link,
                  iconProps: { iconName: 'Export' },
                  subMenuProps: {
                    items: [
                      {
                        key: 'clear',
                        text: 'Clear categories'
                      },
                      {
                        key: 'manage',
                        text: 'Manage categories'
                      }
                    ]
                  }
                },
                {
                  key: 'rename',
                  text: '重命名',
                  data: link,
                  iconProps: { iconName: 'Rename' }
                },
                {
                  key: 'delete',
                  text: '删除',
                  data: link,
                  iconProps: { iconName: 'Delete' }
                }
              ],
              directionalHintFixed: true
            }} /></p>
        <p className="ArticleList-item-time">2018-09-04 12:33</p>

      </ div>
    ));
  }
}

const DragableLinkConnected = DragSource(DRAG_TYPES.ARTICLE, folderSource, collectSource)(DropTarget(DRAG_TYPES.ARTICLE, folderTarget, collectTarget)(DragableArticle))


interface ArtcleListProps {
  data: STATE.FoldersState,
  currentFolder?: string,
  handleActionClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) => boolean | void,
  onLinkClick: (ev?: React.MouseEvent<HTMLElement>, link?: INavLink) => void,
  onDrop: onDropFunction,
}
export class ArtcleList extends React.Component<ArtcleListProps, any> {


  render(): JSX.Element {
    const { currentFolder, onLinkClick, data } = this.props;

    return (
      <div className="ArticleList">
        <div className="ArticleList-item">
          <p>再别康桥</p>
          <p>2018-05-03 12:34</p>
        </div>
        <DragableLinkConnected handleActionClick={() => { }} onDrop={() => { }} onClick={() => { }} link={{ key: '_234', name: '再别康桥', url: '' }} />
      </div>
    );
  }

}

export interface State {
  currentFolder: string | undefined,
  hideRenameModal: boolean,
  hideDeleteDialog: boolean,
  hideNewBookDialog: boolean,
  renameId: string,
  deleteId: string,
  renameName: string,
  deleteName: string,
}
interface IFolderOwnProps {
  //... props exposed for the real parent component
}
interface IFolderStateProps {
  //... props from mapStateToProps
  common: STATE.CommonState,
  folders: STATE.FoldersState,
}
const mapStateToProps: MapStateToProps<IFolderStateProps, IFolderOwnProps, STATE.RootState> = (state) => ({
  common: state.common,
  folders: state.folders,
})

interface IDispatchProps {
  //... props from mapDispatchToProps
  getAllFoldersViaThunk: getAllFoldersThunked,
  createFolderViaThunk: createFolderThunked,
  deleteFolderViaThunk: deleteFolderThunked,
  updateFolderViaThunk: updateFolderThunked,
  dragFolderViaThunk: dragFolderThunked,
}
interface M extends ActionCreatorsMapObject {
  getAllFoldersViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  createFolderViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  deleteFolderViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  updateFolderViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  dragFolderViaThunk: ActionCreator<ReduxThunkPromiseAction>,
}

interface N extends ActionCreatorsMapObject {
  getAllFoldersViaThunk: getAllFoldersThunked,
  createFolderViaThunk: createFolderThunked,
  deleteFolderViaThunk: deleteFolderThunked,
  updateFolderViaThunk: updateFolderThunked,
  dragFolderViaThunk: dragFolderThunked,
}


const mapDispatchToProps: MapDispatchToProps<IDispatchProps, IFolderOwnProps> = (dispatch) => {
  return bindActionCreators<M, N>({
    getAllFoldersViaThunk,
    createFolderViaThunk,
    updateFolderViaThunk,
    deleteFolderViaThunk,
    dragFolderViaThunk,
  }, dispatch)
}

interface IFolderAllProps extends IFolderStateProps, IFolderOwnProps, IDispatchProps {
  children?: React.ReactNode
}

class TreeFolder extends React.Component<IFolderAllProps, State>{
  private renameFiled?: ITextField | null;
  private newbookFiled?: ITextField | null;

  constructor(props: IFolderAllProps) {
    super(props);
    this.state = {
      currentFolder: 'Stories',
      hideRenameModal: true,
      renameId: '',
      hideDeleteDialog: true,
      deleteId: '',
      deleteName: '',
      renameName: '',
      hideNewBookDialog: true,
    }
  }
  UNSAFE_componentWillMount() {
    const { getAllFoldersViaThunk } = this.props;
    const matchFolder = /^\/stories\/(\w+)/.exec(window.location.pathname);
    if (matchFolder) {
      // getAllFoldersViaThunk(matchFolder[1]);
    }
  }
  private hideRenameModal = () => {
    this.setState({ hideRenameModal: true })
  }
  private hideDeleteDialog = () => {
    this.setState({ hideDeleteDialog: true })
  }
  private showNewFolderDialog = () => {
    this.setState({ hideNewBookDialog: false })
  }
  private hideNewFolderDialog = () => {
    this.setState({ hideNewBookDialog: true })
  }
  private handleTabChange = (ev?: React.MouseEvent<HTMLElement>, link?: INavLink): void => {
    if (link) {
      this.setState({ currentFolder: link.key })
      // this.props.history.push(link.path as string)
    }
    return;
  }
  private handleFolderActionClick = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): boolean | void => {
    if (item) {
      if (item.key === 'rename') {
        this.setState({ hideRenameModal: false, renameId: item.data._id, renameName: item.data.name })
      } else if (item.key === 'delete') {
        this.setState({ hideDeleteDialog: false, deleteId: item.data._id, deleteName: item.data.name })
      }
      console.log(item.data);
    }
    return true;
  }
  private handleRenameFolder = () => {
    const { updateFolderViaThunk } = this.props;
    let value = this.renameFiled && this.renameFiled.value;
    let _id = this.state.renameId;
    if (value && value.trim()) {
      updateFolderViaThunk({ _id: _id, name: value.trim() })
        .then(() => {
          this.hideRenameModal();
        })
    }
  };
  private handleCreateNewFolder = () => {
    const { createFolderViaThunk } = this.props;
    let value = this.newbookFiled && this.newbookFiled.value;
    if (value && value.trim()) {
      createFolderViaThunk({ name: value.trim() })
        .then(() => {
          this.hideNewFolderDialog();
        })
    }

  }

  private handleDeleteFolder = () => {
    const { deleteFolderViaThunk } = this.props;
    let _id = this.state.deleteId;
    deleteFolderViaThunk({ _id }).then(() => {
      this.hideDeleteDialog();
    })
  }
  private handleDropToFolder: onDropFunction = (type, source, target) => {
    const { dragFolderViaThunk } = this.props;
    dragFolderViaThunk({ type, source, target });
  }

  render() {
    const { renameName, deleteName } = this.state;
    const { folders } = this.props;
    return (
      <div className="ArticleList-container">
        <ArtcleList
          handleActionClick={this.handleFolderActionClick}
          onLinkClick={this.handleTabChange}
          onDrop={this.handleDropToFolder}
          currentFolder={this.state.currentFolder}
          data={folders}
        />
        <div className="ArticleList-new-action" onClick={this.showNewFolderDialog} ><Icon iconName="Add" />&nbsp;&nbsp;新增文章</div>
        <Loading spining={folders.loading} label="Loading" ariaLabel="Loading" />
        <Dialog
          hidden={this.state.hideRenameModal}
          onDismiss={this.hideRenameModal}
          dialogContentProps={{ title: '重命名', }}
          modalProps={{ isBlocking: false, }}
        >
          <TextField label="文章名称 " componentRef={node => this.renameFiled = node} defaultValue={renameName} required={true} />
          <DialogFooter>
            <PrimaryButton onClick={this.handleRenameFolder} text="保存" />
            <DefaultButton onClick={this.hideRenameModal} text="取消" />
          </DialogFooter>
        </Dialog>
        <Dialog
          hidden={this.state.hideNewBookDialog}
          onDismiss={this.hideNewFolderDialog}
          dialogContentProps={{ title: '新增文章', }}
          modalProps={{ isBlocking: false, }}
        >
          <TextField label="文章名称 " componentRef={node => this.newbookFiled = node} defaultValue={''} required={true} />
          <DialogFooter>
            <PrimaryButton onClick={this.handleCreateNewFolder} text="保存" />
            <DefaultButton onClick={this.hideNewFolderDialog} text="取消" />
          </DialogFooter>
        </Dialog>
        <Dialog
          hidden={this.state.hideDeleteDialog}
          onDismiss={this.hideDeleteDialog}
          dialogContentProps={{
            title: '确认删除该文章？',
            subText:
              '[' + deleteName + '] 内的所有文章也会被删除.'
          }}
          modalProps={{
            isBlocking: false,
            containerClassName: 'writer-dialogDelete'
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={this.handleDeleteFolder} text="确认" />
            <DefaultButton onClick={this.hideDeleteDialog} text="取消" />
          </DialogFooter>
        </Dialog>
      </div>
    )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeFolder)