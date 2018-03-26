import React, { PropTypes } from 'react';

// regex for requirements: http://stackoverflow.com/a/31934169/4958776
const hasUpper = /(?=.*[A-Z])/;
const hasLower = /(?=.*[a-z])/;
const hasNumber = /(?=.*[0-9])/;
const hasSpecial = /(?=.*[!@#$%^&*])/;

class PasswordStrengthMeter extends React.Component {
  static getPasswordScore(password) {
    let score = 0;

    if (!password) return score;

    // requirement checks
    if (password.length >= 8) score++;
    if (hasUpper.test(password)) score++;
    if (hasLower.test(password)) score++;
    if (hasNumber.test(password)) score++;
    if (score == 4 && hasSpecial.test(password)) score++;

    return score;
  }

  getScore(password) {
    return PasswordStrengthMeter.getPasswordScore(password);
  }

  getMessage(score) {
    let message = '';
    switch (score) {
      case 1:
        message = 'Bad';
      break;
      case 2:
        message = 'Okay';
      break;
      case 3:
        message = 'Good';
      break;
      case 4:
        message = 'Strong';
      break;
      case 5:
        message = 'Very Strong';
      break;
    }
    return message;
  }

  // this will add color to the box based on its position and current score
  getBoxClassName(position, score) {
    return (position <= score) ? 'score-'+score : 'score-neutral';
  }

  // this is used externally to display errors
  static getPasswordErrors(password) {
    let errors = [];

    if (!password) return errors;

    if (password.length < 8) errors.push('length');
    if (!hasUpper.test(password)) errors.push('upper');
    if (!hasLower.test(password)) errors.push('lower');
    if (!hasNumber.test(password)) errors.push('number');

    return errors;
  }

  getErrors(password) {
    return PasswordStrengthMeter.getPasswordErrors(password);
  }

  render() {
    const score = this.getScore(this.props.password);
    const message = this.getMessage(score);
    return (
      <div>
        {this.props.password && (
          <div className="password-strength-meter">
            <span className={'score '+this.getBoxClassName(1, score)}></span>
            <span className={'score '+this.getBoxClassName(2, score)}></span>
            <span className={'score '+this.getBoxClassName(3, score)}></span>
            <span className={'score '+this.getBoxClassName(4, score)}></span>
            <span className={'score '+this.getBoxClassName(5, score)}></span>
            <span className={'message message-score-'+score}>{message}</span>
          </div>
        )}
      </div>
    );
  }

}

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired
};

export default PasswordStrengthMeter;
