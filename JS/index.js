$.ajax({
  url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', //请求的url地址
  dataType: 'jsonp', //返回格式为json
  async: true, //请求是否异步，默认为异步，这也是ajax重要特性
  type: 'get', //请求方式
  jsonp: 'jsonpCallback',
  success: function(req) {
    //请求成功时处理
    var myData = req.data;
    console.log(myData);
    handleSlide(myData);
  },
  error: function() {
    //请求出错处理
    console.log('cuowu');
  }
});

/*轮播图部分开始*/
// 获取轮播图
function handleSlide(mydata) {
  var $imgul = $('.imgul');
  var slidehtml = '';
  for (var i = 0; i < mydata.slider.length; i++) {
    slidehtml += `<li>
                        <a href="${mydata.slider[i].linkUrl}">
                            <img src="${mydata.slider[i].picUrl}">
                        </a>
                    </li>`;
  }
  $imgul.html(slidehtml);
}
function slideimg() {
  var startPos = {}; //开始位置
  var endPos = {}; //结束位置
  var scrollDirection; //滚动方向
  var timer; //定时器，后面控制速度会使用
  var touch; //记录触碰节点
  var index = 0; //记录滑动到第几张图片
  var ImgWidth; //图片宽度
  var speed; //滑动速度
  var target; //目标
  var oImg = document.getElementById('imgul');
  var oCircle = document.getElementById('slide-list');
  var aCircle = oCircle.getElementsByTagName('li');

  function slide (index) {
    //先都去掉原点的active类名
    for (var i = 0; i < aCircle.length; i++) {
      aCircle[i].className = '';
    }
    //再单独给对应的小圆点加类名
    aCircle[index].className = 'active';
    //计算图片宽度
    // console.log(oImg.offsetWidth/5);
    ImgWidth = parseInt(oImg.offsetWidth / aCircle.length);
    //OImg是所有图片长，所以除以原点个数得到单个图片宽度
    target = -ImgWidth * index;
    console.log(oImg.offsetLeft);
    timer = setInterval(function() {
      speed =
        speed > 0
          ? Math.ceil((target - oImg.offsetLeft) / 5)
          : Math.floor((target - oImg.offsetLeft) / 5);
      // console.log(oImg.offsetLeft);
      if (target == oImg.offsetLeft) {
        clearInterval(timer);
      } else {
        oImg.style.left = oImg.offsetLeft + speed + 'px';
      }
    }, 80);
  }
  oImg.ontouchstart = function(event) {
    touch = event.targetTouches[0]; //取得第一个touch的坐标值
    startPos = { x: touch.pageX, y: touch.pageY };
    scrollDirection = 0;
  };
  oImg.ontouchmove = function(event) {
    // alert('移动');
    // 如果有多个地方滑动，我们就不发生这个事件
    if (event.targetTouches.length > 1) {
      return;
    }
    touch = event.targetTouches[0];
    endPos = { x: touch.pageX, y: touch.pageY };
    // 判断出滑动方向，向右为1，向左为-1
    scrollDirection = endPos.x - startPos.x > 0 ? 1 : -1;
  };
  oImg.ontouchend = function() {
    if (scrollDirection == 1) {
      if (index >= 1 && index <= aCircle.length - 1) {
        index--;
        slide(index);
      } else if(index <= 0){
        index = aCircle.length - 1;
        slide(index);
      } else {
        return;
      }
    } else if (scrollDirection == -1) {
      if (index >= 0 && index <= aCircle.length - 2) {
        index++;
        slide(index);
      } else if(index >= aCircle.length - 1){
        index = 0;
        slide(index);
      } else {
        return;
      }
    }
  };
  for (var i = 0; i < aCircle.length; i++) {
    aCircle[i].index = i;
    aCircle[i].onclick = function() {
      slide(this.index);
    };
  }
}
window.onload = function () {
  slideimg();
};
