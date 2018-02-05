import * as types from '../constants/ActionTypes';
import objectAssign from 'object-assign';
import _ from 'underscore';

const initialState = {

    status:{
      loading:{},
      uploading:{},
      saving:{},
      modified:{}
    },

    cities:{

    },

    complete: false,
    reviewingProfile: false,

    score: null,

  0: {
      description: null,
      dobMonth: null,
      dobDay: null,
      dobYear: null,
      dogs: null,
      cats: null,
      other: null,
      linkedAccounts: null,
      facebookToken: null,
      linkedinToken: null,
      isActiveDutyMilitary: null,
      alternativeEmail: null,
      saved: false
  },
  1: {
      jobTitle: null,
      jobSalary: null,
      jobEmployer: null,
      jobCity: null,
      jobState: null,
      employerId: null,
      employerFirstName: null,
      employerLastName: null,
      employerPhone: null,
      employerEmail: null,
      incomeSources:[],
      stateList: null,
      saved: false
  },
  2: {
      stateList: null,
      currentState: null,
      currentCity: null,
      numYearsRenter: null,
      numPropertiesRented: null,
      previousHomeowner: false,
      ownedAddress: null,
      ownedCity: null,
      ownedState: null,
      ownedZip: null,
      isLandlord: false,
      ownerStatus: null,
      previousLandlords: [],
      saved: false
  },
  3: {
      stripeNumber: null,
      stripeExpiryMonth: null,
      stripeExpiryYear: null,
      stripeCVC: null,
      stripeAmount: null,
      stripeTransactionStatus: null,

      guarantorFirstName: null,
      guarantorLastName: null,
      guarantorEmail: null,
      guarantorPhone: null,
      guarantorRelation: null,

      dwollaVerifiedStatus: false,
      dwollaToken: null,
      dwollaAmount: null,
      dwollaAccountList: null,
      dwollaSelectedAccount: null,
      dwollaTransactionStatus: null,
      saved: false
  },
  4: {
    hasCreditReport: false,
    saved: false
  },
  5: {
      inviteStatus: null,
      mandateType: null,
      minBedrooms: null,
      maxBedrooms: null,
      minBathrooms:null,
      maxBathrooms:null,
      minRent:null,
      maxRent:null,
      minSqft:null,
      maxSqft:null,
      zipCode:null,
      moveInDate:null,
      city:null,
      state:null,
      leaseLength: null,
      typeSFH: false,
      typeAPT: false,
      typeCONDO: false,
      typeTH: false,
      roommates: [],
      spouseEmail: null,
      familyAges: null,
      id: null,
      saved: false
  }
};


export default function onboardingAppState(state = initialState, action) {
  switch (action.type) {

    // status

    case types.STATUS_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState['status'][action.statusType][action.statusAction] = action.statusState;
      return newState;
    }

    case types.ONBOARDING_CLEAR_MODIFIED:
    {
      let newState = objectAssign({}, state);
      newState['status']['modified'] = {};
      return newState;
    }

    case types.CITIES_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState['cities'][action.statusAction] = action.cityList;
        return newState;
      }


    // score


    case types.ONBOARDING_UPDATE_SCORE:
      {
        let newState = objectAssign({}, state);
        newState['score'] = action.score;
        return newState;
      }

/////////////////////////////////////////////////////////////////////////////
// step one

    case types.ONBOARDING_STEPONE_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[0][action.name] = action.value;
        return newState;
      }



    case types.ONBOARDING_STEPONE_FORM_LOAD:
      {
        let dob = [null, null, null];
        if (action.user.dateOfBirth) {
          dob = action.user.dateOfBirth.split('-');
          dob[1] = (dob[1].charAt(0) == '0') ? dob[1].substr(1) : dob[1];
        }

        let newState = objectAssign({}, state);
        newState[0]['description'] = action.user.description;
        newState[0]['dobMonth'] = dob[1];
        newState[0]['dobDay'] = dob[2];
        newState[0]['dobYear'] = dob[0];
        newState[0]['isActiveDutyMilitary'] = action.user.ttIsActiveDutyMilitay;
        newState[0]['alternativeEmail'] = action.user.alternativeEmail;
        newState[0]['dogs'] = action.dogs;
        newState[0]['cats'] = action.cats;
        newState[0]['other'] = action.other;
        newState[0]['linkedAccounts'] = action.linkedAccounts;
        newState[0]['facebookToken'] = action.facebookToken;
        newState[0]['linkedinToken'] = action.linkedinToken;
        return newState;
      }

    case types.ONBOARDING_STEPONE_FORM_SAVE:
      {
        let newState = objectAssign({}, state);
        newState[0]['description'] = action.description;
        // newState[0]['pets'] = action.pets;
        newState[0].status['modified'] = false;
        return newState;
      }


