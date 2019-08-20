import { createAction } from 'redux-actions';
import * as ActionType from '../reducers';
import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

export const getPostView = createAction('FETCH_POST_VIEW');
export const setPostView = createAction(ActionType.SET_POST_VIEW);
export const epicGetPost = action$ => {
  return action$.pipe(
    ofType(getPostView),
    mergeMap(async action => {
      // const { paths, needIncrease } = action.payload;
      // return setPostView(data)
    })
  );
};
