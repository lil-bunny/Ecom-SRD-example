import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { onAuth } from './authActions'; // Replace with your actual path to authActions

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(axios);

describe('onAuth action', () => {
  afterEach(() => {
    mock.reset();
  });

  it('dispatches AUTH_SUCCESS action upon successful authentication', () => {
    const store = mockStore({});
    const responseData = {
      idToken: 'mockIdToken',
      localId: 'mockLocalId',
      expiresIn: 3600,
    };
    const expectedActions = [
      { type: 'AUTH_START' },
      { type: 'AUTH_SUCCESS', token: 'mockIdToken', userId: 'mockLocalId' },
      // Add expected actions for timeout if needed
    ];
    const email = 'test@example.com';
    const password = 'testPassword';
    const isSignup = true;

    mock.onPost('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=YOUR_API_KEY')
      .reply(200, responseData);

    return store.dispatch(onAuth(email, password, isSignup)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches AUTH_FAIL action upon authentication failure', () => {
    const store = mockStore({});
    const errorResponse = {
      error: {
        message: 'Authentication failed',
      },
    };
    const expectedActions = [
      { type: 'AUTH_START' },
      { type: 'AUTH_FAIL', error: 'Authentication failed' },
    ];
    const email = 'test@example.com';
    const password = 'testPassword';
    const isSignup = true;

    mock.onPost('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=YOUR_API_KEY')
      .reply(400, errorResponse);

    return store.dispatch(onAuth(email, password, isSignup)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  // Add more test cases for other scenarios if needed
});
