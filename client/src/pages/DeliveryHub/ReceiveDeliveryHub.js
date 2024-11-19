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

export default function ReceiveDeliveryHub(props) {
  const { supplyChainContract } = props;
  const { roles } = useRole();
  const [count, setCount] = useState(0);
  const [allReceiveProducts, setAllReceiveProducts] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const navItem = [
    ["Receive Product", "/DeliveryHub/receive"],
    ["Ship Product", "/DeliveryHub/ship"],
  ];
  const [alertText, setAlertText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [supplyChainContract]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cnt = await supplyChainContract.methods.fetchProductCount().call();
      setCount(cnt);
      const arr = [];
      for (let i = 1; i < cnt; i++) {
        const prodState = await supplyChainContract.methods.fetchProductState(i).call();
        if (prodState === "5") {
          const prodData = [];
          const a = await supplyChainContract.methods.fetchProductPart1(i, "product", 0).call();
          const b = await supplyChainContract.methods.fetchProductPart2(i, "product", 0).call();
          const c = await supplyChainContract.methods.fetchProductPart3(i, "product", 0).call();
          prodData.push(a, b, c);
          arr.push(prodData);
        }
      }
      setAllReceiveProducts(arr);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setAlertText("Error fetching products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetTxhash = async (id, hash) => {
    await supplyChainContract.methods.setTransactionHash(id, hash).send({ from: roles.manufacturer, gas: 900000 });
  };

  const handleReceiveButton = async (id, long, lat) => {
    try {
      await supplyChainContract.methods
        .receiveByDeliveryHub(parseInt(id), long, lat)
        .send({ from: roles.deliveryhub, gas: 1000000 })
        .on("transactionHash", function (hash) {
          handleSetTxhash(id, hash);
        });
      setOpen(false);
      setAlertText(""); // Clear alert text on success
      // Re-fetch the products after receiving
      fetchData();
    } catch (error) {
      console.error(error);
      if (error.message.includes("You are not the owner")) {
        setAlertText("You are not the owner of the Product");
      } else {
        setAlertText("An error occurred during the transaction");
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => setOpen(false);

  const handleClick = (prod) => {
    setModalData(prod);
    setOpen(true);
  };

  return (
    <div className={classes.pageWrap}>
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <ProductModal
              prod={modalData}
              open={open}
              handleClose={handleClose}
              handleReceiveButton={handleReceiveButton}
              aText={alertText}
            />

            <h1 className={classes.pageHeading}>Products To be Received</h1>
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
                      {allReceiveProducts.length !== 0 ? (
                        allReceiveProducts
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((prod) => {
                            const d = new Date(parseInt(prod[1][0] * 1000));
                            return (
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
                                  {d.toDateString() + " " + d.toTimeString()}
                                </TableCell>
                                <TableCell className={classes.TableCell} align="center" onClick={() => handleClick(prod)}>
                                  {prod[1][1]}
                                </TableCell>
                                <TableCell className={clsx(classes.TableCell, classes.AddressCell)} align="center" onClick={() => handleClick(prod)}>
                                  {prod[0][2]}
                                </TableCell>
                                <TableCell className={clsx(classes.TableCell)} align="center">
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleReceiveButton(prod[0][0], prod[1][3], prod[1][4])}
                                  >
                                    RECEIVE
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">No products available</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={allReceiveProducts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </>
        )}
      </Navbar>
    </div>
  );
}
