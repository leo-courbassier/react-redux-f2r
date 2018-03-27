import DocumentsPaymentForm from '../../components/account/DocumentsPaymentForm';
import { reduxForm } from 'redux-form';

export default reduxForm({
  form: 'documentsPaymentForm'
})(DocumentsPaymentForm);
