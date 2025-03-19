document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    const walletConnectedBtn = document.getElementById('wallet-connected-btn');
    const walletSelectorModal = document.getElementById('wallet-selector-modal');
    const closeWalletSelector = document.getElementById('close-wallet-selector');
    const walletInfoModal = document.getElementById('wallet-info-modal');
    const closeWalletInfo = document.getElementById('close-wallet-info');
    const userInfoModal = document.getElementById('user-info-modal');
    const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');
    const copyAddressBtn = document.getElementById('copy-address-btn');
    const changeNetworkBtn = document.getElementById('change-network-btn');
    const walletSelectorPreview = document.getElementById('wallet-selector-preview');
    const userInfoPreview = document.getElementById('user-info-preview');
    
    // PC端钱包选择弹窗元素
    const getWalletBtn = document.getElementById('get-wallet-btn');
    const walletPromo = document.getElementById('wallet-promo');
    const recommendedWallets = document.getElementById('recommended-wallets');
    const walletDetail = document.getElementById('wallet-detail');
    const backToRecommended = document.getElementById('back-to-recommended');
    const detailWalletName = document.getElementById('detail-wallet-name');
    const detailChromeLink = document.getElementById('detail-chrome-link');
    const showQrcodeBtn = document.getElementById('show-qrcode-btn');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const closeQrcode = document.getElementById('close-qrcode');
    
    // 移动端钱包选择弹窗元素
    const mobileGetWalletBtn = document.getElementById('mobile-get-wallet-btn');
    const mobileWalletList = document.getElementById('mobile-wallet-list');
    const mobileRecommendedWallets = document.getElementById('mobile-recommended-wallets');
    const mobileWalletDetail = document.getElementById('mobile-wallet-detail');
    const mobileBackToWallets = document.getElementById('mobile-back-to-wallets');
    const mobileBackToRecommended = document.getElementById('mobile-back-to-recommended');
    const mobileDetailWalletName = document.getElementById('mobile-detail-wallet-name');
    const mobileDetailChromeLink = document.getElementById('mobile-detail-chrome-link');
    const mobileShowQrcodeBtn = document.getElementById('mobile-show-qrcode-btn');
    const mobileQrcodeContainer = document.getElementById('mobile-qrcode-container');
    const mobileCloseQrcode = document.getElementById('mobile-close-qrcode');
    const mobileSelectedChain = document.getElementById('mobile-selected-chain');
    
    // 克隆组件到预览区域
    walletSelectorPreview.appendChild(walletSelectorModal.cloneNode(true));
    walletSelectorPreview.querySelector('#wallet-selector-modal').classList.remove('hidden', 'fixed', 'inset-0');
    walletSelectorPreview.querySelector('#wallet-selector-modal').classList.add('block');
    
    userInfoPreview.appendChild(userInfoModal.cloneNode(true));
    userInfoPreview.querySelector('#user-info-modal').classList.remove('hidden', 'fixed', 'inset-0');
    userInfoPreview.querySelector('#user-info-modal').classList.add('block');
    
    // 连接钱包按钮点击事件
    connectWalletBtn.addEventListener('click', function() {
        walletSelectorModal.classList.remove('hidden');
    });
    
    // 关闭钱包选择弹窗
    closeWalletSelector.addEventListener('click', function() {
        walletSelectorModal.classList.add('hidden');
        
        // 重置弹窗状态
        resetWalletSelectorState();
    });
    
    // 重置钱包选择弹窗状态
    function resetWalletSelectorState() {
        // PC端
        walletPromo.classList.remove('hidden');
        recommendedWallets.classList.add('hidden');
        walletDetail.classList.add('hidden');
        qrcodeContainer.classList.add('hidden');
        
        // 移动端
        mobileWalletList.classList.remove('hidden');
        mobileRecommendedWallets.classList.add('hidden');
        mobileWalletDetail.classList.add('hidden');
        mobileQrcodeContainer.classList.add('hidden');
    }
    
    // 关闭钱包信息弹窗
    closeWalletInfo.addEventListener('click', function() {
        walletInfoModal.classList.add('hidden');
    });
    
    // 切换链
    const chainBtns = document.querySelectorAll('.chain-btn');
    const walletLists = document.querySelectorAll('.wallet-list');
    
    chainBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active类
            chainBtns.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');
            
            // 隐藏所有钱包列表
            walletLists.forEach(list => list.classList.add('hidden'));
            
            // 显示对应链的钱包列表
            const chain = this.getAttribute('data-chain');
            document.getElementById(`${chain}-wallets`).classList.remove('hidden');
            
            // 更新移动端选中的链
            mobileSelectedChain.textContent = this.querySelector('span').textContent;
        });
    });
    
    // PC端获取钱包按钮点击事件
    getWalletBtn.addEventListener('click', function() {
        walletPromo.classList.add('hidden');
        recommendedWallets.classList.remove('hidden');
        walletDetail.classList.add('hidden');
    });
    
    // PC端推荐钱包点击事件
    const recommendedWalletBtns = document.querySelectorAll('.recommended-wallet-btn');
    
    recommendedWalletBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const wallet = this.getAttribute('data-wallet');
            
            // 设置钱包详情
            setWalletDetail(wallet, detailWalletName, detailChromeLink);
            
            // 显示钱包详情
            recommendedWallets.classList.add('hidden');
            walletDetail.classList.remove('hidden');
        });
    });
    
    // PC端返回推荐钱包列表
    backToRecommended.addEventListener('click', function() {
        walletDetail.classList.add('hidden');
        recommendedWallets.classList.remove('hidden');
        qrcodeContainer.classList.add('hidden');
    });
    
    // PC端显示二维码
    showQrcodeBtn.addEventListener('click', function() {
        qrcodeContainer.classList.remove('hidden');
    });
    
    // PC端关闭二维码
    closeQrcode.addEventListener('click', function() {
        qrcodeContainer.classList.add('hidden');
    });
    
    // 移动端获取钱包按钮点击事件
    mobileGetWalletBtn.addEventListener('click', function() {
        mobileWalletList.classList.add('hidden');
        mobileRecommendedWallets.classList.remove('hidden');
    });
    
    // 移动端返回钱包列表
    mobileBackToWallets.addEventListener('click', function() {
        mobileRecommendedWallets.classList.add('hidden');
        mobileWalletList.classList.remove('hidden');
    });
    
    // 移动端推荐钱包点击事件
    const mobileRecommendedWalletBtns = document.querySelectorAll('.mobile-recommended-wallet-btn');
    
    mobileRecommendedWalletBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const wallet = this.getAttribute('data-wallet');
            
            // 设置钱包详情
            setWalletDetail(wallet, mobileDetailWalletName, mobileDetailChromeLink);
            
            // 显示钱包详情
            mobileRecommendedWallets.classList.add('hidden');
            mobileWalletDetail.classList.remove('hidden');
        });
    });
    
    // 移动端返回推荐钱包列表
    mobileBackToRecommended.addEventListener('click', function() {
        mobileWalletDetail.classList.add('hidden');
        mobileRecommendedWallets.classList.remove('hidden');
        mobileQrcodeContainer.classList.add('hidden');
    });
    
    // 移动端显示二维码
    mobileShowQrcodeBtn.addEventListener('click', function() {
        mobileQrcodeContainer.classList.remove('hidden');
    });
    
    // 移动端关闭二维码
    mobileCloseQrcode.addEventListener('click', function() {
        mobileQrcodeContainer.classList.add('hidden');
    });
    
    // 设置钱包详情
    function setWalletDetail(wallet, nameElement, linkElement) {
        switch(wallet) {
            case 'metamask':
                nameElement.textContent = 'MetaMask';
                linkElement.href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
                break;
            case 'walletconnect':
                nameElement.textContent = 'WalletConnect';
                linkElement.href = 'https://walletconnect.com/';
                break;
            case 'coinbase':
                nameElement.textContent = 'Coinbase Wallet';
                linkElement.href = 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad';
                break;
            case 'phantom':
                nameElement.textContent = 'Phantom';
                linkElement.href = 'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa';
                break;
            case 'solflare':
                nameElement.textContent = 'Solflare';
                linkElement.href = 'https://chrome.google.com/webstore/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic';
                break;
            case 'bitcoincore':
                nameElement.textContent = 'Bitcoin Core';
                linkElement.href = 'https://bitcoin.org/en/download';
                break;
            case 'trezor':
                nameElement.textContent = 'Trezor';
                linkElement.href = 'https://chrome.google.com/webstore/detail/trezor-suite/oopiodbbpnmcaokjoakbehhnmldofgpn';
                break;
            default:
                nameElement.textContent = '未知钱包';
                linkElement.href = '#';
        }
    }
    
    // 钱包信息按钮点击事件
    const walletInfoBtns = document.querySelectorAll('.wallet-info-btn');
    
    walletInfoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            
            const wallet = this.getAttribute('data-wallet');
            const walletInfoLogo = document.getElementById('wallet-info-logo');
            const walletInfoName = document.getElementById('wallet-info-name');
            const walletChromeLink = document.getElementById('wallet-chrome-link');
            
            // 设置钱包信息
            switch(wallet) {
                case 'metamask':
                    walletInfoLogo.src = 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg';
                    walletInfoName.textContent = 'MetaMask';
                    walletChromeLink.href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
                    break;
                case 'walletconnect':
                    walletInfoLogo.src = 'https://altcoinsbox.com/wp-content/uploads/2023/01/wallet-connect-logo.png';
                    walletInfoName.textContent = 'WalletConnect';
                    walletChromeLink.href = 'https://walletconnect.com/';
                    break;
                case 'coinbase':
                    walletInfoLogo.src = 'https://altcoinsbox.com/wp-content/uploads/2023/03/coinbase-wallet-logo.webp';
                    walletInfoName.textContent = 'Coinbase Wallet';
                    walletChromeLink.href = 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad';
                    break;
                case 'phantom':
                    walletInfoLogo.src = 'https://cryptologos.cc/logos/phantom-logo.png';
                    walletInfoName.textContent = 'Phantom';
                    walletChromeLink.href = 'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa';
                    break;
                case 'solflare':
                    walletInfoLogo.src = 'https://cryptologos.cc/logos/solflare-logo.png';
                    walletInfoName.textContent = 'Solflare';
                    walletChromeLink.href = 'https://chrome.google.com/webstore/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic';
                    break;
                case 'bitcoincore':
                    walletInfoLogo.src = 'https://cryptologos.cc/logos/bitcoin-btc-logo.png';
                    walletInfoName.textContent = 'Bitcoin Core';
                    walletChromeLink.href = 'https://bitcoin.org/en/download';
                    break;
                case 'trezor':
                    walletInfoLogo.src = 'https://cryptologos.cc/logos/trezor-logo.png';
                    walletInfoName.textContent = 'Trezor';
                    walletChromeLink.href = 'https://chrome.google.com/webstore/detail/trezor-suite/oopiodbbpnmcaokjoakbehhnmldofgpn';
                    break;
                default:
                    walletInfoLogo.src = 'https://cryptologos.cc/logos/ethereum-eth-logo.png';
                    walletInfoName.textContent = '未知钱包';
                    walletChromeLink.href = '#';
            }
            
            walletInfoModal.classList.remove('hidden');
        });
    });
    
    // 钱包按钮点击事件（模拟连接钱包）
    const walletBtns = document.querySelectorAll('.wallet-btn');
    
    walletBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 隐藏钱包选择弹窗
            walletSelectorModal.classList.add('hidden');
            
            // 获取当前选中的链和钱包
            const activeChain = document.querySelector('.chain-btn.active');
            const chainName = activeChain.querySelector('span').textContent;
            const chainIcon = activeChain.querySelector('img').src;
            const walletName = this.querySelector('span').textContent;
            const walletIcon = this.querySelector('img').src;
            
            // 生成随机钱包地址
            const randomAddress = '0x' + Array.from({length: 40}, () => 
                Math.floor(Math.random() * 16).toString(16)).join('');
            
            // 更新已连接按钮
            document.getElementById('wallet-avatar').src = walletIcon;
            document.getElementById('wallet-address').textContent = 
                randomAddress.substring(0, 6) + '...' + randomAddress.substring(randomAddress.length - 4);
            
            // 更新用户信息弹窗
            document.getElementById('user-avatar').src = walletIcon;
            document.getElementById('current-chain-icon').src = chainIcon;
            document.getElementById('current-chain-name').textContent = chainName;
            document.getElementById('full-wallet-address').textContent = randomAddress;
            
            // 显示已连接按钮，隐藏连接按钮
            connectWalletBtn.classList.add('hidden');
            walletConnectedBtn.classList.remove('hidden');
            
            // 显示用户信息弹窗
            userInfoModal.classList.remove('hidden');
            
            // 重置钱包选择弹窗状态
            resetWalletSelectorState();
        });
    });
    
    // 已连接按钮点击事件
    walletConnectedBtn.addEventListener('click', function() {
        userInfoModal.classList.remove('hidden');
    });
    
    // 断开连接按钮点击事件
    disconnectWalletBtn.addEventListener('click', function() {
        // 隐藏用户信息弹窗
        userInfoModal.classList.add('hidden');
        
        // 显示连接按钮，隐藏已连接按钮
        connectWalletBtn.classList.remove('hidden');
        walletConnectedBtn.classList.add('hidden');
    });
    
    // 复制地址按钮点击事件
    copyAddressBtn.addEventListener('click', function() {
        const address = document.getElementById('full-wallet-address').textContent;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(address).then(function() {
            // 创建复制成功提示
            const message = document.createElement('div');
            message.className = 'copied-message fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm';
            message.textContent = '地址已复制到剪贴板';
            document.body.appendChild(message);
            
            // 1.5秒后移除提示
            setTimeout(() => {
                document.body.removeChild(message);
            }, 1500);
        });
    });
    
    // 切换网络按钮点击事件
    changeNetworkBtn.addEventListener('click', function() {
        // 隐藏用户信息弹窗
        userInfoModal.classList.add('hidden');
        
        // 显示钱包选择弹窗
        walletSelectorModal.classList.remove('hidden');
    });
    
    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', function(e) {
        if (e.target === walletSelectorModal) {
            walletSelectorModal.classList.add('hidden');
            resetWalletSelectorState();
        }
        if (e.target === walletInfoModal) {
            walletInfoModal.classList.add('hidden');
        }
        if (e.target === userInfoModal) {
            userInfoModal.classList.add('hidden');
        }
    });
}); 