import { ASSET_IMAGES } from '@/utilities/constants/paths';

export const paymentCardData = [
  {
    id: 124,
    cardNumber: '123456789123',
    cardName: 'Visa',
    cardImage: `${ASSET_IMAGES}/etc/visa.png`,
    expiryDate: '07/2025',
    primary: true,
  },
  {
    id: 125,
    cardNumber: '123456789456',
    cardName: 'Mastercard',
    expiryDate: '08/2027',
    cardImage: `${ASSET_IMAGES}/etc/mastercard.png`,
    primary: false,
  },
];
