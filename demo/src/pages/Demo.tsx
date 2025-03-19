import { ConnectButton, ChainType, useWalletKit, getWalletKit, PutNetType, SolNetType } from 'multi-wallet';
import { useEffect, useMemo, useState } from 'react';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

declare global {
	interface Window {
		WalletKit: any;
	}
}

// 在类外部声明这些常量
const MULTICALL3_ADDRESS = '0xe0E7B3133B41E9b5F9858C370FB9909E77Bc247c';

const MULTICALL3_ABI = [
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address'
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]'
			}
		],
		name: 'aggregate',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256'
			},
			{
				internalType: 'bytes[]',
				name: 'returnData',
				type: 'bytes[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'allowFailure',
						type: 'bool'
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Call3[]',
				name: 'calls',
				type: 'tuple[]'
			}
		],
		name: 'aggregate3',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool'
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'allowFailure',
						type: 'bool'
					},
					{
						internalType: 'uint256',
						name: 'value',
						type: 'uint256'
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Call3Value[]',
				name: 'calls',
				type: 'tuple[]'
			}
		],
		name: 'aggregate3Value',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool'
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address'
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]'
			}
		],
		name: 'blockAndAggregate',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256'
			},
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32'
			},
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool'
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bool',
				name: 'requireSuccess',
				type: 'bool'
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address'
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]'
			}
		],
		name: 'tryAggregate',
		outputs: [
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool'
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bool',
				name: 'requireSuccess',
				type: 'bool'
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'target',
						type: 'address'
					},
					{
						internalType: 'bytes',
						name: 'callData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Call[]',
				name: 'calls',
				type: 'tuple[]'
			}
		],
		name: 'tryBlockAndAggregate',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256'
			},
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32'
			},
			{
				components: [
					{
						internalType: 'bool',
						name: 'success',
						type: 'bool'
					},
					{
						internalType: 'bytes',
						name: 'returnData',
						type: 'bytes'
					}
				],
				internalType: 'struct Multicall3.Result[]',
				name: 'returnData',
				type: 'tuple[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getBasefee',
		outputs: [
			{
				internalType: 'uint256',
				name: 'basefee',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256'
			}
		],
		name: 'getBlockHash',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getBlockNumber',
		outputs: [
			{
				internalType: 'uint256',
				name: 'blockNumber',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getChainId',
		outputs: [
			{
				internalType: 'uint256',
				name: 'chainid',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getCurrentBlockCoinbase',
		outputs: [
			{
				internalType: 'address',
				name: 'coinbase',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getCurrentBlockDifficulty',
		outputs: [
			{
				internalType: 'uint256',
				name: 'difficulty',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getCurrentBlockGasLimit',
		outputs: [
			{
				internalType: 'uint256',
				name: 'gaslimit',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getCurrentBlockTimestamp',
		outputs: [
			{
				internalType: 'uint256',
				name: 'timestamp',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'addr',
				type: 'address'
			}
		],
		name: 'getEthBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: 'balance',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getLastBlockHash',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'blockHash',
				type: 'bytes32'
			}
		],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

const Demo = () => {
	const {
		connect,
		currentChainType,
		setChainType,
		currentConnector,
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
		connectStatus,
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
	const chainList = [ChainType.EVM, ChainType.PUT, ChainType.SOL, ChainType.Tron, ChainType.BTC];
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

		// 创建一个密钥对（发起者）
		const senderKeypair = Keypair.generate();

		// 创建接收者公钥
		const recipientPublicKey = new PublicKey('Ab1KyvCkUgsPuJVqThBZ91uZ6cCrtgKeN4tH7moFQA6a'); // 替换为接收者地址

		// 创建转账指令
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: senderKeypair.publicKey,
				toPubkey: recipientPublicKey,
				lamports: BigInt(1) // 转账金额
			})
		);

		// 获取最新的区块哈希
		const recentBlockhash = await connection.getLatestBlockhash();
		transaction.recentBlockhash = recentBlockhash.blockhash;
		transaction.feePayer = senderKeypair.publicKey; // 设置费用支付者

		// 对交易进行签名
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
				theme：{theme}，language：{language}
			</div>
			<div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
				<button onClick={() => toggleTheme()}>change theme</button>
				<button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>change lng</button>
			</div>
			<h2>Connect Button</h2>
			<ConnectButton />
			<h2>Hooks</h2>
			<p></p>
			<div>当 前 链：{currentChainType}</div>
			{[ChainType.EVM, ChainType.Tron].includes(currentChainType) && (
				<div>
					当 前 网：
					{`${currentNetwork?.nativeCurrency.symbol}-(${currentNetwork?.chainId})-[${currentNetwork?.chainName}]`}
				</div>
			)}
			<div>钱 包 名：{currentConnector?.name}</div>
			<div
				style={{
					wordWrap: 'break-word'
				}}
			>
				钱包地址：{walletAddress}
			</div>
			<p>基础方法</p>
			<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
				<button onClick={() => handleConnect()}>连接钱包</button>
				<button onClick={() => handleDisconnect()}>断开链接</button>
				<button onClick={openInfoModal}>打开 Info Modal</button>
				<button onClick={handleGetWalletKit}>获取 walletKit</button>
				<button onClick={() => handleGetProvider()}>获取 Provider</button>
			</div>
			<p>切链</p>
			<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
				{chainList.map(chainType => (
					<button key={chainType} onClick={() => setChainType(chainType)}>
						切换{chainType}
					</button>
				))}
			</div>
			{[ChainType.EVM, ChainType.Tron].includes(currentChainType) && (
				<div>
					<p>切换{ChainType.EVM === currentChainType ? 'EVM' : 'Tron'}网络</p>
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
								切换 {net.chainName}
							</button>
						))}
					</div>
				</div>
			)}
			{[ChainType.SOL, ChainType.PUT].includes(currentChainType as any) && (
				<div>
					<p>
						切换
						{ChainType.SOL === currentChainType ? 'SOL' : 'PUT'}
						网络
					</p>
					<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
						{netWorks.map((net: string) => (
							<button key={net} onClick={() => handleSwitchNet(net)}>
								切换{net}
							</button>
						))}
					</div>
				</div>
			)}
			<div>
				{ChainType.EVM === currentChainType && (
					<div>
						<h2>EVM Proxy Function</h2>
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
					</div>
				)}
				{[ChainType.SOL, ChainType.PUT].includes(currentChainType) && (
					<div>
						<h2>{ChainType.SOL === currentChainType ? 'SOL' : 'PUT'} Proxy Function</h2>
						<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
							<button onClick={() => disconnect()}>disconnect</button>
							<button onClick={() => signMessage('123')}>signMessage</button>
							<button onClick={() => signTransaction(solTransaction)}>signTransaction</button>
							<button onClick={() => sendTransaction(solTransaction)}>sendTransaction</button>
						</div>
					</div>
				)}
				{ChainType.Tron === currentChainType && (
					<div>
						<h2>Tron Proxy Function</h2>
						<div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
							<button onClick={() => disconnect()}>disconnect</button>
							<button onClick={() => signMessage('123')}>signMessage</button>
							<button
								onClick={() =>
									signTransaction({
										to: 'TEQtdcENmGETfZ2pZKZdBZFxD18MXF2zSu', // WETH 合约地址
										value: 10
									})
								}
							>
								signTransaction
							</button>
							<button
								onClick={async () => {
									const res = await sendTransaction({
										to: 'TEQtdcENmGETfZ2pZKZdBZFxD18MXF2zSu', // WETH 合约地址
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
					</div>
				)}
			</div>
		</div>
	);
}

export default Demo;
