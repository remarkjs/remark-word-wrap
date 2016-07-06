import {readdirSync as directory, readFileSync as file} from 'fs';
import {join} from 'path';
import ava from 'ava';
import wrap from '..';
import remark from 'remark';

const base = join(__dirname, 'fixtures');

const specs = directory(base).reduce((tests, contents) => {
    const parts = contents.split('.');
    if (!tests[parts[0]]) {
        tests[parts[0]] = {};
    }
    tests[parts[0]][parts[1]] = file(join(base, contents), 'utf-8');
    return tests;
}, {});

Object.keys(specs).forEach(name => {
    const spec = specs[name];
    ava(name, t => {
        const {contents} = remark().use(wrap).process(spec.fixture, {
            commonmark: true,
            footnotes: true,
        });
        t.deepEqual(contents, spec.expected);
    });
});
