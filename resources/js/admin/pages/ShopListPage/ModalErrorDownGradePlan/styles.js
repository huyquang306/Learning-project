import { makeStyles } from '@material-ui/core/styles';

const useStylesDownGradePlan = makeStyles(() => ({
  textModal: {
    padding: '6px 0px',
  },
  boxContent: {
    maxWidth: 'calc(392px + 20px)',
    padding: '0 10px',
    margin: '30px auto 0',
    fontWeight: 600,
    ['@media (max-width: 600px)']: {
      margin: '10px auto 0!important',
      overflowX: 'hidden',
    },
  },
}));

export {
  useStylesDownGradePlan
};
