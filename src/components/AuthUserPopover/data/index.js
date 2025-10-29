import { ASSET_AVATARS } from '@/utilities/constants/paths';
import { getAssetPath } from '@/utilities/helpers';

export const authUser = {
  email: 'kiley.brown@example.com',
  name: 'Kiley Brown',
  profile_pic: getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`, `60x60`),
  handle: 'kiley.brown@example.com',
  job_title: 'Creative Head',
};
