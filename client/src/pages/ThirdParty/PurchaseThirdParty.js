import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import Navbar from "../Navbar";
import ProductModal from "../ProductModal";
import Loader from "../Loader";

const useStyles = makeStyles((theme) => ({
  pageWrap: {
    padding: theme.spacing(3),
  },
  pageHeading: {
    marginBottom: theme.spacing(2),
  },
  tableCount: {
    marginBottom: theme.spacing(2),
  },
  TableRoot: {
    width: "100%",
  },
  TableContainer: {
    maxHeight: 440,
  },
}));

export default function PurchaseThirdParty(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navItem = [
    {
      title: "Home",
      icon: "home",
      path: "/",
    },
    {
      title: "Third Party",
      icon: "third_party",
      path: "/third-party",
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setLoading(true);
    // Fetch all products from the backend
    setAllProducts([]);
    setLoading(false);
  }, []);

  return (
    <div className={classes.pageWrap}>
      <Navbar pageTitle={"Third Party"} navItems={navItem}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <ProductModal
              prod={modalData}
              open={open}
              handleClose={handleClose}
            />

            <h1 className={classes.pageHeading}>All Products</h1>
            <h3 className={classes.tableCount}>Total : {allProducts.length}</h3>

            <div>
              <Paper className={classes.TableRoot}>
                <TableContainer className={classes.TableContainer}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableBody>
                      {allProducts.length !== 0 ? (
                        allProducts
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((prod) => {
                            const d = new Date(parseInt(prod[1][0] * 1000));
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={prod[0][0]}
                              >
                                {/* TableCell contents remain the same */}
                              </TableRow>
                            );
                          })
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={allProducts.length}
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