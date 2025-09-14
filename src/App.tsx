import { useState, useMemo } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "SOLIDITY CONTRACT";

const CONTRACT_ABI = [
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "Deposit",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "user",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "Withdraw",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "balances",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "deposit",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "withdraw",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	];

export default function App() {
  const [isDepositMenuOpen, setIsDepositMenuOpen] = useState(false);
  const [isWithdrawMenuOpen, setIsWithdrawMenuOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balanceEth, setBalanceEth] = useState<string>("0");
  const [depositAmount, setDepositAmount] = useState<string>(""); 
  const [withdrawAmount, setWithdrawAmount] = useState<string>(""); 


  const provider = useMemo(() => {
    if (!(window as any).ethereum) return null;
    return new ethers.BrowserProvider((window as any).ethereum);
  }, []);

  const contract = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }, [provider]);

  const connectWallet = async () => {
    try {
      if (!provider) { 
        alert ("Metamask not found");
        return;
      }
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
      alert("Error connecting wallet")
    }
  };

  const getBalance = async () => {
  try {
    if (!provider) {
      alert("MetaMask not found");
      return;
    }
    if (!account) {
      alert("Connect wallet");
      return;
    }
    if (!contract) {
      alert("Contract not found");
      return;
    }

    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const balanceWei = await contractWithSigner.getBalance();
    const balanceEthFormatted = ethers.formatEther(balanceWei);

    setBalanceEth(balanceEthFormatted); 
  } catch (err) {
    console.error(err);
    alert("Error getting balance");
  }
  };

  const depositBalance = async () => {
    try {
      if (!provider){
        alert("MetaMask not found")
      }
      if (!contract){
        alert("Contract not found")
      }
      if (!account){
        alert("Connect wallet")
      }
      if (!depositAmount || isNaN(Number(depositAmount))) {
      alert("Input valid amount");
      return;
    }

      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.deposit({
        value: ethers.parseEther(depositAmount)
      });

      await tx.wait();
      await getBalance();

      setDepositAmount(""); 
      setIsDepositMenuOpen(false); 

    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  const withdrawBalance = async () => {
    try {
      if (!provider){
        alert("MetaMask not found")
      }
      if (!contract){
        alert("Contract not found")
      }
      if (!account){
        alert("Connect wallet")
      }

      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.withdraw(
        ethers.parseEther(withdrawAmount)
      );

      await tx.wait();
      await getBalance();

      setWithdrawAmount(""); 
      setIsWithdrawMenuOpen(false); 

    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      
      {!account ? (
        <button 
        onClick={() => connectWallet()}
        className="bg-blue-600 text-white py-3 px-6 rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50 w-full max-w-xs"
        >
        ConnectWallet
        </button>
        ) : (
      <>
      <div className="text-white text-center text-[50px] select-none">{balanceEth}</div>
      <button onClick={getBalance} className="text-white text-center text-[50px] select-none">update</button>

      <div className="gap-10 center text-white justify-items-center">
        <button onClick={() => setIsDepositMenuOpen(!isDepositMenuOpen)} className="rounded-md hidden lg:w-[500px] lg:h-[100px] bg-[#1D1B6D] flex items-center justify-center text-center m-2">Deposit</button>
        <button onClick={() => setIsWithdrawMenuOpen(!isWithdrawMenuOpen)} className="rounded-md hidden lg:w-[500px] lg:h-[100px] bg-[#6D1B1B] flex items-center justify-center text-center m-2">Withdraw</button>
      </div>

      <div className="gap-10 center text-white justify-items-center">
        <button onClick={() => setIsDepositMenuOpen(!isDepositMenuOpen)} className="rounded-md w-[350px] h-[100px] bg-[#1D1B6D] flex items-center justify-center text-center m-2">Deposit</button>
        <button onClick={() => setIsWithdrawMenuOpen(!isWithdrawMenuOpen)} className="rounded-md w-[350px] h-[100px] bg-[#6D1B1B] flex items-center justify-center text-center m-2">Withdraw</button>
      </div>

       <div className="gap-10 center text-white justify-items-center">
        <button onClick={() => setIsDepositMenuOpen(!isDepositMenuOpen)} className="rounded-md hidden md:w-[400px] h-[100px] bg-[#1D1B6D] flex items-center justify-center text-center m-2">Deposit</button>
        <button onClick={() => setIsWithdrawMenuOpen(!isWithdrawMenuOpen)} className="rounded-md hidden md:w-[400px] h-[100px] bg-[#6D1B1B] flex items-center justify-center text-center m-2">Withdraw</button>
      </div>

      {isDepositMenuOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
         <div className="relative space-y-4 rounded-md w-[350px] h-[150px] bg-[#1D1B6D] flex flex-col items-center justify-center">
          <button onClick={() => setIsDepositMenuOpen(false)} className="absolute top-1 right-4 text-white text-xl font-bold">x</button>
          <div className="text-white">Deposit Menu</div>
          <input onChange={(e) => setDepositAmount(e.target.value)} className="bg-black rounded text-white focus:outline-none focus:border-blue-500 "></input>
          <button onClick={depositBalance} className="rounded-md w-[150px] h-[50px] bg-[#104110] text-white font-semibold">Deposit</button>
         </div>
        </div>
        )}

        {isWithdrawMenuOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
         <div className="relative space-y-4 rounded-md w-[350px] h-[150px] bg-[#1D1B6D] flex flex-col items-center justify-center">
          <button onClick={() => setIsWithdrawMenuOpen(false)} className="absolute top-1 right-4 text-white text-xl font-bold">x</button>
          <div className="text-white">Withdraw Menu</div>
          <input onChange={(e) => setWithdrawAmount(e.target.value)} className="bg-black rounded text-white focus:outline-none focus:border-blue-500 "></input>
          <button onClick={withdrawBalance} className="rounded-md w-[150px] h-[50px] bg-[#6D1B1B] text-white font-semibold">Withdraw</button>
         </div>
        </div>
        )}
      </>
    )}
    </div>
  );
};

