const appId = 'ojpiPcPScpDeGiG9luvwggTr-gzGzoHsz';
const appKey = 'xMQi6zHfXigzYx03QqEDXjkC';
var AV = require('leancloud-storage');
AV.init({ appId, appKey });
import _ from 'lodash';
import * as R from 'ramda';

import React, { Component, Fragment } from 'react';

export default class Lean extends Component {
  constructor() {
    super();
  }
  runCallback(result) {
    if (this.props.onLeancloud) {
      this.props.onLeancloud(result);
    }
  }
  componentDidMount() {
    const { urls } = this.props;
    const querys = _.map(urls, path => {
      console.log(path);
      const query = new AV.Query('Counter');
      query.contains('url', path);
      return query;
    });

    const wrapLeanData = R.map(item => ({
      id: item.get('objectId'),
      url: item.get('url'),
      title: item.get('title'),
      time: item.get('time'),
      item: item
    }));

    const increaseItem = R.map(({ item }) => {
      item.increment('time', 1);
      return item;
    });

    if (querys.length) {
      var query = AV.Query.or.apply(this, querys);
      query.find().then(x => {
        const result = wrapLeanData(x);
        if (this.props.needIncrease && process.env.NODE_ENV === 'production') {
          const needIncraseItem = increaseItem(result);
          AV.Object.saveAll(needIncraseItem).then(objects =>
            AV.Object.fetchAll(objects).then(d =>
              this.runCallback(wrapLeanData(d))
            )
          );
        } else {
          this.runCallback(result);
        }
      });
    }
  }

  render() {
    return <div />;
  }
}
