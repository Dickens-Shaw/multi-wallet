import { BaseConnector } from '../baseConnector';
import { default as nacl } from 'tweetnacl';
import { default as bs58 } from 'bs58';
import type { WalletInfo } from '@type/connector';

const buildUrl = (method: string, params: URLSearchParams) =>
	`https://phantom.app/ul/v1/${method}?${params.toString()}`;

const generateDeepLinkProvider = (info: WalletInfo) => {
	return {
		request: async ({ method, params }: any) => {
			console.log('Phantom-----request', method, params);
			return new Promise(() => {
				if (method === 'openDApp') {
					const dappUrl = encodeURIComponent(window.location.href);
					const url = `${info.deepLink}/${dappUrl}?ref=${dappUrl}`;
					console.log('Phantom------deepLink', url);
					window.location.href = url;
				} else if (method === 'login') {
					// window[callbackName] = callback;
					const clientKeyPair = nacl.box.keyPair(); // use nacl to generate a key pair
					const clientPublicKey = bs58.encode(clientKeyPair.publicKey); //  convert the public key to base58
					const clientPrivateKey = clientKeyPair.secretKey;
					localStorage.setItem('clientPrivateKey', bs58.encode(clientPrivateKey));
					const params = new URLSearchParams({
						dapp_encryption_public_key: clientPublicKey,
						app_url: window.location.href,
						redirect_link: window.location.href
					});

					const url = buildUrl('connect', params);
					window.location.href = url;
				}
			});
		}
	};
};

export default class PhantomDeepLinkConnector extends BaseConnector {
	constructor(info: WalletInfo) {
		const provider = generateDeepLinkProvider(info);
		super(info, provider);

		this.deepLink = info.deepLink;
	}

	connect = async () => {
		const provider = this.getProvider();
		try {
			this.beforeConnecting();
			await provider.request({ method: 'openDApp' });
			this.resetStatus();
			return Promise.resolve('');
		} catch (err) {
			console.error(err);
			this.resetStatus();
			return Promise.reject(err);
		}
	};

	reconnection = async () => {
		console.log('reconnection');
	};

	disconnect = async () => {
		this.resetStatus();
	};

	getAccounts = () => {};

	__onAccountsChanged = () => {};

	__onChainChanged = () => {};

	__onConnect = () => {};

	__onDisconnect = () => {};
}

// Connect
// In order to start interacting with Phantom, an app must first establish a connection. This connection request will prompt the user for permission to share their public key, indicating that they are willing to interact further.

// Once a user connects to Phantom, Phantom will return a session param that should be used on all subsequent methods. For more information on sessions, please review Handling Sessions.

// Base URL
// Copy
// https://phantom.app/ul/v1/connect
// Query String Parameters
// app_url (required): A url used to fetch app metadata (i.e. title, icon) using the same properties found in Displaying Your App. URL-encoded.

// dapp_encryption_public_key (required): A public key used for end-to-end encryption. This will be used to generate a shared secret. For more information on how Phantom handles shared secrets, please review Encryption.

// redirect_link (required): The URI where Phantom should redirect the user upon connection. Please review Specifying Redirects for more details. URL-encoded.

// cluster (optional): The network that should be used for subsequent interactions. Can be either: mainnet-beta, testnet, or devnet. Defaults to mainnet-beta.

// Returns
// ✅ Approve
// phantom_encryption_public_key: An encryption public key used by Phantom for the construction of a shared secret between the connecting app and Phantom, encoded in base58.

// nonce: A nonce used for encrypting the response, encoded in base58.

// data: An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.

// Copy
// // content of decrypted `data`-parameter
// {
//   // base58 encoding of user public key
//   "public_key": "BSFtCudCd4pR4LSFqWPjbtXPKSNVbGkc35gRNdnqjMCU",

//   // session token for subsequent signatures and messages
//   // dapps should send this with any other deeplinks after connect
//   "session": "..."
// }
// public_key: The public key of the user, represented as a base58-encoded string.

// session: A string encoded in base58. This should be treated as opaque by the connecting app, as it only needs to be passed alongside other parameters. Sessions do not expire. For more information on sessions, please review Handling Sessions.

// Disconnect
// After an initial Connect event has taken place, an app may disconnect from Phantom at anytime. Once disconnected, Phantom will reject all signature requests until another connection is established.

// Base URL
// Copy
// https://phantom.app/ul/v1/disconnect
// Query String Parameters
// dapp_encryption_public_key (required): The original encryption public key used from the app side for an existing Connect session.

// nonce (required): A nonce used for encrypting the request, encoded in base58.

// redirect_link (required): The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details. URL-encoded.

// payload (required): An encrypted JSON string with the following fields:

// Copy
// {
//     "session": "...", // token received from the connect method
// }
// session (required): The session token received from the Connect method. Please see Handling Sessions for more details.

// Returns
// ✅ Approve
// No query params returned.

// SignAndSendTransaction
// Once an application is connected to Phantom, it can prompt the user for permission to send transactions on their behalf.

// In order to send a transaction, an application must:

// Create an unsigned transaction.

// Have the transaction be signed and submitted to the network by the user's Phantom wallet.

// Optionally await network confirmation using a Solana JSON RPC connection.

// For more information about the nature of Solana transactions, please review the solana-web3.js docs as well as the Solana Cookbook.

// For a sample transaction using Phantom deeplinks, check out our deeplinking demo app.

// Base URL
// Copy
// https://phantom.app/ul/v1/signAndSendTransaction
// Query String Parameters
// dapp_encryption_public_key (required): The original encryption public key used from the app side for an existing Connect session.

// nonce (required): A nonce used for encrypting the request, encoded in base58.

// redirect_link (required): The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details. URL-encoded.

