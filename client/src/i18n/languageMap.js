function initMaps() {
  const langIndex = /himofei/.test(window.location.href) ? 1 : 0;
  const themap = {
    lang: ['zh-cn', 'en']
  }
  Object.keys(themap).forEach(key => {
    themap[key] = themap[key][langIndex];
  });
  return themap;
}

export default initMaps();