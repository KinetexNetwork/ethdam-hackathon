// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./libraries/Decoder.sol";
import "./interfaces/IResolver.sol";
import "@1inch/solidity-utils/contracts/libraries/SafeERC20.sol";
import { SismoConnect, ClaimRequest } from "@sismo-core/sismo-connect-solidity/contracts/libs/sismo-connect/SismoConnectLib.sol";

contract NFTResolver is SismoConnect, IResolver {
    error OnlySettlement();
    error InvalidResolver();

    using Decoder for bytes;
    using SafeERC20 for IERC20;
    using AddressLib for Address;

    address private immutable _settlement;
    address private immutable _owner;

    constructor(address settlement, bytes16 appId) SismoConnect(appId) {
        _settlement = settlement;
        _owner = msg.sender;
    }

    function resolveOrders(address resolver, bytes calldata tokensAndAmounts, bytes calldata data) external {
        if (msg.sender != _settlement) revert OnlySettlement();
        if (resolver != tx.origin) revert InvalidResolver();

        ClaimRequest memory claim = buildClaim({groupId: 0x37a0c6dca70ff60654675e604b258a48});

        verify({
            responseBytes: data,
            claim: claim
        });

        Decoder.TokensAndAmountsData[] calldata items = tokensAndAmounts.decodeTokensAndAmounts();
        for (uint256 i = 0; i < items.length; i++) {
            IERC20(items[i].token.get()).safeTransferFrom(resolver, msg.sender, items[i].amount);
        }
    }

    function rescueFunds(IERC20 token) external {
        require(msg.sender == _owner, "caller is not owner");
        token.safeTransfer(msg.sender, token.balanceOf(address(this)));
    }
}