// payload (required): An encrypted JSON string with the following fields:

// Copy
// {
//   "transaction": "...", // serialized transaction, base58-encoded
//   "sendOptions": "..." // an optional Solana web3.js sendOptions object
//   "session": "...", // token received from the connect method
// }
// transaction (required): The transaction that Phantom will sign and submit, serialized and encoded in base58.

// sendOptions (optional): An optional object that specifies options for how Phantom should submit the transaction. This object is defined in Solana web3.js.

// session (required): The session token received from the Connect method. Please see Handling Sessions for more details.

// Returns
// ✅ Approve
// nonce: A nonce used for encrypting the response, encoded in base58.

// data: An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.

// Copy
// // content of decrypted `data`-parameter
// {
//   "signature": "..." // transaction-signature
// }
// signature: The first signature in the transaction, which can be used as its transaction id.

// SignAllTransactions
// Once an app is connected, it is also possible to sign multiple transactions at once. Unlike SignAndSendTransaction, Phantom will not submit these transactions to the network. Applications can submit signed transactions using web3.js's sendRawTransaction.

// Base URL
// Copy
// https://phantom.app/ul/v1/signAllTransactions
// Query String Parameters
// dapp_encryption_public_key (required): The original encryption public key used from the app side for an existing Connect session.

// nonce (required): A nonce used for encrypting the request, encoded in base58.

// redirect_link (required): The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details. URL-encoded.

// payload (required): An encrypted JSON string with the following fields:

// Copy
// {
//   "transactions": [
//     "...", // serialized transaction, bs58-encoded
//     "...", // serialized transaction, bs58-encoded
//   ],
//   "session": "...", // token received from connect-method
// }
// transactions (required): An array of transactions that Phantom will sign, serialized and encoded in base58.

// session (required): The session token received from the Connect method. Please see Handling Sessions for more details.

// Returns
// ✅ Approve
// nonce: A nonce used for encrypting the response, encoded in base58.

// data: An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.

// Copy
// // content of decrypted `data`-parameter
// {
//     transactions: [
//         "...", // signed serialized transaction, bs58-encoded
//         "...", // signed serialized transaction, bs58-encoded
//     ]
// }
// transactions: An array of signed, serialized transactions that are base58 encoded. Phantom will not submit these transactions. Applications can submit these transactions themselves via web3.js's sendRawTransaction.

// SignTransaction
// The easiest and most recommended way to send a transaction is via SignAndSendTransaction. It is safer for users, and a simpler API for developers, for Phantom to submit the transaction immediately after signing it instead of relying on the application to do so.

// However, it is also possible for an app to request just the signature from Phantom. Once signed, an app can submit the transaction itself using web3.js's sendRawTransaction.

// Base URL
// Copy
// https://phantom.app/ul/v1/signTransaction
// Query String Parameters
// dapp_encryption_public_key (required): The original encryption public key used from the app side for an existing Connect session.

// nonce (required): A nonce used for encrypting the request, encoded in base58.

// redirect_link (required): The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details. URL-encoded.

// payload (required): An encrypted JSON string with the following fields:

// Copy
// {
//   "transaction": "...", // serialized transaction, base58 encoded
//   "session": "...", // token received from connect-method
// }
// transaction (required): The transaction that Phantom will sign, serialized and encoded in base58.

// session (required): The session token received from the Connect method. Please see Handling Sessions for more details.

// Returns
// ✅ Approve
// nonce: A nonce used for encrypting the response, encoded in base58.

// data: An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.

// Copy
// // content of decrypted `data`-parameter
// {
//     transaction: "...", // signed serialized transaction, base58 encoded
// }
// transaction: The signed, serialized transaction that is base58 encoded. Phantom will not submit this transactions. An application can submit this transactions itself via web3.js's sendRawTransaction.

// SignMessage
// Once it's connected to Phantom, an app can request that the user signs a given message. Applications are free to write their own messages which will be displayed to users from within Phantom's signature prompt. Message signatures do not involve network fees and are a convenient way for apps to verify ownership of an address.

// In order to send a message for the user to sign, an application must:

// Provide a hex or UTF-8 encoded string as a Uint8Array and then base58-encoded it.

// Request that the encoded message is signed via the user's Phantom wallet.

// The deeplinking demo app provides an example of signing a message.

// For more information on how to verify the signature of a message, please refer to Encryption Resources.

// Base URL
// Copy
// https://phantom.app/ul/v1/signMessage
// Query String Parameters
// dapp_encryption_public_key (required): The original encryption public key used from the app side for an existing Connect session.

// nonce (required): A nonce used for encrypting the request, encoded in base58.

// redirect_link (required): The URI where Phantom should redirect the user upon completion. Please review Specifying Redirects for more details. URL-encoded.

// payload (required): An encrypted JSON string with the following fields:

// Copy
// {
//   "message": "...", // the message, base58 encoded
//   "session": "...", // token received from connect-method
//   "display": "utf8" | "hex", // the encoding to use when displaying the message
// }
// message (required): The message that should be signed by the user, encoded in base58. Phantom will display this message to the user when they are prompted to sign.

// session (required): The session token received from the Connect method. Please see Handling Sessions for more details.

// display (optional): How you want us to display the string to the user. Defaults to utf8

// Returns
// ✅ Approve
// nonce: A nonce used for encrypting the response, encoded in base58.

// data: An encrypted JSON string. Refer to Encryption to learn how apps can decrypt data using a shared secret. Encrypted bytes are encoded in base58.

// Copy
// // content of decrypted `data`-parameter
// {
//     signature: "...", // message-signature
// }
// signature: The message signature, encoded in base58. For more information on how to verify the signature of a message, please refer to Encryption Resources.
