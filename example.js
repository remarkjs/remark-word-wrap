var remark = require('remark');
var wrap = require('./src/index.js');

var markdown = 'Hello, world!';
var result = remark().use(wrap, {width: 5}).process(markdown);

// Output:
console.log('md', result.contents);
