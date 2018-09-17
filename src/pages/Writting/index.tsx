import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Nav, INavProps, INavLinkGroup, INavLink, } from 'office-ui-fabric-react/lib/Nav';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import './index.less';

export interface Props {

}
export interface State {
  currentTab: string | undefined,
}

class Writting extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);

  }

  render() {
    return (
      <div className="Writting">
        <div className="Writting-left">
          Writing page
        </div>
      </div>
    )
  }
};

export default Writting;