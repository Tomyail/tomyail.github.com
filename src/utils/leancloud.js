const appId = 'ojpiPcPScpDeGiG9luvwggTr-gzGzoHsz';
const appKey = 'xMQi6zHfXigzYx03QqEDXjkC';
var AV = require('leancloud-storage');
AV.init({ appId, appKey });

import * as R from 'ramda';
const makeQuery = R.map(path => {
  const query = new AV.Query('Counter');
  query.contains('url', path);
  return query;
});

const wrapLeanData = R.map(item => ({
  id: item.get('objectId'),
  url: item.get('url').substring(0, item.get('url').length - 1),
  title: item.get('title'),
  time: item.get('time'),
  item: item
}));

const increaseItem = R.map(({ item }) => {
  item.increment('time', 1);
  return item;
});
const find = query => AV.Query.or.apply(this, query).find();
const increase = item => R.pipeP(AV.Object.saveAll, AV.Object.fetchAll)(item);
export default async function(urls, needIncrease) {
  const query = makeQuery(urls);
  if (query.length) {
    //can not use async
    //https://github.com/gatsbyjs/gatsby/issues/3931#issuecomment-364414141
    //https://github.com/ember-cli/ember-cli-uglify/issues/5
    const queryResult = await find(query);
    const result = wrapLeanData(queryResult);
    if (needIncrease && process.env.NODE_ENV === 'production') {
      const needIncraseItem = increaseItem(result);
      const increasedItem = await R.composeP(
        AV.Object.fetchAll,
        AV.Object.saveAll
      )(needIncraseItem);
      return wrapLeanData(increasedItem);
    } else {
      return result;
    }
  }
}
