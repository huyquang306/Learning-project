import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Components(Material-UI)
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TableHead,
  Grid,
  Button,
} from '@material-ui/core';
import IOSSwitch from 'js/utils/components/Switch/IOSSwitch';
import ShopInfoContext from 'js/shop/components/ShopInfoContext';

// Base Components
import PageContainer from 'js/shared-order/components/PageContainer';
import HeaderAppBar from 'js/shop-order/components/HeaderAppBar';
import PageInnerContainer from 'js/shared/components/PageInnerContainer';
import PageInnerWrap from 'js/shared-order/components/PageInnerWrap';
import Footer from 'js/shared-order/components/Footer';
import FlashMessage from 'js/shared-order/components/FlashMessage';

// Styles
import { useStylesPageCoursesList } from './styles';
import { Add } from "@material-ui/icons";

// Service
import ShopOrderApiService from 'js/shop-order/shop-order-api-service';

// Helper
import Utils from 'js/shared/utils';
import { INITIAL_PROPOSE_FLG } from 'js/utils/helpers/courseHelper';
import { renderUrlImageS3 } from 'js/utils/helpers/image';

const STATUS_ACTIVE = 'active';
const STATUS_INACTIVE = 'inactive';

const PageCoursesList = (props) => {
  const classes = useStylesPageCoursesList(props);
  const [shop] = useContext(ShopInfoContext);
  const history = useHistory();
  const [courses, setCourses] = useState([]);
  const [toast, setToast] = useState({
    isShow: false,
    message: '',
    status: 'success',
  });

  useEffect(() => {
    getMasterCourses();
  }, []);

  const getMasterCourses = async () => {
    try {
      const response = await ShopOrderApiService.getMasterCourses(shop.hashId);
      setCourses(response);
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const getCourses = async () => {
    try {
      const response = await ShopOrderApiService.getCourses(shop.hashId);
      setCourses(response);
    } catch (error) {
      showWarningMessage(error.message);
    }
  };

  const showWarningMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'warning',
    });
  };

  const showSuccessMessage = (message) => {
    setToast({
      isShow: true,
      message: message,
      status: 'success',
    });
  };

  const onClickCopy = async (course) => {
    try {
      const response = await ShopOrderApiService.copyCourse(shop.hashId, course.hash_id);
      let newCoursesClone = Utils.cloneDeep(courses);
      newCoursesClone.push(response);
      setCourses(newCoursesClone);

      showSuccessMessage('コースのコピーが成功しました');
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const onChangeStatus = async (event, courseIndex) => {
    let newCoursesClone = Utils.cloneDeep(courses);
    const { target } = event;
    newCoursesClone[courseIndex].status = target.checked ? STATUS_ACTIVE : STATUS_INACTIVE;

    try {
      await ShopOrderApiService.updateBlocksInCourse(
        shop.hashId,
        newCoursesClone[courseIndex].hash_id,
        newCoursesClone[courseIndex]
      );

      setCourses(newCoursesClone);
      showSuccessMessage('コースステータスの更新が成功しました');
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  const onChangeInitialProposeFlg = async (event, courseIndex) => {
    let newCoursesClone = Utils.cloneDeep(courses);
    const { target } = event;
    newCoursesClone[courseIndex].initial_propose_flg = target.checked ? INITIAL_PROPOSE_FLG.STATUS_ON : INITIAL_PROPOSE_FLG.STATUS_OFF;

    try {
      await ShopOrderApiService.updateBlocksInCourse(
        shop.hashId,
        newCoursesClone[courseIndex].hash_id,
        newCoursesClone[courseIndex]
      );

      setCourses(newCoursesClone);
      showSuccessMessage('コースの初期提案の更新が成功しました');
    } catch (error) {
      showWarningMessage(error.message);
    }
  }

  return (
    <PageContainer padding='0px' height='auto' minHeight='auto'>
      {/* Change background color body and unset minHeight */}
      <style>{'body { background-color: white }'}</style>

      <HeaderAppBar title='コース登録'/>
      <PageInnerWrap height='auto'>
        <PageInnerContainer padding={ '8px 16px' } height='auto'>
          <Box flex={ 1 } className={ classes.head }>
            <Box mt={ 1 }>
              <TableContainer component={ Paper } className={ classes.container }>
                <Table stickyHeader aria-label='simple table'>
                  <TableHead>
                    <TableRow classes={{ root: classes.tableHead }}>
                      {/* status */}
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                        style={{ minWidth: '120px' }}
                      >
                        利用中
                      </TableCell>

                      {/* initial_propose_flg */}
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                        style={{ minWidth: '120px' }}
                      >
                        初期提案
                      </TableCell>

                      {/* name */}
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                      >
                        商品名
                      </TableCell>

                      {/* time */}
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                        style={{ minWidth: '160px' }}
                      >
                        時間
                      </TableCell>

                      {/* image */}
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                        style={{ minWidth: '160px' }}
                      >
                        写真
                      </TableCell>

                      {/* action */}
                      <TableCell
                        classes={{ root: classes.tableCell }}
                        align="center"
                        style={{ minWidth: '160px' }}
                      >
                        アクション
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      courses && courses.map((course, courseIndex) => (
                        <TableRow key={ courseIndex }>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                          >
                            <IOSSwitch
                              checked={ course.status === STATUS_ACTIVE }
                              onChange={ (e) => onChangeStatus(e, courseIndex) }
                            />
                          </TableCell>

                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                          >
                            <IOSSwitch
                              checked={ course.initial_propose_flg === INITIAL_PROPOSE_FLG.STATUS_ON }
                              onChange={ (e) => onChangeInitialProposeFlg(e, courseIndex) }
                            />
                          </TableCell>

                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                          >
                            <Link
                              className={ classes.linkWithoutUnder }
                              to={ `/menus/courses/${course.hash_id}` }
                            >
                              { course.name }
                            </Link>
                          </TableCell>

                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                          >
                            <Link
                              className={ classes.linkWithoutUnder }
                              to={ `/menus/courses/${course.hash_id}` }
                            >
                              { course.time_block_unit }分
                            </Link>
                          </TableCell>

                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                          >
                            <Link
                              className={ classes.linkWithoutUnder }
                              to={ `/menus/courses/${course.hash_id}` }
                            >
                              {
                                course.s_image_folder_path ? (
                                  <img
                                    className={ classes.imageCourse }
                                    src={ renderUrlImageS3(course.s_image_folder_path) }
                                  />
                                ) : <u>設定無し</u>
                              }
                            </Link>
                          </TableCell>

                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                          >
                            {/* button copy */}
                            <Button
                              className={ `${classes.button} ${classes.buttonCopy}` }
                              onClick={ () => onClickCopy(course) }
                            >
                              コピー
                            </Button>

                            {/* button detail */}
                            <Button
                              className={ `${classes.button} ${classes.buttonDetail}` }
                              onClick={ () => history.push(`/menus/courses/${course.hash_id}`) }
                            >
                              詳細
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <Footer padding='10px'>
            <Box textAlign='center'>
              <Grid spacing={ 5 } container justify='center'>
                <Grid item>
                  <Button
                    onClick={() => history.push('/menus/setting')}
                    className={`${classes.buttonController} + ' ' + ${classes.buttonBack}`}
                  >
                    戻る
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => history.push('/menus/courses/add')}
                    className={`${classes.buttonController} + ' ' + ${classes.buttonAdd}`}
                  >
                    <Add /> 追加する
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Footer>

          <FlashMessage
            isOpen={ toast.isShow }
            onClose={isOpen => setToast({ ...toast, isShow: isOpen })}
            status={ toast.status }
            message={ toast.message }
          />
        </PageInnerContainer>
      </PageInnerWrap>
    </PageContainer>
  );
};

PageCoursesList.propTypes = {};
export default PageCoursesList;
