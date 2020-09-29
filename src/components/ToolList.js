import React from 'react';
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

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
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

  return (
    <Grid container spacing={6} className={classes.root}>
      <Grid item xs={8} md={8} lg={12}>
        <form noValidate autoComplete="off">
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
              <TableRow>
                <TableCell align="right" >Enter VM IP Address</TableCell>
                <TableCell align="right">
                  <TextField id="outlined-basic" label="IP Address of VM" variant="outlined" />
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        </form>
      </Grid>
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
              <Button variant="contained" color="primary" className={classes.button}> Create VM </Button>
            </TableRow>
          </Table>
        </form>
      </Grid>
    </Grid>
  );
}
