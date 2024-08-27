// userService.ts
import { supabase } from './supabase-client';

export interface User {
  id?: number;
  username: string;
  email: string;
}

export async function createUser(user: User): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function getUserById(userId: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function updateUser(userId: number, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data;
}

export async function deleteUser(userId: number): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  
  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }

  return true;
}
