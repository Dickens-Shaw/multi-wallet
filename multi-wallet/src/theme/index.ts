import { createGlobalStyle } from 'styled-components';

// 导入Manrope字体的不同字重
// 只导入需要的字重，减小包体积
import '@fontsource/manrope/300.css'; // Light
import '@fontsource/manrope/400.css'; // Regular
import '@fontsource/manrope/500.css'; // Medium
import '@fontsource/manrope/600.css'; // SemiBold
import '@fontsource/manrope/700.css'; // Bold
import '@fontsource/manrope/800.css'; // ExtraBold

export const themeStyle = {
	darkMode: {
		textColor: '#ffffff',
		textColor1: '#757575 ',
		textColor2: '#ffffff',
		textColor3: '#5c5c5c',
		textColor4: '#ffffff',
		textColor5: '#858585',
		buttonBg: '#ffffff',
		buttonColor: '#000000',
		modalBg: '#191919',
		modalSideBg: '#171717',
		itemActiveBg: 'rgba(255, 255, 255, 0.20)',
		itemHoverBg: 'rgba(255, 255, 255, 0.10)',
		blue: '#00a6ff',
		gray: '#acacac',
		borderColor: '#2a2a2a',
		backArrowColor: '#fbfbfb',
		closeBtnBg: 'rgba(146, 146, 146, .2)',
		closeBtnColor: '#ffffff',
		closeBtnHoverBg: 'rgba(146, 146, 146, .4)',
		infoBtnBg: 'rgba(224, 232, 255, 0.1)',
		infoBtnHoverBg: 'rgba(224, 232, 255, 0.2)',
		cardBg: 'linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F',
		spinColor: '#ffffff',
		modalOverlay: 'rgba(255,255,255,.15)'
	},
	lightMode: {
		textColor: '#000000',
		textColor1: '#757575',
		textColor2: '#444444',
		textColor3: '#a8a8a8',
		textColor4: '#111111',
		textColor5: '#858585',
		buttonBg: '#000000',
		buttonColor: '#ffffff',
		modalBg: '#ffffff',
		modalSideBg: '#f9f9f9',
		itemActiveBg: 'rgba(0, 0, 0, 0.20)',
		itemHoverBg: 'rgba(0, 0, 0, 0.10)',
		blue: '#00a6ff',
		gray: '#acacac',
		borderColor: '#f0f0f0',
		backArrowColor: '#161617',
		closeBtnBg: 'rgba(146, 146, 146, .3)',
		closeBtnColor: '#ffffff',
		closeBtnHoverBg: 'rgba(146, 146, 146, .5)',
		infoBtnBg: 'rgba(0, 0, 0, 0.05)',
		infoBtnHoverBg: 'rgba(0, 0, 0, 0.1)',
		cardBg: 'linear-gradient(126deg,rgba(200, 200, 200, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%),#f5f5f5',
		spinColor: '#6a6a6a',
		modalOverlay: 'rgba(0,0,0,.33)'
	}
};

export const ThemedGlobalStyle = createGlobalStyle`
	.gap-2 {
		gap: 2px;
	}

	.gap-4 {
		gap: 4px;
	}

	.gap-6 {
		gap: 6px;
	}

	.gap-8 {
		gap: 8px;
	}

	.gap-10 {
		gap: 10px;
	}

	.gap-12 {
		gap: 12px;
	}

	.gap-14 {
		gap: 14px;
	}

	.gap-16 {
		gap: 16px;
	}

	.pd-tb-10{
		padding: 10px 0;
	}
`;
