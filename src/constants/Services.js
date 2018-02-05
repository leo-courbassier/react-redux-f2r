// server address
// export const BASE_URL = 'https://ec2-52-91-200-31.compute-1.amazonaws.com:9931/api';
export const BASE_URL = 'https://api.fit2rent.com/api';

// methods

export const USER_USER = BASE_URL + '/user/user';
export const USER_USER_DETAILS = BASE_URL + '/user/user?returnDetails=true';
export const USER_SIGNUP = BASE_URL + '/user/addUser';
export const USER_PROFILE_PIC = BASE_URL + '/user/profilePic';

export const USER_UPDATE_USER = BASE_URL + '/user/updateUser';

export const TT_CHECKINVITES = BASE_URL + '/tt/checkInvites';

export const TT_ADDPETS = BASE_URL + '/tt/addPets';
export const TT_DELETEPETS = BASE_URL + '/tt/deletePets';
export const TT_PETS = BASE_URL + '/tt/pets';

export const TT_ADDRESSES = BASE_URL + '/tt/addresses';

export const TT_STEP1 = BASE_URL + '/tt/step1';
export const TT_STEP2 = BASE_URL + '/tt/step2';
export const TT_STEP3 = BASE_URL + '/tt/step3';
export const TT_STEP6 = BASE_URL + '/tt/step6';

export const TT_LINKEDACCOUNTS = BASE_URL + '/tt/linkedAccounts';
export const FACEBOOK_AUTHORIZEURL = BASE_URL + '/facebook/authorizeUrl';
export const LINKEDIN_AUTHORIZEURL = BASE_URL + '/linkedin/authorizeUrl';
export const FACEBOOK_AUTHORIZE = BASE_URL + '/facebook/authorize';
export const LINKEDIN_AUTHORIZE = BASE_URL + '/linkedin/authorize';
export const FACEBOOK_TOKEN = BASE_URL + '/facebook/token';
export const LINKEDIN_TOKEN = BASE_URL + '/linkedin/token';

export const VERIFY_VERIFICATION = BASE_URL + '/verify/employment';
export const VERIFY_REQUESTVERIFY = BASE_URL + '/verify/requestVerify';
export const TT_REQUESTFEEDBACK = BASE_URL + '/tt/requestFeedback';

export const TT_LL_FEEDBACK = BASE_URL + '/tt/llfeedback';

export const TT_AI = BASE_URL + '/tt/ai';
export const TT_ADDAI = BASE_URL + '/tt/addAI';
export const TT_DELETEAI = BASE_URL + '/tt/deleteAI';
export const DEPOT_UPLOAD = BASE_URL + '/depot/upload';
export const DEPOT_UPLOADCR = BASE_URL + '/depot/uploadCR';

export const TT_ADDRENTMANDATE = BASE_URL + '/tt/addRentMandate';
export const TT_ADDFAMILY = BASE_URL + '/tt/addFamily';
export const TT_INVITEROOMMATE = BASE_URL + '/tt/inviteRoommate';
export const TT_MANDATES = BASE_URL + '/tt/mandates';

export const GEO_STATES = BASE_URL + '/geo/states';
export const GEO_CITIES = BASE_URL + '/geo/cities';

export const GR_VERIFY = BASE_URL + '/gr/verify';

// stripe

export const PAYMENT_CCADHOC = BASE_URL + '/payment/cc-ad-hoc';

// dwolla

export const PAYMENT_ACHFS = BASE_URL + '/payment/ach-fs?verified=true';

export const DWOLLA_IAV_CREATECUSTOMER = BASE_URL + '/dwolla/iav/create-customer';
export const DWOLLA_IAV_TOKEN = BASE_URL + '/dwolla/iav/token';

export const PAYMENT_ACHADHOC = BASE_URL + '/payment/ach-ad-hoc';


// reset password

export const USER_GETURL = BASE_URL + '/user/getUrl';
export const USER_UPDATE = BASE_URL + '/user/update';

// feedback

export const TT_DATA = BASE_URL + '/tt/data';
export const TT_FEEDBACK = BASE_URL + '/tt/feedback';


// payment

export const PAYMENT_ACCTS = BASE_URL + '/payment/accts';

// ecommerce

export const E_CATALOG = BASE_URL + '/e/catalog';
export const E_CALCULATE_DISCOUNT = BASE_URL + '/e/calculateDiscount';
export const E_TT_CHECKOUT = BASE_URL + '/e/ttCheckout';

// verify

export const VERIFY_DATA = BASE_URL + '/verify/data';
export const VERIFY_CONFIRM = BASE_URL + '/verify/confirm';

// f2r score

export const TT_F2RSCORE = BASE_URL + '/tt/f2rScore';
export const TT_PSEUDO_F2RSCORE = BASE_URL + '/tt/pseudoF2RScore';
