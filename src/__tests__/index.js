import ava from 'ava';
import wrap from '..';
import remark from 'remark';
import {readdirSync as directory, readFileSync as file} from 'fs';
import {join} from 'path';

const base = join(__dirname, 'fixtures');

const specs = directory(base).reduce((tests, contents) => {
    var parts = contents.split('.');
    if (!tests[parts[0]]) {
        tests[parts[0]] = {};
    }
    tests[parts[0]][parts[1]] = file(join(base, contents), 'utf-8');
    return tests;
}, {});

Object.keys(specs).forEach(name => {
    var spec = specs[name];
    ava(name, t => {
        const result = remark.use(wrap).process(spec.fixture);
        t.same(result, spec.expected);
    });
});
