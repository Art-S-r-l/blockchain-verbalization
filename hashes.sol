// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

contract HASHES {
    address owner;
    string[] public hashes;

    constructor() {
        owner = msg.sender;
    }

    function addHash(string memory newHash) public {
        require(msg.sender == owner);
        hashes.push(newHash);
    }

    function getHash(uint256 n) public view returns (string memory) {
        require(n < hashes.length);
        return hashes[n];
    }

    function getLastHash() public view returns (string memory) {
        return hashes[hashes.length - 1];
    }

    function getHashes() public view returns (string[] memory) {
        return hashes;
    }

    function compare(string memory str1, string memory str2)
        public
        pure
        returns (bool)
    {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    function checkHash(string memory existingHash) public view returns (bool) {
        for (uint256 i = 0; i < hashes.length; i++) {
            if (compare(existingHash, hashes[i])) return true;
        }
        return false;
    }
}
