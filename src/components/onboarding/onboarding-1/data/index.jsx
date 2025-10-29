import {
  RiCheckDoubleLine,
  RiHotelLine,
  RiMapPinUserFill,
  RiMastercardFill,
  RiSlideshow2Line,
} from "react-icons/ri";
import { PersonalDetail } from "../PersonalDetail";

const steps = [
  {
    label: "Your Detail",
    description: "Provide your general detail",
    icon: <RiSlideshow2Line />,
    key: "personal-detail",
    component: PersonalDetail,
  },
  {
    label: "About Organisation",
    description: "Tell us about your company",
    icon: <RiHotelLine />,
    key: "about-organisation",
    component: PersonalDetail,
  },
  {
    label: "Payment Detail",
    description: "Add Payment Method",
    icon: <RiMastercardFill />,
    key: "payment-detail",
    component: PersonalDetail,
  },
  {
    label: "Billing Address",
    description: "Tell us where to deliver",
    icon: <RiMapPinUserFill />,
    key: "billing-address",
    component: PersonalDetail,
  },
  {
    label: "Submit & Done",
    description: "All done!",
    icon: <RiCheckDoubleLine />,
    key: "final-onboarding",
    component: PersonalDetail,
  },
];

export { steps };
