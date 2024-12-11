import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Button from "@material-ui/core/Button";
import ProductModal from "../../components/Modal";
import { useRole } from "../../context/RoleDataContext";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import { useStyles } from "../../components/Styles";
import clsx from "clsx";
import Loader from "../../components/Loader";

export default function ReceiveThirdParty(props) {
  const { supplyChainContract } = props;
  const { roles } = useRole();
  const [allReceiveProducts, setAllReceiveProducts] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const classes = useStyles();

  const navItem = [
    ["Buy Product", "/ThirdParty/allProducts"],
    ["Receive Product", "/ThirdParty/receive"],
    ["Ship Products", "/ThirdParty/ship"],
  ];

  useEffect(() => {
    fetchData();
  }, [supplyChainContract]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cnt = await supplyChainContract.methods.fetchProductCount().call();
      const arr = [];
      for (let i = 1; i < cnt; i++) {
        const prodState = await supplyChainContract.methods.fetchProductState(i).call();
        if (prodState === "2") {
          const [a, b, c] = await Promise.all([
            supplyChainContract.methods.fetchProductPart1(i, "product", 0).call(),
            supplyChainContract.methods.fetchProductPart2(i, "product", 0).call(),
            supplyChainContract.methods.fetchProductPart3(i, "product", 0).call()
          ]);
          arr.push([a, b, c]);
        }
      }
      setAllReceiveProducts(arr);
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlertText("Error fetching products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveButton = async (id, long, lat) => {
    try {
      await supplyChainContract.methods
        .receiveByThirdParty(parseInt(id), long, lat)
        .send({ from: roles.thirdparty, gas: 1000000 })
        .on("transactionHash", function (hash) {
          handleSetTxhash(id, hash);
        });
      setOpen(false);
      setAlertText(""); // Clear alert text on success
      // Re-fetch the products after receiving
      fetchData();
    } catch (error) {
      console.error(error);
      setAlertText("You are not the owner of the product");
    }
  };

  const handleSetTxhash = async (id, hash) => {
    await supplyChainContract.methods
      .setTransactionHash(id, hash)
      .send({ from: roles.manufacturer, gas: 900000 });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => setOpen(false);

  const handleClick = (prod) => {
    setModalData(prod);
    setOpen(true);
  };

  const renderTableBody = () => {
    if (allReceiveProducts.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center">
            No products to receive
          </TableCell>
        </TableRow>
      );
    }

    return allReceiveProducts
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((prod) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={prod[0][0]}>
          <TableCell className={classes.TableCell} component="th" align="left" scope="row" onClick={() => handleClick(prod)}>
            {prod[0][0]}
          </TableCell>
          <TableCell className={classes.TableCell} align="center" onClick={() => handleClick(prod)}>
            {prod[1][2]}
          </TableCell>
          <TableCell className={classes.TableCell} align="center" onClick={() => handleClick(prod)}>
            {prod[0][4]}
          </TableCell>
          <TableCell align="center" onClick={() => handleClick(prod)}>
            {new Date(parseInt(prod[1][0] * 1000)).toDateString() + " " + new Date(parseInt(prod[1][0] * 1000)).toTimeString()}
          </TableCell>
          <TableCell className={classes.TableCell} align="center" onClick={() => handleClick(prod)}>
            {prod[1][1]}
          </TableCell>
          <TableCell className={clsx(classes.TableCell, classes.AddressCell)} align="center" onClick={() => handleClick(prod)}>
            {prod[0][2]}
          </TableCell>
          <TableCell className={clsx(classes.TableCell)} align="center">
            <Button type="submit" variant="contained" color="primary" onClick={() => handleReceiveButton(prod[0][0], prod[0][3], prod[0][4])}>
              RECEIVE
            </Button>
          </TableCell>
        </TableRow>
      ));
  };

  return (
    <div className={classes.pageWrap}>
      <Navbar pageTitle="Third Party" navItems={navItem}>
        {loading ? (
          <Loader />
        ) : (
          <div>
            <ProductModal
              prod={modalData}
              open={open}
              handleClose={handleClose}
              handleReceiveButton={handleReceiveButton}
              aText={alertText}
            />

            <h1 className={classes.pageHeading}>Products to be Received</h1>
            <h3 className={classes.tableCount}>
              Total: {allReceiveProducts.length}
            </h3>

            {alertText && (
              <p><b style={{ color: "red" }}>{alertText}</b></p>
            )}

            <div>
              <Paper className={classes.TableRoot}>
                <TableContainer className={classes.TableContainer}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.TableHead} align="left">Universal ID</TableCell>
                        <TableCell className={classes.TableHead} align="center">Product Code</TableCell>
                        <TableCell className={classes.TableHead} align="center">Manufacturer</TableCell>
                        <TableCell className={classes.TableHead} align="center">Manufacture Date</TableCell>
                        <TableCell className={classes.TableHead} align="center">Product Name</TableCell>
                        <TableCell className={clsx(classes.TableHead, classes.AddressCell)} align="center">Owner</TableCell>
                        <TableCell className={clsx(classes.TableHead)} align="center">RECEIVE</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {renderTableBody()}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={allReceiveProducts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </Paper>
            </div>
          </div>
        )}
      </Navbar>
    </div>
  );
}
