# [remark]-word-wrap [![Build Status](https://travis-ci.org/ben-eb/remark-word-wrap.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/remark-word-wrap.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/remark-word-wrap.svg)][deps]

> Wrap lines of Markdown to a specified width.


## Install

With [npm](https://npmjs.org/package/remark-word-wrap) do:

```
npm install remark-word-wrap
```


## Example

```javascript
var remark = require('remark');
var wrap = require('remark-word-wrap');
var markdown = 'Hello, world!';
var result = remark().use(wrap, {width: 5}).process(markdown);
```

Output:

```md

Hello,
world!
```


## API

Add extra line breaks to `paragraph` nodes to ensure that they fit to a
specified width.

### remark.use(wrap, [options])

#### options

##### indent

Type: `string`
Default: `''` (empty)

Prepend this string to the start of each line.

##### newline

Type: `string`
Default: `\n`

Append this string to the end of each line.

##### width

Type: `number`
Default: `72`

The maximum length of the line. Note that this does not include additional
characters from elements like lists.


## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.


## License

MIT © [Ben Briggs](http://beneb.info)

[ci]: https://travis-ci.org/ben-eb/remark-word-wrap

[deps]: https://gemnasium.com/ben-eb/remark-word-wrap

[npm]: http://badge.fury.io/js/remark-word-wrap

[remark]: https://github.com/wooorm/remark
