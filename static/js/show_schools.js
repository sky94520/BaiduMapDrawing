//获取侧边栏宽度 默认隐藏
let sidebar_width;
$(document).ready(function () {
    document.getElementById("allmap").style.height = document.body.clientHeight + "px";
    sidebar_width = (document.body.clientWidth )/ 2;
    sidebar_width = sidebar_width > 300?sidebar_width:300;
    document.getElementById("show_sidebar").style.width = sidebar_width + "px";
    hide_sidebar(sidebar_width);
});

$("#arrow").on("click", function (e) {
    if($(this).hasClass("show")){
        hide_sidebar(sidebar_width);
    }else{
        show_sidebar();
    }
});

function hide_sidebar(sidebar_width) {
    $("#arrow").removeClass("show");
    document.getElementById("show_sidebar").style.right = `-${sidebar_width}px`;
}

function show_sidebar() {
    $("#arrow").addClass("show");
    document.getElementById("show_sidebar").style.right = 0;
}

/**
 * 获取选中的点的数据 可重写
 * @param selected_data
 */
function overlayComplete(selected_data){
    let html = [];
    selected_data.forEach(function (value, i) {
        let index = i+1;
        let row_data = `
            <tr>
                <td>${index}</td>
                <td class="cursor-pointer" title="${value["name"]}">${value["name"]}</td>
            </tr>
        `;
        html.push(row_data);
    });
    let innerString = html.join("");
    $("#show_info_table").html(innerString);
    //打开侧边栏
    show_sidebar();
}
