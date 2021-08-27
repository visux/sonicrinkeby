import Web3 from "web3";
import Web3Modal from "web3modal";
import Authereum from "authereum";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {useState} from "react";

export default function wallet_model() {
    const [loading, setLoading] = useState(false);
        return {
           get web3Loading() {
              return loading
           },
           async getweb3() {
             setLoading(true);
             let web3Modal;
             let provider;
             let web3;
             let providerOptions;
             providerOptions = {
              /*  metamask: {
                  id: 'injected',
                  name: 'MetaMask',
                  type: 'injected',
                  check: 'isMetaMask'
                },*/
                walletconnect: {
                    package: WalletConnectProvider, // required
                    options: {
                       infuraId: 'e9de165b048446448a63b212962230d3', // Required
                       network: 'mainnet',
                qrcodeModalOptions: {
                    mobileLinks: [
                    'rainbow',
                    'metamask',
                    'argent',
                    'trust',
                    'imtoken',
                    'pillar'
                    ]
                 }
             }
        },
        authereum: {
              package: Authereum // required
                },
        };
        web3Modal = new Web3Modal({
           network: 'mainnet',
           cacheProvider: true,
         providerOptions
        });
        provider = await web3Modal.connect();
        provider.on('error', (e: any) => console.error('WS Error', e));
        provider.on('end', (e: any) => console.error('WS End', e));

        provider.on('disconnect', (error: { code: number; message: string }) => {
        console.log(error);
        });
        provider.on('connect', (info: { chainId: number }) => {
        console.log(info);
        });
        web3 = new Web3(provider);
        setLoading(false);
        return web3;
        },
        }
}