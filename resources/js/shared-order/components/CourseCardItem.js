import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { isOverTimeCourse } from 'js/utils/helpers/courseHelper';
import { isEmpty } from 'lodash';

// Library
import Utils from 'js/shared/utils';

const useStyles = makeStyles({
  orderActive: {
    backgroundColor: '#E4E1B0',
    borderRadius: '7px',
    marginTop: '4px',
  },
  courseOver: {
    backgroundColor: 'rgba(255, 0, 0, 0.67)',
    borderRadius: '7px',
    marginTop: '4px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2px 0 6px',
  },
  itemLeft: {
    display: 'flex',
    alignItems: 'center',
    height: '24px',
    flex: 1,
    width: 'calc(100% - 20px)',
    
    '& span': {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      display: 'inline-block',
      backgroundColor: 'transparent',
      '&.active': {
        backgroundColor: 'rgba(255, 0, 0, 0.67)',
      },
    },
  },
  itemTitle: {
    fontSize: '14px',
    lineHeight: '16px',
    color: '#000000',
    marginLeft: '2px',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
});

const CourseCardItem = (props) => {
  const { ordergroup, course } = props;
  const classes = useStyles();
  
  const [isOverTime, setIsOverTime] = useState(false);
  
  useEffect(() => {
    let timerInterval = null;
    if (!isEmpty(ordergroup) && !isEmpty(course)) {
      timerInterval = setInterval(() => {
        setIsOverTime(isOverTimeCourse(ordergroup, course));
      }, Utils.REFRESH_SECOND());
    }
    
    return () => {
      clearInterval(timerInterval);
    };
  }, [ordergroup, course]);
  
  return (
    <div
      className={ isOverTime ? classes.courseOver : classes.orderActive }
      key='course-key'
    >
      <div className={ classes.item }>
        <div className={ classes.itemLeft }>
          <div className={ classes.itemTitle }>{ course.name }</div>
        </div>
      </div>
    </div>
  );
};

CourseCardItem.propTypes = {
  course: PropTypes.object,
  ordergroup: PropTypes.object,
};

CourseCardItem.defaultProps = {
  course: {
    name: '',
  },
  ordergroup: {},
};

export default CourseCardItem;
