#这是一个魔方

 * @param [el]{String|Element}
 * @param [options]{Object}
 *      方向键 + 鼠标 控制
 *      size:number;  每个方块边长
 *      color:array/length=6; 包含六个面的颜色字符串的数组;
 *      innerColor:string; 魔方内部颜色;
 *      radius:string; 圆角弧度;
 *      borderWidth:number; 边框宽度
 *      borderColor:string; 边框颜色;
 *      transitionTime:number; 过渡时间



 #实例方法：
### step(mcName,direction) 转动一步
        mcName:转动块的类名  e.g. "x1" 、 "y2"
        direction:+1或-1 顺时针逆时针
###restoration() 复位
