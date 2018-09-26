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
import { ReduxThunkPromiseAction, getAllStoryBooksThunked, createStoryBookThunked, deleteStoryBookThunked, updateStoryBookThunked, dragStoryBookThunked, getAllStoryBooksViaThunk, createStoryBookViaThunk, updateStoryBookViaThunk, deleteStoryBookViaThunk, dragStoryBookViaThunk } from '../../actions';

export interface IDragLinkOwnProps {
  handleActionClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) => boolean | void,
  link: INavLink,
  onDrop: (id: string) => void,
  onClick: (book: MODEL.Storybook) => void,
}

export interface IDragProps {
  isDragging?: boolean,
  connectDragSource?: ConnectDragSource,
  connectDragPreview?: ConnectDragPreview,
  isOver?: boolean,
  connectDropTarget?: ConnectDropTarget,
}
const folderSource: DragSourceSpec<DragableLinkOwnProps, { _id?: string, name: string }> = {
  beginDrag(props: DragableLinkOwnProps) {
    // props.beginDrag(props.book._id)
    return { _id: props.link.key, name: props.link.name };
  }
};
const folderTarget = {
  drop(props: DragableLinkOwnProps, monitor: DropTargetMonitor) {
    // props.onDrop(props.book._id);
    let item = monitor.getItem();
    let itemType = monitor.getItemType();
    console.log(item, itemType);
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
interface DragableLinkOwnProps extends IDragProps, IDragLinkOwnProps { }

export class DragableLink extends React.Component<DragableLinkOwnProps> {
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
      <div className={classnames("ms-Nav-linkText linkText-40 Folder-nav", {
        "Folder-drag-over": isOver,
        "Folder-drag-dragging": isDragging
      })} >
        <span className="Folder-nav-name">{isOver ? (isDragging ? '取消移动' : '移动到这里') : link.name}</span>
        <IconButton
          title="菜单"
          className="Folder-nav-actions"
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
          }} />
      </ div>
    ));
  }
}

const DragableLinkConnected = DragSource(DRAG_TYPES.FOLDER, folderSource, collectSource)(DropTarget([DRAG_TYPES.FOLDER, DRAG_TYPES.ARTICLE], folderTarget, collectTarget)(DragableLink))


