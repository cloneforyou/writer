import * as React from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';


import * as PropTypes from 'prop-types';
import { Nav, INavProps, INavLinkGroup, INavLink, } from 'office-ui-fabric-react/lib/Nav';

export interface Props {
  onLinkClick: Function,
  currentTab: string
}
export interface State {
  currentTab: string | undefined,
}
export class NavBasic extends React.Component<any, any> {
  constructor(props: INavProps) {
    super(props);
    this.state = {
      currentTab: 'MainMenu',
    }
  }

  render(): JSX.Element {
    const { currentTab, onLinkClick } = this.props;

    return (
      <div className="ms-NavExample-LeftPane">
        <div className="logo">
          <h1>Writer</h1>
        </div>
        <Nav
          className='reverse'
          groups={[{
            links: [
              { name: '写作', icon: 'Edit', url: '', key: 'Stories', path: '/stories' },
              { name: '笔记', icon: 'EditNote', url: '', key: 'Notes', path: '/notes' },
              { name: '灵感', icon: 'Lightbulb', url: '', key: 'Inspirations', path: '/ideas' },
            ]
          }, {
            links: [
              { name: '发现', icon: 'Cafe', url: '', key: 'Explore', path: '/explore' },
              { name: '关注', icon: 'Family', url: '', key: 'Follow', path: '/follow' },
              { name: '收藏', icon: 'FavoriteStar', url: '', key: 'Favorites', path: '/favorite' },
            ]
          }, {
            links: [
              { name: '同步', icon: 'Sync', url: '', key: 'Sync', path: '/sync' },
              { name: '导出', icon: 'Download', url: '', key: 'Donwload', path: '/download' },
              { name: '回收站', icon: 'Delete', url: '', key: 'TrashBin', path: '/transh' },
            ]
          }, {
            links: [
              { name: '账户', icon: 'Contact', url: '', key: 'Account', path: '/account' },
              { name: '设置', icon: 'Settings', url: '', key: 'Settings', path: '/settings' },
            ]
          }] as INavLinkGroup[]}
          selectedKey={currentTab}
          onLinkClick={onLinkClick}
        />

      </div>
    );
  }

}

class MainNav extends React.Component<Props & RouteComponentProps, State>{
  constructor(props: Props & RouteComponentProps) {
    super(props);
    this.state = {
      currentTab: 'Stories',
    }
  }
  private handleTabChange = (ev?: React.MouseEvent<HTMLElement>, link?: INavLink): void => {
    if (link) {
      this.setState({ currentTab: link.key })
      this.props.history.push(link.path as string)
    }
    return;
  }

  render() {
    return (
      <div className="appNav">
        <NavBasic onLinkClick={this.handleTabChange} currentTab={this.state.currentTab} />
      </div>
    )
  }
};

export default withRouter(MainNav);