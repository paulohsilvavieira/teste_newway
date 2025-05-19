import { faker } from '@faker-js/faker';
export const mockRegisterAuthInput = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
