import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css';

import { BrowserRouter } from "react-router-dom";
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { loadTheme } from '@uifabric/styling';

import icons_src from './assets/icons/fabricmdl2icons-2.68.woff2';
import FabricTheme from './Fabric.theme';
import Root from './root';
import './app.less';
import { Provider } from 'react-redux'

import store from './store'

initializeIcons(icons_src);
loadTheme(FabricTheme);

// tslint:disable:jsx-no-lambda
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Fabric><Root /></Fabric>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));

if (module.hot) {
  module.hot.accept()
}