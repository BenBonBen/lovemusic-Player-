// 创建一个歌单数组存放歌单信息
let playList = []
let curRotate = 0
// 图片旋转
let style = ''
let currentTime = 0
let playTimer = null
let progressRate = 0
let playtype = 0 //存储播放方式，0是顺序播放，1是随机播放
//播放状态对象，里面包含curIndex（记录当前的歌曲下标），state（播放状态）
let playStatus = {
  curIndex: 0,
  state: 0 //0为停止播放  1为正在播放
}

$.ajax({
  url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', //请求的url地址
  dataType: 'jsonp', //返回格式为json
  async: true, //请求是否异步，默认为异步，这也是ajax重要特性
  type: 'get', //请求方式
  jsonp: 'jsonpCallback',
  success: function(req) {
    //请求成功时处理
    var myData = req.data
    console.log(myData)
    // 轮播
    handleSlide(myData)
    // 电台
    handledj(myData)
    //热门音乐
    hotmusic(myData)
  },
  error: function() {
    //请求出错处理
    console.log('cuowu')
  }
})

/*轮播图部分开始*/
// 获取轮播图
function handleSlide(mydata) {
  var $imgul = $('.imgul')
  var slidehtml = ''
  for (var i = 0; i < mydata.slider.length; i++) {
    slidehtml += `<li>
                        <a href="${mydata.slider[i].linkUrl}">
                            <img src="${mydata.slider[i].picUrl}">
                        </a>
                    </li>`
  }
  $imgul.html(slidehtml)
}
function slideimg() {
  var startPos = {} //开始位置
  var endPos = {} //结束位置
  var scrollDirection //滚动方向
  var timer //定时器，后面控制速度会使用
  var touch //记录触碰节点
  var index = 0 //记录滑动到第几张图片
  var ImgWidth //图片宽度
  var speed //滑动速度
  var target //目标
  var oImg = document.getElementById('imgul')
  var oCircle = document.getElementById('slide-list')
  var aCircle = oCircle.getElementsByTagName('li')

  function slide(index) {
    //先都去掉原点的active类名
    for (var i = 0; i < aCircle.length; i++) {
      aCircle[i].className = ''
    }
    //再单独给对应的小圆点加类名
    aCircle[index].className = 'active'
    //计算图片宽度
    // console.log(oImg.offsetWidth/5);
    ImgWidth = parseInt(oImg.offsetWidth / aCircle.length)
    //OImg是所有图片长，所以除以原点个数得到单个图片宽度
    target = -ImgWidth * index
    console.log(oImg.offsetLeft)
    timer = setInterval(function() {
      speed =
        speed > 0
          ? Math.ceil((target - oImg.offsetLeft) / 5)
          : Math.floor((target - oImg.offsetLeft) / 5)
      // console.log(oImg.offsetLeft);
      if (target == oImg.offsetLeft) {
        clearInterval(timer)
      } else {
        oImg.style.left = oImg.offsetLeft + speed + 'px'
      }
    }, 80)
  }
  oImg.ontouchstart = function(event) {
    touch = event.targetTouches[0] //取得第一个touch的坐标值
    startPos = { x: touch.pageX, y: touch.pageY }
    scrollDirection = 0
  }
  oImg.ontouchmove = function(event) {
    // alert('移动');
    // 如果有多个地方滑动，我们就不发生这个事件
    if (event.targetTouches.length > 1) {
      return
    }
    touch = event.targetTouches[0]
    endPos = { x: touch.pageX, y: touch.pageY }
    // 判断出滑动方向，向右为1，向左为-1
    scrollDirection = endPos.x - startPos.x > 0 ? 1 : -1
  }
  oImg.ontouchend = function() {
    if (scrollDirection == 1) {
      if (index >= 1 && index <= aCircle.length - 1) {
        index--
        slide(index)
      } else if (index <= 0) {
        index = aCircle.length - 1
        slide(index)
      } else {
        return
      }
    } else if (scrollDirection == -1) {
      if (index >= 0 && index <= aCircle.length - 2) {
        index++
        slide(index)
      } else if (index >= aCircle.length - 1) {
        index = 0
        slide(index)
      } else {
        return
      }
    }
  }
  for (var i = 0; i < aCircle.length; i++) {
    aCircle[i].index = i
    aCircle[i].onclick = function() {
      slide(this.index)
    }
  }
}
// 轮播图部分结束

