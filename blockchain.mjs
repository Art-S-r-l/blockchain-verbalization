import Web3 from "web3";
import express from "express";
import cors from "cors";

//Web3 initialization
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/b8e057db24a54112ab06ce5ef022e721'));

const contractAddress = "0xd35d02cf903d351bdb54583578a80d42f60d6129"
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newEvent",
				"type": "string"
			}
		],
		"name": "addEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "events",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "n",
				"type": "uint256"
			}
		],
		"name": "getEvent",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getEvents",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLastEvent",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contract = new web3.eth.Contract(abi, contractAddress, {
					from: "0x7250BB2f0F698423C65cde4a02d144842A684120", // default from address
					gasPrice: 0 // default gas price in wei
				});

const privateKey = "0x7bc2085721e277ceddd8c314d281110d0a0340030ebabc6b735139fed3a4008d";

const account = web3.eth.accounts.privateKeyToAccount(privateKey);

//EXPRESS initialization
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/event', (req, res) => {
	const event = req.body.event;
	web3.eth.getGasPrice().then(gasPrice => {
		web3.eth.getTransactionCount(account.address).then(noncen => {
			const data = contract.methods.addEvent(event).encodeABI();
			const rawTransaction = {
				from: account.address,
				to: contractAddress,
				value: web3.utils.toHex(web3.utils.toWei("0", "ether")),
				nonce: noncen,
				"gasPrice": gasPrice,
				"gasLimit": web3.utils.toHex(300_000),
				data: data
			};
			web3.eth.accounts.signTransaction(rawTransaction, privateKey, function(signTransactionErr, signedTx) {
				web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
					if (err) {
						console.log(err);
						res.json({ err });
					} else {
						let str = `Transaction hash: ${hash}`;
						console.log(str);
						res.json({ str });
					}
				})
			})
		})
	})
});

app.get('/event', (req, res) => {
	const n = req.body.number;
	contract.methods.getEvent(n).call().then((event) => {
		res.json({ event });
	}).catch((error) => {
		res.json({ error });
	});
})

app.get('/lastevent', (req, res) => {
	contract.methods.getLastEvent().call().then((event) => {
		res.json({ event });
	}).catch((error) => {
		res.json({ error });
	});
})

app.get('/events', (req, res) => {
	contract.methods.getEvents().call().then((events) => {
		res.json({ events });
	}).catch((error) => {
		res.json({ error });
	});
})


const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});