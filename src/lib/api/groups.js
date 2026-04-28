import { supabase } from '../supabaseClient';

export async function createGroup(group) {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      id: group.id,
      name: group.name,
      participants: group.participants,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateGroup(group) {
  const { data, error } = await supabase
    .from('groups')
    .update({
      name: group.name,
      participants: group.participants,
    })
    .eq('id', group.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteGroup(groupId) {
  const { error } = await supabase.from('groups').delete().eq('id', groupId);

  if (error) {
    throw error;
  }
}

export async function getGroupById(id) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
