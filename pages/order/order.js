// pages/order/order.js
import initCalendar from '../../template/calendar/index';
const conf = {
  onShow: function () {
    initCalendar(); // 初始化日历
  }
};
Page(conf);