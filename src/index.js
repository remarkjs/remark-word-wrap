import is from 'unist-util-is';
import parents from 'unist-util-parents';
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
                if (is('break', current)) {
                    len = 0;
                    child ++;
                }
                if (is('image', current)) {
                    len = len + current.url.length + (current.alt || '').length;
                    child ++;
                }
                if (is('imageReference', current) || is('footnoteReference', current)) {
                    child ++;
                }
                if (current.node.value) {
                    words = getWords(current.node.value);
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
                            if (pos === 0 && current.parent && is('link', current.parent)) {
                                let paragraph = current.parent.parent.node;
                                let index = paragraph.children.indexOf(current.parent.node);
                                if (index > 0) {
                                    paragraph.children[index - 1].value += `\n${indent}`;
                                    lines[lines.length - 1].push(word);
                                } else {
                                    lines[lines.length - 1].push([`${indent}${word}`]);
                                }
                            } else {
                                lines.push([`${indent}${word}`]);
                            }
                            len = word.length + 1;
                        }
                        pos ++;
                    }

                    current.node.value = joinWords(lines, newline);
                    child ++;
                }
                if (current.children) {
                    recurse(current);
                    if (is('link', current)) {
                        // Add extra padding for anchor delimiters; []()
                        len = len + current.url.length + 4;
                    }
                    if (is('linkReference', current)) {
                        // Add extra padding for identifier delimiters; [][]
                        len = len + current.identifier.length + 4;
                    }
                    child ++;
                }
            }
        };

        recurse(parents(node));
    }

    return ast => visit(ast, visitor);
}
