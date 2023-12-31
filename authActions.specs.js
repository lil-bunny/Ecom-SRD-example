

describe('onAuth action creator', () => {
  afterEach(() => {
    mock.reset();
  });

  it('dispatches authSuccess action on successful authentication', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const isSignup = true;
    const store = mockStore({});

    const authData = {
      email,
      password,
      returnSecureToken: true
    };

    const responseData = {
      idToken: 'mockedToken',
      localId: 'mockedUserId',
      expiresIn: 3600,
    };

    mock.onPost(/.*/).reply(200, responseData);

    const expectedActions = [
      { type: 'AUTH_START' },
      { type: 'AUTH_SUCCESS', idToken: 'mockedToken', userId: 'mockedUserId' },
      // Add your expected actions for checkAuthTimeout if needed
    ];

    return store.dispatch(onAuth(email, password, isSignup)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches authFail action on failed authentication', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const isSignup = true;
    const store = mockStore({});

    const authData = {
      email,
      password,
      returnSecureToken: true
    };

    mock.onPost(/.*/).reply(400, { error: 'Mocked error' });

    const expectedActions = [
      { type: 'AUTH_START' },
      { type: 'AUTH_FAIL', error: 'Mocked error' },
    ];

    return store.dispatch(onAuth(email, password, isSignup)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
