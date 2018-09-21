const mockyeah = require('mockyeah');
const path = require('path');

mockyeah.get('/', { text: 'Hello World' });
mockyeah.get('/api/storybooks', { filePath: path.resolve(__dirname, 'response/get/story/all.json') });