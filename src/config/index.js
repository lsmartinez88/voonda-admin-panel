import { footerTheme } from '@/themes/footer/default';
import { headerTheme } from '@/themes/header/default';
import { mainTheme } from '@/themes/main/default';
import { sidebarTheme } from '@/themes/sidebar/default';
import { createJumboTheme } from '@jumbo/utilities/helpers';

export const config = {
  containerStyle: 'fluid',
};
export const CONFIG = {
  THEME: createJumboTheme(mainTheme, headerTheme, sidebarTheme, footerTheme),
};
