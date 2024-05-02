// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract ArtNFTV1 is Initializable, ERC721HolderUpgradeable, ERC721Upgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 private _nextTokenId;
    mapping(uint256 => uint256) public tokenPrice;
    mapping(uint256 => bool) public isForSale;

    IERC20 public USDC;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, address USDCAddress) initializer public {
        __ERC721_init("Art NFT", "ART");
        __ERC721URIStorage_init();
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        USDC = IERC20(USDCAddress);
    }

    function setUSDCAddress(address USDCAddress) public onlyOwner {
        USDC = IERC20(USDCAddress);
    }

    function safeMint(string memory uri, uint256 copies, uint256 initialPrice) public onlyOwner {
        for (uint256 i = 0; i < copies; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(address(this), tokenId);
            _setTokenURI(tokenId, uri);
            tokenPrice[tokenId] = initialPrice;
            isForSale[tokenId] = true;
        }
    }

    function setTokenPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "You must own the token to set its price.");
        tokenPrice[tokenId] = price;
    }

    function toggleForSale(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You must own the token to toggle if it is for sale or not.");
        isForSale[tokenId] = !isForSale[tokenId];
    }

    function purchaseToken(uint256 tokenId, uint256 payAmount) public {
        require(isForSale[tokenId], "This piece is not for sale.");
        require(tokenPrice[tokenId] <= payAmount, "This is not enough USDC to purchase the piece.");
        USDC.transferFrom(msg.sender, ownerOf(tokenId), payAmount);
        this.safeTransferFrom(ownerOf(tokenId), msg.sender, tokenId);
        approve(address(this), tokenId);
    }

    function claimContractUSDC() public onlyOwner {
        USDC.transfer(owner(), USDC.balanceOf(address(this)));
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
