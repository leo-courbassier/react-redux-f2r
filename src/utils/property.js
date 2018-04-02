import * as Conversion from './conversion';

export const getLastPropertyImageURL = (property) => {
  if (property.imageUrls && property.imageUrls.length) {
    const len = property.imageUrls.length - 1;
    return Conversion.urlToHttps(property.imageUrls[len]);
  } else {
    return '';
  }
};
