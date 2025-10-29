import {
  RiMailUnreadLine,
  RiNotificationLine,
  RiSmartphoneLine,
} from 'react-icons/ri';

export const notificationsData = [
  {
    id: 1,
    title: 'In-app Notifications',
    description: 'Notifications delivered inside the app',
    icon: <RiNotificationLine fontSize={22} />,
  },
  {
    id: 2,
    title: 'SMS Notifications',
    description: 'Notifications delivered to the phone via SMS',
    icon: <RiSmartphoneLine fontSize={22} />,
  },
  {
    id: 3,
    title: 'Email Notifications',
    description:
      'Notifications delivered to your primary email address abc@example.com',
    icon: <RiMailUnreadLine fontSize={22} />,
  },
];
