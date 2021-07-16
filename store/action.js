import * as actionTypes from './actionTypes';
import {
  isExpired,
  getExpirationDate,
} from '../cometchat-pro-react-native-ui-kit/src/utils/functions';

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
    console.log('Hello I am Called');
    CometChat.getLoggedinUser()
      .then((user) => {
        console.log('response::::::', user);
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
  return (dispatch, state) => {
    const token = state().reducer.jwtToken;
    axios({
      url: serverUrl + 'user/workspaces',
      method: 'get',
      params: {
        user_id: 'superhero1',
      },
      headers: {
        Authorization: `Bearer ${token}`,
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

export const jwtToken = () => {
  return (dispatch, state) => {
    const token = state().reducer.jwtToken;
    console.log('check karen::::::', token);

    if (!token || isExpired(getExpirationDate(token))) {
      axios({
        url: serverUrl + 'auth/get_token',
        method: 'post',
        headers: {
          app_key: 'b2hVnob8NqU4qFLq6un6QFQSMJkk01dI',
          user_id: 'uid_1',
        },
      })
        .then((res) => {
          dispatch({
            type: actionTypes.JWT_TOKEN,
            payload: res.headers,
          });
        })
        .catch((err) => {
          // console.log('error:', err);
          console.log('error jwt:', err.response);
          return err.response;
        });
    }
  };
};

export const selectWorkSpace = (data) => {
  return {
    type: actionTypes.SELECTED_WORKSPACE,
    payload: data,
  };
};

export const onAddWorkSpace = (data) => {
  console.log('credentials', data);
  return (dispatch, state) => {
    const token = state().reducer.jwtToken;
    axios
      .post(serverUrl + 'workspace', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log('response:::::', res.data);
        dispatch({
          type: actionTypes.ADD_WORK_SPACE,
          payload: '',
        });
      })
      .catch((err) => {
        console.log('error:', err);
        console.log('error:', err.response);
        return err.response;
      });
  };
};