// 电台部分开始
function handledj(radio_data) {
  var $radio = $('.radio_detail')
  var radiohtml = ''
  for (var i = 0; i < radio_data.radioList.length; i++) {
    radiohtml += `
            <a href="javascript:;">
              <img src="${radio_data.radioList[i].picUrl}" />
              <span>${radio_data.radioList[i].Ftitle}</span>
            </a>`
  }
  $radio.html(radiohtml)
}
//电台部分结束

function hotmusic(hotmusic_data) {
  var $hotmusic = $('.song_detail')
  var hmusichtml = ''
  for (var i = 0; i < hotmusic_data.songList.length; i++) {
    hmusichtml += `
            <a href="javascript:;">
              <img src="${hotmusic_data.songList[i].picUrl}" />
              <span class="accessnum">${hotmusic_data.songList[i].accessnum /
                1000}万</span>
              <span class="songListDesc">
              ${hotmusic_data.songList[i].songListDesc}
              </span>
              <span class="songListAuthor">${
                hotmusic_data.songList[i].songListAuthor
              }</span>
            </a>`
  }
  $hotmusic.html(hmusichtml)
}

window.onload = function() {
  slideimg()
}

//搜索部分开始
;(function() {
  //获取input框
  const searchInput = $('.searchmusic input')
  // 获取搜索按钮
  const searchBtn = $('.searchmusic span.icon-sousuo')
  // 获取显示歌单list
  const songList = $('.list')

  //绑定搜索框，按确认事件，按下确认执行搜索音乐函数
  searchInput.on('keydown', function(e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      searchMusic()
    }
  })
  // 绑定搜索按钮点击事件，点击执行搜索音乐函数
  searchBtn.on('click', function() {
    searchMusic()
  })

  function searchMusic() {
    // 获取Input框内的值
    const keyword = searchInput[0].value
    console.log(keyword)
    $.ajax({
      url: 'http://songsearch.kugou.com/song_search_v2', //请求的url地址
      dataType: 'jsonp', //返回格式为json
      async: true, //请求是否异步，默认为异步，这也是ajax重要特性
      data: {
        userid: parseInt(Math.random() * 100),
        clientver: '',
        platform: 'WebFilter',
        tag: 'em',
        filter: '2',
        iscorrection: '1',
        privilege_filter: 0,
        keyword: keyword,
        // pagesize: 10,
        page: 1
      }, //参数值
      type: 'GET', //请求方式
      success: function(rs) {
        const data = rs.data
        console.log(rs)
        for (let i = 0; i < data.lists.length; i++) {
          const str = data.lists[i].SingerName
          const nameStr = data.lists[i].SongName
          //数据中存在<em>歌名</em>的现象，所以要把em标签去掉
          if (str.indexOf('<em>') !== -1 && str.indexOf('<em>') !== '-1') {
            let formatStr =
              str.slice(0, str.indexOf('<em>')) +
              str.slice(str.indexOf('<em>') + 4, str.indexOf('</em>')) +
              str.slice(str.indexOf('</em>') + 5)
            data.lists[i].SingerName = formatStr
          } else if (
            nameStr.indexOf('<em>') !== -1 &&
            nameStr.indexOf('<em>') !== '-1'
          ) {
            let formatName =
              nameStr.slice(0, nameStr.indexOf('<em>')) +
              nameStr.slice(
                nameStr.indexOf('<em>') + 4,
                nameStr.lastIndexOf('</em>')
              ) +
              nameStr.slice(nameStr.indexOf('</em>') + 5)
            data.lists[i].SongName = formatName
          }
        }
        const html = template('searchResult', data)
        songList.html(html)
      },
      error: function(err) {
        //请求出错处理
        console.log(2)
        console.log(err)
      }
    })
  }
})()

