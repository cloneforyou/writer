import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Dispatch, ActionCreator, bindActionCreators, ActionCreatorsMapObject } from 'redux';


import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { List } from 'office-ui-fabric-react/lib/List';
import { IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import './index.less';
import { STATE } from '../../../reducers/state';

import * as MODEL from '../../../../model'

import {

} from '../../../actions'

import TreeFolder from '../../../components/TreeFolder';


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

}

interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

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



const mapStateToProps = (state: STATE.RootState) => ({
  common: state.common,
  storybooks: state.storybooks,
})

interface M extends ActionCreatorsMapObject {

}

interface N extends ActionCreatorsMapObject {

}


const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators<M, N>({

  }, dispatch)
}

interface CreateBookItem {
  name: string
}

class BookSpace extends React.PureComponent<IProps, State>{
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

  }



  private handleBeforeDrag = (id: string) => {
    this.setState({ dragId: id });
  }

  private handleBookClick = (book: MODEL.Storybook) => {
    console.log(book)
  }
  render() {
    const { renameName, deleteName } = this.state;
    const { storybooks } = this.props;
    const { list, orders } = storybooks;
    return (
      <div className="BookSpace">
        <div className="BookSpace-Folder">
          <TreeFolder />
        </div>
      </div>
    )
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(BookSpace);
