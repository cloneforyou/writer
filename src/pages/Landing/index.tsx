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
      <div className="ms-Nav-LeftPane">
        <div className="logo">
          <h1>Writer</h1>
        </div>
        <Nav
          className='reverse'
          groups={[{
            links: [
              { name: '写作', icon: 'Edit', url: '', key: 'Writing', },
              { name: '笔记', icon: 'EditNote', url: '', key: 'Notes' },
              { name: '灵感', icon: 'Lightbulb', url: '', key: 'Inspirations' },
            ]
          }, {
            links: [
              { name: '发现', icon: 'Cafe', url: '', key: 'Explore', },
              { name: '关注', icon: 'Family', url: '', key: 'Follow', },
              { name: '收藏', icon: 'FavoriteStar', url: '', key: 'Favorites' },
            ]
          }, {
            links: [
              { name: '同步', icon: 'Sync', url: '', key: 'Sync' },
              { name: '导出', icon: 'Download', url: '', key: 'Donwload' },
              { name: '回收站', icon: 'Delete', url: '', key: 'TrashBin' },
            ]
          }, {
            links: [
              { name: '账户', icon: 'Contact', url: '', key: 'Account', },
              { name: '设置', icon: 'Settings', url: '', key: 'Settings' },
            ]
          }] as INavLinkGroup[]}
          selectedKey={currentTab}
          onLinkClick={onLinkClick}
        />

      </div>
    );
  }

}

class Landing extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTab: 'Writting',

    }
  }
  private handleTabChange = (ev?: React.MouseEvent<HTMLElement>, link?: INavLink): void => {
    if (link) {
      this.setState({ currentTab: link.key })
    }
    return;
  }

  render() {
    return (
      <div className="Landing">
        <div className="Landing-left">
       Langind page
        </div>
      </div>
    )
  }
};

export default Landing;