import { supabase } from './supabaseClient';

export async function touchGroupActivity(groupId) {
  if (!groupId) return;

  const { error } = await supabase
    .from('groups')
    .update({ last_activity_at: new Date().toISOString() })
    .eq('id', groupId);

  if (error) {
    console.error('Error updating group activity:', error);
  }
}
