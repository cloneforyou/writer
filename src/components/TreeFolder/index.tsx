import * as React from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';


import * as PropTypes from 'prop-types';
import { Nav, INavProps, INavLinkGroup, INavLink, } from 'office-ui-fabric-react/lib/Nav';
import { IRenderFunction } from '@uifabric/utilities';


interface DragableLinkOwnProps {
  link: INavLink
}

export class DragableLink extends React.Component<DragableLinkOwnProps> {
  render() {
    const { link } = this.props;
    return (
      <div className="ms-Nav-linkText linkText-40">
        {link.name || ''}
      </div>)
  }
}



export interface Props {

}
export interface State {
  currentFolder: string | undefined,
}
export class FolderNav extends React.Component<any, any> {
  constructor(props: INavProps) {
    super(props);
    this.state = {
      currentFolder: 'MainMenu',
    }
  }
  renderLink: IRenderFunction<INavLink> = (link, defaultRender): JSX.Element | null => {
    if (typeof link !== 'undefined' && defaultRender) {
      return <DragableLink link={link} />

    }
    return null
  }
  render(): JSX.Element {
    const { currentFolder, onLinkClick } = this.props;

    return (
      <div className="ms-NavExample-LeftPane">
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

class TreeFolder extends React.Component<Props & RouteComponentProps, State>{
  constructor(props: Props & RouteComponentProps) {
    super(props);
    this.state = {
      currentFolder: 'Stories',
    }
  }
  private handleTabChange = (ev?: React.MouseEvent<HTMLElement>, link?: INavLink): void => {
    if (link) {
      this.setState({ currentFolder: link.key })
      // this.props.history.push(link.path as string)
    }
    return;
  }

  render() {
    return (
      <div className="appNav">
        <FolderNav onLinkClick={this.handleTabChange} currentFolder={this.state.currentFolder} />
      </div>
    )
  }
};

export default withRouter(TreeFolder);