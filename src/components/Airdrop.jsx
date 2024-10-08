import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useEffect, useState, useTransition } from "react";


export default function Airdrop() {
    const wallet = useWallet();
    const {connection} = useConnection();
    console.log(wallet)
    const [amount,setAmount] = useState(0);
    const [amountto,setAmountto] = useState(0);
    const [balance,setBalance] = useState(0);
    async function requestAirDrop() {
        await connection.requestAirdrop(wallet.publicKey, amount*LAMPORTS_PER_SOL);
        getBalance();
    }
    const [recipient,setRecipient] = useState("");
    useEffect(() => {
        getBalance();
    }, [wallet,wallet.publicKey]);

    async function getBalance() {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance/LAMPORTS_PER_SOL);
    }

    async function sendSol(){
        const transaction = new Transaction();
        console.log(wallet.publicKey);
        console.log(recipient);
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(recipient),
                lamports: amountto*LAMPORTS_PER_SOL
            })
        )

        await wallet.sendTransaction(transaction,connection);
        alert("Sent "+ amountto +" Sol to "+recipient);
    }
    return (
        <div>
            your current balance is {balance}
            <br></br>
             <input type="text" placeholder="no of sol" onChange={e=>{setAmount(e.target.value)}} />
             <br></br>
            <button onClick={requestAirDrop}>  Request air-drop </button>
            <br></br>
            <br></br>

            <input type="text" placeholder="Enter public key of recipient" onChange={e=>{setRecipient(e.target.value)}} />
            <input type="text" placeholder="no of sol" onChange={e=>{setAmountto(e.target.value)}} />
            <button onClick={sendSol}> Send Sol</button>
        </div>
    )
}