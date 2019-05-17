/* eslint-disable */
const px2dpUnitRE = /^([+-]?[0-9.]+)(pxdp|pxfz)$/;

function isPx2dpUnit(value) {
  return px2dpUnitRE.test(value);
}

function getMatchObject(dim) {
  // const vh = dim.height;
  // const vw = dim.width;
  // return {
  //   vh: vh,
  //   vw: vw,
  //   vmax: Math.max(vw, vh),
  //   vmin: Math.min(vw, vh)
  // };
  return dim;
}

function clone(aObject) {
  let value;
  const bObject = {};
  for (const key in aObject) {
    value = aObject[key];
    bObject[key] = typeof value === "object" ? clone(value) : value;
  }
  return bObject;
}

export function transform(styles, dimensions) {
  const dim = getMatchObject(dimensions);

  function replacePx2dpUnit(_, number, unit) {
    
    // const base = dim[unit];
    // const val = parseFloat(number) / 100;
    // return val * base;
    let val = number;
    if(unit === 'pxdp'){ // for dimension size
      val = dimSize(number, dim);
    }else if(unit === 'pxfz'){ // for fontsize
      val = textSize(number, dim);
    }
    return val;
  }

  function replace(value) {
    return parseFloat(value.replace(px2dpUnitRE, replacePx2dpUnit));
  }

  const replacement = clone(styles);

  for (const key in replacement) {
    const selector = replacement[key];

    if (isPx2dpUnit(selector)) {
      replacement[key] = replace(selector);
      continue;
    }

    for (const key in selector) {
      const val = selector[key];

      if (isPx2dpUnit(val)) {
        selector[key] = replace(val);
        continue;
      }

      for (const key in val) {
        if (isPx2dpUnit(val[key])) {
          val[key] = replace(val[key]);
          continue;
        }
      }
    }
  }
  return replacement;
}

function dimSize(size, dimensions){
  const designWidth = dimensions.designWidth;
  return Math.round((size / designWidth) * dimensions.width);
}

function textSize(size, dimensions){
  const designWidth = dimensions.designWidth;
  return Math.round((size / designWidth) * dimensions.width / dimensions.fontScale);
}

