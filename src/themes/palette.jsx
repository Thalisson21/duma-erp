// project imports
import { extendPaletteWithChannels } from 'utils/colorUtils';

// assets
import defaultColor from './theme/default';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

const presetColors = {
  default: defaultColor,
  ocean: {
    ...defaultColor,
    primaryLight: '#dbeafe',
    primary200: '#93c5fd',
    primaryMain: '#2563eb',
    primaryDark: '#1d4ed8',
    primary800: '#1e40af',
    secondaryLight: '#ccfbf1',
    secondary200: '#5eead4',
    secondaryMain: '#0f766e',
    secondaryDark: '#0f5f59',
    secondary800: '#134e4a',
    darkPrimaryLight: '#dbeafe',
    darkPrimary200: '#93c5fd',
    darkPrimaryMain: '#60a5fa',
    darkPrimaryDark: '#3b82f6',
    darkPrimary800: '#1d4ed8',
    darkSecondaryLight: '#ccfbf1',
    darkSecondary200: '#5eead4',
    darkSecondaryMain: '#2dd4bf',
    darkSecondaryDark: '#14b8a6',
    darkSecondary800: '#0f766e'
  },
  emerald: {
    ...defaultColor,
    primaryLight: '#dcfce7',
    primary200: '#86efac',
    primaryMain: '#16a34a',
    primaryDark: '#15803d',
    primary800: '#166534',
    secondaryLight: '#fef3c7',
    secondary200: '#fcd34d',
    secondaryMain: '#d97706',
    secondaryDark: '#b45309',
    secondary800: '#92400e',
    darkPrimaryLight: '#dcfce7',
    darkPrimary200: '#86efac',
    darkPrimaryMain: '#4ade80',
    darkPrimaryDark: '#22c55e',
    darkPrimary800: '#15803d',
    darkSecondaryLight: '#fef3c7',
    darkSecondary200: '#fcd34d',
    darkSecondaryMain: '#fbbf24',
    darkSecondaryDark: '#f59e0b',
    darkSecondary800: '#b45309'
  },
  floresta: {
    ...defaultColor,
    primaryLight: '#dcfce7',
    primary200: '#86efac',
    primaryMain: '#15803d',
    primaryDark: '#166534',
    primary800: '#14532d',
    secondaryLight: '#f0fdf4',
    secondary200: '#bbf7d0',
    secondaryMain: '#65a30d',
    secondaryDark: '#4d7c0f',
    secondary800: '#365314',
    darkPrimaryLight: '#dcfce7',
    darkPrimary200: '#86efac',
    darkPrimaryMain: '#4ade80',
    darkPrimaryDark: '#22c55e',
    darkPrimary800: '#166534',
    darkSecondaryLight: '#f0fdf4',
    darkSecondary200: '#bbf7d0',
    darkSecondaryMain: '#a3e635',
    darkSecondaryDark: '#84cc16',
    darkSecondary800: '#4d7c0f'
  },
  rose: {
    ...defaultColor,
    primaryLight: '#ffe4e6',
    primary200: '#fda4af',
    primaryMain: '#e11d48',
    primaryDark: '#be123c',
    primary800: '#9f1239',
    secondaryLight: '#e0f2fe',
    secondary200: '#7dd3fc',
    secondaryMain: '#0284c7',
    secondaryDark: '#0369a1',
    secondary800: '#075985',
    darkPrimaryLight: '#ffe4e6',
    darkPrimary200: '#fda4af',
    darkPrimaryMain: '#fb7185',
    darkPrimaryDark: '#f43f5e',
    darkPrimary800: '#be123c',
    darkSecondaryLight: '#e0f2fe',
    darkSecondary200: '#7dd3fc',
    darkSecondaryMain: '#38bdf8',
    darkSecondaryDark: '#0ea5e9',
    darkSecondary800: '#0369a1'
  }
};

export function buildPalette(presetColor) {
  const colors = presetColors[presetColor] || defaultColor;

  const lightColors = {
    primary: {
      light: colors.primaryLight,
      main: colors.primaryMain,
      dark: colors.primaryDark,
      200: colors.primary200,
      800: colors.primary800
    },
    secondary: {
      light: colors.secondaryLight,
      main: colors.secondaryMain,
      dark: colors.secondaryDark,
      200: colors.secondary200,
      800: colors.secondary800
    },
    error: {
      light: colors.errorLight,
      main: colors.errorMain,
      dark: colors.errorDark
    },
    orange: {
      light: colors.orangeLight,
      main: colors.orangeMain,
      dark: colors.orangeDark
    },
    warning: {
      light: colors.warningLight,
      main: colors.warningMain,
      dark: colors.warningDark,
      contrastText: colors.grey700
    },
    success: {
      light: colors.successLight,
      200: colors.success200,
      main: colors.successMain,
      dark: colors.successDark
    },
    grey: {
      50: colors.grey50,
      100: colors.grey100,
      500: colors.grey500,
      600: colors.grey600,
      700: colors.grey700,
      900: colors.grey900
    },
    dark: {
      light: colors.darkTextPrimary,
      main: colors.darkLevel1,
      dark: colors.darkLevel2,
      800: colors.darkBackground,
      900: colors.darkPaper
    },
    text: {
      primary: colors.grey700,
      secondary: colors.grey500,
      dark: colors.grey900,
      hint: colors.grey100,
      heading: colors.grey900
    },
    divider: colors.grey200,
    background: {
      paper: colors.paper,
      default: colors.paper
    }
  };

  const commonColor = { common: { black: colors.darkPaper, white: '#fff' } };

  const darkColors = {
    primary: {
      light: colors.darkPrimaryLight,
      main: colors.darkPrimaryMain,
      dark: colors.darkPrimaryDark,
      200: colors.darkPrimary200,
      800: colors.darkPrimary800
    },
    secondary: {
      light: colors.darkSecondaryLight,
      main: colors.darkSecondaryMain,
      dark: colors.darkSecondaryDark,
      200: colors.darkSecondary200,
      800: colors.darkSecondary800
    },
    error: {
      light: colors.errorLight,
      main: colors.errorMain,
      dark: colors.errorDark
    },
    orange: {
      light: colors.orangeLight,
      main: colors.orangeMain,
      dark: colors.orangeDark
    },
    warning: {
      light: colors.warningLight,
      main: colors.warningMain,
      dark: colors.warningDark,
      contrastText: colors.darkPaper
    },
    success: {
      light: colors.successLight,
      200: colors.success200,
      main: colors.successMain,
      dark: colors.successDark
    },
    grey: {
      50: colors.darkLevel2,
      100: colors.darkLevel1,
      200: colors.darkBackground,
      300: colors.darkTextSecondary,
      500: colors.darkTextSecondary,
      600: colors.darkTextPrimary,
      700: colors.darkTextTitle,
      900: colors.darkTextTitle
    },
    dark: {
      light: colors.darkTextPrimary,
      main: colors.darkLevel1,
      dark: colors.darkLevel2,
      800: colors.darkBackground,
      900: colors.darkPaper
    },
    text: {
      primary: colors.darkTextPrimary,
      secondary: colors.darkTextSecondary,
      dark: colors.darkTextTitle,
      hint: colors.darkLevel1,
      heading: colors.darkTextTitle
    },
    divider: colors.darkLevel1,
    background: {
      paper: colors.darkPaper,
      default: colors.darkBackground
    }
  };

  const extendedLight = extendPaletteWithChannels(lightColors);
  const extendedDark = extendPaletteWithChannels(darkColors);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight
    },
    dark: {
      mode: 'dark',
      ...extendedCommon,
      ...extendedDark
    }
  };
}
