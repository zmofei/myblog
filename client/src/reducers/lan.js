const lan = (state = { lan: 'zh' }, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return Object.assign({}, state, { lan: action.lan });
    default:
      return state;
  }
}

export default lan;