SCHOOL_DATA = [];
// 百度地图API功能
var map = new BMap.Map("allmap");
var point = new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 6);
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
map.setMapStyleV2({
    styleId: 'c14586afadb04dad70f10f9439238315'
});
//添加覆盖物 增加点
function add_overlay(data){
    SCHOOL_DATA = data;
    let images = [
        {'url':"http://api.map.baidu.com/images/marker_red_sprite.png", "size": new BMap.Size(39, 25), "offset": new BMap.Size(23, 10)}, //red
        {'url':"http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m0.png", "size": new BMap.Size(53, 52),"offset": new BMap.Size(12, 10)}, //m0
        {'url':"http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m1.png", "size": new BMap.Size(56, 55),"offset": new BMap.Size(12, 10)}, //m1
        {'url':"http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m2.png", "size": new BMap.Size(66, 65),"offset": new BMap.Size(12, 10)}, //m2
        {'url':"http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m3.png", "size": new BMap.Size(78, 77),"offset": new BMap.Size(12, 10)}, //m3
    ];
    let markers = [];
    for (let i = 0;i < data.length;i++)
    {
        let datum = data[i];
        let point = new BMap.Point(datum.lng, datum.lat);
        //添加marker
        let index = 0;
        let image = images[index];
        let myIcon=new BMap.Icon(image.url,image.size);
        let marker = new BMap.Marker(point, {icon: myIcon});
        marker.setTitle(datum.name);
        //点聚合
        markers.push(marker);
        //map.addOverlay(marker);
    }
    var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
}
$.ajax({
    url: SCHOOL_LOCATION_URL,
    dataType: "json",
    success: function (json_data) {
        if (!json_data.status) {
            toggle_alert(false, json_data.msg);
            return false;
        }
        //TODO: 移动，使得位置正确
        //TODO:其他做法：https://blog.csdn.net/Beam007/article/details/94390235?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase
        var new_point = new BMap.Point(121.010960626739, 31.3794931441043);
        map.panTo(new_point);
        add_overlay(json_data.data);
    },
    error: function (error) {
        toggle_alert(false, error)
    }
})

//--------------------鼠标绘制工具---------------------------
var styleOptions = {
    strokeColor:"red",    //边线颜色。
    fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
//实例化鼠标绘制工具
var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: true, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_LEFT, //位置
        offset: new BMap.Size(5, 5), //偏离值
        drawingModes : [
            BMAP_DRAWING_RECTANGLE
        ]
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});
 //添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', function (e) {
    drawingManager.close();      //关闭画图

    let selected = [];
    SCHOOL_DATA.forEach(function(value) {
        let lng = parseFloat(value["lng"]);
        let lat = parseFloat(value["lat"]);
        let point = new BMap.Point(lng, lat);
        if(BMapLib.GeoUtils.isPointInPolygon(point, e.overlay)) {
            selected.push(value);
        }
    });
    // 圈定区域后的操作, 可重写
    map.removeOverlay(e.overlay);	//画完后清除所画对象
    overlayComplete(selected);
});

/**
 * 获取选中的点的数据 可重写
 * @param selected_data
 */
/*
function overlayComplete(selected_data){
    console.log(selected_data);
}
*/
