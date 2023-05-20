import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  basicPaginateHeader: {
    margin: '20px 0',
  }
}));

const BasicPagination = (props) => {
  const classes = useStyles(props);
  
  return (
    <div className={ classes.basicPaginateHeader } style={{ float: props.positionLeftOrRight }}>
      {
        props.totalPage && props.totalPage > 1 ? (
          <Pagination
            count={ props.totalPage }
            page={ props.currentPage }
            variant="outlined"
            shape="rounded"
            onChange={ props.onChange }
          />
        ) : null
      }
    </div>
  );
}

BasicPagination.propTypes = {
  totalPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  positionLeftOrRight: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
BasicPagination.defaultProps = {
  totalPage: 0,
  currentPage: 0,
  positionLeftOrRight: 'right',
  onChange: () => {},
}

export default BasicPagination;
