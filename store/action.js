import * as actionTypes from './actionTypes';

import { CometChat } from '@cometchat-pro/react-native-chat';
import axios from 'axios';
import { serverUrl } from '../cometchat-pro-react-native-ui-kit/src/utils/consts';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (user) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    user: user,
    isLoggedIn: true,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const createNewUser = (uid, authKey) => {
  return (dispatch) => {
    let apiKey = 'API_KEY';
    let name = uid;
    let user = new CometChat.User(uid);
    user.setName(name);
    CometChat.createUser(user, authKey).then(
      (user) => {
        if (user) {
          dispatch(auth(uid, authKey));
        } else {
          dispatch(authFail(user));
        }
      },
      (error) => {
        dispatch(authFail(error));
      }
    );
  };
};

export const logoutSuccess = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    authRedirectPath: '/login',
  };
};

export const logout = () => {
  return (dispatch) => {
    CometChat.logout().then(dispatch(logoutSuccess()));
  };
};

export const auth = (uid, authKey, createUser) => {
  return (dispatch) => {
    dispatch(authStart());

    CometChat.login(uid, authKey)
      .then((user) => {
        if (user) {
          dispatch(authSuccess(user));
        } else {
          dispatch(authFail(user));
        }
      })
      .catch((error) => {
        // console.log('CometChatLogin Failed', error);
        if (error.code === 'ERR_UID_NOT_FOUND') {
          dispatch(createNewUser(uid, authKey));
        } else {
          dispatch(authFail(error));
        }
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    CometChat.getLoggedinUser()
      .then((user) => {
        if (user) {
          dispatch(authSuccess(user));
        } else {
          dispatch(authFail(user));
        }
      })
      .catch((error) => {
        dispatch(authFail(error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const workSpaceList = () => {
  return (dispatch) => {
    axios({
      url: serverUrl + 'user/workspaces',
      method: 'get',
      params: {
        user_id: 'superhero1',
      },
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidWlkXzEiLCJpYXQiOjE2MjYxNjE2MDAsImV4cCI6MTYyNjE2NTIwMH0.kSNcOI-7mkD4KrIt9X5fd3qjeTqyTAfTdiYOIqg6ytw',
      },
    })
      .then((res) => {
        console.log('response:::::', res.data.data);
        dispatch({
          type: actionTypes.WORK_SPACE_LIST,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log('error:', err);
        console.log('error:', err.response);
        return err.response;
      });
  };
};
