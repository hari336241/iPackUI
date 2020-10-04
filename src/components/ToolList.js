import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '100',
  },
  paper: {
    width: 400,
    height: 400,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(86, 98, 226, 0.3)',
  },
  table: {
    maxWidth: '80%',
  },
  tableContainer: {
    width: 960,
    height: 'auto',
    borderRadius: 13,
    boxShadow: '0 3px 5px 2px rgba(86, 98, 226, 0.3)',
  },
  submit: {
    width: 960,
    height: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function ToolList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(["Jenkins", "Nexus", "SonarQube", "Aquasec", "Docker", "Chef"]);
  const [right, setRight] = React.useState([]);
  const [vmIpAddress, setVmIpAddress] = React.useState();
  const [vmUserName , setVmUserName] = React.useState('');
  const [vmPassword , setVmPassword] = React.useState('');
  const [ipAddressError,setIpAddressError] = React.useState(false);
  const [userError,setUserError] = React.useState(false);
  const [passwordError,setPasswordError] = React.useState(false);
  const [ipErrorMessage,setIpErrorMessage] = React.useState('');
  const [userErrorMessage , setUserErrorMessage] = React.useState('');
  const [passwordErrorMessage , setPasswordErrorMessage] = React.useState('');
  const [responseMessage,setResponseMessage] = React.useState('');
  const [responseErrorMessage,setResponseErrorMessage] = React.useState('');
  const [disabled,isDisabled] = useState(true);

useEffect(() => {

  console.log("in Use Effect")
  if(vmIpAddress !== "" && vmUserName !== "" && vmPassword !== ""){
    isDisabled(false)
  }else{
    isDisabled(true);
  }
})

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  const ipAddressChangeHandler = event => {

    
    let ipAddress = event.target.value;
    console.log(ipAddress)
    if(ipAddress.trim() === "" )
    {
      setIpAddressError(true);
      setIpErrorMessage('IP Address should not be empty');
      setVmIpAddress("");
    }
    else{
      setIpAddressError(false)
    setIpErrorMessage("")
    setVmIpAddress(event.target.value);
  }
}

  const vmUserNameChangeHandler = event => {

    const username = event.target.value;
    if(username.trim() === "" )
    {
      setUserError(true);
      setUserErrorMessage('VM Username should not empty');
      setVmUserName("");
    }else {
      setUserError(false);
      setUserErrorMessage('');
    setVmUserName(username);
  }
}

  const vmPasswordChangeHandler = event => {
    const password = event.target.value;
    if(password.trim() === ""){
      setPasswordError(true);
      setPasswordErrorMessage('VM Password should not be empty');
      setVmPassword("")
    }else {
      setPasswordError(false)
      setPasswordErrorMessage('');
      setVmPassword(password)
    }


  }

  const createVM = () => {

    const ipAddress = vmIpAddress;
    const username = vmUserName;
    const password = vmPassword;
    const softwares = right;


    console.log("Ip Address" , ipAddress , "username" , username , "Password" , password , "Softwares" , softwares);

   
    axios.post(`http://server/ClientIP=${vmIpAddress}&ClientUserName=${vmUserName}&ClientPwd=${vmPassword}&Softwares=${softwares}`).then(
      response => {
      console.log(response);
      setVmIpAddress('');
      setVmUserName('');
      setVmPassword('');
      setRight([]);
      setLeft(["Jenkins", "Nexus", "SonarQube", "Aquasec", "Docker", "Chef"]);
      setResponseMessage("VM Created Successfully")
      }
    ).catch(error => {
      console.log(error);
      setResponseErrorMessage("Unable create VM please try again")
    })

  }

  return (
    <Grid container spacing={6} className={classes.root}>
      <Grid item xs={8} md={8} lg={12}>
        <form noValidate autoComplete="off">
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
              <TableRow>
                <TableCell align="right" >Enter VM IP Address</TableCell>
                <TableCell align="right">
                  <TextField 
                  error= {ipAddressError}
                  id="outlined-basic" 
                  label="IP Address of VM" 
                  variant="outlined" 
                  helperText={ipErrorMessage}
                  onChange={event => ipAddressChangeHandler(event)}
                  value={vmIpAddress}
                  required/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" >Enter VM UserName</TableCell>
                <TableCell align="right">
                  <TextField 
                  error= {userError}
                  id="outlined-basic" 
                  label="VM UserName" 
                  variant="outlined" 
                  helperText={userErrorMessage}
                  onChange={event => vmUserNameChangeHandler(event)}
                  value={vmUserName}
                  required/>
                </TableCell>
                <TableCell align="right" >Enter VM Password</TableCell>
                <TableCell align="right">
                  <TextField 
                  error= {passwordError}
                  id="outlined-basic" 
                  label="VM Password" 
                  variant="outlined" 
                  helperText={passwordErrorMessage}
                  onChange={event => vmPasswordChangeHandler(event)}
                  value={vmPassword}
                  required/>
                </TableCell>              
              </TableRow>
            </Table>
          </TableContainer>
        </form>
      </Grid>
  <p>{responseMessage}</p>
  <p>{responseErrorMessage}</p>
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center" >
          <Button variant="outlined" size="small" className={classes.button} disabled={left.length === 0} aria-label="move all right"
            onClick={handleAllRight}>
            ≫
          </Button>
          <Button variant="outlined" size="small" className={classes.button} disabled={leftChecked.length === 0} aria-label="move selected right"
            onClick={handleCheckedRight}>
            &gt;
          </Button>
          <Button variant="outlined" size="small" className={classes.button} disabled={rightChecked.length === 0} aria-label="move selected left"
            onClick={handleCheckedLeft}>
            &lt;
          </Button>
          <Button variant="outlined" size="small" className={classes.button} disabled={right.length === 0} aria-label="move all left"
            onClick={handleAllLeft}>
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>

      <Grid item className={classes.submit}>
        <form noValidate autoComplete="off">
          <Table aria-label="simple table">
            <TableRow align="right">
              <Button variant="contained" color="primary" className={classes.button} onClick={createVM} disabled={disabled}> Create VM </Button>
            </TableRow>
          </Table>
        </form>
      </Grid>
    </Grid>
  );
}
