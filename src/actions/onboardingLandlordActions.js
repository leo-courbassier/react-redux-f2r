import * as types from '../constants/ActionTypes';
import * as services from '../constants/Services';
import 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import _ from 'underscore';

import * as api from './api';
import * as conversion from '../utils/conversion';

import {logout, updateUserInfo} from './loginActions';


export function getCheckoutReady(callback) {
  return function (dispatch, getState) {
    api.getUserDetails(dispatch, getState, (json) => {
      let canSkipStep6 = json.onboardingStatus === 'STEP_SIX';
      let hasNotCheckedOut = json.userDetails.ttServiceLevel === 'NONE';

      if (typeof callback === 'function') {
        callback({ canSkipStep6, hasNotCheckedOut });
      }
    });
  };
}

export function updateOnboardingScore() {
  return function (dispatch, getState) {
    api.getPseudoScore(dispatch, getState, (response) => {
      let score = response.f2rScore;
      dispatch({type: types.ONBOARDING_UPDATE_SCORE, score});
    });
  };
}

/////////////////////////////////////////////////////////////////////////////
// step one

export function updateStepOneForm(settings, name, value) {

  return function (dispatch, getState) {
    api.setStatus(dispatch, 'modified', 'stepOneForm', true);
    dispatch({type: types.ONBOARDING_STEPONE_FORM_UPDATE, settings, name, value});
  };
}

export function loadStepOne(){
  return function (dispatch, getState) {

    let requestUser = api.getUserDetails(dispatch, getState);
    let requestPets = api.getPets(dispatch, getState);
    let requestLinkedAccounts = api.getLinkedAccounts(dispatch, getState);
    let requestFacebookToken = api.getFacebookToken(dispatch, getState);
    let requestLinkedinToken = api.getLinkedinToken(dispatch, getState);


    api.setStatus(dispatch, 'loading', 'stepOneForm', true);

    Promise.all([
      requestUser,
      requestPets,
      requestLinkedAccounts,
      requestFacebookToken,
      requestLinkedinToken
      ])
    .then((results) => {

      let user = results[0].userDetails;
      let pets = results[1];
      let linkedAccounts = results[2];

      let dogs = _.where(pets, {type: 'DOG'}).length.toString();
      let cats = _.where(pets, {type: 'CAT'}).length.toString();
      let other = _.where(pets, {type: 'OTHER'}).length.toString();

      let facebookToken = results[3];
      let linkedinToken = results[4];

      dispatch({ type: types.ONBOARDING_STEPONE_FORM_LOAD,
        user,
        dogs,
        cats,
        other,
        linkedAccounts,
        facebookToken,
        linkedinToken });

      api.setStatus(dispatch, 'loading', 'stepOneForm', false);
    });


  };
}

export function saveStepOne(description,  dogs, cats, other, openNextStep, callback,openNextStepFunction) {
  return function (dispatch, getState) {
    let authHeader = api.getAuthHeaders(dispatch, getState);

    let userId = getState().loginAppState.userInfo.id;

    let pets = [];
    for (let i=0;i < dogs;i++){
      pets.push({"type": "DOG", "userId": userId});
    }
    for (let i=0;i < cats;i++){
      pets.push({"type": "CAT", "userId": userId});
    }
    for (let i=0;i < other;i++){
      pets.push({"type": "OTHER", "userId": userId});
    }


    let statusAction = openNextStep ? 'stepOneFormProceed' : 'stepOneForm';
    api.setStatus(dispatch, 'saving', statusAction, true);

    let payloadUser = {
        "id": userId,
        "userDetails": {
          "description": description
        }
      };

    let payload = {"user": payloadUser, "petList": pets};


    api.postStepOne(dispatch, getState, payload, () => {
      api.setStatus(dispatch, 'saving', statusAction, false);
      api.setStatus(dispatch, 'modified', 'stepOneForm', false);
      dispatch({type: types.ONBOARDING_STEPONE_FORM_UPDATE, name: 'saved', value: true});
      if (callback) callback();
      if (openNextStep) openNextStepFunction();
    });



  };
}

export function uploadProfilePic(file) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'uploading', 'profilePicUpload', true);
    api.uploadProfilePic(dispatch, getState, file, () =>{
      api.setStatus(dispatch, 'uploading', 'profilePicUpload', false);
      dispatch(updateUserInfo());
    });

  };
}



