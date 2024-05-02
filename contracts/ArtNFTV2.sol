// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ArtNFTV1.sol";

contract ArtNFTV2 is ArtNFTV1 {
    mapping(uint256 => bool) public has50PercentDiscount;

    function apply50PercentDiscount(uint256 tokenId) public onlyOwner {
        require(ownerOf(tokenId) == address(this), "This piece has been bought by a different owner.");
        if (!has50PercentDiscount[tokenId]) {
            has50PercentDiscount[tokenId] = true;
            tokenPrice[tokenId] = tokenPrice[tokenId] / 2;
        }
    }
}
