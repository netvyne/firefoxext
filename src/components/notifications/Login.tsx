import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
    Alert,
  Box, Button, CssBaseline, Grid, TextField
} from '@mui/material';
import { DateTime } from 'luxon';
import React from 'react';
import { useMutation } from 'react-query';
import { Notification, User } from '../../../types/common/types';
import './styles.scss';
interface Props  {
    setCurrentUser: any;
    themeColors: any;
}

const Login = ({ setCurrentUser, themeColors } : Props) => {
    const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  // @ts-ignore
  const signInMutation = useMutation();
  const onSignIn = async (e: any) => {
    e.preventDefault();
    const mutateData = {
      Email: email,
      Password: password,
    };
    setIsError(false);
    const res = signInMutation.mutate(
      // @ts-ignore
      { route: '/login', data: mutateData },
      {
        onError: (err: any) => {
          setErrorText(err.response.data.Message);
          setIsError(true);
        },
        onSuccess: (retData: { [CurrentUser: string]: User }) => {
            setCurrentUser(retData);
            localStorage.setItem('netvyneUser', JSON.stringify(retData));
        },
      },
    );
    return res;
  };

  const notif = (
    <Box
      color="text.primary"
      border={0}
      mb={1}
      padding={1}
      className="notificationBox"
      bgcolor={themeColors.divBackground}
      width="100%"
    >
      <Box>
        <Grid item container xs={12} direction="row" spacing={1} alignItems="center" wrap="nowrap">
        <Grid item xs pt={1}>
            <form onSubmit={onSignIn}>
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email address"
                  type="string"
                  margin="dense"
                  size="small"
                  style={{
                    borderRadius: 7
                  }}
                  onInput={(e: any) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  label="Password"
                  margin="dense"
                  size="small"
                  style={{
                    borderRadius: 7
                  }}
                  inputProps={{ maxLength: 20 }}
                  onInput={(e: any) => setPassword(e.target.value)}
                  error={/\s/.test(password)}
                />
              </Grid>
              <Grid item component={Box} pt={1} xs>
                <Button
                  onClick={onSignIn}
                  variant="contained"
                  fullWidth
                  disabled={(password === '') || (email === '') || /\s/.test(password)}
                  color="primary"
                  size="medium"
                  sx={{
                    textTransform: 'none', backgroundColor: '#33DA00', fontSize: 'large'
                  }}
                  type="submit"
                >
                  Login
                  {isError && (
                    <Alert severity="error">{errorText}</Alert>
                  )}
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return <CssBaseline>{notif}</CssBaseline>;
};

export default Login;
