/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-01-17 21:28:14
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-01-17 21:48:56
 * @FilePath: \AIdoes\script.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 颜色数组
const colors = [
    'rgba(255,0,0,0.8)',
    'rgba(255,69,0,0.8)',
    'rgba(255,165,0,0.8)',
    'rgba(255,215,0,0.8)',
    'rgba(0,128,0,0.8)',
    'rgba(0,255,255,0.8)',
    'rgba(0,0,255,0.8)',
    'rgba(128,0,128,0.8)',
    'rgba(255,192,203,0.8)'
];
// 算法文本数组
const algorithms = ['贪心', '模拟', '枚举', '搜索', '二分', '动态规划', '倍增', '构造'];

let colorIndex = 0;

function getNextColor() {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
}

$(document).ready(function() {
    // 初始化第一个颜色
    document.documentElement.style.setProperty('--trail-color', colors[0]);

    // 点击显示算法文本
    $(document).click(function(event) {
        const algorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
        const $text = $('<div>').addClass('algorithm-text')
            .css({
                'left': event.pageX + 10,
                'top': event.pageY - 10,
                'color': colors[Math.floor(Math.random() * colors.length)]
            })
            .text(algorithm);
        $('body').append($text);
        
        // 动画结束后移除元素
        $text.on('animationend', function() {
            $(this).remove();
        });
    });

    // 鼠标轨迹效果
    $(document).mousemove(function(event) {
        const nextColor = getNextColor();
        document.documentElement.style.setProperty('--trail-color', nextColor);
        
        const $trail = $('<div>').addClass('trail')
            .css({
                'left': event.pageX - 5,
                'top': event.pageY - 5
            });
        $('body').append($trail);
        
        // 动画结束后移除元素
        $trail.on('animationend', function() {
            $(this).remove();
        });
    });

    // 从JSON文件加载获奖数据
    $.getJSON('awards.json', function(awards) {
        // 渲染获奖记录
        function renderAwards() {
            const $awardsList = $('#awards-list');
            $awardsList.empty();
            
            awards.forEach(award => {
                const awardHtml = `
                    <div class="award-item">
                        <h3>${award.title}</h3>
                        <p><strong>获奖日期：</strong>${award.date}</p>
                        <p>${award.description}</p>
                    </div>
                `;
                $awardsList.append(awardHtml);
            });
        }

        // 初始化
        renderAwards();
    }).fail(function() {
        $('#awards-list').html('<p>无法加载获奖数据</p>');
    });
});
