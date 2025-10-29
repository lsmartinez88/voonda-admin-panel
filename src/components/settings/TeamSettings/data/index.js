import { ASSET_AVATARS } from '@/utilities/constants/paths';

const teamMembers = [
  {
    firstName: 'Mitchel',
    lastName: 'Stark',
    email: 'mitchel.stark@example',
    profilePic: `${ASSET_AVATARS}/avatar3.jpg`,
    access: 'Org Admin',
    lastActive: '25 Oct, 2023',
    status: 'invited',
  },
  {
    firstName: 'Chris',
    lastName: 'Harris',
    email: 'c.harris@example.com',
    profilePic: `${ASSET_AVATARS}/avatar11.jpg`,
    access: 'owner',
    lastActive: '25 Oct, 2023',
    status: 'active',
  },
];

export { teamMembers };
