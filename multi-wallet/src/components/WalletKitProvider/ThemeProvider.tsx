'use client';
import { ThemeProvider } from 'styled-components';
import { type ReactNode, useMemo } from 'react';
import { type Theme } from '@type/configType';
import { themeStyle } from '../../theme';

interface IWalletKitThemeProvider {
	theme?: Theme;
	children: ReactNode;
}

export function WalletKitThemeProvider({ theme, children }: IWalletKitThemeProvider) {
	const themeObject = useMemo(() => {
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'darkMode' : 'lightMode';
		return themeStyle[theme || systemTheme];
	}, [theme]);
	return <ThemeProvider theme={themeObject}>{children}</ThemeProvider>;
}
