import React, { Component } from "react";
import SupplyChainContract from "./contracts/SupplyChain.json";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { RoleDataContextProvider } from "./context/RoleDataContext";
import { createBrowserHistory } from 'history';
import getWeb3 from "./getWeb3";

// Manufacturer imports
import Manufacture from "./pages/Manufacturer/Manufacture";
import AllManufacture from "./pages/Manufacturer/AllManufacture";
import ShipManufacture from "./pages/Manufacturer/ShipManufacture";

// Third Party imports
import ReceiveThirdParty from "./pages/ThirdParty/ReceiveThirdParty";
import ShipThirdParty from "./pages/ThirdParty/ShipThirdParty";
import PurchaseThirdParty from "./pages/ThirdParty/PurshaseThirdParty";

// Customer imports
import PurchaseCustomer from "./pages/Customer/PurchaseCustomer";
import ReceiveCustomer from "./pages/Customer/ReceiveCustomer";
import ReceivedByCustomer from "./pages/Customer/ReceivedByCustomer";

// Delivery Hub imports
import ReceiveDeliveryHub from "./pages/DeliveryHub/ReceiveDeliveryHub";
import ShipDeliveryHub from "./pages/DeliveryHub/ShipDeliveryHub";

// Other imports
import RoleAdmin from "./pages/RoleAdmin";
import Explorer from './pages/Explorer';
import Home from "./pages/Home";
import "./App.css";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./components/Theme";

class App extends Component {
  state = { 
    web3: null, 
    accounts: null, 
    contract: null, 
    mRole: null, 
    tpRole: null, 
    dhRole: null, 
    cRole: null 
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SupplyChainContract.networks[networkId];
      
      if (!deployedNetwork) {
        throw new Error('Contract not deployed to detected network.');
      }

      const instance = new web3.eth.Contract(
        SupplyChainContract.abi,
        deployedNetwork.address
      );

      // Get roles from localStorage
      const mRole = localStorage.getItem("mRole") || "";
      const tpRole = localStorage.getItem("tpRole") || "";
      const dhRole = localStorage.getItem("dhRole") || "";
      const cRole = localStorage.getItem("cRole") || "";

      this.setState({ 
        web3, 
        accounts, 
        contract: instance, 
        mRole, 
        tpRole, 
        dhRole, 
        cRole 
      });
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { accounts, contract, mRole, tpRole, dhRole, cRole } = this.state;

    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <RoleDataContextProvider 
            mRole={mRole} 
            tpRole={tpRole} 
            dhRole={dhRole} 
            cRole={cRole}
          >
            <Router history={createBrowserHistory()}>
              <Switch>
                {/* Public Routes */}
                <Route exact path="/">
                  <Home accounts={accounts} supplyChainContract={contract} />
                </Route>
                <Route exact path="/roleAdmin">
                  <RoleAdmin accounts={accounts} supplyChainContract={contract} />
                </Route>
                <Route exact path="/explorer">
                  <Explorer accounts={accounts} supplyChainContract={contract} web3={this.state.web3} />
                </Route>

                {/* Manufacturer Routes */}
                <Route exact path="/manufacturer">
                  {mRole !== "" ? (
                    <Redirect to="/manufacturer/manufacture" />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/manufacturer/manufacture">
                  {mRole !== "" ? (
                    <Manufacture accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/manufacturer/allManufacture">
                  {mRole !== "" ? (
                    <AllManufacture accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/manufacturer/ship">
                  {mRole !== "" ? (
                    <ShipManufacture accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>

                {/* Third Party Routes */}
                <Route exact path="/thirdparty">
                  {tpRole !== "" ? (
                    <Redirect to="/thirdparty/allProducts" />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/thirdparty/allProducts">
                  {tpRole !== "" ? (
                    <PurchaseThirdParty accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/thirdparty/receive">
                  {tpRole !== "" ? (
                    <ReceiveThirdParty accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/thirdparty/ship">
                  {tpRole !== "" ? (
                    <ShipThirdParty accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>

                {/* Delivery Hub Routes */}
                <Route exact path="/deliveryhub">
                  {dhRole !== "" ? (
                    <Redirect to="/deliveryhub/receive" />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/deliveryhub/receive">
                  {dhRole !== "" ? (
                    <ReceiveDeliveryHub accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/deliveryhub/ship">
                  {dhRole !== "" ? (
                    <ShipDeliveryHub accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>

                {/* Customer Routes */}
                <Route exact path="/customer">
                  {cRole !== "" ? (
                    <Redirect to="/customer/buy" />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/customer/buy">
                  {cRole !== "" ? (
                    <PurchaseCustomer accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/customer/receive">
                  {cRole !== "" ? (
                    <ReceiveCustomer accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>
                <Route exact path="/customer/allReceived">
                  {cRole !== "" ? (
                    <ReceivedByCustomer accounts={accounts} supplyChainContract={contract} />
                  ) : (
                    <Redirect to="/roleAdmin" />
                  )}
                </Route>

                {/* Fallback Route */}
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
            </Router>
          </RoleDataContextProvider>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
