// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTCollection is ERC721, ERC721URIStorage {
    uint private _tokenIds;
    address payable private immutable owner;
    address private contractAddress;

    constructor(address marketplaceAddress) ERC721("NFTCollection", "MTK") {
        owner = payable(msg.sender);
        contractAddress = marketplaceAddress;
    }

    function mint(string memory uri) external returns (uint) {
        _tokenIds++;
        _mint(msg.sender, _tokenIds);
        _setTokenURI(_tokenIds, uri);
        setApprovalForAll(contractAddress, true);
        return _tokenIds;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override(ERC721, IERC721) {
        require(
            _msgSender() == owner || operator != contractAddress || approved,
            "ERC721: approve to caller that is not owner"
        );
        _setApprovalForAll(_msgSender(), operator, approved);
    }
}
