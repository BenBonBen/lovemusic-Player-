function getmatrix(a, b, c, d, e, f) {
  var aa = Math.round((180 * Math.asin(a)) / Math.PI);
  var bb = Math.round((180 * Math.acos(b)) / Math.PI);
  var cc = Math.round((180 * Math.asin(c)) / Math.PI);
  var dd = Math.round((180 * Math.acos(d)) / Math.PI);
  var deg = 0;
  if (aa == bb || -aa == bb) {
    deg = dd;
  } else if (-aa + bb == 180) {
    deg = 180 + cc;
  } else if (aa + bb == 180) {
    deg = 360 - cc || 360 - dd;
  }
  return deg >= 360 ? 0 : deg;
}
