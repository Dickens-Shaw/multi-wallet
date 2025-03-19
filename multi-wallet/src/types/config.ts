import type { Chain } from './chain';

export type Config = {
	chains?: Chain[];
	multiInjectedProviderDiscovery?: boolean;
};
