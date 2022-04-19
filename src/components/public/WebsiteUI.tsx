import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Url, Website } from '../../../types/common/types';

interface Props {
  initWebsite: Website;
  url: Url;
}

const WebsiteUI = ({
  initWebsite, url
} : Props) => {
  function clickTitle() {
    if (initWebsite && initWebsite.ID) {
      window.open(`${process.env.PUBLIC_WEB}/w/${initWebsite.ID}`, '_blank', 'noopener,noreferrer');
    }
    return false;
  }

  let websiteTitle : string = '';
  websiteTitle = (initWebsite?.Title && initWebsite?.Title !== '') ? initWebsite.Title : url?.Title;
  const website = (
    <Box mx={3} borderRadius="borderRadius" height="35px">
      <Grid container wrap="nowrap">
        <Grid
          container
          direction="column"
        >
          <Grid item component={Box} my={1}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                cursor: (initWebsite?.ID) ? 'pointer' : 'default'
              }}
              onClick={() => clickTitle()}
            >
              {(websiteTitle && websiteTitle.length > 32)
                ? websiteTitle.substring(0, 32).concat('...')
                : (websiteTitle)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  return <CssBaseline>{website}</CssBaseline>;
};

export default WebsiteUI;
