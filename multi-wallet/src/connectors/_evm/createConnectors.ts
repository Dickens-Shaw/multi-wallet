import { createStore as mipdCreateStore } from 'mipd';
import { createStore } from 'zustand/vanilla';

export async function createConnectors() {
	const { EvmConnector } = await import('./evmConnector');
	const mipd = typeof window !== 'undefined' ? mipdCreateStore() : undefined;
	const connectors = createStore(() => {
		const collection = [];
		const rdnsSet = new Set<string>();
		if (mipd) {
			const providers = mipd.getProviders();
			for (const provider of providers) {
				if (rdnsSet.has(provider.info.rdns)) continue;
				collection.push(new EvmConnector(provider));
			}
		}
		return collection;
	});

	mipd?.subscribe(providerDetails => {
		const connectorRdnsSet = new Set();
		for (const connector of connectors.getState()) {
			connectorRdnsSet.add(connector.id);
		}
		const newConnectors: any[] = [];
		for (const providerDetail of providerDetails) {
			if (connectorRdnsSet.has(providerDetail.info.rdns)) {
				continue;
			}
			newConnectors.push(new EvmConnector(providerDetail));
		}
		connectors.setState(x => [...x, ...newConnectors], true);
	});
	return [...connectors.getState()];
}