/////////////////////////////////////////////////////////////////////////////
// step two


export function updateStepTwoForm(settings, name, value) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'modified', 'stepTwoForm', true);
    dispatch({type: types.ONBOARDING_STEPTWO_FORM_UPDATE, settings, name, value});
  };
}

export function loadStepTwo(){
  return function (dispatch, getState) {
    let requestIncomeSources = api.getIncomeSources(dispatch, getState);
    let authHeader = api.getAuthHeaders(dispatch, getState);
    let requestUser = api.getUserDetails(dispatch, getState);
    let requestStates = api.getStateList(dispatch, getState);
    let requestEmployerVerification = api.getEmployerVerification(dispatch, getState);
    let getPropertyList = api.getPropertyList(dispatch, getState);
    api.setStatus(dispatch, 'loading', 'stepTwoForm', true);
    Promise.all([
      requestUser,
      requestIncomeSources,
      requestStates,
      requestEmployerVerification,
      getPropertyList
      ]).then((results) => {
      let user = results[0].userDetails;
      let landlordId = results[0].userDetails.userId;
      let propertyTitle = '';
      let address1= '';
      let address2= '';
      let city ='';
      let state = '';
      let zipCode= '';
      let propertyClass = '';
      let propertyStatus = '';
      let numBeds = '';
      let numBaths = '';
      let rent = '';
      let headline = '';
      let sqft = '';
      let amenityList:[];
      let stateList = results[2];
      let incomeSources = [];//results[4];
      //let propertyTypeList = {"APT":"Apartment"}//["APT","SFM","CONDO","DUPLEX","MOBILE_HOME","TOWNHOUSE"]
      let employerVerification = results[3];

      dispatch({ type: types.ONBOARDING_STEPTWO_FORM_LOAD,
        landlordId,
        propertyTitle,
        address1,
        address2,
        city,
        state,
        zipCode,
        propertyClass,
        propertyStatus,
        numBeds,
        numBaths,
        rent,
        headline,
        sqft,
        amenityList:[],
        stateList,
        incomeSources:[],
        saved: false

      });

        api.getCityList(
          dispatch,
          getState,
          null,
        'currentCityList'
          );

      api.setStatus(dispatch, 'loading', 'stepTwoForm', false);
    });
  };
}


export function saveStepTwo(
  landlordId,
  propertyTitle,
  address1,
  address2,
  city,
  state,
  zipCode,
  propertyClass,
  propertyStatus,
  numBeds,
  numBaths,
  rent,
  headline,
  sqft,
  amenityList,
  openNextStep,
  incomeSources,
  callback
  ) {
  return function (dispatch, getState) {
    let authHeader = api.getAuthHeaders(dispatch, getState);
    let userId = getState().loginAppState.userInfo.id;
    let statusAction = openNextStep ? 'stepTwoFormProceed' : 'stepTwoForm';
    api.setStatus(dispatch, 'saving', statusAction, true);

    let userDetails = {
      "landlordId":landlordId,
      "address":address1,
      "secondLineAddress":address2,
      "city":city,
      "state":state,
      "zipCode":zipCode,
      "propertyType":"SFM",
      "propertyClass":propertyClass,
      "propertyStatus":propertyStatus,
      "numBeds":numBeds,
      "numBaths":numBaths,
      "rent":rent,
      "headline":propertyTitle,
      "sqft": sqft,
      "amenityList":amenityList
    };

   let payload = {"user": userDetails,"incomeList": incomeSources};


    let verificationData = {

         "userId": userId
        // "position": position,
        // "salary": salary,
        // "companyName": employer,
        // "companyCity": employerCity,
        // "companyState": employerState,
        // "id": employerId,
        // "verifierFirstName": employerFirstName,
        // "verifierLastName": employerLastName,
        // "verifierPhone": employerPhone,
        // "verifierEmail": employerEmail

      };

      api.postStepTwo(dispatch, getState, userDetails, () => {
        if (userId) {
          let name = 'employerId';
          let value = userId;
          dispatch({type: types.ONBOARDING_STEPTWO_FORM_UPDATE, name, value});
        }
        api.setStatus(dispatch, 'saving', statusAction, false);
        api.setStatus(dispatch, 'modified', 'stepTwoForm', false);
        dispatch({type: types.ONBOARDING_STEPTWO_FORM_SAVE, name: 'saved', value: true});
        if (callback) callback();
        if (openNextStep) openNextStep();

    });

  };
}


