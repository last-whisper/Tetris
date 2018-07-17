window.onload = function () {
    document.onselectstart = function () {
        return false;
    }
    document.body.style.height = window.innerHeight + 'px';

    function Shapes(screen, prevBox, leftBtn, rightBtn, rotateBtn, pauseBtn, quickBtn, speedLevel) {
        this.boxWarpper = document.getElementById(screen);//屏幕
        this.prevBox = document.getElementById(prevBox);//预览
        this.container = null;//方块
        this.leftBtn = document.querySelector(leftBtn);
        this.rightBtn = document.querySelector(rightBtn);
        this.rotateBtn = document.querySelector(rotateBtn);
        this.pauseBtn = document.querySelector(pauseBtn);
        this.quickBtn = document.querySelector(quickBtn);
        this.timer = null;//方块下移定时器
        this.speedLevel = speedLevel || 500//游戏速度,默认500ms
        this.onoff = false //游戏是否运行中？
        this.fasterSpeed = this.speedLevel;//加速下降的参数
        this.nextShape = this.createNum(6);//下一个方块的形状
        this.nextColor = this.createNum(6);//下一个方块的颜色
        this.color = [[], ['rgb(0, 241, 44)','rgb(141, 255, 150)'], ['rgb(83, 48, 177)', 'rgb(255, 108, 230)'],
            ['rgb(28, 73, 202)', 'rgb(82, 182, 255)'], ['rgb(255, 87, 110)', 'rgb(255, 186, 186)'],
            ['#fc3a98', '#f1c4e8'], ['#de8d6f', '#f5ccb6']]
    }

    //初始化
    Shapes.prototype.init = function () {
        var This = this;
        this.container = this.createShape();
        this.boxWarpper.appendChild(this.container);
        this.moveBox(this.speedLevel);

        //事件
        this.leftBtn.onclick = function () {
            This.removeBox(this.dataset.type)
        }
        this.rightBtn.onclick = function () {
            This.removeBox(this.dataset.type)
        }
        this.rotateBtn.onclick = function () {
            This.rotateBox()
        }
        this.pauseBtn.onclick = function () {
            This.onoff ? this.innerHTML = 'begin' : this.innerHTML = 'stop';
            This.pause()
        }
        this.quickBtn.onclick = function () {
            This.quickDown()
        }

    }


    //加工并出厂方块
    Shapes.prototype.createShape = function () {
        this.prevBox.innerHTML = '' //先清除预览窗口的方块
        var Box = this.createElements();//生成方块HTML
        this.createShapesMethod(this.nextShape, this.nextColor, Box)//给方块确定形状

        this.nextShape = this.createNum(6)//更改this.nextShape的值 预先定义下一个方块的形状
        this.nextColor = this.createNum(6)//更改this.nextShape的值 预先定义下一个方块的颜色
        //预览窗口生成下一个形状的方块
        var nextBox = this.createElements();//下一个方块的HTNL
        this.createShapesMethod(this.nextShape, this.nextColor, nextBox, this.prevBox)//给下一个方块确定形状
        this.prevBox.appendChild(nextBox)//添加到预览窗口

        return Box//出厂方块
    }

    //生成方块形状的方法
    Shapes.prototype.createShapesMethod = function (n, m, obj, hasPrevBox) {
        hasPrevBox = hasPrevBox || null;
        switch (n) {
            case 1 ://横条
                obj.style.cssText = 'width:200px;height:50px;position:absolute;';
                var date = {
                    w: 200,
                    h: 50
                }
                if (hasPrevBox) {
                    obj.style.top = (hasPrevBox.offsetHeight - date.h) / 2 + 'px';
                    obj.style.left = (hasPrevBox.offsetWidth - date.w) / 2 + 'px';
                } else {
                    obj.style.top = -date.h + 'px';
                    obj.style.left = (this.boxWarpper.clientWidth - date.w) / 2 + 'px';
                }
                for (var i = 0; i < 4; i++) {
                    obj.children[i].style.left = i * 50 + 'px';
                }
                break;
            case 2 ://竖条
                obj.style.cssText = 'width:50px;height:200px;position:absolute;';
                var date = {
                    w: 50,
                    h: 200
                }
                if (hasPrevBox) {
                    obj.style.top = (hasPrevBox.offsetHeight - date.h) / 2 + 'px';
                    obj.style.left = (hasPrevBox.offsetWidth - date.w) / 2 + 'px';
                } else {
                    obj.style.top = -date.h + 'px';
                    obj.style.left = (this.boxWarpper.clientWidth - date.w) / 2 + 'px';
                }
                for (var i = 0; i < 4; i++) {
                    obj.children[i].style.top = i * 50 + 'px';
                }
                break;
            case 3 ://方形
                obj.style.cssText = 'width:100px;height:100px;position:absolute;';
                var date = {
                    w: 100,
                    h: 100
                }
                if (hasPrevBox) {
                    obj.style.top = (hasPrevBox.offsetHeight - date.h) / 2 + 'px';
                    obj.style.left = (hasPrevBox.offsetWidth - date.w) / 2 + 'px';
                } else {
                    obj.style.top = -date.h + 'px';
                    obj.style.left = (this.boxWarpper.clientWidth - date.w) / 2 + 'px';
                }
                obj.children[1].style.left = '50px';
                obj.children[2].style.top = '50px';
                obj.children[3].style.top = '50px';
                obj.children[3].style.left = '50px';
                break;
            case 4 ://左L
                obj.style.cssText = 'width:150px;height:100px;position:absolute;';
                var date = {
                    w: 150,
                    h: 100
                }
                if (hasPrevBox) {
                    obj.style.top = (hasPrevBox.offsetHeight - date.h) / 2 + 'px';
                    obj.style.left = (hasPrevBox.offsetWidth - date.w) / 2 + 'px';
                } else {
                    obj.style.top = -date.h + 'px';
                    obj.style.left = (this.boxWarpper.clientWidth - date.w) / 2 + 'px';
                }
                for (var i = 1; i < 4; i++) {
                    obj.children[i].style.left = (i - 1) * 50 + 'px';
                    obj.children[i].style.top = '50px';
                }
                break;
            case 5 ://右L
                obj.style.cssText = 'width:150px;height:100px;position:absolute;';
                var date = {
                    w: 150,
                    h: 100
                }
                if (hasPrevBox) {
                    obj.style.top = (hasPrevBox.offsetHeight - date.h) / 2 + 'px';
                    obj.style.left = (hasPrevBox.offsetWidth - date.w) / 2 + 'px';
                } else {
                    obj.style.top = -date.h + 'px';
                    obj.style.left = (this.boxWarpper.clientWidth - date.w) / 2 + 'px';
                }
                obj.children[0].style.left = 100 + 'px';
                for (var i = 1; i < 4; i++) {
                    obj.children[i].style.left = (i - 1) * 50 + 'px';
                    obj.children[i].style.top = '50px';
                }
                break;
            case 6 ://凸起
                obj.style.cssText = 'width:150px;height:100px;position:absolute;';
                var date = {
                    w: 150,
                    h: 100
                }
                if (hasPrevBox) {
                    obj.style.top = (hasPrevBox.offsetHeight - date.h) / 2 + 'px';
                    obj.style.left = (hasPrevBox.offsetWidth - date.w) / 2 + 'px';
                } else {
                    obj.style.top = -date.h + 'px';
                    obj.style.left = (this.boxWarpper.clientWidth - date.w) / 2 + 'px';
                }
                obj.children[0].style.left = '50px';
                for (var i = 1; i < 4; i++) {
                    obj.children[i].style.left = (i - 1) * 50 + 'px';
                    obj.children[i].style.top = '50px';
                }
                break;

        }
        var num = m;

        for (var i = 0; i < 4; i++) {
            if (obj.children[i]) {

                obj.children[i].style.background = '-webkit-linear-gradient(top right,' + this.color[m][1] + ',' + this.color[m][0] + ')'
                obj.children[i].style.border = '3px solid ' + this.color[m][1];
                obj.children[i].style.boxShadow = 'inset 0 0 8px ' + this.color[m][0];

            }
        }


    }

    //创建方块元素
    Shapes.prototype.createElements = function () {
        var box = document.createElement('div');
        box.className = 'box1';
        for (var i = 0; i < 4; i++) {
            var _box = document.createElement('div');
            _box.className = 'box';
            _box.style.width = '50px';
            _box.style.height = '50px';
            _box.style.position = 'absolute';
            box.appendChild(_box);
        }

        return box
    }


    //方块自动下降
    Shapes.prototype.moveBox = function (speed) {
        if (!this.container) return
        this.onoff = true;
        var This = this;
        this.timer = setInterval(function () {
            This.container.style.top = This.container.offsetTop + 25 + 'px';
            This.deleteBox(This.boxWarpper, This.container);
        }, speed, This)
    }

    //删除方块
    Shapes.prototype.deleteBox = function (parentNode, child) {
        if (child.offsetTop >= parentNode.clientHeight) {
            parentNode.removeChild(child);
            this.container = null//移除方块后container属性重置为null
            clearInterval(this.timer)
            this.timer = null;
            setTimeout(function (This) {//一个方块消失后重新生成一个方块
                This.init()
            }, this.speedLevel, this)

        }
    }

    //水平移动方块
    Shapes.prototype.removeBox = function (target) {
        if (this.container === null) return//如果屏幕中没有方块，那么方块移动事件不生效
        clearInterval(this.timer)//左右移动时清除方块自动下移的定时器
        this.timer=null;

        if (target === 'left') {
            var _left = this.container.offsetLeft - 50;
            _left < 0 ? _left = 0 : null;//防止方块跑出屏幕
            this.container.style.left = _left + 'px';
            this.moveBox(this.speedLevel)//重启定时器

        } else if (target === 'right') {
            var _right = this.container.offsetLeft + 50;
            _right > this.boxWarpper.clientWidth - this.container.offsetWidth ? _right = this.boxWarpper.clientWidth - this.container.offsetWidth : null;
            this.container.style.left = _right + 'px';
            this.moveBox(this.speedLevel)//重启定时器
        }
    }

    //方块旋转
    Shapes.prototype.rotateBox = function () {
        if (!this.container) return
        var arr = ['', 90, 180, 270]
        var rotate = this.container.style.transform || '0';

        var angle =parseInt(rotate.match(/\d+/)[0]) + arr[this.createNum(3)];
        this.container.style.transform = 'rotate(' +angle +'deg)';
        if (!this.timer){
            this.moveBox(this.speedLevel)
        }
    }

    //生成随机数  1~max
    Shapes.prototype.createNum = function (max) {
        return Math.round(Math.random() * (max - 1) + 1)
    }

    //游戏暂停与开始
    Shapes.prototype.pause = function () {
        if (this.onoff) {
            clearInterval(this.timer)//游戏暂停
            this.timer=null
            this.onoff = !this.onoff;
        } else {
            this.moveBox(this.speedLevel)//游戏开始，重启定时器
        }
    }

    //加速下降
    Shapes.prototype.quickDown = function () {
        this.fasterSpeed <= 100 ? this.fasterSpeed = 100 : this.fasterSpeed -= 100;
        clearInterval(this.timer);
        this.timer=null;
        this.moveBox(this.fasterSpeed);
    }


    var p = new Shapes('box-warpper', 'next-shape', '[data-type=left]', '[data-type=right]', '[data-type=rotate]', '[data-type=pause]', '[data-type=quick]', 200);
    p.init();


}//onload事件的括号


