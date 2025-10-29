import {
  RiGithubFill,
  RiReactjsFill,
  RiStackOverflowFill,
} from 'react-icons/ri';

const educationsData = [
  {
    title: 'Rajasthan University Jaipur',
    description:
      'Bachelor of Technology (B.Tech) Information Technology 2003-2007',
  },
  {
    title: 'Rajasthan University Jaipur',
    description:
      'Bachelor of Technology (B.Tech) Information Technology 2003-2007',
  },
];
const socialsData = [
  {
    icon: <RiGithubFill fontSize={24} />,
    title: 'GitHub',
    followers: 4,
  },
  {
    icon: <RiStackOverflowFill fontSize={24} />,
    title: 'StackOverflow',
    followers: 8,
  },
  {
    icon: <RiReactjsFill fontSize={24} />,
    title: 'ReactJs',
    followers: 10,
  },
];

export { educationsData, socialsData };
