import { supabase } from './supabaseClient';

export async function uploadImage(file) {
  const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
  const extension = extensions[file.type];
  if (!extension || file.size > 5 * 1024 * 1024) {
    throw new Error('Selecione uma imagem JPEG, PNG ou WebP de até 5 MB.');
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Entre na sua conta para enviar imagens.');
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file);
  if (error) throw error;
  return path;
}

export async function resolveImage(path) {
  if (!path || /^(https?:|data:)/.test(path)) return path;
  const { data, error } = await supabase.storage.from('product-images').createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}
