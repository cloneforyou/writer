import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Root from './root';

// tslint:disable:jsx-no-lambda
ReactDOM.render(<Root />, document.getElementById('root'))
console.log('webpack');

if (module.hot) {
    module.hot.accept()
}