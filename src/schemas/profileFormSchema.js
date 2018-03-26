import buildSchema from 'redux-form-schema'

const schema = {
  'firstName': {
    label: 'First Name',
    required: true
  },
  'lastName': {
    label: 'Last Name',
    required: true
  },
  'email': {
    label: 'Email',
    required: true
  },
  'phoneNumber': {
    label: 'Phone Number'
  },
  'dobYear': {
    label: 'Date of Birth (Year)'
  },
  'dobMonth': {
    label: 'Date of Birth (Month)'
  },
  'dobDay': {
    label: 'Date of Birth (Month)'
  },
  'description': {
    label: 'Description'
  }
}

export default buildSchema(schema)