export function uploadIncomeDoc(file, statusAction, sources, sourceIndex) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'uploading', statusAction, true);
    api.uploadIncomeDoc(dispatch, getState, file, () =>{
      let newSources = sources;
      if (sources && sources[sourceIndex]) {
        newSources[sourceIndex].documentationProvided = true;
      }
      dispatch({ type: types.ONBOARDING_STEPTWO_UPDATE_INCOME_SOURCES, sources: newSources });
      dispatch({ type: types.ONBOARDING_STEPTHREE_UPDATE_INCOME_SOURCES, sources: newSources });
      api.setStatus(dispatch, 'uploading', statusAction, false);
    });
  };
}


/////////////////////////////////////////////////////////////////////////////
// step three

export function updateStepThreeForm(settings, name, value,index) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'modified', 'stepThreeForm', true);
    dispatch({type: types.ONBOARDING_STEPTHREE_FORM_UPDATE, settings, name, value,index});
  };
}

export function updateDepositList(settings) {

  return function (dispatch, getState) {
    api.setStatus(dispatch, 'modified', 'stepThreeForm', true);
    dispatch({type: types.ONBOARDING_STEPTHREE_REMOVE_OBJ_FROM_ARRAY, settings});
  };
}


export function loadStepThree(){
  return function (dispatch, getState) {
    let authHeader = api.getAuthHeaders(dispatch, getState);
    let requestUser = api.getUserDetails(dispatch, getState);
    let requestAddresses = api.getAddresses(dispatch, getState);
    let requestStates = api.getStateList(dispatch, getState);
    let getPropertyList = api.getPropertyList(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'stepThreeForm', true);
    Promise.all([
      requestUser,
      requestStates,
      requestAddresses,
      getPropertyList
      ]).then((results) => {

       let landlordId = results[0].userDetails.userId;
       let propertyId;
       let email = results[0].userDetails.email;
       let propertyList = results[3];
       let startDate;
       let endDate;
       let monthlyRent;
       let isLandlord;
       let isMonthToMonth;
       let leaseStatus;
       let renterIds;
       let saved;
       dispatch({ type: types.ONBOARDING_STEPTHREE_FORM_LOAD,
        landlordId,
        propertyId,
        email,
        propertyList,
        startDate,
        endDate,
        monthlyRent,
        isLandlord,
        isMonthToMonth,
        leaseStatus,
        renterIds});
        api.setStatus(dispatch, 'loading', 'stepThreeForm', false);
    });
  };
}



export function saveStepThree(
  landlordId,
  propertyId,
  leaseStartDate,
  leaseEndDate,
  paymentStartDate,
  paymentEndDate,
  paymentDueDate,
  monthlyRent,
  isMonthToMonth,
  leaseStatus,
  renterIds,
  depositList,
  tenant,
  openNextStep,
  callback
  ) {
  return function (dispatch, getState) {
    let authHeader = api.getAuthHeaders(dispatch, getState);
    let userId = getState().loginAppState.userInfo.id;
    let statusAction = openNextStep ? 'stepThreeFormProceed' : 'stepThreeForm';
    api.setStatus(dispatch, 'saving', statusAction, true);


    let landLordObjSave={
       "landlordId":landlordId,
       "propertyId":propertyId,
       "startDate":"2016-09-01",
       "endDate":"2017-08-31",
       "paymentDueDate":"2017-08-31",
       "rentAmount":parseInt(monthlyRent),
       "isMonthToMonth":isMonthToMonth,
       "leaseStatus":"ACTIVE",
       "renterIds":[
           {"renterId":1}
       ],
       "depositList":depositList
    };


    let leaseObje = api.postStepThree(dispatch, getState, landLordObjSave, (response) => {

         api.setStatus(dispatch, 'saving', statusAction, false);
         api.setStatus(dispatch, 'modified', 'stepThreeForm', false);

         for (let ten of tenant) {
              //call send invite tenant
              api.inviteTenant(dispatch, getState, ten.email,response.id,callback, () => {

              });
             }

        if (openNextStep) openNextStep();

    });

  };
}



