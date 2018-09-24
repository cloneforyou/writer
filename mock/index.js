const mockyeah = require('mockyeah');
const path = require('path');

mockyeah.get('/', { text: 'Hello World' });
mockyeah.get('/api/storybooks', { filePath: path.resolve(__dirname, 'response/get/story/all.json') });
mockyeah.put('/api/storybooks', { filePath: path.resolve(__dirname, 'response/put/story/newStorybook.json') });
mockyeah.post('/api/storybooks', { filePath: path.resolve(__dirname, 'response/post/story/rename.json') });
mockyeah.delete('/api/storybooks', { filePath: path.resolve(__dirname, 'response/delete/story/one.json') });