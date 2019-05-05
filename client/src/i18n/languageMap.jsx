import React from "react";
import { connect } from 'react-redux';

import lanmap from './languageMap.json';

function getText(mouduleName, lan) {
  const path = mouduleName.split('.');
  let text = lanmap;
  let i = 0;
  while (text !== undefined && i < path.length) {
    text = text[path[i]];
    i += 1;
  }
  return text[lan];
}

function lan(props) {
  return <>{getText(props.mouduleName, props.lan)}</>;
}

const mapStateToProps = state => {
  return { lan: state.lan };
};

export default connect(
  mapStateToProps
)(lan);