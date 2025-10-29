import { ASSET_AVATARS } from '@/utilities/constants/paths';

export const connections = [
  {
    id: 32,
    user: {
      id: 21,
      name: 'Julia Robert',
      username: 'julia.robert',
      profile_pic: `${ASSET_AVATARS}/avatar4.jpg`,
    },
    follow: true,
  },
  {
    id: 33,
    user: {
      id: 22,
      name: 'Joe Lee',
      username: 'joe.lee',
      profile_pic: `${ASSET_AVATARS}/avatar5.jpg`,
    },
    follow: false,
  },
  {
    id: 34,
    user: {
      id: 23,
      name: 'Chang Lee',
      username: 'chang.lee',
      profile_pic: `${ASSET_AVATARS}/avatar6.jpg`,
    },
    follow: false,
  },
  {
    id: 35,
    user: {
      id: 24,
      name: 'Mickey Arthur',
      username: 'mickey.arthur',
      profile_pic: `${ASSET_AVATARS}/avatar7.jpg`,
    },
    follow: true,
  },
  {
    id: 36,
    user: {
      id: 25,
      name: 'Shane Watson',
      username: 'shane.watson',
      profile_pic: `${ASSET_AVATARS}/avatar8.jpg`,
    },
    follow: true,
  },
];
