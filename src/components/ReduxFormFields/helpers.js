export const hasFieldError = field =>
  field.meta.touched && field.meta.error;

export const isValidEmail = email =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export const getDigitsOnly = value =>
  value.replace(/\D/g,'').trim();

export const isValidPhone = value =>
  getDigitsOnly(value).length >= 10;
