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

class Stories extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);

  }
  private handleTabChange = (ev?: React.MouseEvent<HTMLElement>, link?: INavLink): void => {
    if (link) {
      this.setState({ currentTab: link.key })
    }
    return;
  }

  render() {
    return (
      <div className="Story">
        <div className="Story-xxx">
          Stopey page
        </div>
      </div>
    )
  }
};

export default Stories;