/////////////////////////////////////////////////////////////////////////////
// step four


export function updateStepFourForm(settings, name, value, statusAction) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'modified', statusAction, true);
    dispatch({type: types.ONBOARDING_STEPFOUR_FORM_UPDATE, settings, name, value});
  };
}

export function showSucessScreen() {
  return function (dispatch, getState) {
    //api.setStatus(dispatch, 'modified', statusAction, true);
    dispatch({type: types.ONBOARDING_STEPFOUR_SHOW_SUCESS});
  };
}

//step load form four

export function loadStepFour(){
  return function (dispatch, getState) {
    let authHeader = api.getAuthHeaders(dispatch, getState);

    let requestUser = api.getUserDetails(dispatch, getState);
    let requestIncomeSources = api.getIncomeSources(dispatch, getState);
    let requestStates = api.getStateList(dispatch, getState);
    let requestEmployerVerification = api.getEmployerVerification(dispatch, getState);


    api.setStatus(dispatch, 'loading', 'stepFourForm', true);
    Promise.all([
      requestUser,
      requestIncomeSources,
      requestStates,
      requestEmployerVerification
      ]).then((results) => {

      let user = results[0].userDetails;
      let position = user.position;
      let salary = user.salary;
      let employer = user.employer;
      let employerCity = user.employerCity;
      let employerState = user.employerState;

      let incomeSources = results[1];
      let stateList = results[2];
      //let propertyTypeList = {"APT":"Apartment"}//["APT","SFM","CONDO","DUPLEX","MOBILE_HOME","TOWNHOUSE"]

      let employerVerification = results[3];

      dispatch({ type: types.ONBOARDING_STEPFOUR_FORM_LOAD,
        position,
        salary,
        employer,
        employerCity,
        employerState,
        incomeSources,
        //propertyTypeList,
        stateList,
        employerVerification });

      api.getCityList(
          dispatch,
          getState,
          null,
        'currentCityList'
          );

      api.setStatus(dispatch, 'loading', 'stepTwoForm', false);
    });
  };
}



//end

export function clearStepFourForm() {
  return { type: types.ONBOARDING_STEPFOUR_FORM_CLEAR };
}

export function loadDwolla(){
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'loading', 'dwollaForm', true);
    api.verifyFundingSources(dispatch, getState, (json) =>{
      let accounts = json;
      dispatch({type: types.DWOLLA_LOAD_ACCOUNT_LIST, accounts});
      let verified = (json.length != 0);
      dispatch({type: types.DWOLLA_VERIFIED_STATUS, verified});
      if(!verified){
        api.getUserDetails(dispatch, getState, (json) => {
          let customer = {
            "first_name": json.firstName,
            "last_name": json.lastName,
            "email": json.email
          };
          api.postDwollaCustomer(dispatch, getState, customer, () => {
            api.getDwollaToken(dispatch, getState, (json) => {
              let token = json.token;
              dispatch({type: types.DWOLLA_TOKEN, token});
              api.setStatus(dispatch, 'loading', 'dwollaForm', false);
            });
          });
        });
      }else{
        api.setStatus(dispatch, 'loading', 'dwollaForm', false);
      }
    });
  };
}

export function saveDwolla(payload, id, callback) {
  return function (dispatch, getState) {

    api.postDwollaPayment(dispatch, getState, payload, (response) => {
      api.setStatus(dispatch, 'saving', 'dwollaForm', false);
      api.setStatus(dispatch, 'modified', 'dwollaForm', false);
      if (response.status == "PENDING"){
        // clears out dwolla form:
        // dispatch({type: types.ONBOARDING_STEPFOUR_FORM_CLEAR});
        let amount = {"id": id, "userDetails": {"ttSecurityDeposit": payload.value}};
        api.postUserDetails(dispatch, getState, amount, callback);
      }
      let message = response.message;
      dispatch({type: types.ONBOARDING_DWOLLA_TRANSACTION_STATUS, message});
      dispatch({type: types.ONBOARDING_STEPFOUR_FORM_UPDATE, name: 'saved', value: true});
    });

  };
}

