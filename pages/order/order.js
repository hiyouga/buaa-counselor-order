// pages/order/order.js
import initDatepicker from '../../template/datepicker/index'
const conf = {
  onLoad: function () {
    initDatepicker({
      showInput: false,
      type: 'normal'
    })
  }
}
Page(conf)