/////////////////////////////////////////////////////////////////////////////
// step two

    case types.ONBOARDING_STEPTWO_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[1][action.name] = action.value;
        return newState;
      }


    case types.ONBOARDING_STEPTWO_FORM_LOAD:
      {
        let newState = objectAssign({}, state);
        newState[1]['jobTitle'] = action.position;
        newState[1]['jobSalary'] = action.salary;
        newState[1]['jobEmployer'] = action.employer;
        newState[1]['jobCity'] = action.employerCity;
        newState[1]['jobState'] = action.employerState;

        newState[1]['incomeSources'] = action.incomeSources;

        newState[1]['stateList'] = action.stateList;

        // TODO: Move this logic out of the reducer
        if (action.employerVerification && action.employerVerification.length > 0) {
          for (let i = 0; i < action.employerVerification.length; i++) {
            let employer = action.employerVerification[i];

            // check if current employer id is higher than previous
            let isBiggerId = (i !== 0 && parseInt(employer.id) > parseInt(action.employerVerification[i - 1].id));

            // ovewrite previous data if first item or current employer id is bigger
            if (i === 0 || isBiggerId) {
              newState[1]['employerId'] = employer.id; // this is NOT employeeId
              newState[1]['employerFirstName'] = employer.verifierFirstName;
              newState[1]['employerLastName'] = employer.verifierLastName;
              newState[1]['employerPhone'] = employer.verifierPhone;
              newState[1]['employerEmail'] = employer.verifierEmail;
            }
          }
        }

        return newState;
      }

    case types.ONBOARDING_STEPTWO_FORM_SAVE:
      {
        let newState = objectAssign({}, state);
        newState[1]['jobTitle'] = action.position;
        newState[1]['jobSalary'] = action.salary;
        newState[1]['jobEmployer'] = action.employer;
        newState[1]['jobCity'] = action.employerCity;
        newState[1]['jobState'] = action.employerState;
        newState[1].status['modified'] = false;
        return newState;
      }

    case types.ONBOARDING_STEPTWO_UPDATE_INCOME_SOURCES:
      {
        let newState = objectAssign({}, state);
        newState[1]['incomeSources'] = action.sources;
        return newState;
      }










/////////////////////////////////////////////////////////////////////////////
// step three


    case types.ONBOARDING_STEPTHREE_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[2][action.name] = action.value;
        return newState;
      }



    case types.ONBOARDING_STEPTHREE_FORM_LOAD:
      {
        let newState = objectAssign({}, state);


        newState[2]['currentState'] = action.currentState;
        newState[2]['currentCity'] = action.currentCity;
        newState[2]['numYearsRenter'] = action.numYearsRenter;
        newState[2]['numPropertiesRented'] = action.numPropertiesRented;

        newState[2]['previousHomeowner'] = action.previousHomeowner;

        newState[2]['ownerStatus'] = action.ownerStatus;
        newState[2]['isLandlord'] = action.isLandlord;

        newState[2]['ownedAddress'] = action.ownedAddress;
        newState[2]['ownedCity'] = action.ownedCity;
        newState[2]['ownedState'] = action.ownedState;
        newState[2]['ownedZip'] = action.ownedZip;

        newState[2]['stateList'] = action.stateList;

        newState[2]['previousLandlords'] = action.previousLandlords;


        return newState;
      }

    case types.ONBOARDING_STEPTHREE_FORM_SAVE:
      {
        let newState = objectAssign({}, state);
        newState[2]['jobTitle'] = action.position;
        newState[2]['jobSalary'] = action.salary;
        newState[2]['jobEmployer'] = action.employer;
        newState[2]['jobCity'] = action.employerCity;
        newState[2]['jobState'] = action.employerState;
        newState[2].status['modified'] = false;
        return newState;
      }

    case types.ONBOARDING_STEPTHREE_UPDATE_LANDLORDS:
      {
        let newState = objectAssign({}, state);
        newState[2]['previousLandlords'] = action.sources;
        return newState;
      }










