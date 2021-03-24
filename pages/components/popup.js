import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { DateRange } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function popup(data) {
     data = data.children
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    // data.open = false;
  };
  
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  useEffect(() => {data.open = {open}})
  return (
    <div>  
      <IconButton aria-label={id} onClick={handleClick}>
                <RoomIcon fontSize="large"/>
        </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography}>{data.name}</Typography>
        <Typography className={classes.typography}>{data.bikeCapacity} Bikes available</Typography>
        <Typography className={classes.typography}>{data.temperature}  °C</Typography>
      </Popover>
    </div>
  );
}