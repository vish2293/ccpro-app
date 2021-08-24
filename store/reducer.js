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
  chatRead: {},
  workspaceTypes: [],
  allWorkspaces: {},
  loader: true,
  teamLoader: true,
  allTeamsList: [],
  groupList: [],
  usersList: [],
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

const setWorkSpaceTypes = (state, action) => {
  console.log('superrrr', action);
  return {
    ...state,
    workspaceTypes: action.payload,
  };
};

const setAllWorkspaces = (state, action) => {
  return {
    ...state,
    allWorkspaces: action.payload,
    loader: false,
  };
};

const addNewWorkSpace = (state, action) => {
  console.log('reducer called:::', action.payload);
  const copyOfAllList = { ...state.allWorkspaces };
  const copyofUserWorkList = { ...state.workSpace };
  console.log(
    'condddddd:::',
    copyOfAllList.data.filter(
      (a) => a.in_workspace_id === action.payload.in_workspace_id
    ).length
  );
  if (
    copyOfAllList.data.filter(
      (a) => a.in_workspace_id === action.payload.in_workspace_id
    ).length !== 0
  ) {
    const dataIndex = copyOfAllList.data.findIndex(
      (a) => a.in_workspace_id === action.payload.in_workspace_id
    );
    const userIndex = copyofUserWorkList.data.findIndex(
      (a) => a.in_workspace_id === action.payload.in_workspace_id
    );

    copyOfAllList.data[dataIndex] = action.payload;
    copyofUserWorkList.data[userIndex] = action.payload;
  } else {
    copyOfAllList.data.push(action.payload);
    copyofUserWorkList.data.push(action.payload);
    console.log('copy of user:', copyOfAllList);
  }
  return {
    ...state,
    allWorkspaces: copyOfAllList,
    workSpace: copyofUserWorkList,
  };
};

const getAllTeams = (state, action) => {
  console.log('data in reducer:***:::', action.payload);
  return {
    ...state,
    allTeamsList: action.payload,
    teamLoader: false,
  };
};

const setNewTeam = (state, action) => {
  console.log('data in reducer:***:::', action.payload);
  const copyOfList = Array.from(state.allTeamsList);
  const selectedWorkSpace = state.selectedWorkSpace;
  console.log('selected::', selectedWorkSpace);

  if (
    selectedWorkSpace?.in_workspace_id === action.payload.metadata.workspace_id
  ) {
    copyOfList.push(action.payload);
  }

  return {
    ...state,
    allTeamsList: copyOfList,
  };
};

const setGroups = (state, action) => {
  return {
    ...state,
    groupList: action.payload,
  };
};

const updateGroup = (state, action) => {
  const copyOfData = Array.from(state.groupList);
  console.log('previous data:', copyOfData);
  const index = copyOfData.findIndex((a) => a.guid === action.payload.guid);
  copyOfData[index] = action.payload;

  return {
    ...state,
    groupList: copyOfData,
  };
};

const addGroup = (state, action) => {
  const copyOfData = Array.from(state.groupList);
  copyOfData.push(action.payload);
  return {
    ...state,
    groupList: copyOfData,
  };
};

const updateTeam = (state, action) => {
  console.log('data in reducer:***:::', action.payload);
  const copyOfList = Array.from(state.allTeamsList);
  const index = copyOfList.findIndex((a) => a.guid === action.payload.guid);
  copyOfList[index] = action.payload;

  return {
    ...state,
    allTeamsList: copyOfList,
  };
};

const setPinnedWorkspace = (state, action) => {
  console.log('data in reducer:***:::', action.payload);
  const copyOfList = { ...state.workSpace };
  console.log('all work data::', copyOfList);
  const index = copyOfList.data.findIndex(
    (a) => a.st_guid === action.payload.us_workspaces[0]
  );
  console.log('found::', copyOfList.data[index]);
  copyOfList.data[index].in_pinned = 1;
  // const index = copyOfList.findIndex((a) => a.guid === action.payload.guid);
  // copyOfList[index] = action.payload;

  return {
    ...state,
    workSpace: copyOfList,
  };
};

const setUnPinnedWorkspace = (state, action) => {
  console.log('data in reducer:***:::', action.payload);
  const copyOfList = { ...state.workSpace };
  console.log('all work data::', copyOfList);
  const index = copyOfList.data.findIndex(
    (a) => a.st_guid === action.payload.us_workspaces[0]
  );
  console.log('found::', copyOfList.data[index]);
  copyOfList.data[index].in_pinned = 0;
  // const index = copyOfList.findIndex((a) => a.guid === action.payload.guid);
  // copyOfList[index] = action.payload;

  return {
    ...state,
    workSpace: copyOfList,
  };
};

const getUsersList = (state, action) => {
  return {
    ...state,
    usersList: action.payload,
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
    case actionTypes.GET_WORKSPACE_TYPES:
      return setWorkSpaceTypes(state, action);
    case actionTypes.GET_ALL_WORKSPACES:
      return setAllWorkspaces(state, action);
    case actionTypes.ADD_WORK_SPACE:
      return addNewWorkSpace(state, action);
    case actionTypes.GET_ALL_TEAMS:
      return getAllTeams(state, action);
    case actionTypes.GET_NEW_TEAM:
      return setNewTeam(state, action);
    case actionTypes.GET_GROUPS:
      return setGroups(state, action);
    case actionTypes.UPDATE_GROUPS:
      return updateGroup(state, action);
    case actionTypes.ADD_GROUP:
      return addGroup(state, action);
    case actionTypes.UPDATE_TEAM:
      return updateTeam(state, action);
    case actionTypes.PINNED_WORKSAPCE:
      return setPinnedWorkspace(state, action);
    case actionTypes.UN_PINNED_WORKSAPCE:
      return setUnPinnedWorkspace(state, action);
    case actionTypes.GET_USERS_LIST:
      return getUsersList(state, action);
    case actionTypes.READ_ALL:
      console.log('acctionnonon', action.payload);
      return {
        ...state,
        chatRead: { ...state.chatRead, ...action.payload },
      };
    default:
      return state;
  }
};

export default reducer;
