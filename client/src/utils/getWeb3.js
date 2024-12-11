import Web3 from 'web3';

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    try {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          resolve(web3);
        } catch (error) {
          reject(new Error("User denied account access"));
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        resolve(web3);
      }
      // Fallback to localhost
      else {
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:7545'
        );
        const web3 = new Web3(provider);
        resolve(web3);
      }
    } catch (error) {
      reject(error);
    }
  });

export default getWeb3; 