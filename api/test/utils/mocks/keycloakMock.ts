import { KeycloakServices } from '../services/keycloak.service';

export class KeycloakServiceMock {
  constructor(private readonly keycloakService: KeycloakServices) {}

  public mockKeycloakCreateUser() {
    jest.spyOn(this.keycloakService, 'createUser').mockResolvedValue({
      user: {
        id: 'dummy_id',
        email: 'dummy_email@mail.com',
        username: `dummy_email@mail.com`,
      },
    });
  }

  public mockKeycloakCreateUserError() {
    jest.spyOn(this.keycloakService, 'login').mockImplementationOnce(() => {
      throw new Error('Something went wrong');
    });
  }

  public mockKeycloakLogin() {
    jest.spyOn(this.keycloakService, 'login').mockResolvedValue({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    });
  }

  public mockKeycloakRefreshToken() {
    jest.spyOn(this.keycloakService, 'refreshToken').mockResolvedValue({
      access_token: 'mock-access-new-token',
      refresh_token: 'mock-refresh-new-token',
    });
  }
}