//播放详情页面
//表示当前歌曲
let curSong = playList[playStatus.curIndex]
//媒体控制对象它下面有四个属性，
//分别是switchSong(切换歌曲) ，play(播放) ，pause(暂停) ，resetPlayStatus（重置播放状态）
let mediaControl = {
  //切歌
  switchSong: function(state) {
    // 0为上一首, 1为下一首
    if (state == 1) {
      if (playStatus.curIndex < playList.length - 1) {
        playStatus.curIndex++
      } else {
        playStatus.curIndex = 0
      }
      // alert(2);
    } else if (state == 3) {
      let tempIndex = playStatus.curIndex
      do {
        playStatus.curIndex = Math.floor(Math.random() * playList.length)
      } while (tempIndex == playStatus.curIndex)
      //随机播放
      console.log(playStatus.curIndex)
    } else {
      if (playStatus.curIndex > 0) {
        playStatus.curIndex--
      } else {
        playStatus.curIndex = playList.length - 1
      }
      console.log(playStatus.curIndex)
    }
    //设置此时的歌曲播放信息
    curSong = playList[playStatus.curIndex]
    //调用setPlayStatus方法设置播放信息
    setPlayStatus(
      curSong.albumPic,
      curSong.songTitle,
      curSong.singer,
      curSong.url,
      formatDurtion(curSong.timelength) //时间
    )
    // 每次切歌都要重置一次播放信息
    this.resetPlayStatus()
    setTimeout(() => {
      this.__play__()
    }, 500)
    console.log(this)
  },
  //播放
  __play__: function() {
    playStatus.state = 1
    $('.icon-play')
      .find('img')
      .attr('src', '../img/pause2.png')
    progressBar(1)
    styles = `
      @-webkit-keyframes spin {
      from {
        transform: ${curRotate};
      }
      to {
        transform: rotate(${360 + curRotate}deg);
      }
    }`
    $('#dynamic').html(styles)
    $('#detail_img').addClass('spinning')
    $('#music-link')[0].play()
  },
  //暂停
  __pause__: function() {
    playStatus.state = 0
    $('.icon-play')
      .find('img')
      .attr('src', '../img/play2.png')
    progressBar(0)
    curRotate = eval('get' + $('#detail_img').css('transform'))
    $('#detail_img')
      .removeClass('spinning')
      .css('transform', `rotate(${curRotate}deg)`)
    $('#music-link')[0].pause()
  },
  //重置播放状态
  resetPlayStatus: function() {
    currentTime = 0
    $('.cur-time').html('00:00')
    progressRate = 0
    $('.progressing').css('width', '0')
    curRotate = 0
    $('#detail_img')
      .removeClass('spinning')
      .css('transform', `rotate(${curRotate}deg)`)
    clearInterval(playTimer)
  },
  //拖动调整进度条
  adjust: function(e) {
    var bar = e.target
  }
}
//设置播放器状态
function setPlayStatus(pic, title, singer, url, time) {
  $('#detail_img').attr('src', pic) //attr() 方法设置或返回被选元素的属性值。
  $('#song_title').html(title)
  $('#singer_dtr').html(singer)
  $('#music-link').attr('src', url)
  $('.total-time').html(time)
}
//格式化时间，把毫秒单位的时间，转化为00：00
function formatDurtion(time) {
  function addZero(t) {
    return (t = t < 10 ? `0${t}` : `${t}`)
  }
  const min = addZero(Math.floor(time / 1000 / 60)) //math.floor(x)返回小于等于x的最大整数
  const sec = addZero(Math.floor(time / 1000) - min * 60)
  return `${min}:${sec}`
}
//点击下部播放栏
$('#song_img,#singer,#song').on('click', function(e) {
  var musicmsg = {
    singer: $('#singer').html(),
    SongName: $('#song').html(),
    imgurl: $('#imgurl')[0].src,
    musicurl: $('#music')[0].src
  }
  $('.list').css('display', 'none')
  $('.nav').css('display', 'none')
  $('.content').css('display', 'none')
  $('.playMusic').css('display', 'none')
  $('.searchmusic').css('display', 'none')
  $('#player-interface').css('display', 'block')
  $('#music')[0].pause()
  // 传递播放详情页面数据
  handleMusic(musicmsg)
})
// 同步底部播放信息到播放详情页
function handleMusic(musicmsg) {
  $('#detail_img').attr('src', musicmsg.imgurl)
  $('#song_title').html(musicmsg.SongName)
  $('#singer_dt').html(musicmsg.singer)
  $('#music-link').attr('src', musicmsg.musicurl)
  console.log(musicmsg.SongName)
}

//点击搜索页面
$('#search').on('click', function(e) {
  $('.nav').css('display', 'none')
  $('.content').css('display', 'none')
  $('.player-interface').css('display', 'none')
  $('.searchmusic').css('display', 'block')
  $('.list').css('display', 'block')
  $('.playMusic').css('display', 'block')
})

