// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', // 保存输入框的值
    operatorCode: 0,
    clearFlag: 0,
    num1: 0.0,
    num2: 0.0
  },

  inputChange(event) {
    this.setData({
      inputValue: event.detail.value // 更新 data 中的 inputValue
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  /*
  * 事件传参处理函数
  */
  sayHi(e) {
    console.log(e);
    var msg=e.target.dataset.msg;
    wx.showToast({
      title: '你好'+msg,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh(e) {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  
  handleInput(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      inputValue: value
    })
  },
  validateNumber(val) {
    // 先移除非数字、小数点和负号的字符
    let sanitizedValue = val.replace(/[^0-9.-]/g, '');

    // 仅允许负号在开头，其他位置的负号将被移除
    // 移除非法字符，确保负号只能在开头
    if (sanitizedValue.charAt(0) === '-') {
      sanitizedValue = '-' + sanitizedValue.slice(1).replace(/-/g, ''); // 确保负号只能在第一个字符
    } else {
      sanitizedValue = sanitizedValue.replace(/-/g, ''); // 移除非首位的负号
    }
    // 确保只保留第一个小数点，移除多余的小数点
    sanitizedValue = sanitizedValue.replace(/(\..*)\./g, '$1'); 

    //确保小数点前有至少一个数字，如果没有，则移除小数点
    const decimalIndex = sanitizedValue.indexOf('.');
    if (decimalIndex !== -1 && decimalIndex === 0) {
        // 小数点出现在第一位（无数字在前），则移除小数点
        sanitizedValue = sanitizedValue.replace('.', '');
    } else if (decimalIndex !== -1 && sanitizedValue.charAt(decimalIndex - 1) === '-') {
        // 小数点紧跟在负号后面（负号后没有数字），也移除小数点
        sanitizedValue = sanitizedValue.replace('.', '');
    }
    return sanitizedValue;
  },

  handleButtonTap(e) {
    if(this.data.clearFlag === 1){
      this.setData({
        inputValue: '',
        clearFlag: 0
      });
    }

    let index = e.currentTarget.dataset.index;
    let value = e.currentTarget.dataset.value;
    
    // 更新输入框的值
    let newValue;
    if (value === '-') {
      if(this.data.inputValue.charAt(0) === '-'){
        newValue = this.data.inputValue.replace('-', '');
      }else{
        newValue = value + this.data.inputValue;
      }
    } else {
      newValue = this.data.inputValue + value;
    }

    this.setData({
      inputValue: newValue
    });

    // 如果有手动绑定 input 事件处理函数，手动调用它
    this.handleInput({ detail: { value: newValue } });
  },

  // 按钮响应：AC
  handleACButtonTap(e) {
    // 清空输入框内容
    this.setData({
      inputValue: '',
      num1 : 0.0,
      num2 : 0.0,
      operatorCode : 0,
      clearFlag: 0
    });
  },

  // 按钮响应: +、-、*、/ 清空输入框内容
  handleComputeButtonTap(e) {
    this.data.num1 = parseFloat(this.data.inputValue);
    // 清空输入框内容
    this.setData({
      clearFlag: 1
    });

    // 记录运算符类型
    let opValue = e.currentTarget.dataset.value;
    // 设置运算符并显示结果
    this.setOperator(opValue);
  },

  // 按钮响应: = 输出运算结果
  handleEqualButtonTap(e) {
    this.data.num2 = parseFloat(this.data.inputValue);  // 保存第二个数值
    let result = 0.0;
    let op = parseInt(this.data.operatorCode, 10);

    // 根据运算符执行计算
    switch (op) {
      case 1:  // 加法
        result = this.data.num1 + this.data.num2;
        break;
      case 2:  // 减法
        result = this.data.num1 - this.data.num2;
        break;
      case 3:  // 乘法
        result = this.data.num1 * this.data.num2;
        break;
      case 4:  // 除法
        if (this.data.num2 !== 0) {
          result = this.data.num1 / this.data.num2;
        } else {
          wx.showToast({
            title: '除数不能为0',
            icon: 'none'
          });
          return;
        }
        break;
      case 5:  // 取余
        result = this.data.num1 % this.data.num2;
        break;
      default:
        wx.showToast({
          title: '无效操作符',
          icon: 'none'
        });
        break;
    }

    // 显示计算结果，并清空操作符和第二个数值
    let formattedResult = parseFloat(result.toFixed(4)); // 保留四位小数，并去掉多余的小数位

    this.setData({
      inputValue: formattedResult.toString(), // 转换为字符串
      num1:0.0,
      num2:0.0,
      clearFlag: 0
    });    
  },

  setOperator(op) {
    // 更新运算符状态
    this.setData({
      operatorCode : op
    }, () => {
      //这里的回调函数在 setData 完成后执行
    });
  },

  // 获取当前运算符
  getOperator() {
    return this.data.operatorCode;
  }
})