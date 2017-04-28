/**
 * Created by TR0000009 on 2017/4/1.
 */
/**
 * @param [el]{String|Element}
 * @param [options]{Object}
 * @constructor
 *      方向键 + 鼠标 控制
 *      size:number;  每个方块边长
 *      color:array/length=6; 包含六个面的颜色字符串的数组;
 *      innerColor:string; 魔方内部颜色;
 *      radius:string; 圆角弧度;
 *      borderWidth:number; 边框宽度
 *      borderColor:string; 边框颜色;
 *      transitionTime:number; 过渡时间
 */
function MagicCube(el,options) {
    this._options = options ? options : {}
    if(el){
        if(el.nodeType == 1){
            this.wrapper = el
        }else if(typeof el === 'string'){
            this.wrapper = document.querySelector(el)
        }
    }else{
        this.wrapper = document.createElement('div')
        document.body.appendChild(this.wrapper)
    }
    this.isRun = false
    this.isRe = false
    this.isFirst = false
    this.wrapper.className = 'cubeWrapper'
    this._stepArr = []
    this.init() // 初始化
}
MagicCube.prototype={
    init : function () {
        this.dataInit()    //初始化数据
        this.setCube()   // 创建方格
        this.setStyle()   // 初始化样式
        this.colorInit()   //初始化颜色
        this.keyControl()  // 键盘控制
        this.mouseControl() // 鼠标控制
    },
    dataInit:function(){
        this._options.size = this._options.size ? this._options.size : 100
        if(!Array.isArray(this._options.color)||this._options.color.length !==6){
            this._options.color = this._options.color ? this._options.color :['aqua','antiquewhite','greenyellow','mediumvioletred','skyblue','fuchsia']
        }
        this._options.innerColor = this._options.innerColor?this._options.innerColor :'#555038'
        this._options.radius = this._options.radius ?this._options.radius:'10%'
        this._options.borderWidth = this._options.borderWidth ? this._options.borderWidth : 2
        this._options.borderColor = this._options.borderColor ? this._options.borderColor : "#443F2A"
        this._options.transitionTime = this._options.transitionTime ?this._options.transitionTime:.5
    },
    setCube : function () {
        var wrapper = this.wrapper
        for(var j = 0;j < 27; j ++) {
            var cell = document.createElement("div")
            cell.classList.add("cell")
            for (var i = 1; i <= 6; i++) {
                var face = document.createElement("div")
                face.classList.add("face" + i )
                cell.appendChild(face)
                face.loc = {
                    X:j %3,
                    Y:Math.floor((j %9)/3),
                    Z:Math.floor(j/9),
                    f:i
                }
                this.colorWather(face)
            }
            cell.X = j %3
            cell.Y = Math.floor((j %9)/3)
            cell.Z = Math.floor(j/9)
            cell.classList.add("x"+cell.X)
            cell.classList.add("y"+cell.Y)
            cell.classList.add("z"+cell.Z)
            cell.style.transformOrigin =( -100*cell.X+150)+"px "+(-100*cell.Y+150)+"px "+(100*cell.Z-150)+"px"
            cell.style.left = 100*cell.X+"px"
            cell.style.top =cell.Y*100+"px"
            cell.style.transform = "translateZ("+-cell.Z*100 +"px) "
            wrapper.appendChild(cell)
        }
    },
    setStyle : function () {
        const styleNode = document.createElement('style')
        var origin =  this._options.size*3/2
        var text = ".cell{  transform-style: preserve-3d;  position: absolute;  } .face2{transform:translateY(-100px) rotatex(90deg);transform-origin:bottom;}  .face3{ transform:translateX(100px)  rotateY(90deg);  transform-origin:left;  }  .face4{ transform-origin:top;  transform:translateY(100px)  rotateX(-90deg);  }  .face5{ transform-origin:right;  transform:translateX(-100px) rotatey(-90deg);  }  .face6{ transform:translatez(-100px) rotatex(180deg) ;  }"
            + ".cubeWrapper{  position: relative;  transform-style: preserve-3d;  transform-origin:"+ origin +"px  "+origin+"px -"+origin+"px;  margin: 200px auto;  width: 0;  left:-"+origin+"px;  transform: rotateX(-10deg) rotateY(-40deg);  }"
            +" .cell div{box-sizing: border-box; position:absolute;  height: "+ this._options.size+"px;  width: "+ this._options.size+"px;" +
            "  border-radius: "+this._options.radius+";  top:0;  left: 0;  border:"+this._options.borderWidth+"px solid "+this._options.borderColor+"; }"
        styleNode.innerHTML = text
        document.head.appendChild(styleNode)
    },
    colorWather:function (el) {
        var val = -1      // 内部颜色默认标识
        var me = this
        el.style.backgroundColor = this._options.innerColor  //内部颜色
        Object.defineProperty(el,'COLOR',{
            get:function () {
                return val
            },
            set:function (newVal) {  //监视COLOR，改变颜色
                val = newVal
                el.style.backgroundColor = val >=0 ? me._options.color[val] : me._options.innerColor
//                    el.innerHTML = 'x'+el.parentNode.X +',y'+ el.parentNode.Y+',z'+el.parentNode.Z +',f'+el.loc.f + '【'+el.COLOR+'】';
            }
        })
    },
    colorInit:function(){  //初始化6个面颜色
        Array.prototype.slice.call(document.querySelectorAll('.z0 .face1')).forEach(function (item) {
            item.COLOR = 0
        })
        Array.prototype.slice.call(document.querySelectorAll('.y0 .face2')).forEach(function (item) {
            item.COLOR = 1
        })
        Array.prototype.slice.call(document.querySelectorAll('.x2 .face3')).forEach(function (item) {
            item.COLOR = 2
        })
        Array.prototype.slice.call(document.querySelectorAll('.y2 .face4')).forEach(function (item) {
            item.COLOR = 3
        })
        Array.prototype.slice.call(document.querySelectorAll('.x0 .face5')).forEach(function (item) {
            item.COLOR = 4
        })
        Array.prototype.slice.call(document.querySelectorAll('.z2 .face6')).forEach(function (item) {
            item.COLOR = 5
        })
    },
    keyControl:function () {
        var m = -40, n = -10
        var me = this
        document.onkeydown = function(event){
            event = event || window.event
            switch (event.keyCode){
                case  37:
                    m-=5
                    break
                case 38:
                    n+=5
                    break
                case 39:
                    m+=5
                    break
                case 40:
                    n-=5
                    break
                default  :
            }
            me.wrapper.style.transform = "rotateX("+n+"deg) rotateY("+m+"deg)"
        }
    },
    mouseControl:function () {
        var me = this
        this.wrapper.onmousedown = function(e){
            e = e || event;
            console.log(me.isRun)
            if(me.isRun||me.isRe){
                return
            }
            console.log('执行了')
            if(e.target.COLOR<0){
                return
            }
            var startBlock = e.target
            var className =''                                           // 可能旋转的格子name，提示作用
            var elseC = ''                                                  // 点击正面name,用来排除正面旋转的可能
            var moveCells = null                                      // 存放旋转的格子
            var direct = 0                                                 // 旋转方向
            var mcName = ''                                            // 旋转层name
            switch (startBlock.loc.f){  //找到有可能动的块的className
                case 6://z
                    className =  '.x'+startBlock.parentNode.X +',.y'+ startBlock.parentNode.Y;
                    elseC = 'Z'
                    break;
                case 5://x
                    className =  '.y'+startBlock.parentNode.Y +',.z'+ startBlock.parentNode.Z;
                    elseC = 'X'
                    break;
                case 4://y
                    className =  '.x'+startBlock.parentNode.X +',.z'+ startBlock.parentNode.Z;
                    elseC = 'Y'
                    break;
                case 3://x
                    className =  '.y'+startBlock.parentNode.Y +',.z'+ startBlock.parentNode.Z;
                    elseC = 'X'
                    break;
                case 2://y
                    className =  '.x'+startBlock.parentNode.X +',.z'+ startBlock.parentNode.Z;
                    elseC = 'Y'
                    break;
                case 1://z
                    className =  '.x'+startBlock.parentNode.X +',.y'+ startBlock.parentNode.Y;
                    elseC = 'Z'
                    break;
                default:
            }
            Array.prototype.slice.call(document.querySelectorAll(className)).forEach(function (item) {
                Array.prototype.slice.call(item.children).forEach(function (div) {
                    div.style.boxShadow = "#fff 0px 0px 10px 4px,black 0px 0px 5px 5px,blue 0px 0px 5px 5px";
                })
            })
            me.wrapper.onmousemove = function (e) {
                e = e || event;
                var moveBlock = e.target
                if(moveBlock !== startBlock){
                    Array.prototype.slice.call(me.wrapper.querySelectorAll('[class^=face]')).forEach(function (face) {
                        face.style.boxShadow = ''
                    })
                    mcName = choose(elseC)
                    moveCells = document.querySelectorAll('.cell'+mcName)
                    Array.prototype.slice.call(moveCells).forEach(function (item) {
                        Array.prototype.slice.call(item.children).forEach(function (div) {
                            div.style.boxShadow = "#fff 0px 0px 10px 4px,black 0px 0px 5px 5px,blue 0px 0px 5px 5px";
                        })
                    })

                    function choose(elseC) {
                        var str = 'XYZ'.replace(elseC,'')
                        var A = str[0],B =str[1]
                        if(startBlock.loc[A] === moveBlock.loc[A] ){
                            direct = startBlock.loc[B] - moveBlock.loc[B]
                            return '.'+A.toLocaleLowerCase()+moveBlock.loc[A]
                        }
                        if(startBlock.loc[B]=== moveBlock.loc[B]){
                            direct = startBlock.loc[A]  -  moveBlock.loc[A]
                            return '.'+B.toLocaleLowerCase()+moveBlock.loc[B]
                        }
                    }
                }
            }
            document.onmouseup = function (e) {
                e = e || event
                Array.prototype.slice.call(me.wrapper.querySelectorAll('div')).forEach(function (face) {
                    face.style.boxShadow = ''
                })
                me.wrapper.onmousemove = document.onmouseup = null
                if(direct){
                    if(!e.target.loc || e.target.loc.f !== startBlock.loc.f){
                        return
                    }
                    var roller = /[a-z]/.exec(mcName)[0] //获得转动轴
                    direct = direct>0?1:direct<0?-1:0
                    if(e.target.loc.f === 4 ||e.target.loc.f ===5||e.target.loc.f ===6 ){          //方向修正为 视角上的顺逆时针
                        direct = -direct
                    }
                    if(roller==='x'&&(e.target.loc.f ===1||e.target.loc.f ===6)){
                        direct = -direct
                    }
                    if(mcName){
                        me._stepArr.push({mcName:mcName,direct:direct})
                        me.step(mcName,direct,moveCells,roller)
                    }
                }
            }
            return false
        }
    },
    step : function(mcName,direct,moveCells,roller) {
        var me = this
        var colorChange = me.colorChange.bind(me)
        if(!moveCells){
            moveCells = document.querySelectorAll('.cell'+mcName)
        }
        if(!roller){
            roller = /[a-z]/.exec(mcName)[0]
        }
        var mArr = me.getArr(moveCells,roller,me)  // 获取旋转表面的数组
        var arr = mArr[0]  // 侧面
        var arr2 = mArr[1] // 整体面'
        Array.prototype.slice.call(moveCells).forEach(function (item) {
            var text = item.style.transform
            me.isRun = true
            item.style.transition = "transform "+me._options.transitionTime+"s linear";
            item.style.transform = text +'rotate'+roller+'('+-direct*90+'deg)'
            item.addEventListener('transitionend',end)
            function end() {
                me.isRun = false
                this.style.transition = ''
                if(colorChange){
                    //确保只执行一次
                    colorChange(arr,direct,arr2)
                    colorChange = null
                }
                this.style.transform = text   //位置返回原状态
                this.removeEventListener('transitionend',end) //每次执行完后解绑
            }
        })
    },
    colorChange: function (arr,direct,arr2) {
        var a = []
        var b = [[],[],[]]
        var me  = this
        arr.forEach(function (item) {
            a.push(item.COLOR)
        })
        if(arr2){
            for(var q =0;q<3;q++){
                for(var p = 0;p<3;p++){
                    b[q][p] = arr2[p+q*3].COLOR
                }
            }
            if(direct < 0){
                b = me.clockwise(b)
            }else{
                b = me.anticlockwise(b)
            }
            b = flatten(b)
            arr2.forEach(function (item,index) {
                item.COLOR = b[index]
            })

            function flatten(arr) {
                return arr.reduce(function(acc, val) {
                    return acc.concat(Array.isArray(val) ? flatten(val) : val)
                }, [])
            }

        }
        for(var i = 0;i<3;i++){
            if(direct<0){
                var last = a.pop()
                a.unshift(last)
            }else{
                var first = a.shift()
                a.push(first)
            }
        }
        arr.forEach(function (item,index) {
            item.COLOR = a[index]
        })
    },
    clockwise : function (matrix) {//3X3数组 顺时针旋转
        var result =[[],[],[]]
        for(var i=0;i<matrix.length;i++){
            for(var j=0;j<matrix[i].length;j++){
                var n = (i+matrix.length-1)>matrix.length-1?(i+matrix.length-1)%(matrix.length-1) :(i+matrix.length-1)
                result[j][n] = matrix[i][j]
            }
        }
        return result
    },
    anticlockwise : function (matrix) { // 逆时针
        var result =[[],[],[]]
        for(var i=0;i<matrix.length;i++){
            for(var j=0;j<matrix[i].length;j++){
                result[(matrix.length-1)-j][i] = matrix[i][j]
            }
        }
        return result
    },
    max:function (arr,str) {
        /*
         * arr:查找数组
         * str :查找属性名
         * 返回出现次数最多的属性值
         * */
        var obj = {}
        arr.forEach(function (item) {
            if(!obj[item[str]]){
                obj[item[str]] = 1
            }else{
                obj[item[str]] += 1
            }
        })
        var val = 0
        var mm = ''
        for(var key in obj){
            if(obj[key] > val){
                mm = key
            }
            val = obj[key]
        }
        return mm
    },
    getArr:function (moveCells,roller,cube) { // 获得正确顺序的面的数组
        /*
         * moveCells：旋转的块
         * roller： 旋转轴
         * 返回排完序的面的数组
         * */
        var KEYS = ['X','Y','Z']
        KEYS.forEach(function (item,index) {
            if(item == roller.toLocaleUpperCase()){
                KEYS.splice(index,1)
            }
        })
        var arr = []
        Array.prototype.slice.call(moveCells).forEach(function (item) {
            Array.prototype.slice.call(item.children).forEach(function (face) {
                if (face.COLOR >= 0) {
                    arr.push(face)
                }
            })
        })
        arr.sort(function (a,b) {
            return +(a.className > b.className) || +(a.className === b.className)-1
        })
        if(arr.length>12){ // 旋转不为中间层的情况
            var name = cube.max(arr,"className") //获取整体旋转的面的className
            var arr2 = []
            for(var i = 0;i<arr.length;i++){
                if(arr[i].className === name){
                    arr2.push(arr[i])
                    arr.splice(i,1)
                    i--
                }
            }
            arr2.sort(function (a,b) {
                if(roller == 'x'){
                    return a.loc[KEYS[1]] < b.loc[KEYS[1]]
                }else{
                    return a.loc[KEYS[1]] > b.loc[KEYS[1]]
                }
            }).sort(function (a,b) {
                if(a.loc[KEYS[1]] === b.loc[KEYS[1]]){
                    return a.loc[KEYS[0]] > b.loc[KEYS[0]]
                }
            })

        }
        arr = sortA(arr,KEYS)
        function sortA(arr,KEYS) {
            var a0 = arr.slice(0,3)
            var a1 = arr.slice(3,6)
            var a2 = arr.slice(6,9)
            var a3 = arr.slice(9,12)
            a0.sort(function (a,b) {
                if(roller == 'x'){
                    return a.loc[KEYS[0]] < b.loc[KEYS[0]]
                }else {
                    return a.loc[KEYS[0]] > b.loc[KEYS[0]]
                }
            })
            a1.sort(function (a,b) {
                return a.loc[KEYS[1]] > b.loc[KEYS[1]]
            })
            a2.sort(function (a,b) {
                if(roller == 'y'||roller == 'x'){
                    return a.loc[KEYS[1]] < b.loc[KEYS[1]]
                }else{
                    return a.loc[KEYS[0]] < b.loc[KEYS[0]]
                }
            })
            a3.sort(function (a,b) {
                if(roller == 'y'){
                    return a.loc[KEYS[0]] < b.loc[KEYS[0]]
                }else if(roller == 'x'){
                    return a.loc[KEYS[0]] > b.loc[KEYS[0]]
                }else{
                    return a.loc[KEYS[1]] < b.loc[KEYS[1]]
                }
            })
            if(roller == 'y'||roller == 'x'){
                return a0.concat(a1).concat(a3).concat(a2)
            }else {
                return a0.concat(a1).concat(a2).concat(a3)
            }
        }
        return [arr,arr2]
    },
    restoration:function () {
        if(this.isFirst){
            return
        }
        this.isFirst = true
        var me = this
        re()
        function re() {
            if(me._stepArr.length<=0){
                me.isRe = false
                me.isFirst = false
                return
            }
            me.isRe = true
            var lastSetp = me._stepArr.pop()
            me.step(lastSetp.mcName,-lastSetp.direct)
            setTimeout(re,800)
        }
    }
}