export function saveStripe(payload, id, callback) {
  return function (dispatch, getState) {
    api.postStripe(dispatch, getState, payload, (response) => {
      api.setStatus(dispatch, 'saving', 'stripeForm', false);
      api.setStatus(dispatch, 'modified', 'stripeForm', false);
      if (response.status == "SUCCEEDED"){
        // clears out stripe form:
        // dispatch({type: types.ONBOARDING_STEPFOUR_FORM_CLEAR});
        let stripeAmount = Math.round(payload.amount / 100 / 1.04);
        let amount = {"id": id, "userDetails": {"ttSecurityDeposit": stripeAmount}};
        api.postUserDetails(dispatch, getState, amount, callback);
      }
      let message = response.message;
      dispatch({type: types.ONBOARDING_STRIPE_TRANSACTION_STATUS, message});
      dispatch({type: types.ONBOARDING_STEPFOUR_FORM_UPDATE, name: 'saved', value: true});
    });
  };
}

export function showCongratsDashboard(){
  return function (dispatch, getState) {
    dispatch({type: types.ONBOARDING_STEPFOUR_SHOW_CONGRATS});
  };
}

export function showDwollaForm(){
  return function (dispatch, getState) {
    dispatch({type: types.ONBOARDING_STEPFOUR_SHOW_DWOLA_FORM});
  };
}


export function saveGuarantor(
  firstName,
  lastName,
  email,
  homeAddress,
  city,
  state,
  zipCode,
  dateBirth,
  ssn,
  openNextStep,
  callback
  ) {
  return function (dispatch, getState) {

    let statusAction = openNextStep ? 'stepFourFormProceed' : 'stepFourForm';
    api.setStatus(dispatch, 'loading', statusAction, true);

  let payload={
              "first_name":"Luke",
              "last_name":"Skywalker",
              "email":"lee@fittorent.com",
              "dob":"1974-01-31",
              "address1":"1234 Bonnie Butler Way",
              "city":"Charlotte",
              "state":"NC",
              "zipCode":"28276",
              "phone":"(704) 555-5555",
              "ssnLast4":"1234"
            };

    //   api.postGuarantor(dispatch, getState, payload, () => {
    //   api.setStatus(dispatch, 'loading', statusAction, false);
    //   api.setStatus(dispatch, 'modified', 'stepFourForm', false);
    //   dispatch({type: types.ONBOARDING_STEPFOUR_FORM_UPDATE, name: 'saved', value: true});
    //   if (callback) callback();
    //   if (openNextStep) openNextStep();
    // });
      api.postDwollaCustomer(dispatch, getState, payload, (response) => {
      api.setStatus(dispatch, 'loading', statusAction, false);
      api.setStatus(dispatch, 'modified', 'stepFourForm', false);
       if (callback) callback();
       if (openNextStep) openNextStep();
       dispatch({type: types.ONBOARDING_STEPFOUR_SHOW_DWOLLA});
      });
  };
}



/////////////////////////////////////////////////////////////////////////////
// step five


export function loadStepFive(){
  return function (dispatch, getState) {
    let authHeader = api.getAuthHeaders(dispatch, getState);

    let requestUser = api.getUserDetails(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'stepFiveForm', true);
    Promise.all([
      requestUser
      ]).then((results) => {

      let user = results[0].userDetails;

      dispatch({ type: types.ONBOARDING_STEPFIVE_FORM_LOAD, hasCreditReport: user.ttHasCreditReport });

      api.setStatus(dispatch, 'loading', 'stepFiveForm', false);
    });
  };
}

export function uploadCreditReport(file, callback) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'uploading', 'uploadCredit', true);
    api.uploadCreditReport(dispatch, getState, file, () =>{
      api.setStatus(dispatch, 'uploading', 'uploadCredit', false);
      dispatch({type: types.ONBOARDING_STEPFIVE_FORM_UPDATE, name: 'saved', value: true});
      if (callback) callback();
    });
  };
}





export function uploadSupportingDoc(file, callback) {
  return function (dispatch, getState) {
    api.setStatus(dispatch, 'uploading', 'uploadDoc', true);
    api.uploadSupportingDoc(dispatch, getState, file, () =>{
      api.setStatus(dispatch, 'uploading', 'uploadDoc', false);
      dispatch({type: types.ONBOARDING_STEPFIVE_FORM_UPDATE, name: 'saved', value: true});
      if (callback) callback();
    });
  };
}









