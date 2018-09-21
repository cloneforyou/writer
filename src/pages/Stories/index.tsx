import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Nav, INavProps, INavLinkGroup, INavLink, } from 'office-ui-fabric-react/lib/Nav';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { List } from 'office-ui-fabric-react/lib/List';
import { IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import './index.less';

export interface Props {

}
export interface State {
  hideRenameModal: boolean,
  hideDeleteDialog: boolean,
  hideNewBookDialog: boolean,
  renameId: string,
  deleteId: string,
  renameName: string,
}

class Stories extends React.Component<Props, State>{
  private renameFiled?: ITextField | null;
  private newbookFiled?: ITextField | null;
  constructor(props: Props) {
    super(props);
    this.state = {
      hideRenameModal: true,
      renameId: '',
      hideDeleteDialog: true,
      deleteId: '',
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
  private showNewBookDialog = () => {
    this.setState({ hideNewBookDialog: false })
  }
  private hideNewBookDialog = () => {
    this.setState({ hideNewBookDialog: true })
  }
  private handleBookActionClick = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): boolean | void => {
    if (item) {
      if (item.key === 'rename') {
        this.setState({ hideRenameModal: false, renameId: item.data.id, renameName: item.data.name })
      } else if (item.key === 'delete') {
        this.setState({ hideDeleteDialog: false, deleteId: item.data.id })
      }
      console.log(item.data);
    }
    return true;
  }
  render() {
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
            <div className="Story-book">
              <div className="Story-book-actions">
                <IconButton
                  title="菜单"
                  ariaLabel="菜单"
                  menuProps={{
                    onItemClick: this.handleBookActionClick,
                    items: [
                      {
                        key: 'color',
                        text: '修改背景颜色',
                        data: { id: '2345', name: 'xxsdfa' },
                        iconProps: { iconName: 'Color' }
                      },
                      {
                        key: 'rename',
                        text: '重命名',
                        data: { id: '2345', name: 'xxsdfa' },
                        iconProps: { iconName: 'Rename' }
                      },
                      {
                        key: 'delete',
                        text: '删除',
                        data: { id: '2345', name: 'xxsdfa' },
                        iconProps: { iconName: 'Delete' }
                      }
                    ],
                    directionalHintFixed: true
                  }} />
              </div>
              <div className="Story-book-cover">
                <h1 className="ms-fontSize-xxl ms-fontWeight-regular">写作测试</h1>
              </div>
            </div>
            <div className="Story-book">
            <div className="Story-book-actions">
                <IconButton
                  title="菜单"
                  ariaLabel="菜单"
                  menuProps={{
                    onItemClick: this.handleBookActionClick,
                    items: [
                      {
                        key: 'color',
                        text: '修改背景颜色',
                        data: { id: '2345', name: 'xxsdfa' },
                        iconProps: { iconName: 'Color' }
                      },
                      {
                        key: 'rename',
                        text: '重命名',
                        data: { id: '2345', name: 'xxsdfa' },
                        iconProps: { iconName: 'Rename' }
                      },
                      {
                        key: 'delete',
                        text: '删除',
                        data: { id: '2345', name: 'xxsdfa' },
                        iconProps: { iconName: 'Delete' }
                      }
                    ],
                    directionalHintFixed: true
                  }} />
              </div>
              <div className="Story-book-cover">
                <h1 className="ms-fontSize-xxl ms-fontWeight-regular">草稿本</h1>
              </div>
            </div>
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
            <TextField label="封面名称 " componentRef={node => this.renameFiled = node} defaultValue={this.state.renameName} required={true} />
            <DialogFooter>
              <PrimaryButton onClick={this.hideRenameModal} text="保存" />
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
              <PrimaryButton onClick={this.hideNewBookDialog} text="保存" />
              <DefaultButton onClick={this.hideNewBookDialog} text="取消" />
            </DialogFooter>
          </Dialog>
          <Dialog
            hidden={this.state.hideDeleteDialog}
            onDismiss={this.hideDeleteDialog}
            dialogContentProps={{
              title: '确认删除？',
              subText:
                '如果笔记本内还有文章，将不能删除笔记本.'
            }}
            modalProps={{
              isBlocking: false,
              containerClassName: 'writer-dialogDelete'
            }}
          >
            <DialogFooter>
              <PrimaryButton onClick={this.hideDeleteDialog} text="确认" />
              <DefaultButton onClick={this.hideDeleteDialog} text="取消" />
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    )
  }
};

export default Stories;