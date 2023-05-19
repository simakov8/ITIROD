export function validate_email(email) {
  let expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    return true;
  } else {
    return false;
  }
}

export function validate_password(password) {
  if (password.length < 6) {
    return false;
  } else {
    return true;
  }
}

export function validate_field(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}