/////////////////////////////////////////////////////////////////////////////
// step six


// export function updateStepSixForm(settings, name, value) {
//   return function (dispatch, getState) {
//     api.setStatus(dispatch, 'modified', 'stepSixForm', true);
//     dispatch({type: types.ONBOARDING_STEPSIX_FORM_UPDATE, settings, name, value});
//   };
// }

export function loadStepSix(callback){
  return function (dispatch, getState) {
    let authHeader = api.getAuthHeaders(dispatch, getState);

    let requestStates = api.getStateList(dispatch, getState);
    let checkIfInvited = api.getUserDetails(dispatch, getState);
    let requestMandates = api.getMandates(dispatch, getState);

    api.setStatus(dispatch, 'loading', 'stepSixForm', true);
    Promise.all([
      requestStates,
      checkIfInvited,
      requestMandates
      ]).then((results) => {


      let stateList = results[0];
      let inviteStatus = results[1].onboardingStatus;
      let mandates = results[2];
      let mandate = mandates && mandates[0];

      // loop over all mandates and find active mandate
      if (mandates && mandates.length > 1) {
        for (let currentMandate of mandates) {
          if (currentMandate.activeMandate) {
            mandate = currentMandate;
          }
        }
      }

      callback({mandate});

      // dispatch({ type: types.ONBOARDING_STEPSIX_FORM_LOAD,
      //   stateList, mandate });

      dispatch({ type: types.ONBOARDING_INVITE_STATUS,
        inviteStatus });

      // api.getCityList(
      //   dispatch,
      //   getState,
      //   currentState,
      //   'mandateCityList'
      //   );



      api.setStatus(dispatch, 'loading', 'stepSixForm', false);
    });
  };
}


export function saveStepSix(
  mandateType,
  minBedrooms,
  maxBedrooms,
  minBathrooms,
  maxBathrooms,
  minRent,
  maxRent,
  minSqft,
  maxSqft,
  zipCode,
  moveInDate,
  city,
  state,
  leaseLength,
  typeSFH,
  typeAPT,
  typeCONDO,
  typeTH,
  roommates,
  spouseEmail,
  familyAges,
  id,
  callback
  ) {
  return function (dispatch, getState) {

    let authHeader = api.getAuthHeaders(dispatch, getState);
    let userId = getState().loginAppState.userInfo.id;


    api.setStatus(dispatch, 'saving', 'stepSixForm', true);


    let mandate = {
      "mandate":{
        "id": id,
        "userId": userId,
        "minBedrooms": minBedrooms,
        "maxBedrooms": maxBedrooms,
        "minBathrooms": minBathrooms,
        "maxBathrooms": maxBathrooms,
        "minRent": minRent,
        "maxRent": maxRent,
        "minSqft": minSqft,
        "maxSqft": maxSqft,
        "zipCode": zipCode,
        "moveInDate": moveInDate,
        "city": city,
        "state": state,
        "mandateType": mandateType,
        "leaseLength": leaseLength,
        "propertyTypeList": ''
      }
    };

    let mates = _.flatten(_.pluck(roommates, 'email'));

    if(mandateType == "JOINT"){
      mates = [spouseEmail];
    }


    api.postStepSix(dispatch, getState, mandate, (mandate) => {
      if(familyAges !== null){
        let ages = familyAges.replace(/(^,)|(,$)/g, "").split(',');
        let family = [];
        _.map(ages, (age) => { family.push({"age": age}); });
        api.addFamily(dispatch, getState, family);
      }
      if(mandateType == "SHARED" || mandateType == "JOINT"){
        _.map(mates, (mate) => { api.inviteRoommate(dispatch, getState, `?email=${mate}&mandateId=${mandate.id}`); });
      }
      api.setStatus(dispatch, 'saving', 'stepSixForm', false);
      api.setStatus(dispatch, 'modified', 'stepSixForm', false);
      dispatch({ type: types.ONBOARDING_COMPLETE, success: true, reviewingProfile: true });
      if (callback) callback();
    });



  };

}

export function undoComplete(reviewingProfile = false) {
  return function (dispatch, getState) {
      dispatch({ type: types.ONBOARDING_COMPLETE, success: false, reviewingProfile });
  };
}
