export const formatAddress = (address: string) => {
	if (!address) return '';
	return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