//点击搜索列表歌曲
function playMusic(hash, album_id) {
  $.ajax({
    url:
      'http://www.kugou.com/yy/index.php?r=play/getdata&_=1497972864535&hash=',
    dataType: 'jsonp', //返回格式为json
    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
    data: {
      hash: hash,
      album_id: album_id
    }, //参数值
    type: 'GET', //请求方式
    success: function(req) {
      //请求成功时处理
      var datas = req.data
      console.log(req)
      //更新底部播放栏歌曲信息,同时把歌曲信息放进一个歌单数组
      resetmusic(datas)
      //把歌单渲染出来
      show_Musiclist()
    },
    error: function() {
      //请求出错处理
    }
  })
}

// 更新底部歌曲信息函数
function resetmusic(datas) {
  $('#imgurl').attr('src', datas.img)
  $('#singer').html(datas.author_name)
  $('#song').html(datas.audio_name)
  $('#music').attr('src', datas.play_url)
  //添加自动播放属性
  $('#music').attr('autoplay', 'autoplay')
  $('#playbtn')
    .removeClass('playBtn')
    .addClass('pausing')

  // 点击一次存一次这首歌的信息进数组中
  playList.push({
    songTitle: datas.audio_name,
    singer: datas.author_name,
    albumPic: datas.img,
    url: datas.play_url,
    timelength: datas.timelength
  })

  console.log(playList)
}

//控制进度条方法
function progressBar(state) {
  if (state) {
    playTimer = setInterval(() => {
      currentTime += 1000
      $('.cur-time').html(formatDurtion(currentTime))
      progressRate = (currentTime / curSong.timelength) * 100
      $('.progressing').css('width', `${progressRate}%`)
      if (currentTime >= Math.floor(curSong.timelength / 1000) * 1000) {
        if (playtype == 0) {
          mediaControl.__pause__()
          mediaControl.switchSong(1)
        } else {
          mediaControl.__pause__()
          mediaControl.switchSong(3)
        }
      }
    }, 1000)
  } else {
    clearInterval(playTimer)
  }
}

//添加播放按钮点击的监听
$('.icon-play').on('click', function() {
  if (!playStatus.state) {
    mediaControl.__play__()
  } else {
    mediaControl.__pause__()
  }
})

//添加下一首按钮点击的监听
$('.icon-next').on('click', function() {
  if (playtype == 0) {
    mediaControl.switchSong(1)
  } else {
    mediaControl.switchSong(3)
  }
})

//添加上一首按钮点击的监听
$('.icon-prev').click(function() {
  if (playtype == 0) {
    mediaControl.switchSong(0)
  } else {
    mediaControl.switchSong(3)
  }
})

//添加随机播放与顺序播放切换的监听
$('.playstyles').click(function() {
  // console.log(e.target);
  if ($('.randomPlay').css('display') == 'none') {
    $('.randomPlay').removeClass('current')
    $('.orderPlay').addClass('current')
    playtype = 1 //1是随机播放
  } else {
    $('.orderPlay').removeClass('current')
    $('.randomPlay').addClass('current')
    playtype = 0 //0是顺序播放
  }
})

// 底部播放按钮控制歌曲播放
$('#playbtn').on('click', function() {
  if ($('#playbtn').hasClass('pausing')) {
    $('#playbtn')
      .removeClass('pausing')
      .addClass('playBtn')
    $('#music')[0].pause()
  } else if ($('#playbtn').hasClass('playBtn')) {
    $('#playbtn')
      .removeClass('playBtn')
      .addClass('pausing')
    $('#music')[0].play()
  }
})

//点击底部播放列表
$('#playList').on('click', function() {
  console.log($('.MusicList').css('right'))
  if ($('.MusicList').css('right') === '0px') {
    $('.MusicList').animate({
      right: '-40%'
    })
  } else {
    $('.MusicList').animate({
      right: 0
    })
  }
})

//把点击的歌曲渲染出列表方法
function show_Musiclist() {
  let Music_list = ''
  for (let i = 0; i < playList.length; i++) {
    Music_list += '<li>' + playList[i].songTitle + '</li>'
  }
  $('#MusicList')
    .find('ul')
    .html(Music_list)
}
