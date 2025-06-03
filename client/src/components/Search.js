import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 10px',
    display: 'flex',
    margin: '20px auto',
    width: '40%',
    border: "2px solid #1a237e",
    borderRadius: 50,
    boxShadow: "2px 2px 10px #9fa8da"
  },
  input: {
    justifyContent: 'center',
    flex: 1,
    outline: "none",
    border: "none",
    padding: 0,
    borderRadius: 40,
    fontSize: 17
  },
  iconButton: {
    padding: 10,
  },
}));

export default function CustomizedInputBase(props) {
  const classes = useStyles();
  const [search, setSearch] = React.useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    if (search.trim()) {
      props.findProduct(search);
      setSearch(""); // Clear the input after search
    } else {
      alert("Please enter a valid Universal ID."); // Basic error handling
    }
  };

  return (
    <Paper className={classes.root}>
      <input
        className={classes.input}
        placeholder="Enter Product Universal ID"
        inputProps={{ 'aria-label': 'Enter Product Universal ID' }}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        value={search}
        type="number" // Set input type to number
      />
      <IconButton 
        className={classes.iconButton} 
        aria-label="search" 
        onClick={performSearch} // Use the performSearch function
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

