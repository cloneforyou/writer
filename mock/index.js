const mockyeah = require('mockyeah');
const path = require('path');

mockyeah.get('/', { text: 'Hello World' });
mockyeah.get('/api/storybooks', { filePath: path.resolve(__dirname, 'response/get/story/all.json') });
mockyeah.put('/api/storybooks', { filePath: path.resolve(__dirname, 'response/put/story/newStorybook.json') });
mockyeah.post('/api/storybooks', { filePath: path.resolve(__dirname, 'response/post/story/rename.json') });
mockyeah.delete('/api/storybooks', { filePath: path.resolve(__dirname, 'response/delete/story/one.json') });
mockyeah.get('/api/storybooks/:sid', { filePath: path.resolve(__dirname, 'response/get/folder/all.json') });
mockyeah.put('/api/folders', { filePath: path.resolve(__dirname, 'response/put/folder/newStorybook.json') });
mockyeah.post('/api/folders', { filePath: path.resolve(__dirname, 'response/post/folder/rename.json') });
mockyeah.delete('/api/folders', { filePath: path.resolve(__dirname, 'response/delete/folder/one.json') });