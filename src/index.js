import visit from 'unist-util-visit';

function getWords (value) {
    return value.replace(/\n/g, ' ').split(' ');
}

function joinWords (lines, newline) {
    return lines.map(line => line.join(' ')).join(newline);
}

export default function attacher (remark, opts) {
    const {indent, newline, width} = {
        indent: '',
        newline: '\n',
        width: 72,
        ...opts
    };

    function visitor (node) {
        if (node.type !== 'paragraph') {
            return;
        }

        let len = 0;

        let recurse = function (sub) {
            let child = 0;
            let current, lines, pos, words, word;

            while (child < sub.children.length) {
                current = sub.children[child];
                if (current.type === 'image') {
                    len = len + current.src.length + (current.alt || '').length;
                    child ++;
                }
                if (current.type === 'link') {
                    words = getWords(current.children[0].value);
                    lines = [[]];
                    pos = 0;

                    while (pos < words.length) {
                        word = words[pos];
                        if (len + word.length + 1 < width) {
                            if (len === 0) {
                                word = indent + word;
                            }
                            lines[lines.length - 1].push(word);
                            len = len + word.length + 1;
                        } else {
                            if (pos === 0) {
                                sub.children[child - 1].value += '\n' + indent;
                                lines[lines.length - 1].push(word);
                            } else {
                                lines.push([`${indent}${word}`]);
                            }
                            len = word.length + 1;
                        }
                        pos ++;
                    }
                    
                    current.children[0].value = joinWords(lines, newline);

                    // Add extra padding for anchor delimiters; []()
                    len = len + current.href.length + 4;
                    child ++;
                }
                if (current.value) {
                    words = getWords(current.value);
                    lines = [[]];
                    pos = 0;

                    while (pos < words.length) {
                        word = words[pos];
                        if (len + word.length + 1 < width) {
                            if (len === 0) {
                                word = indent + word;
                            }
                            lines[lines.length - 1].push(word);
                            len = len + word.length + 1;
                        } else {
                            lines.push([`${indent}${word}`]);
                            len = word.length + 1;
                        }
                        pos ++;
                    }

                    current.value = joinWords(lines, newline);
                    child ++;
                }
                if (current.children && current.type !== 'link') {
                    recurse(current);
                    child ++;
                }
            }
        };

        recurse(node);
    }

    return ast => visit(ast, visitor);
}
