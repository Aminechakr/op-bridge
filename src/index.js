import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./assets/style/main.scss"
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from './store'
import { Provider } from 'react-redux'
import { WagmiConfig, createConfig, createStorage } from 'wagmi'
import { configureChains } from '@wagmi/core'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { GetL1Chain, GetL2Chain } from './config/chain';
export const RACE = {
    id: Number(process.env.REACT_APP_L2_CHAIN_ID),
    name: "RACE Testnet",
    network: "RACE",
    iconUrl: "https://i.imgur.com/Q3oIdip.png",
    iconBackground: "#000000",
    nativeCurrency: {
        decimals: 18,
        name: 'ETHEREUM',
        symbol: 'ETH'
    },
    rpcUrls: {
        default: {
            http: [String(process.env.REACT_APP_L2_RPC_URL)]
        },
    },
    blockExplorers: {
        default: { name: "RACE Testnet Explorer", url: process.env.REACT_APP_L2_EXPLORER_URL }
    },
    testnet: true

}

const { chains, publicClient } = configureChains(
    [GetL1Chain(), GetL2Chain()],
    [
        jsonRpcProvider({
            rpc: chain => ({ http: chain.rpcUrls.default.http[0] })

        })
    ])

export const connectors = [
    new MetaMaskConnector({
        chains,
        options : {
            shimDisconnect: false,
        }
    }),
];

const config = createConfig({
    autoConnect: true,
    connectors,
    storage: createStorage({ storage: window.localStorage }),
    publicClient,
})
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <WagmiConfig config={config}>
        <Provider store={store}>
            <App />
        </Provider>,
    </WagmiConfig>
);
reportWebVitals();
