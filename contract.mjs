import Web3 from "web3";

export default class Contract {
	
	#web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78')); //https://rinkeby.infura.io/v3/b8e057db24a54112ab06ce5ef022e721

	#contractAddress = "0x6ACE2D0099516986241a10dd4BaDE23363AED462"
	#abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"newHash","type":"string"}],"name":"addHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"existingHash","type":"string"}],"name":"checkHash","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"str1","type":"string"},{"internalType":"string","name":"str2","type":"string"}],"name":"compare","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"n","type":"uint256"}],"name":"getHash","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHashes","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLastHash","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"hashes","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]

	#contract = new this.#web3.eth.Contract(this.#abi, this.#contractAddress, {
					from: "0x7250BB2f0F698423C65cde4a02d144842A684120", // default from address
					gasPrice: 0 // default gas price in wei
				});

	#privateKey = "";

	#account = null;

	constructor(privateKey) {
		this.#privateKey = privateKey;
		this.#account = this.#web3.eth.accounts.privateKeyToAccount(privateKey);
  	}

	addHash(hash){
		this.#web3.eth.getGasPrice().then(gasPrice => {
			this.#web3.eth.getTransactionCount(this.#account.address).then(noncen => {
				const data = this.#contract.methods.addHash(hash).encodeABI();
				const rawTransaction = {
					from: this.#account.address,
					to: this.#contractAddress,
					value: this.#web3.utils.toHex(this.#web3.utils.toWei("0", "ether")),
					nonce: noncen,
					"gasPrice": gasPrice,
					"gasLimit": this.#web3.utils.toHex(300_000),
					data: data
				};
				this.#web3.eth.accounts.signTransaction(rawTransaction, this.#privateKey, (signTransactionErr, signedTx) => {
					this.#web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
						if (err) {
							console.log(err);
						} else {
							console.log(`Hash della transazione di verbalizzazione in blockchain: ${hash}`);
						}
					})
				})
			})
		})
	}

	getHash(n){
		this.#contract.methods.getHash(n).call().then((hash) => {
			return hash;
		}).catch((error) => {
			return error;
		});
	}

	getLastHash() {
		this.#contract.methods.getLastHash().call().then((hash) => {
			return hash;
		}).catch((error) => {
			return error;
		});
	}

	getHashes() {
		this.#contract.methods.getHashes().call().then((hashes) => {
			return hashes;
		}).catch((error) => {
			return error;
		});
	}

	checkHash(hash) {
		this.#contract.methods.checkHash(hash).call().then((bool) => {
			return bool;
		}).catch((error) => {
			return error;
		});
	}
}