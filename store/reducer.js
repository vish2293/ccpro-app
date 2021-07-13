import * as actionTypes from './actionTypes';

const initialState = {
  user: {},
  isLoggedIn: false,
  error: null,
  loading: false,
  authRedirectPath: '/',
  workSpace: {},
  jwtToken: null,
  selectedWorkSpace: {},
};

const authStart = (state, action) => {
  return {
    ...state,
    error: null,
    loading: true,
  };
};

const authSuccess = (state, action) => {
  return {
    ...state,
    user: action.user,
    error: null,
    isLoggedIn: action.isLoggedIn,
    loading: false,
  };
};

const authFail = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};

const authLogout = (state, action) => {
  return {
    ...state,
    isLoggedIn: false,
    user: null,
    jwtToken: null,
  };
};

const setAuthRedirectPath = (state, action) => {
  return {
    ...state,
    authRedirectPath: action.path,
  };
};

const setWorkSpaceList = (state, action) => {
  return {
    ...state,
    workSpace: action.payload,
  };
};

const setJwtToken = (state, action) => {
  return {
    ...state,
    jwtToken: action.payload.token,
  };
};

const setSelectedWorkSpace = (state, action) => {
  console.log('superrrr', action);
  return {
    ...state,
    selectedWorkSpace: action.payload,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    case actionTypes.WORK_SPACE_LIST:
      return setWorkSpaceList(state, action);
    case actionTypes.JWT_TOKEN:
      return setJwtToken(state, action);
    case actionTypes.SELECTED_WORKSPACE:
      return setSelectedWorkSpace(state, action);
    default:
      return state;
  }
};

export default reducer;
