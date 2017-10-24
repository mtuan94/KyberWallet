import React from "react"
import { connect } from "react-redux"

import {calculateMinAmount, toT, toTWei, toEther} from "../../utils/converter"

import {TransferForm} from "../../components/Forms"
//import TokenDest from "./TokenDest"
//import {TokenDest, MinRate} from "../ExchangeForm"
import {Token, ExchangeRate} from "../Exchange"
import {PostTransfer} from  "../Transfer"
import {SelectTokenModal, ChangeGasModal, PassphraseTransferModal, TransactionLoading} from "../CommonElements"

//import {toT, toTWei} from "../../utils/converter"
import {openTokenModal, hideSelectToken} from "../../actions/utilActions"
// import { selectToken } from "../../actions/exchangeActions"

import {verifyAccount} from "../../utils/validators"
import { specifyAddressReceive, specifyAmountTransfer, selectToken, errorSelectToken, goToStep, showAdvance, openPassphrase ,throwErrorDestAddress, thowErrorAmount, makeNewTransfer} from '../../actions/transferActions';


@connect((store) => {
  if (store.account.isStoreReady){
    if (!!!store.account.account.address){
      window.location.href = "/"
    }
  }  
  return {...store.transfer}
})

export default class Transfer extends React.Component {
  
  openTokenChoose = (e) =>{
    this.props.dispatch(openTokenModal("transfer"))
  }
  onAddressReceiveChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAddressReceive(value));
  }
  onAmountChange = (event) => {
    var value = event.target.value
    this.props.dispatch(specifyAmountTransfer(value));
  }
  chooseToken = (symbol,address, type) => {
    
    // this.props.dispatch(selectToken(symbol, address, type))
    this.props.dispatch(selectToken(symbol, address))
    this.props.dispatch(hideSelectToken())
  }

  showAdvanceOption = () => {
    this.props.dispatch(showAdvance())
  }
  

  createRecap = () => {
    return `transfer ${this.props.amount.toString().slice(0,7)}${this.props.amount.toString().length > 7?'...':''} ${this.props.tokenSymbol} to ${this.props.destAddress.slice(0,7)}...${this.props.destAddress.slice(-5)}`
  }  

  makeNewTransfer = () => {
    this.props.dispatch(makeNewTransfer());
  }

  render() {
    var showAdvanceBtn = (
      <button onClick={this.showAdvanceOption}>Advance</button>
    )
    var destAddress = (
      <input value={this.props.destAddress} onChange={this.onAddressReceiveChange.bind(this)} />
    )
    var amount = (
      <input value={this.props.amount} onChange={this.onAmountChange.bind(this)} />
    )
    // var transferBtn = (
    //   <button onClick = {this.clickTransfer}>Transfer</button>
    // )
    var token = (
      <Token type="transfer"
      token={this.props.tokenSymbol} 
      onSelected={this.openTokenChoose}
      /> 
    )
    var tokenModal = (
      <SelectTokenModal chooseToken ={this.chooseToken} type="transfer"/>
    )
    var changeGasModal = (
      <ChangeGasModal type="transfer"
          gas={this.props.gas}
          gasPrice={this.props.gasPrice} 
          open = {this.props.advance}
          gasPriceError = {this.props.errors.gasPriceError}
          gasError = {this.props.errors.gasError}                        
          />
    )
    var transferButton = (
      <PostTransfer />      
    )
    var trasactionLoadingScreen = (
      <TransactionLoading tx={this.props.txHash} makeNewTransaction={this.makeNewTransfer}/>
    )
    var errorDestAddress = (
      <div>{this.props.errors.destAddress}</div>
    )
    var errorAmount = (
      <div>{this.props.errors.amountTransfer}</div>
    )
    return (
     <TransferForm step = {this.props.step}
                    showAdvanceBtn = {showAdvanceBtn}
                    destAddress = {destAddress}
                    amount = {amount}
                    token = {token}
                    tokenModal = {tokenModal}
                    changeGasModal = {changeGasModal}
                    transferButton = {transferButton}
                    errorDestAddress = {errorDestAddress}
                    errorAmount = {errorAmount}
                    trasactionLoadingScreen = {trasactionLoadingScreen}
                    recap = {this.createRecap()}
                    />
    ) 
  }
}
