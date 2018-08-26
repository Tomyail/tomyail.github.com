import { handleAction } from 'redux-actions';

// import * as R from 'ramda';
import { combineReducers } from 'redux';
import _ from 'lodash';

export const SET_POST_VIEW = 'SET_POST_VIEW';

const postView = handleAction(
  SET_POST_VIEW,
  (state, action) => {
    const post = action.payload;
    const mapKeys = _.mapKeys(post, val => {
      return val.url;
    });
    return { ...state, ...mapKeys };
  },
  {}
);

export default combineReducers({ postView });
