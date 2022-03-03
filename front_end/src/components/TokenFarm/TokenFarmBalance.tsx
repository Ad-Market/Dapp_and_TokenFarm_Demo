import { useEthers, useTokenBalance, useContractCall } from "@usedapp/core"
import { formatUnits } from "ethers/lib/utils"
import { Token } from "../Main"
import { BalanceMsg } from "../BalanceMsg"
import networkMapping from "../../chain-info/deployments/map.json"
import { constants, Contract, utils } from "ethers"
import TokenFarm from "../../chain-info/contracts/TokenFarm.json"


export interface WalletBalanceProps {
    token: Token
}

export const TokenFarmBalance = ({ token }: WalletBalanceProps) => {
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const { account } = useEthers()
    const { image, address, name } = token

    const [tokensStakedBalance] =
        useContractCall({
            abi: tokenFarmInterface,
            address: tokenFarmAddress,
            method: "stakingBalance",
            args: [address, account],
        }) ?? []

    //const tokensStakedBalance = useTokenBalance(TokenFarmAddress, account)
    const formattedStakedTokenBalance: number = tokensStakedBalance ? parseFloat(formatUnits(tokensStakedBalance, 18)) : 0
    return (<BalanceMsg
        label={`Your staked ${name} balance`}
        tokenImgSrc={image}
        amount={formattedStakedTokenBalance} />
    )
}