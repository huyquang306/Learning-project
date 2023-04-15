import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import ModalChildren from './ModalChildren';
import { useStylesOrderManager as useStyles, stylesOrderManager as styles } from './styles';
import ButtonCore from 'js/shared/components/Button';
import Utils from 'js/shared/utils';
import PageTableListContext from './PageTableListContext';
import { ORDER_STATUS } from 'js/utils/helpers/courseHelper';
import { renderUrlImageS3 } from 'js/utils/helpers/image';
import ModalUpdateNumberCourse from './ModalChildren';
import { NO_IMAGE_URL } from 'js/utils/helpers/const';

const DEFAULT_QUANTITY_ORDER = 0;

const ModalOrderDetail = (props) => {
  const classes = useStyles(props);
  const { orderDetail, setOrderDetail } = props;

  const {
    state,
    courseOrder,
    setCourseOrder,
    allOrders,
    setAllOrders,
    listPreOrderRemove,
    setListPreOrderRemove,
    listPreOrderUpdate,
    setListPreOrderUpdate,
    listNewMenus,
    setListNewMenus,
    listPreOrder,
    setListPreOrder,
  } = useContext(PageTableListContext);

  // state
  const [isConfirmUpdateNumberCourse, setIsConfirmUpdateNumberCourse] = useState(false);

  const onConfirmOrderDetail = () => {
    const preOrderUpdates = Utils.cloneDeep(listPreOrderUpdate);
    const listNewMenusClone = Utils.cloneDeep(listNewMenus);
    const allOrdersClone = Utils.cloneDeep(allOrders);
    const listPreOrderClone = Utils.cloneDeep(listPreOrder);
    const indexInAllOrders = allOrdersClone.findIndex(
      (order) => order.new_hash_id === orderDetail?.data?.new_hash_id
    );
    const indexInPreUpdate = preOrderUpdates.findIndex(
      (order) => order.id === orderDetail?.data?.id
    );
    const indexInListPreOrder = listPreOrderClone.findIndex(
      (order) => order.menu_hash_id === orderDetail?.data?.menu_hash_id
    );
    const indexInListNewMenus = listNewMenusClone.findIndex(
      (order) => order.new_hash_id === orderDetail?.data?.new_hash_id
    );

    if (orderDetail?.data?.quantity === DEFAULT_QUANTITY_ORDER) {
      // Case: order quanity = 0
      if (orderDetail?.data?.isNewOrder || orderDetail?.data?.isNewMenu) {
        if (indexInListPreOrder > -1) {
          // Case: order is new order and exist in listPreOrder
          listPreOrderClone.splice(indexInListPreOrder, 1);
        }

        if (indexInListNewMenus > -1) {
          // Case: order is order without menu and exist in listNewMenus
          listNewMenusClone.splice(indexInListNewMenus, 1);
        }

        allOrdersClone.splice(indexInAllOrders, 1);
      } else {
        setListPreOrderRemove([...listPreOrderRemove, orderDetail?.data?.id]);
        allOrdersClone[indexInAllOrders].status = ORDER_STATUS.STATUS_CANCEL;
        allOrdersClone[indexInAllOrders].amount = 0;
      }
    } else {
      if (orderDetail?.data?.id) {
        // Case: update quantity of order exist in ordergroup
        if (indexInPreUpdate > -1) {
          preOrderUpdates[indexInPreUpdate].quantity = orderDetail?.data?.quantity;
        } else {
          preOrderUpdates.push({
            id: orderDetail?.data?.id,
            quantity: orderDetail?.data?.quantity,
          });
        }
      } else {
        if (orderDetail?.data?.course_hashId) {
          // Case: update quantity of course
          state?.ordergroup?.number_of_customers === orderDetail?.data?.quantity
            ? updateCourse()
            : setIsConfirmUpdateNumberCourse(true);

          return;
        } else if (orderDetail?.data?.isNewOrder) {
          // Case: update quantity of order is new order
          listPreOrderClone[indexInListPreOrder].quantity = orderDetail?.data?.quantity;
          listPreOrderClone[indexInListPreOrder].amount =
            Number(orderDetail?.data?.price) * Number(orderDetail?.data?.quantity);
        } else {
          // Case: update quantity of order is order without menu
          listNewMenusClone[indexInListNewMenus].quantity = orderDetail?.data?.quantity;
          listNewMenusClone[indexInListNewMenus].amount =
            Number(orderDetail?.data?.price) * Number(orderDetail?.data?.quantity);
        }
      }
      allOrdersClone[indexInAllOrders].quantity = orderDetail?.data?.quantity;
      allOrdersClone[indexInAllOrders].amount =
        Number(orderDetail?.data?.quantity) * Number(orderDetail?.data?.price);
    }

    setAllOrders(allOrdersClone);
    setListPreOrderUpdate(preOrderUpdates);
    setListPreOrder(listPreOrderClone);
    setListNewMenus(listNewMenusClone);
  };

  const updateCourse = () => {
    const courseOrderClone = Utils.cloneDeep(courseOrder);
    const allOrdersClone = Utils.cloneDeep(allOrders);
    const indexInAllOrders = allOrdersClone.findIndex(
      (order) => order.new_hash_id === orderDetail?.data?.new_hash_id
    );
    courseOrderClone.quantity = orderDetail?.data?.quantity;
    allOrdersClone[indexInAllOrders].quantity = orderDetail?.data?.quantity;
    allOrdersClone[indexInAllOrders].amount =
      Number(orderDetail?.data?.quantity) * Number(orderDetail?.data?.price);
    setCourseOrder(courseOrderClone);
    setAllOrders(allOrdersClone);
  };

  const handleDecrement = () => {
    let order = Utils.cloneDeep(orderDetail);
    const minQuantity = orderDetail?.data?.course_hashId
      ? DEFAULT_QUANTITY_ORDER + 1
      : DEFAULT_QUANTITY_ORDER;
    const { quantity } = order.data;
    order.data.quantity = quantity > minQuantity ? quantity - 1 : minQuantity;
    setOrderDetail(order);
  };

  const handleIncrement = () => {
    let order = Utils.cloneDeep(orderDetail);
    order.data.quantity += 1;
    setOrderDetail(order);
  };

  return (
    <>
      <ModalChildren
        isOpen={orderDetail.isShow}
        title={orderDetail.data.name}
        onClose={(isOpen) => {
          setOrderDetail({ ...orderDetail, isShow: isOpen });
        }}
        onConfirm={onConfirmOrderDetail}
        customClass={classes.smallModalCard}
      >
        <Box display='flex' alignItems='center' className={classes.prodItem}>
          {orderDetail?.data?.m_menu?.m_image_folder_path ||
          orderDetail?.data?.m_menu?.main_image_path ? (
            <img
              style={styles.thumbnail}
              src={renderUrlImageS3(
                orderDetail?.data?.m_menu?.m_image_folder_path ||
                  orderDetail?.data?.m_menu?.main_image_path
              )}
            />
          ) : (
            <img src={`${process.env.MIX_ASSETS_PATH}/${NO_IMAGE_URL}`} alt='banner' />
          )}
        </Box>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <ButtonCore
            padding='0'
            borderRadius='50%'
            classes={{ root: classes.customButton }}
            style={{ background: '#E4E1B0', color: '#333333' }}
            onClick={handleDecrement}
          >
            ー
          </ButtonCore>
          <Box display='flex' alignItems='baseline' fontSize={50} fontWeight='fontWeightBold'>
            {orderDetail.data.quantity}
            <Box fontSize={23} fontWeight='fontWeightRegular'>
              {orderDetail?.data?.course_hashId ? '名' : '個'}
            </Box>
          </Box>
          <ButtonCore
            padding='0'
            borderRadius='50%'
            bgcolor='#F2994B'
            fgcolor='#ffffff'
            classes={{ root: classes.customButton }}
            onClick={handleIncrement}
          >
            ＋
          </ButtonCore>
        </Box>
      </ModalChildren>
      {isConfirmUpdateNumberCourse && (
        <ModalUpdateNumberCourse
          isOpen={isConfirmUpdateNumberCourse}
          title='お知らせ'
          onClose={(isOpen) => {
            setIsConfirmUpdateNumberCourse(isOpen);
          }}
          onConfirm={updateCourse}
          onCancel={() => setIsConfirmUpdateNumberCourse(false)}
          customClass={classes.smallModalCard}
        >
          <Box>
            <Box textAlign='center' className={classes.boxContent}>
              <Box>コースの注文数を変更しますか？</Box>
            </Box>
          </Box>
        </ModalUpdateNumberCourse>
      )}
    </>
  );
};

ModalOrderDetail.propTypes = {
  orderDetail: PropTypes.object,
  setOrderDetail: PropTypes.func,
};

ModalOrderDetail.defaultProps = {
  orderDetail: {},
  setOrderDetail: () => {},
};

export default ModalOrderDetail;
