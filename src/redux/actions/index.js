import { createAction } from 'redux-actions';
import * as ActionType from '../reducers';
import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';
// import leancloud from '../../utils/leancloud';

export const getPostView = createAction('FETCH_POST_VIEW');
export const setPostView = createAction(ActionType.SET_POST_VIEW);
export const epicGetPost = action$ => {
  return action$.pipe(
    ofType(getPostView),
    mergeMap(async action => {
      const { paths, needIncrease } = action.payload;
      // const data = await leancloud(paths, needIncrease)
      // return setPostView(data)
    })
  );
};
