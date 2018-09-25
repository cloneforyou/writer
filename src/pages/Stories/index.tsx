import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect, InferableComponentEnhancerWithProps, MapStateToProps, MapDispatchToPropsParam } from 'react-redux';
import { withRouter, RouteComponentProps, RouteProps } from 'react-router';
import { Dispatch, ActionCreator, bindActionCreators, ActionCreatorsMapObject } from 'redux';


import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { List } from 'office-ui-fabric-react/lib/List';
import { IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import './index.less';
import { STATE } from '../../reducers/state';
import Storybook from './Storybook';
import * as MODEL from '../../../model'

import {
  getAllStoryBooksViaThunk,
  getAllStoryBooksThunked,
  saveStorybooksAction,
  createStoryBookViaThunk,
  createStoryBookThunked,
  createStoryBookAction,
  ReduxThunkPromiseAction,
  deleteStoryBookViaThunk,
  deleteStoryBookThunked,
  updateStoryBookViaThunk,
  updateStoryBookThunked,
  dragStoryBookViaThunk,
  dragStoryBookThunked,
} from '../../actions'

interface IOwnProps {
  //... props exposed for the real parent component

}

interface IStateProps {
  //... props from mapStateToProps
  common: STATE.CommonState,
  storybooks: STATE.StorybooksState,
}

interface IDispatchProps {
  //... props from mapDispatchToProps
  getAllStoryBooksViaThunk: getAllStoryBooksThunked,
  createStoryBookViaThunk: createStoryBookThunked,
  deleteStoryBookViaThunk: deleteStoryBookThunked,
  updateStoryBookViaThunk: updateStoryBookThunked,
  dragStoryBookViaThunk: dragStoryBookThunked,
}
interface PathProps {
  history: any
}
interface IProps extends IStateProps, IDispatchProps, IOwnProps, RouteComponentProps<{}> {
}

export interface State {
  hideRenameModal: boolean,
  hideDeleteDialog: boolean,
  hideNewBookDialog: boolean,
  renameId: string,
  deleteId: string,
  renameName: string,
  deleteName: string,
  dragId: string,
}



const mapStateToProps: MapStateToProps<IStateProps, IOwnProps, STATE.RootState> = (state) => ({
  common: state.common,
  storybooks: state.storybooks,
})

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


const mapDispatchToProps: MapDispatchToPropsParam<N, IOwnProps> = (dispatch) => {
  return bindActionCreators<M, N>({
    getAllStoryBooksViaThunk,
    createStoryBookViaThunk,
    updateStoryBookViaThunk,
    deleteStoryBookViaThunk,
    dragStoryBookViaThunk,
  }, dispatch)
}

interface CreateBookItem {
  name: string
}

class Stories extends React.Component<IProps, State>{
  private renameFiled?: ITextField | null;
  private newbookFiled?: ITextField | null;
  constructor(props: IProps) {
    super(props);
    this.state = {
      hideRenameModal: true,
      renameId: '',
      hideDeleteDialog: true,
      deleteId: '',
      deleteName: '',
      renameName: '',
      hideNewBookDialog: true,
      dragId: '',
    }
  }
  componentWillMount() {
    const { getAllStoryBooksViaThunk } = this.props;
    getAllStoryBooksViaThunk();
  }
  private hideRenameModal = () => {
    this.setState({ hideRenameModal: true })
  }
  private hideDeleteDialog = () => {
    this.setState({ hideDeleteDialog: true })
  }
  private showNewBookDialog = () => {
    this.setState({ hideNewBookDialog: false })
  }
  private hideNewBookDialog = () => {
    this.setState({ hideNewBookDialog: true })
  }
  private handleBookActionClick = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): boolean | void => {
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
  private handleCreateNewStorybook = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement>) => {
    const { createStoryBookViaThunk } = this.props;
    let value = this.newbookFiled && this.newbookFiled.value;
    if (value && value.trim()) {
      createStoryBookViaThunk({ name: value.trim() })
        .then(() => {
          this.hideNewBookDialog();
        })
    }

  }

  private handleDeleteStorybook = () => {
    const { deleteStoryBookViaThunk } = this.props;
    let _id = this.state.deleteId;
    deleteStoryBookViaThunk({ _id }).then(() => {
      this.hideDeleteDialog();
    })
  }
  private handleRenameStorybook = () => {
    const { updateStoryBookViaThunk } = this.props;
    let value = this.renameFiled && this.renameFiled.value;
    let _id = this.state.renameId;
    if (value && value.trim()) {
      updateStoryBookViaThunk({ _id: _id, name: value.trim() })
        .then(() => {
          this.hideRenameModal();
        })
    }

  }

  private handleBeforeDrag = (id: string) => {
    this.setState({ dragId: id });
  }
  private handleDrop = (id: string) => {
    const { dragStoryBookViaThunk } = this.props;
    let sourceId = this.state.dragId;
    if (id !== sourceId) {
      dragStoryBookViaThunk({ source: sourceId, target: id });
    }
  }
  private handleBookClick = (book: MODEL.Storybook) => {
    const { history } = this.props;
    history.push('/stories/' + book._id);
    console.log(book)
  }
  render() {
    const { renameName, deleteName } = this.state;
    const { storybooks } = this.props;
    const { list, orders } = storybooks;
    return (
      <div className="Story">
        {/* <div className="Story-recent">
           <p className="ms-fontSize-xl">最近写作</p>
          <List items={[
            <div>yess</div>,
            <div>yess</div>,
            <div>yess</div>
          ]}
            onRenderCell={(item) => item}
          />
        </div>*/}
        <div className="Story-books">
          <p className="ms-fontSize-xl">全部笔记本</p>
          <div className="Story-books-list">
            {list.map(book => <Storybook
              key={book._id}
              book={book}
              onClick={this.handleBookClick}
              beginDrag={this.handleBeforeDrag}
              onDrop={this.handleDrop}
              handleActionClick={this.handleBookActionClick} />)}

            <div className="Story-book Story-book-new" onClick={this.showNewBookDialog}>
              <i className="Story--hover-show ms-Icon ms-Icon--Add ms-fontSize-xxl" aria-hidden="true"></i>
              <p className="Story--hover-show ms-fontSize-l">新增笔记本</p>
            </div>
          </div>
          <Dialog
            hidden={this.state.hideRenameModal}
            onDismiss={this.hideRenameModal}
            dialogContentProps={{ title: '重命名', }}
            modalProps={{ isBlocking: false, }}
          >
            <TextField label="封面名称 " componentRef={node => this.renameFiled = node} defaultValue={renameName} required={true} />
            <DialogFooter>
              <PrimaryButton onClick={this.handleRenameStorybook} text="保存" />
              <DefaultButton onClick={this.hideRenameModal} text="取消" />
            </DialogFooter>
          </Dialog>
          <Dialog
            hidden={this.state.hideNewBookDialog}
            onDismiss={this.hideNewBookDialog}
            dialogContentProps={{ title: '新增笔记本', }}
            modalProps={{ isBlocking: false, }}
          >
            <TextField label="封面名称 " componentRef={node => this.newbookFiled = node} defaultValue={''} required={true} />
            <DialogFooter>
              <PrimaryButton onClick={this.handleCreateNewStorybook} text="保存" />
              <DefaultButton onClick={this.hideNewBookDialog} text="取消" />
            </DialogFooter>
          </Dialog>
          <Dialog
            hidden={this.state.hideDeleteDialog}
            onDismiss={this.hideDeleteDialog}
            dialogContentProps={{
              title: '确认删除[' + deleteName + ']？',
              subText:
                '如果笔记本内还有文章，将不能删除笔记本.'
            }}
            modalProps={{
              isBlocking: false,
              containerClassName: 'writer-dialogDelete'
            }}
          >
            <DialogFooter>
              <PrimaryButton onClick={this.handleDeleteStorybook} text="确认" />
              <DefaultButton onClick={this.hideDeleteDialog} text="取消" />
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    )
  }
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Stories)
);
