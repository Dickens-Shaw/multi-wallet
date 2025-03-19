export function generateRandomAvatar() {
	const animalColors = {
		'🐵': '#8B4513',
		'🐶': '#A0522D',
		'🐺': '#696969',
		'🦊': '#FF8C00',
		'🦝': '#808080',
		'🐱': '#FAFAD2',
		'🦁': '#FFA500',
		'🐯': '#FF8C00',
		'🐮': '#8B4513',
		'🐷': '#FF8CBC',
		'🐗': '#8B4513',
		'🦒': '#FFD700',
		'🐭': '#D3D3D3',
		'🐹': '#DEB887',
		'🐰': '#FFF5EE',
		'🐻': '#8B4513',
		'🐨': '#A9A9A9',
		'🐼': '#FFFFFF',
		'🐸': '#7CFC00'
	};

	const keys = Object.keys(animalColors) as (keyof typeof animalColors)[];
	const randomIndex = Math.floor(Math.random() * keys.length);
	const text = keys[randomIndex];

	if (!text) {
		throw new Error('Unexpected undefined value from keys[randomIndex]');
	}

	const bg = animalColors[text];

	return { text, bg };
}
