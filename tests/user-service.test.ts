// userService.test.ts
import { createUser, getUserById, updateUser, deleteUser, User } from '../src/user-service';

// Mocking Supabase client
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({ data: { id: '2222', username: 'testuser', email: 'test@example.com' } }) // Adjust this as needed
        .mockResolvedValueOnce({ data: { id: '2222', username: 'testuser', email: 'test@example.com' } }) // For `getUserById`
        .mockResolvedValueOnce({ data: { id: '2222', username: 'testuser', email: 'updated@example.com' } }) // For `updateUser`
        .mockResolvedValueOnce({ data: null }) // For `deleteUser` and fetching the deleted user
    }),
  };
});

describe('UserService CRUD Operations', () => {
  let createdUser: User | null;

  beforeAll(async () => {
    // No need for setup since we are mocking the Supabase client
  });

  afterAll(async () => {
    if (createdUser && createdUser.id) {
      await deleteUser(createdUser.id);
    }
  });

  it('should create a new user', async () => {
    const newUser: User = { username: 'testuser', email: 'test@example.com' };
    createdUser = await createUser(newUser);
  
    expect(createdUser).not.toBeNull();
    expect(createdUser?.id).toBe('2222');  // this block should match the mock data
    expect(createdUser?.username).toBe('testuser');
    expect(createdUser?.email).toBe('test@example.com');
  });

  it('should fetch the created user by ID', async () => {
    if (!createdUser || !createdUser.id) {
      throw new Error('Created user is not defined');
    }

    const fetchedUser = await getUserById(createdUser.id);

    expect(fetchedUser).not.toBeNull();
    expect(fetchedUser?.id).toBe(createdUser.id);
    expect(fetchedUser?.username).toBe(createdUser.username);
    expect(fetchedUser?.email).toBe(createdUser.email);
  });

  it('should update the user\'s email', async () => {
    if (!createdUser || !createdUser.id) {
      throw new Error('Created user is not defined');
    }

    const updatedEmail = 'updated@example.com';
    const updatedUser = await updateUser(createdUser.id, { email: updatedEmail });

    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.email).toBe(updatedEmail);
  });

  it('should delete the user', async () => {
    if (!createdUser || !createdUser.id) {
      throw new Error('Created user is not defined');
    }

    const deleteResult = await deleteUser(createdUser.id);
    expect(deleteResult).toBe(true);

    const fetchedUser = await getUserById(createdUser.id);
    expect(fetchedUser).toBeNull();
  });
});
