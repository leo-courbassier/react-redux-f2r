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
      /*dobMonth: null,
      dobDay: null,
      dobYear: null,
      dogs: null,
      cats: null,
      other: null,
      linkedAccounts: null,
      facebookToken: null,
      linkedinToken: null,
      isActiveDutyMilitary: null,
      alternativeEmail: null,*/
      saved: false
  },
  1: {
      landlordId:null,
      propertyTitle: null,
      stateList: null,
      address1:null,
      address2:null,
      city:null,
      state:null,
      zipCode:null,
      propertyClass:null,
      propertyStatus:null,
      numBeds:null,
      numBaths:null,
      rent:null,
      headline:null,
      sqft:null,
      incomeSources:[],
      amenityList:[],
      saved: false
  },
  2: {
      landlordId: null,
      propertyId: null,
      propertyList: null,
      leaseStartDate: null,
      leaseEndDate: null,
      paymentStartDate:null,
      paymentEndDate:null,
      paymentDueDate:null,
      monthlyRent:null,
      isLandlord: true,
      isMonthToMonth:false,
      leaseStatus:null,
      renterIds:null,
      depositList:[{
        depositAmount: 0,
        depositType: "",
        depositStatus: ""
}],
      pepe:[],
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
    saved: false,
    stateList: null,
    currentState: null,
    currentCity: null
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
        newState[1]['landlordId'] = action.landlordId;
        newState[1]['propertyTitle'] = action.propertyTitle;
        newState[1]['state'] = action.state;
        newState[1]['zipCode'] = action.zipCode;
        newState[1]['propertyClass'] = action.propertyClass;
        newState[1]['propertyStatus'] = action.propertyStatus;
        newState[1]['numBeds'] = action.beganRentingDate;
        newState[1]['numBaths'] = action.sqft;
        newState[1]['rent'] = action.headline;
        newState[1]['sqft'] = action.sqft;
        newState[1]['headline'] = action.headline;
        newState[1]['amenityList'] = action.amenityList;
        newState[1]['stateList'] = action.stateList;
        newState[1]['propertyTypeList'] = action.propertyTypeList;


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
        newState[1]['landlordId'] = action.landlordId;
        newState[1]['propertyTitle'] = action.propertyTitle;
        newState[1]['state'] = action.state;
        newState[1]['zipCode'] = action.zipCode;
        newState[1]['propertyClass'] = action.propertyClass;
        newState[1]['propertyStatus'] = action.propertyStatus;
        newState[1]['numBeds'] = action.numBeds;
        newState[1]['numBaths'] = action.numBaths;
        newState[1]['rent'] = action.rent;
        //newState[1]['beganRentingDate'] = action.beganRentingDate;
        newState[1]['sqft'] = action.sqft;
        newState[1]['headline'] = action.headline;
        newState[1]['amenityList'] = action.amenityList;
        newState[1]['stateList'] = action.stateList;
        newState[1]['propertyTypeList'] = action.propertyTypeList;
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
    
        if (action.index!=null||typeof action.index != 'undefined') {          
           newState[2]['depositList'][action.index][action.name] = action.value;
        } else {
          newState[2][action.name] = action.value;
        }
        return newState;
      }

      case types.ONBOARDING_STEPTHREE_REMOVE_OBJ_FROM_ARRAY:
      {
        //new functionality for clear empty objects
        let newState = objectAssign({}, state);
        let depositList = newState[2]['depositList'];
        let incomeSources = [];

        for (let deposit of depositList) {

          if (deposit && deposit.depositAmount && deposit.depositType && deposit.depositStatus) {
             let newSource = deposit;            
             incomeSources.push(newSource);
          }
        }
        
        newState[2]['depositList'] = incomeSources;
       
        return newState;
      }


    case types.ONBOARDING_STEPTHREE_FORM_LOAD:
      {
        let newState = objectAssign({}, state);

        newState[2]['landlordId'] = action.landlordId;
        newState[2]['propertyList'] = action.propertyList;
        newState[2]['propertyId'] = action.propertyId;
        newState[2]['leaseStartDate'] = action.leaseStartDate;
        newState[2]['leaseEndDate'] = action.leaseEndDate;
        newState[2]['paymentStartDate'] = action.paymentStartDate;
        newState[2]['paymentEndDate'] = action.paymentEndDate;
        newState[2]['paymentDueDate'] = action.paymentDueDate;
        newState[2]['monthlyRent'] = action.monthlyRent;
        newState[2]['isLandlord'] = true;//action.isLandlord;
        newState[2]['isMonthToMonth'] = action.isMonthToMonth;
        newState[2]['leaseStatus'] = action.leaseStatus;
        newState[2]['renterIds'] = action.renterIds;
        newState[2]['email'] = action.email;

        return newState;
      }

    case types.ONBOARDING_STEPTHREE_FORM_SAVE:
      {
        let newState = objectAssign({}, state);

        newState[2]['landlordId'] = action.landlordId;
        newState[2]['propertyId'] = action.propertyId;
        newState[2]['leaseStartDate'] = action.leaseStartDate;
        newState[2]['leaseEndDate'] = action.leaseEndDate;
        newState[2]['paymentStartDate'] = action.paymentStartDate;
        newState[2]['paymentEndDate'] = action.paymentEndDate;
        newState[2]['paymentDueDate'] = action.paymentDueDate;
        newState[2]['monthlyRent'] = action.monthlyRent;
        newState[2]['isLandlord'] = true;//action.isLandlord;
        newState[2]['isMonthToMonth'] = action.isMonthToMonth;
        newState[2]['leaseStatus'] = action.leaseStatus;
        newState[2]['renterIds'] = action.renterIds;
        newState[2]['email'] = action.email;
        newState[2]['depositList'] = action.depositList;
        //newState[2].status['modified'] = false;
        return newState;
      }

    case types.ONBOARDING_STEPTHREE_UPDATE_LANDLORDS:
      {
        let newState = objectAssign({}, state);

        newState[2]['landlordId'] = action.landlordId;
        newState[2]['propertyId'] = action.propertyId;
        newState[2]['leaseStartDate'] = action.leaseStartDate;
        newState[2]['leaseEndDate'] = action.leaseEndDate;

        newState[2]['paymentStartDate'] = action.paymentStartDate;
        newState[2]['paymentEndDate'] = action.paymentEndDate;
        newState[2]['paymentDueDate'] = action.paymentDueDate;
        newState[2]['monthlyRent'] = action.monthlyRent;
        newState[2]['isLandlord'] = true;//action.isLandlord;
        newState[2]['isMonthToMonth'] = action.isMonthToMonth;
        newState[2]['leaseStatus'] = action.leaseStatus;
        newState[2]['renterIds'] = action.renterIds;
        newState[2]['email'] = action.email;
        newState[2]['depositList'] = action.depositList;
        newState[2].status['modified'] = true;
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

      case types.ONBOARDING_STEPFOUR_FORM_LOAD:
        {
          let newState = objectAssign({}, state);
          newState[3]['jobCity'] = action.employerCity;
          newState[3]['jobState'] = action.employerState;
          newState[3]['stateList'] = action.stateList;

          return newState;
        }

        case types.ONBOARDING_STEPFOUR_FORM_SAVE:
          {
            let newState = objectAssign({}, state);
            newState[3]['jobCity'] = action.employerCity;
            newState[3]['jobState'] = action.employerState;
            newState[3]['stateList'] = action.stateList;
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
        newState[3]['jobCity'] = null;
        newState[3]['jobState'] = null;
        newState[3]['stateList'] = null;
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
