import { combineEpics } from 'redux-observable';

import { epicGetPost } from '../actions/';
export const rootEpic = combineEpics(epicGetPost);
