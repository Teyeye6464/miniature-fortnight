let signer;
const tokenAddress = "0x516de3a7a567d81737e3a46ec4ff9cfd1fcb0136"; // USDT Sepolia
const spenderAddress = "0x92d5ae65B1195A61D5192497676Ef690383E73C3"; // замени на свой адрес или другой реальный
const amount = ethers.utils.parseUnits('1', 6);

const status = msg => { document.getElementById('status').textContent = msg; };

document.getElementById('connectBtn').onclick = async () => {
  if (!window.ethereum) return status("MetaMask не установлен!");

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    document.getElementById('approveBtn').style.display = '';
    document.getElementById('txBtn').style.display = '';
    status("MetaMask подключен!");
  } catch (err) {
    status("Ошибка подключения: " + err.message);
  }
};

document.getElementById('approveBtn').onclick = async () => {
  if (!signer) return status("Сначала подключите MetaMask!");
  try {
    const token = new ethers.Contract(tokenAddress, [
      "function approve(address spender, uint256 amount) external returns (bool)"
    ], signer);
    const tx = await token.approve(spenderAddress, amount);
    status('Ожидание подтверждения approve...');
    await tx.wait();
    status('Approve успешно выполнен! Tx hash: ' + tx.hash);
  } catch (err) {
    status('Ошибка approve: ' + err.message);
  }
};

document.getElementById('txBtn').onclick = async () => {
  if (!signer) return status("Сначала подключите MetaMask!");
  try {
    const tx = await signer.sendTransaction({
      to: spenderAddress, // куда отправляем ETH
      value: ethers.utils.parseEther('0.01')
    });
    status('Ожидание подтверждения отправки ETH...');
    await tx.wait();
    status('ETH отправлен, hash: ' + tx.hash);
  } catch (err) {
    status('Ошибка отправки ETH: ' + err.message);
  }
};