interface FolderNavProps {
  currentFolder?: string,
  handleActionClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem) => boolean | void,
  onLinkClick: (ev?: React.MouseEvent<HTMLElement>, link?: INavLink) => void,
}
export class FolderNav extends React.Component<FolderNavProps, any> {
  renderLink: IRenderFunction<INavLink> = (link, defaultRender): JSX.Element | null => {
    const { handleActionClick } = this.props;
    if (typeof link !== 'undefined' && defaultRender) {
      return <DragableLinkConnected handleActionClick={handleActionClick} onDrop={() => { }} onClick={() => { }} link={link} />
    }
    return null
  }
  render(): JSX.Element {
    const { currentFolder, onLinkClick } = this.props;

    return (
      <div className="Folder">
        <Nav
          className='reverse'
          groups={[{
            links: [
              { name: '新建目录', url: '', key: 'new', path: '/new' },
              { name: '素年锦时', url: '', key: 'Notes', path: '/notes' },
              { name: '理想国', url: '', key: 'Inspirations', path: '/ideas' },
              { name: '攻壳机动队', url: '', key: 'Explore', path: '/explore' },
              { name: '攻壳机动队-情节', url: '', key: 'Follow', path: '/follow' },
              { name: '攻壳机动队-人设', url: '', key: 'Favorites', path: '/favorite' },
              { name: 'As Long As Possiable to test ecllipse long sentence', url: '', key: 'Sync', path: '/sync' },
              { name: '庆余年', url: '', key: 'Donwload', path: '/download' },
              { name: '间客', url: '', key: 'TrashBin', path: '/transh' },
              { name: '私房钱藏匿地点', url: '', key: 'Account', path: '/account' },
              { name: '秘密', url: '', key: 'Settings', path: '/settings' },
            ]
          }] as INavLinkGroup[]}
          selectedKey={currentFolder}
          onLinkClick={onLinkClick}
          onRenderLink={this.renderLink}
        />
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
  storybooks: STATE.StorybooksState,
}
const mapStateToProps: MapStateToProps<IFolderStateProps, IFolderOwnProps, STATE.RootState> = (state) => ({
  common: state.common,
  storybooks: state.storybooks,
})

interface IDispatchProps {
  //... props from mapDispatchToProps
  getAllStoryBooksViaThunk: getAllStoryBooksThunked,
  createStoryBookViaThunk: createStoryBookThunked,
  deleteStoryBookViaThunk: deleteStoryBookThunked,
  updateStoryBookViaThunk: updateStoryBookThunked,
  dragStoryBookViaThunk: dragStoryBookThunked,
}
interface M extends ActionCreatorsMapObject {
  getAllStoryBooksViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  createStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  deleteStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  updateStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction>,
  dragStoryBookViaThunk: ActionCreator<ReduxThunkPromiseAction>,
}

interface N extends ActionCreatorsMapObject {
  getAllStoryBooksViaThunk: getAllStoryBooksThunked,
  createStoryBookViaThunk: createStoryBookThunked,
  deleteStoryBookViaThunk: deleteStoryBookThunked,
  updateStoryBookViaThunk: updateStoryBookThunked,
  dragStoryBookViaThunk: dragStoryBookThunked,
}


const mapDispatchToProps: MapDispatchToProps<IDispatchProps, IFolderOwnProps> = (dispatch) => {
  return bindActionCreators<M, N>({
    getAllStoryBooksViaThunk,
    createStoryBookViaThunk,
    updateStoryBookViaThunk,
    deleteStoryBookViaThunk,
    dragStoryBookViaThunk,
  }, dispatch)
}

interface IFolderAllProps extends IFolderStateProps, IFolderOwnProps, IDispatchProps, RouteComponentProps<{}> {
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
    const { updateStoryBookViaThunk } = this.props;
    let value = this.renameFiled && this.renameFiled.value;
    let _id = this.state.renameId;
    if (value && value.trim()) {
      updateStoryBookViaThunk({ _id: _id, name: value.trim() })
        .then(() => {
          this.hideRenameModal();
        })
    }
  };
  private handleCreateNewFolder = () => {
    const { createStoryBookViaThunk } = this.props;
    let value = this.newbookFiled && this.newbookFiled.value;
    if (value && value.trim()) {
      createStoryBookViaThunk({ name: value.trim() })
        .then(() => {
          this.hideNewFolderDialog();
        })
    }

  }

  private handleDeleteFolder = () => {
    const { deleteStoryBookViaThunk } = this.props;
    let _id = this.state.deleteId;
    deleteStoryBookViaThunk({ _id }).then(() => {
      this.hideDeleteDialog();
    })
  }
  render() {
    const { renameName, deleteName } = this.state;
    return (
      <div className="Folder-container">
        <FolderNav
          handleActionClick={this.handleFolderActionClick}
          onLinkClick={this.handleTabChange}
          currentFolder={this.state.currentFolder} />
        <div className="Folder-new-action" onClick={this.showNewFolderDialog} ><Icon iconName="Add" />&nbsp;&nbsp;新建目录</div>
        <Loading spining={false} label="Loading" ariaLabel="Loading" />
        <Dialog
          hidden={this.state.hideRenameModal}
          onDismiss={this.hideRenameModal}
          dialogContentProps={{ title: '重命名', }}
          modalProps={{ isBlocking: false, }}
        >
          <TextField label="目录名称 " componentRef={node => this.renameFiled = node} defaultValue={renameName} required={true} />
          <DialogFooter>
            <PrimaryButton onClick={this.handleRenameFolder} text="保存" />
            <DefaultButton onClick={this.hideRenameModal} text="取消" />
          </DialogFooter>
        </Dialog>
        <Dialog
          hidden={this.state.hideNewBookDialog}
          onDismiss={this.hideNewFolderDialog}
          dialogContentProps={{ title: '新增目录', }}
          modalProps={{ isBlocking: false, }}
        >
          <TextField label="目录名称 " componentRef={node => this.newbookFiled = node} defaultValue={''} required={true} />
          <DialogFooter>
            <PrimaryButton onClick={this.handleCreateNewFolder} text="保存" />
            <DefaultButton onClick={this.hideNewFolderDialog} text="取消" />
          </DialogFooter>
        </Dialog>
        <Dialog
          hidden={this.state.hideDeleteDialog}
          onDismiss={this.hideDeleteDialog}
          dialogContentProps={{
            title: '确认删除该目录？',
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TreeFolder)
);