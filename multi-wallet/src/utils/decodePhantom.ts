import { default as nacl } from 'tweetnacl';
import { default as bs58 } from 'bs58';

export const decodePhantomDeepLink = () => {
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('data')) {
		const phantomEncryptionPublicKey = bs58.decode(urlParams.get('phantom_encryption_public_key') || '');
		const nonce = bs58.decode(urlParams.get('nonce') || '');
		const encryptedData = bs58.decode(urlParams.get('data') || '');

		const clientPrivateKey = bs58.decode(localStorage.getItem('clientPrivateKey') || '');
		if (!clientPrivateKey) {
			console.error('Client private key not found');
			return;
		}
		// use nacl to generate a shared secret and decrypt the data
		console.log(phantomEncryptionPublicKey, clientPrivateKey);
		const sharedSecret = nacl.box.before(phantomEncryptionPublicKey, clientPrivateKey);
		const decryptedData = nacl.box.open.after(encryptedData, nonce, sharedSecret);

		// decode the decrypted data
		if (decryptedData) {
			const result = JSON.parse(new TextDecoder().decode(decryptedData));
			localStorage.removeItem('clientPrivateKey');
			console.log('decodePhantomDeepLink', result);
			return result;
		} else {
			console.error('Failed to decrypt data');
		}
	}
};
