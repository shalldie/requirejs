
import * as _ from './utils';

const result = _.pathNormalize('./a/b/c/../../e/f');

document.getElementById('root').innerHTML = result;
