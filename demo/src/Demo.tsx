import { ConnectButton, ChainType, useWalletKit, getWalletKit, PutNetType, SolNetType, ConnectStatus } from 'multi-wallet';
import { useEffect, useMemo, useState } from 'react';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { MULTICALL3_ADDRESS, MULTICALL3_ABI } from './constant';

declare global {
	interface Window {
		WalletKit: any;
	}
}

const Demo = () => {
	const {
		connect,
		currentChainType,
		setChainType,
		currentConnector,
		connectStatus,
		theme,
		toggleTheme,
		language,
		setLanguage,
		walletAddress,
		currentNetwork,
		setCurrentNetwork,
		getProvider,
		provider,
		showWalletInfo,
		disconnect,
		signMessage,
		signTransaction,
		sendTransaction,
		readContract,
		writeContract,
		multicall,
		switchNetwork,
		waitForTransactionReceipt,
		getSupportNets
	} = useWalletKit();

	const chainList = [ChainType.EVM, ChainType.SOL, ChainType.Tron, ChainType.BTC, ChainType.PUT];
	const handleConnect = async () => {
		try {
			const res = await connect();
			console.log('connect:res', res);
		} catch (err) {
			console.error('connect:error', err);
		}
	};

	const handleDisconnect = () => {
		currentConnector?.disconnect();
	};

	const handleGetProvider = async () => {
		const provider = await getProvider();
		console.log('provider', provider);
	};

	useEffect(() => {
		window.WalletKit = getWalletKit();
	}, []);

	useEffect(() => {
		const handleConnect = async (address: string) => {
			console.log('event:connect', address);
		};
		const handleChainChanged = (chainId: string) => {
			console.log('event:chainId', chainId);
		};
		const handleAccountChanged = (address: string) => {
			console.log('event:accountsChanged', address);
		};
		const handleDisconnect = () => {
			console.log('event:disconnect');
		};
		if (currentConnector) {
			currentConnector.on('connect', handleConnect);
			currentConnector.on('chainChanged', handleChainChanged);
			currentConnector.on('accountsChanged', handleAccountChanged);
			currentConnector.on('disconnect', handleDisconnect);
		}
		return () => {
			if (currentConnector) {
				currentConnector.off('connect', handleConnect);
				currentConnector.off('chainChanged', handleChainChanged);
				currentConnector.off('accountsChanged', handleAccountChanged);
				currentConnector.off('disconnect', handleDisconnect);
			}
		};
	}, [currentConnector]);

	const openInfoModal = () => {
		showWalletInfo();
	};

	const handleGetWalletKit = () => {
		const kit = getWalletKit();
		console.log('getWalletKit', kit);
	};

	const [solTransaction, setSolTransaction] = useState<any>();
	const generateSolTransaction = async () => {
		const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

		// Create a key pair (initiator)
		const senderKeypair = Keypair.generate();

		// Create recipient public key
		const recipientPublicKey = new PublicKey('Ab1KyvCkUgsPuJVqThBZ91uZ6cCrtgKeN4tH7moFQA6a'); // Replace with recipient address

		// Create transfer instruction
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: senderKeypair.publicKey,
				toPubkey: recipientPublicKey,
				lamports: BigInt(1) // Transfer amount
			})
		);

		// Get the latest block hash
		const recentBlockhash = await connection.getLatestBlockhash();
		transaction.recentBlockhash = recentBlockhash.blockhash;
		transaction.feePayer = senderKeypair.publicKey; // Set fee payer

		// Sign the transaction
		await transaction.sign(senderKeypair);
		setSolTransaction(transaction);
	};

	useEffect(() => {
		generateSolTransaction();
	}, []);

	const netWorks = useMemo(() => {
		const enumValues = currentChainType === ChainType.PUT ? Object.values(PutNetType) : Object.values(SolNetType);
		return enumValues;
	}, [currentChainType]);

	const handleSwitchNet = async (net: string) => {
		if (provider) {
			console.log(net);
			// await switchNetwork(net);
		}
	};

	return (
		<div>
			<div>
				theme: {theme}, language: {language}
			</div>
			<div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
				<button onClick={() => toggleTheme()}>change theme</button>
				<button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>change lng</button>
			</div>
			<h2>Connect Button</h2>
			<ConnectButton />
			<h2>Info</h2>
			<p></p>
			<div>Current Chain: {currentChainType}</div>
			<div>
				Current Network:
				{[ChainType.EVM, ChainType.Tron].includes(currentChainType) ? `${currentNetwork?.nativeCurrency.symbol}-(${currentNetwork?.chainId})-[${currentNetwork?.chainName}]` : `-`}
			</div>
			<div>Wallet Name: {currentConnector?.name}</div>
			<div
				style={{
					wordWrap: 'break-word'
				}}
			>
				Wallet Address: {walletAddress}
			</div>
			<h2>Methods</h2>
			<p>Basic</p>
			<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
				<button onClick={() => handleConnect()}>Connect Wallet</button>
				<button onClick={() => handleDisconnect()}>Disconnect</button>
				<button onClick={() => openInfoModal()}>Open Info Modal</button>
				<button onClick={() => handleGetWalletKit()}>Get WalletKit</button>
				<button onClick={() => handleGetProvider()}>Get Provider</button>
			</div>
			{connectStatus === ConnectStatus.Disconnected && (
				<>
					<p>Switch Chain</p>
					<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
						{chainList.map(chainType => (
							<button key={chainType} onClick={() => setChainType(chainType)}>
								Switch to {chainType}
							</button>
						))}
					</div>
				</>
			)}
			{[ChainType.EVM, ChainType.Tron].includes(currentChainType) && (
				<>
					<p>Switch {ChainType.EVM === currentChainType ? 'EVM' : 'Tron'} Network</p>
					<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
						{getSupportNets().map(net => (
							<button
								key={net.chainId}
								onClick={async () => {
									if (provider) {
										await switchNetwork(net.chainId);
									} else {
										setCurrentNetwork(net.chainId);
									}
								}}
							>
								Switch to {net.chainName}
							</button>
						))}
					</div>
				</>
			)}
			{[ChainType.SOL, ChainType.PUT].includes(currentChainType as any) && (
				<>
					<p>
						Switch to
						{ChainType.SOL === currentChainType ? 'SOL' : 'PUT'}
						Network
					</p>
					<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
						{netWorks.map((net: string) => (
							<button key={net} onClick={() => handleSwitchNet(net)}>
								Switch to {net}
							</button>
						))}
					</div>
				</>
			)}
			<div>
				{ChainType.EVM === currentChainType && (
					<>
						<p>EVM Proxy Function</p>
						<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
							<button onClick={() => disconnect()}>disconnect</button>
							<button onClick={() => signMessage('123')}>signMessage</button>
							<button
								onClick={() =>
									sendTransaction({
										to: walletAddress,
										from: walletAddress,
										gas: '0x76c0',
										value: '0x8ac7230489e80000',
										gasPrice: '0x4a817c800'
									})
								}
							>
								sendTransaction
							</button>
							<button
								onClick={async () => {
									const res = await readContract({
										abi: [
											{
												type: 'function',
												name: 'getLpFeeAndFinalAmount',
												inputs: [
													{
														name: 'source_chain_id',
														type: 'uint256',
														internalType: 'uint256'
													},
													{
														name: 'source_token',
														type: 'bytes32',
														internalType: 'bytes32'
													},
													{
														name: 'all_amount',
														type: 'uint256',
														internalType: 'uint256'
													}
												],
												outputs: [
													{
														name: 'lp_fee',
														type: 'uint256',
														internalType: 'uint256'
													},
													{
														name: 'final_amount',
														type: 'uint256',
														internalType: 'uint256'
													}
												],
												stateMutability: 'view'
											}
										],
										args: [
											'11155111 ',
											'0x000000000000000000000000fFf9976782d46CC05630D1f6eBAb18b2324d6B14',
											'200000000000000'
										],
										functionName: 'getLpFeeAndFinalAmount',
										address: '0x3BCD6c66f8A9B7460ce7A87C71FaBBA49F288B34'
									});
									console.log('readContract res', res);
								}}
							>
								readContract(RPC)
							</button>
							<button
								onClick={() =>
									writeContract({
										address: '0xBD782429D4a4032C19678774D201Ff1231f63d45',
										abi: [
											{
												constant: false,
												inputs: [
													{ name: '_to', type: 'address' },
													{ name: '_value', type: 'uint256' }
												],
												name: 'transfer',
												outputs: [{ name: '', type: 'bool' }],
												type: 'function'
											}
										],
										functionName: 'transfer',
										args: ['0x3f61ddc23412dff8861e278a47cbddc9a4d41d9f', 1]
									})
								}
							>
								writeContract
							</button>
							<button
								onClick={async () => {
									const res = await multicall(
										[
											{
												address: '0xC2b1C8E2ED3bD2F049d033082e6eb60D6AFe791F',
												abi: [
													{
														type: 'function',
														name: 'balanceOf',
														stateMutability: 'view',
														inputs: [{ name: 'account', type: 'address' }],
														outputs: [{ type: 'uint256' }]
													},
													{
														type: 'function',
														name: 'totalSupply',
														stateMutability: 'view',
														inputs: [],
														outputs: [{ name: 'supply', type: 'uint256' }]
													}
												],
												functionName: 'totalSupply'
											},
											{
												address: '0xC2b1C8E2ED3bD2F049d033082e6eb60D6AFe791F',
												abi: [
													{
														type: 'function',
														name: 'balanceOf',
														stateMutability: 'view',
														inputs: [{ name: 'account', type: 'address' }],
														outputs: [{ type: 'uint256' }]
													},
													{
														type: 'function',
														name: 'totalSupply',
														stateMutability: 'view',
														inputs: [],
														outputs: [{ name: 'supply', type: 'uint256' }]
													}
												],
												functionName: 'balanceOf',
												args: [walletAddress]
											}
										],
										{
											multicallAddress: MULTICALL3_ADDRESS,
											multicallAbi: MULTICALL3_ABI
										}
									);
									console.log('multicall res', res);
								}}
							>
								multicall
							</button>
						</div>
					</>
				)}
				{[ChainType.SOL, ChainType.PUT].includes(currentChainType) && (
					<>
						<p>{ChainType.SOL === currentChainType ? 'SOL' : 'PUT'} Proxy Function</p>
						<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
							<button onClick={() => disconnect()}>disconnect</button>
							<button onClick={() => signMessage('123')}>signMessage</button>
							<button onClick={() => signTransaction(solTransaction)}>signTransaction</button>
							<button onClick={() => sendTransaction(solTransaction)}>sendTransaction</button>
						</div>
					</>
				)}
				{ChainType.Tron === currentChainType && (
					<>
						<p>Tron Proxy Function</p>
						<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
							<button onClick={() => disconnect()}>disconnect</button>
							<button onClick={() => signMessage('123')}>signMessage</button>
							<button
								onClick={() =>
									signTransaction({
										to: 'TEQtdcENmGETfZ2pZKZdBZFxD18MXF2zSu', // WETH contract address
										value: 10
									})
								}
							>
								signTransaction
							</button>
							<button
								onClick={async () => {
									const res = await sendTransaction({
										to: 'TEQtdcENmGETfZ2pZKZdBZFxD18MXF2zSu', // WETH contract address
										value: 10
									});
									console.log('sendTransactionSuccess', res);
									// const receipt = await waitForTransactionReceipt(res.txid);
									// console.log(receipt);
								}}
							>
								sendTransaction
							</button>
							<button
								onClick={async () => {
									const res = await readContract({
										address: '0xA83D811C387302E236BA81D8D06FD0543F636597',
										args: ['33772211'],
										functionName: 'nonceMap',
										abi: [
											{
												type: 'function',
												name: 'nonceMap',
												inputs: [
													{
														name: '',
														type: 'uint256',
														internalType: 'uint256'
													}
												],
												outputs: [
													{
														name: '',
														type: 'uint256',
														internalType: 'uint256'
													}
												],
												stateMutability: 'view'
											}
										],
										rpcUrl: 'https://nile.trongrid.io/jsonrpc',
										from: '0xF45D890DB474A4FBDD238EA41245A6303DDCA7AB'
									});
									console.log('readContract res', res);
								}}
							>
								readContract(RPC)
							</button>
							<button
								onClick={() =>
									writeContract({
										address: 'TNuoKL1ni8aoshfFL1ASca1Gou9RXwAzfn',
										abi: [
											{
												outputs: [{ type: 'uint256' }],
												constant: true,
												inputs: [{ name: 'who', type: 'address' }],
												name: 'balanceOf',
												stateMutability: 'View',
												type: 'Function'
											},
											{
												outputs: [{ type: 'bool' }],
												inputs: [
													{ name: '_to', type: 'address' },
													{ name: '_value', type: 'uint256' }
												],
												name: 'transfer',
												stateMutability: 'Nonpayable',
												type: 'Function'
											}
										],
										functionName: 'transfer',
										args: ['TKmX4i9TiEpRTv4f7xSrRkRFYuuzMuZCkJ', BigInt(2000000000000000000)],
										// value: provider.tronWeb.toSun(5),
										options: { feeLimit: 100000000, callValue: 16000000 }
									})
								}
							>
								writeContract
							</button>
							<button
								onClick={() => {
									waitForTransactionReceipt('ab79df0f9fe15f25fdc019ac5fcf9472093c5925036fd2e78c5267f623433dd5');
								}}
							>
								waitForTransactionReceipt
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Demo;
