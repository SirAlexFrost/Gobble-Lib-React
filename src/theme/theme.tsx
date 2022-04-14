import { createContext, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { WithChildren } from '../with-children-type';
import { BaseTheme } from './turkeydev-theme';

export const WHITE = '#ffffff';
export const BLACK = '#000000';
export const CC_BLUE_DARK = '#00687D';
export const CC_BLUE = '#009FBF';
export const OFF_WHITE = '#d8d8d8';
export const GRAY_BLUISH = '#343A40';
export const DARK_GRAY_BLUISH = '#212529';
export const LIGHT_GRAY = '#f1f1f1';

export const defaultLightTheme: BaseTheme = {
    fontFamily: 'Ubuntu',
    background: {
        color: '#E5E5E5',
        on: GRAY_BLUISH
    },
    navbar: {
        color: '#fafafa',
        on: GRAY_BLUISH,
    },
    surface: {
        color: LIGHT_GRAY,
        on: GRAY_BLUISH,
    },
    inputs: {
        color: '#BFC8CC',
        colorDisabled: OFF_WHITE,
        outlineRaised: '#05050540',
        outlineLowered: '#00000099',
        on: DARK_GRAY_BLUISH,
        onVariant: '#899295',
    },
    primary: {
        color: CC_BLUE,
        on: DARK_GRAY_BLUISH
    },
    secondary: {
        color: CC_BLUE_DARK,
        on: WHITE
    },
    error: {
        color: '#ffb4a9',
        on: '#680003'
    },
};

export const defaultDarkTheme: BaseTheme = {
    fontFamily: 'Ubuntu',
    background: {
        color: DARK_GRAY_BLUISH,
        on: OFF_WHITE
    },
    navbar: {
        color: GRAY_BLUISH,
        on: OFF_WHITE,
    },
    surface: {
        color: '#333B44',
        on: OFF_WHITE,
    },
    inputs: {
        color: GRAY_BLUISH,
        colorDisabled: '#61696C',
        outlineRaised: '#ffffff65',
        outlineLowered: '#00000066',
        on: WHITE,
        onVariant: '#899295',
    },
    primary: {
        color: CC_BLUE_DARK,
        on: WHITE
    },
    secondary: {
        color: CC_BLUE,
        on: DARK_GRAY_BLUISH
    },
    error: {
        color: '#ba1b1b',
        on: WHITE
    }
};

export const defaultJustRed: BaseTheme = {
    fontFamily: 'Ubuntu',
    background: {
        color: '#ff0000',
        on: '#ff0000'
    },
    navbar: {
        color: '#ff0000',
        on: '#ff0000',
    },
    surface: {
        color: '#ff0000',
        on: '#ff0000',
    },
    inputs: {
        color: '#ff0000',
        colorDisabled: '#ff0000',
        outlineRaised: '#ff0000',
        outlineLowered: '#ff0000',
        on: '#ff0000',
        onVariant: '#ff0000',
    },
    primary: {
        color: '#ff0000',
        on: '#ff0000'
    },
    secondary: {
        color: '#ff0000',
        on: '#ff0000'
    },
    error: {
        color: '#ff0000',
        on: '#ff0000'
    }
};

type ThemeContextType = {
    readonly setTheme: (newTheme: string) => void
    readonly theme: string
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeContext = () => {
    const theme = useContext(ThemeContext);
    if (!theme)
        throw new Error('Theme Context is undefined! Must be used from within a Theme Context Provider!');
    return theme;
};


const darkModeKey = 'darkMode';

type ThemeContextProviderProps = WithChildren & {
    readonly themes?: readonly { readonly name: string, readonly theme: BaseTheme }[]
}

const defaultThemes = ['dark', 'light', 'just_red'];

export const ThemeContextProvider = ({ children, themes }: ThemeContextProviderProps) => {
    const darkModeLocalStorage = localStorage.getItem(darkModeKey) ?? (window.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light');
    const [theme, setCurrentTheme] = useState<string>(darkModeLocalStorage);

    const setTheme = (newTheme: string) => {
        localStorage.setItem(darkModeKey, newTheme);
        setCurrentTheme(newTheme);
    };

    const darkThemeToUse = themes?.find(t => t.name === 'dark')?.theme ?? defaultDarkTheme;
    const lightThemeToUse = themes?.find(t => t.name === 'light')?.theme ?? defaultLightTheme;
    const justRedThemeToUse = themes?.find(t => t.name === 'just_red')?.theme ?? defaultJustRed;
    const themeMap = [...(themes?.filter(t => !defaultThemes.includes(t.name)) ?? []), { name: 'dark', theme: darkThemeToUse }, { name: 'light', theme: lightThemeToUse }, { name: 'just_red', theme: justRedThemeToUse }];

    return (
        <ThemeContext.Provider value={{ setTheme, theme }}>
            <ThemeProvider theme={themeMap.find(t => t.name === theme)?.theme ?? defaultDarkTheme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider >
    );
};
