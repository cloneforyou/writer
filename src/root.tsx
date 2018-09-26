import * as React from 'react';
import { Route, Switch, withRouter, RouteProps, RouteComponentProps } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';

import { DragDropContext } from 'react-dnd';


import Landing from './pages/Landing';
import Setting from './pages/Setting';
import Writting from './pages/Writting';
import Stories from './pages/Stories';
import StoriesSpace from './pages/Stories/Space';

import * as PropTypes from 'prop-types';
import { Nav, INavProps, INavLinkGroup, INavLink, } from 'office-ui-fabric-react/lib/Nav';
import AppNav from './components/AppNav';
import CustomPreviewLayer from './components/CustomPreviewLayer';


export interface Props {

}
export interface State {
  currentTab: string | undefined,
}

class Root extends React.Component<Props & RouteComponentProps, State>{
  constructor(props: Props & RouteComponentProps) {
    super(props);
    this.state = {
      currentTab: 'stories',
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
      <div className="app">
        <CustomPreviewLayer />
        <AppNav onLinkClick={this.handleTabChange} currentTab={this.state.currentTab!} />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/stories" component={Stories} />
          <Route exact path="/stories/:sid" component={StoriesSpace} />
          <Route exact path="/stories/writting" component={Writting} />
          <Route exact path="/settings" component={Setting} />
        </Switch>
      </div>
    )
  }
};

export default withRouter(DragDropContext(HTML5Backend)(Root));