/////////////////////////////////////////////////////////////////////////////
// step four





    case types.ONBOARDING_STEPFOUR_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[3][action.name] = action.value;
        return newState;
      }


    case types.ONBOARDING_STEPFOUR_FORM_CLEAR:
      {
        let newState = objectAssign({}, state);
        newState[3]['stripeNumber'] = null;
        newState[3]['stripeExpiryMonth'] = null;
        newState[3]['stripeExpiryYear'] = null;
        newState[3]['stripeCVC'] = null;
        newState[3]['stripeAmount'] = null;
        newState[3]['dwollaTransactionStatus'] = null;
        newState[3]['dwollaAmount'] = null;
        return newState;
      }

    case types.ONBOARDING_STRIPE_TRANSACTION_STATUS:
      {
        let newState = objectAssign({}, state);
        newState[3]['stripeTransactionStatus'] = action.message;
        return newState;
      }

    case types.ONBOARDING_DWOLLA_TRANSACTION_STATUS:
      {
        let newState = objectAssign({}, state);
        newState[3]['dwollaTransactionStatus'] = action.message;
        return newState;
      }

    case types.DWOLLA_VERIFIED_STATUS:
      {
        let newState = objectAssign({}, state);
        newState[3]['dwollaVerifiedStatus'] = action.verified;
        return newState;
      }

    case types.DWOLLA_TOKEN:
      {
        let newState = objectAssign({}, state);
        newState[3]['dwollaToken'] = action.token;
        return newState;
      }

    case types.DWOLLA_LOAD_ACCOUNT_LIST:
      {
        let newState = objectAssign({}, state);
        newState[3]['dwollaAccountList'] = action.accounts;
        if(action.accounts.length > 0){
          newState[3]['dwollaSelectedAccount'] = action.accounts[0].id;
        }
        return newState;
      }




/////////////////////////////////////////////////////////////////////////////
// step five

case types.ONBOARDING_STEPFIVE_FORM_LOAD:
  {
    let newState = objectAssign({}, state);
    newState[4]['hasCreditReport'] = action.hasCreditReport;
    return newState;
  }

  case types.ONBOARDING_STEPFIVE_FORM_UPDATE:
    {
      let newState = objectAssign({}, state);
      newState[4][action.name] = action.value;
      return newState;
    }

/////////////////////////////////////////////////////////////////////////////
// step six



    case types.ONBOARDING_STEPSIX_FORM_UPDATE:
      {
        let newState = objectAssign({}, state);
        newState[5][action.name] = action.value;
        return newState;
      }

    case types.ONBOARDING_STEPSIX_FORM_LOAD:
      {
        let newState = objectAssign({}, state);



        newState[5]['stateList'] = action.stateList;

        if (action.mandate) {
          Object
            .keys(action.mandate)
            .map((key) => {
              let value = action.mandate[key];
              if (_.has(newState[5], key)) {
                newState[5][key] = value;
              }
            });

            if (
              action.mandate.propertyTypeList &&
              action.mandate.propertyTypeList.length > 0
            ) {
              for (let propertyType of action.mandate.propertyTypeList) {
                switch (propertyType) {
                  case 'SFM':
                    newState[5]['typeSFH'] = true;
                  break;
                  case 'APT':
                    newState[5]['typeAPT'] = true;
                  break;
                  case 'CONDO':
                    newState[5]['typeCONDO'] = true;
                  break;
                  case 'TOWNHOUSE':
                    newState[5]['typeTH'] = true;
                  break;
                }
              }
            }
        }

        return newState;
      }

    case types.ONBOARDING_STEPSIX_UPDATE_ROOMMATES:
      {
        let newState = objectAssign({}, state);
        newState[5]['roommates'] = action.sources;
        return newState;
      }

    case types.ONBOARDING_STEPSIX_UPDATE_MANDATE_TYPE:
      {
        let newState = objectAssign({}, state);
        newState[5]['mandateType'] = action.mandate;
        return newState;
      }

    case types.ONBOARDING_INVITE_STATUS:
      {
        let newState = objectAssign({}, state);
        newState[5]['inviteStatus'] = action.inviteStatus;
        return newState;
      }

    case types.ONBOARDING_COMPLETE:
      {
        let newState = objectAssign({}, state);
        newState['complete'] = action.success;
        newState['reviewingProfile'] = action.reviewingProfile;
        return newState;
      }



    default:
      return state;
  }
}
