import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import {List, ListItem, ListItemText, Menu, MenuItem} from "@mui/material";
import React, {useCallback, useEffect, useRef} from "react";

const coins = ['BTC', 'LTC', 'DOGE', 'DGB', 'RVN', 'ARRR' ];

export const ServerTable = () => {
    const [info, setInfo] = React.useState([]);
    const coin = useRef();
    const establishUserWalletInfo = useCallback(async () => {
        try {
            const response = await qortalRequestWithTimeout({
                action: 'GET_CROSSCHAIN_SERVER_INFO',
                coin: coin.current
            }, 1800000)

            var index = 0;
            response.map((row) => row.index = index++);
            setInfo( response );

        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        establishUserWalletInfo()
    }, [coin])

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState();
    const open = Boolean(anchorEl);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);

        coin.current = coins[index];
        establishUserWalletInfo();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
      <div>
        <div>
         <List
           component="nav"
            aria-label="Coins"
           sx={{ bgcolor: "background.paper"}}
           >
           <ListItem
             button
             id="lock-button"
             aria-haspopup="listbox"
             aria-controls="lock-menu"
             aria-label="derived addresses"
             aria-expanded={open ? "true" : undefined}
             onClick={handleClickListItem}
             >
              <ListItemText
                  primary="Select Coin"
                  secondary={coins[selectedIndex]}
              />
           </ListItem>
         </List>
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox'
            }}
          >
              {coins.map((coin, index) => (
                  <MenuItem
                    key={coin}
                    disabled={index === selectedIndex}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                      {coin}
                  </MenuItem>
              ))}
          </Menu>
        </div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Host</TableCell>
            <TableCell>Port</TableCell>
            <TableCell align="right">Average Response Time</TableCell>
            <TableCell align="right">Connection Type</TableCell>
            <TableCell>Is Current</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {info.map((row) => (
            <TableRow
              key={row.index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.hostName}</TableCell>
              <TableCell>{row.port}</TableCell>
              <TableCell align="right">{row.averageResponseTime}</TableCell>
              <TableCell>{row.connectionType}</TableCell>
              <TableCell>{row.isCurrent.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
  );
}
