import { Button, CircularProgress, Input, Snackbar } from "@material-ui/core"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { utils } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import React, { useEffect, useState } from "react"
import { useUnstakeTokens } from "../../hooks/useUnstakeTokens"
import { Token } from "../Main"
import { Alert } from "@material-ui/lab"

export interface StakeFormProps {
    token: Token
}

export const UnstakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const { notifications } = useNotifications()

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
    }

    const { UnstakeAll, state: UnstakeAllState } = useUnstakeTokens(tokenAddress)

    const handleStakeSubmit = () => {
        //const amountAsWei = utils.parseEther(amount.toString())
        return UnstakeAll()
    }

    const isMining = UnstakeAllState.status === "Mining"
    //const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showUnstakeTokenSuccess, setShowUnstakeTokenSuccess] = useState(false)

    const handleCloseSnack = () => {
        //setShowErc20ApprovalSuccess(false)
        setShowUnstakeTokenSuccess(false)
    }

    useEffect(() => {
        //if (notifications.filter((notification) =>
        //    notification.type === "transactionSucceed" &&
        //    notification.transactionName === "Approve ERC20 Transfer").length > 0) {
        //    //setShowErc20ApprovalSuccess(true)
        //    setShowStakeTokenSuccess(false)
        //}
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Unstake Tokens").length > 0) {
            //setShowErc20ApprovalSuccess(false)
            setShowUnstakeTokenSuccess(true)
        }
    }, [notifications, showUnstakeTokenSuccess])

    return (
        <>
            <Button
                onClick={handleStakeSubmit}
                color="secondary"
                size="large"
                disabled={isMining}
                variant="contained">
                {isMining ? <CircularProgress size={26} /> : "Unstake all"}
            </Button>
            <Snackbar
                open={showUnstakeTokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Token(s) unstaked!
                </Alert>
            </Snackbar>
        </>
    )

}