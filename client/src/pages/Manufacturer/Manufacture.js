import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useRole } from "../../context/RoleDataContext";
import Navbar from "../../components/Navbar";
import { useStyles } from "../../components/Styles";
import Grid from "@material-ui/core/Grid";
import Loader from "../../components/Loader";

export default function Manufacture(props) {
    const { supplyChainContract } = props;
    const classes = useStyles();
    const { roles } = useRole();
    const [loading, setLoading] = useState(false);
    const [fvalid, setfvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navItem = [
        ["Add Product", "/manufacturer/manufacture"],
        ["Ship Product", "/manufacturer/ship"],
        ["All Products", "/manufacturer/allManufacture"],
    ];
    const [manuForm, setManuForm] = useState({
        id: 0,
        manufacturerName: "",
        manufacturerDetails: "",
        manufacturerLongitude: "",
        manufacturerLatitude: "",
        productName: "",
        productCode: "0",
        productPrice: "0",
        productCategory: "",
    });

    const handleChangeManufacturerForm = (e) => {
        const { name, value } = e.target;
        
        if (name === 'productCode' || name === 'productPrice') {
            // Only allow positive integers
            if (value === '' || /^\d+$/.test(value)) {
                setManuForm(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            setManuForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmitManufacturerForm = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            // Convert and validate numeric fields
            const productCode = parseInt(manuForm.productCode);
            const productPrice = parseInt(manuForm.productPrice);

            // Validate all required fields
            if (!manuForm.manufacturerName || 
                !manuForm.manufacturerDetails || 
                !manuForm.manufacturerLongitude || 
                !manuForm.manufacturerLatitude || 
                !manuForm.productName || 
                !manuForm.productCategory) {
                throw new Error("Please fill in all required fields");
            }

            // Validate numeric fields
            if (isNaN(productCode) || productCode <= 0) {
                throw new Error("Product code must be a valid positive number");
            }

            if (isNaN(productPrice) || productPrice <= 0) {
                throw new Error("Product price must be a valid positive number");
            }

            setfvalid(false);

            // Call the smart contract with validated values
            await supplyChainContract.methods
                .manufactureProduct(
                    manuForm.manufacturerName,
                    manuForm.manufacturerDetails,
                    manuForm.manufacturerLongitude,
                    manuForm.manufacturerLatitude,
                    manuForm.productName,
                    productCode,
                    productPrice,
                    manuForm.productCategory
                )
                .send({ from: roles.manufacturer, gas: 999999 })
                .on('transactionHash', function (hash) {
                    handleSetTxhash(hash);
                });

            // Reset form after successful submission
            setManuForm({
                id: 0,
                manufacturerName: "",
                manufacturerDetails: "",
                manufacturerLongitude: "",
                manufacturerLatitude: "",
                productName: "",
                productCode: "0",
                productPrice: "0",
                productCategory: "",
            });

        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(error.message);
            setfvalid(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSetTxhash = async (hash) => {
        await supplyChainContract.methods
            .setTransactionHashOnManufacture(hash)
            .send({ from: roles.manufacturer, gas: 900000 });
    };

    // const createProduct = async () => {
    //     setLoading(true);
    //     for (var i = 0; i < 5; i++) {
    //         await supplyChainContract.methods
    //             .manufactureProduct(
    //                 "product" + i,
    //                 "manufacturer" + 1,
    //                 "98",
    //                 "89",
    //                 "mi" + i,
    //                 99 + i,
    //                 12000,
    //                 "electronics"
    //             )
    //             .send({ from: roles.manufacturer, gas: 999999 })
    //             .on("transactionHash", function (hash) {
    //                 handleSetTxhash(hash);
    //             });
    //     }
    //     setLoading(false);
    // };

    return (
        <div className={classes.pageWrap}>
            <Navbar pageTitle="Manufacturer" navItems={navItem}>
                {loading ? (
                    <Loader />
                ) : (
                    <div className={classes.FormWrap}>
                        <h1 className={classes.pageHeading}>Add Product</h1>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    name="manufacturerName"
                                    variant="outlined"
                                    value={manuForm.manufacturerName}
                                    onChange={handleChangeManufacturerForm}
                                    label="Manufacturer Name"
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    name="manufacturerDetails"
                                    variant="outlined"
                                    value={manuForm.manufacturerDetails}
                                    onChange={handleChangeManufacturerForm}
                                    label="Manufacturer Details"
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    name="manufacturerLongitude"
                                    variant="outlined"
                                    value={manuForm.manufacturerLongitude}
                                    onChange={handleChangeManufacturerForm}
                                    label="Longitude"
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    name="manufacturerLatitude"
                                    variant="outlined"
                                    value={manuForm.manufacturerLatitude}
                                    onChange={handleChangeManufacturerForm}
                                    label="Latitude"
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    name="productName"
                                    variant="outlined"
                                    value={manuForm.productName}
                                    onChange={handleChangeManufacturerForm}
                                    label="Product Name"
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    name="productCode"
                                    type="number"
                                    variant="outlined"
                                    value={manuForm.productCode}
                                    onChange={handleChangeManufacturerForm}
                                    label="Product Code"
                                    style={{ width: "100%" }}
                                    inputProps={{
                                        min: "1",
                                        step: "1"
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    name="productPrice"
                                    type="number"
                                    variant="outlined"
                                    value={manuForm.productPrice}
                                    onChange={handleChangeManufacturerForm}
                                    label="Product Price"
                                    style={{ width: "100%" }}
                                    inputProps={{
                                        min: "1",
                                        step: "1"
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    name="productCategory"
                                    variant="outlined"
                                    value={manuForm.productCategory}
                                    onChange={handleChangeManufacturerForm}
                                    label="Product Category"
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        {fvalid && (
                            <p>
                                <b style={{ color: "red" }}>
                                    {errorMessage || "Please enter all data"}
                                </b>
                            </p>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitManufacturerForm}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "SUBMIT"}
                        </Button>
                    </div>
                )}
            </Navbar>
        </div>
    );
}
