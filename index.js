window.onload = function() {

    window.brush = null;

    var canvas = new fabric.Canvas('canvas', {
        isDrawingMode: false,
        hoverCursor: "pointer",
        //selection: false
    })
        .setWidth(window.screen.width)
        .setHeight(window.screen.height);

    // ウィンドウサイズ
    window.canvas = canvas;

    // キーボードが押されたらの処理
    $(window).keyup(function (e) {
        // デリートキーが押されたら、図形の削除を行う
        if (e.keyCode === 46) {
            gui2.remove();
        }
    });

    // GUIの初期値
    function setupBrush(brushName, opt) {
        canvas.freeDrawingBrush = new fabric[brushName](canvas, opt || {});
    }

    // 初期設定
    var gui = new dat.GUI();
        gui.brushType = "InkBrush";
        gui.brushWidth = 30;
        gui.brushOpacity = 1;
        gui.inkAmount = 7;
        gui.brushColor = "#000000";
        gui.BackgroundColor = "#FFFFFF";

    setupBrush(gui.brushType, {
        width: gui.brushWidth,
        opacity: gui.brushOpacity,
        inkAmount: gui.inkAmount,
        color: gui.brushColor,
    });

    gui.FreeDrawing = function () {
        canvas.isDrawingMode = !canvas.isDrawingMode;
    }

    gui.clear = function () {
        canvas.isDrawingMode = false;
        if (confirm('本当にクリアしますか？')) {
            canvas.clearContext(canvas.contextTop);
        }
    }

    gui.save = function() {
        var dataURL = canvas.contextTop.canvas.toDataURL("image/png");
        window.open(dataURL);
    }

    // メニュー
    var f0 = gui.addFolder('Free drawing');
        f0.add(gui, "FreeDrawing");
        f0.add(gui, "brushType", ["CrayonBrush", "InkBrush", "MarkerBrush", "SprayBrush"]).onFinishChange(setupBrush);
        f0.add(gui, "brushWidth", 1, 100).step(1)
            .onChange(function(value) {
                canvas.freeDrawingBrush.width = value;
            });

        f0.addColor(gui, "brushColor")
            .onChange(function(value) {
                canvas.freeDrawingBrush.changeColor(value);
        });

        f0.add(gui, "brushOpacity", 0.1, 1).step(0.1)
            .onChange(function(value) {
                      canvas.freeDrawingBrush.changeOpacity(value);
                  });
        f0.add(gui, "inkAmount", 1, 10).step(0.1)
              .onChange(function(value) {
                  canvas.freeDrawingBrush.inkAmount = value;
              });
        f0.addColor(gui, "BackgroundColor")
              .onChange(function (value) {
                  canvas.setBackgroundColor(value);
                  canvas.renderAll();
              });

        //gui.add(gui, "zoomin");
        //gui.add(gui, "zoomout");
        f0.add(gui, "save");
        f0.add(gui, "clear");


    // カメラ倍率の初期化
    var CameraCounter = 100;

    // オブジェクトドローイングメニュー
    gui2 = new dat.GUI({ autoPlace: false });

    // 初期値
    gui2.objbrushType = "Pencil";
    gui2.Linecolor = "#000000";
    gui2.Linewidth = 1;
    gui2.Shadowcolor = 0;
    gui2.Shadowwidth = 0;
    gui2.Shadowoffset = 0;

    gui2.BackgroundColor = "#FFFFFF";
    gui2.TextColor = "#000000";
    gui2.text = "Text";

    gui2.GraphicColor = "#000000";
    gui2.StrokeColor = "#000000";
    gui2.TextSize = 100;

    gui2.strokeWidth = 3;

    // テキストの追加
    gui2.text_input = function () {
        canvas.isDrawingMode = false;

        if (canvas.getContext) {
            var context = canvas.getContext('2d');
        }

    var size, textcolor;
    var mouse_pos = { x: 0, y: 0 };

    canvas.observe('mouse:down', function (e) {

    mouse_pos = canvas.getPointer(e.e);
    size = parseInt(size, 10);

    canvas.add(new fabric.Text(gui2.text, {
        fontSize: gui2.TextSize,
        left: mouse_pos.x,
        top: mouse_pos.y,
        textAlign: "left",
        fontWeight: 'bold',
        fill: gui2.TextColor,
    }));

    canvas.off('mouse:down');
    canvas.renderAll();
    canvas.calcOffset();
    });
}

    // 図形
    gui2.rect = function () {
        var mouse_pos = { x: 0, y: 0 };
        canvas.isDrawingMode = false;
        canvas.observe('mouse:down', function (e) {
        mouse_pos = canvas.getPointer(e.e);
        canvas.add(new fabric.Rect({
            left: mouse_pos.x,
            top: mouse_pos.y,
            width: 75,
            height: 50,
            fill: gui2.GraphicColor,
            stroke: gui2.StrokeColor,
            strokeWidth: gui2.strokeWidth,
            padding: 10
        }));
        canvas.off('mouse:down');
        });
    }

    // 円を追加する
    gui2.circle = function () {
        var color, InnerColor;
        color = $('#color').val();
        strokecolor = $('#strokecolor').val();
        var mouse_pos = { x: 0, y: 0 };
        canvas.isDrawingMode = false;
        canvas.observe('mouse:down', function (e) {
            mouse_pos = canvas.getPointer(e.e);
            canvas.add(new fabric.Circle({
            left: mouse_pos.x,
            top: mouse_pos.y,
            radius: 30,
            fill: gui2.GraphicColor,
            stroke: gui2.StrokeColor,
            strokeWidth: gui2.strokeWidth,
        }));
        canvas.off('mouse:down');
        });
    }

    // 楕円を追加する
    gui2.ellipse = function () {
        var color, InnerColor;
        color = $('#color').val();
        strokecolor = $('#strokecolor').val();
        var mouse_pos = { x: 0, y: 0 };

        canvas.isDrawingMode = false;

        canvas.observe('mouse:down', function (e) {
            mouse_pos = canvas.getPointer(e.e);
            canvas.add(new fabric.Ellipse({
            rx: 45,
            ry: 25,
            fill: gui2.GraphicColor,
            stroke: gui2.StrokeColor,
            strokeWidth: gui2.strokeWidth,
            left: mouse_pos.x,
            top: mouse_pos.y
        }));
        canvas.off('mouse:down');
        });
    }

    // 直線を引く
    gui2.line = function () {
        canvas.isDrawingMode = false;

        if (canvas.getContext) {
            var context = canvas.getContext('2d');
        }

        canvas.observe('mouse:down', function (e) { mousedown(e); });
        canvas.observe('mouse:move', function (e) { mousemove(e); });
        canvas.observe('mouse:up', function (e) { mouseup(e); });

        var started = false;
        var startX = 0;
        var startY = 0;

        /* Mousedown */
        function mousedown(e) {
            var mouse = canvas.getPointer(e.e);
            started = true;
            startX = mouse.x;
            startY = mouse.y;
            canvas.off('mouse:down');
        }

        /* Mousemove */
        function mousemove(e) {
            if (!started) {
                return false;
            }
            canvas.off('mouse:move');
        }

        /* Mouseup */
        function mouseup(e) {
            if (started) {
                var mouse = canvas.getPointer(e.e);
                var color, InnerColor;
                color = $('#color').val();
                strokecolor = $('#strokecolor').val();
                canvas.add(new fabric.Line([startX, startY, mouse.x, mouse.y], { stroke: gui2.StrokeColor, strokeWidth: gui2.strokeWidth }));
                canvas.renderAll();
                canvas.calcOffset();
                started = false;
                canvas.off('mouse:up');
            }
        }
    }

    // ズームイン
    gui2.zoomin = function () {
        canvas.setZoom(canvas.getZoom() * 1.1);
        CameraCounter = CameraCounter + 10;
    }

        // ズームアウト
    gui2.zoomout = function () {
        canvas.setZoom(canvas.getZoom() / 1.1);
        CameraCounter = CameraCounter - 10;
    }

    // バッグクラウンドカラー
    gui2.backgroundcolor = function () {
        var backgroundcolor;
        backgroundcolor = $('#backgroundcolor').val();
        canvas.setBackgroundColor(backgroundcolor);
        canvas.renderAll();
        canvas.calcOffset();
    }

    // Canvasを別ウィンドウで開く
    gui2.Save = function () {
        canvas.isDrawingMode = false;
        var dataURL = canvas.toDataURL("image/png");
        window.open(dataURL);
    }

    // Canvasをクリアする
    gui2.Clear = function () {
        canvas.isDrawingMode = false;
        if (confirm('本当にクリアしますか？')) {
            canvas.clear();
        }
    }

    // オブジェクトを削除する
    gui2.remove = function () {
        canvas.isDrawingMode = false;

        var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
        if (activeObject) {
            if (confirm('本当に削除しますか？')) {
                canvas.remove(activeObject);
            }
        }　else if (activeGroup) {
            if (confirm('本当に削除しますか？')) {
                var objectsInGroup = activeGroup.getObjects();
                    canvas.discardActiveGroup();
                    objectsInGroup.forEach(function (object) {
                        canvas.remove(object);
                    });
                }
            }
        };

    // メニュー
    var file = gui2.addFolder("File");
        file.add(gui2, "Clear");
        file.add(gui2, "Save");

    // Canvasメニュー
    var f1 = gui2.addFolder("Canvas");
        f1.add(gui2, "zoomin");
        f1.add(gui2, "zoomout");
        f1.add(gui2, "remove");
        f1.addColor(gui, "BackgroundColor")
            .onChange(function (value) {
                canvas.setBackgroundColor(value);
                canvas.renderAll();
        });

    // オブジェクトドローイング
    var ojbdr = gui2.addFolder("ObjectModeDrawing");
        ojbdr.add(gui2, "objbrushType", ["Pencil", "Circle"]).onChange(function (value) {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric[value + 'Brush'](canvas);
        });

        ojbdr.addColor(gui2, "Linecolor")
            .onChange(function (value) {
                gui2.Linecolor = value;
        });
    
        ojbdr.add(gui2, 'Linewidth', 1, 100); // Min and max


    // Add:Text
    var f2 = gui2.addFolder('Text');
        f2.add(gui2, "text_input");
        f2.add(gui2, 'text');
        f2.add(gui2, 'TextSize', 1, 100); // Min and max

        f2.addColor(gui2, "TextColor")
            .onChange(function (value) {
            gui2.TextColor = value;
        });

    // Graphic
    var f3 = gui2.addFolder('Graphic');
        f3.add(gui2, 'rect');
        f3.add(gui2, 'circle');
        f3.add(gui2, 'ellipse');
        f3.add(gui2, 'line');
        f3.addColor(gui2, "GraphicColor")
            .onChange(function (value) {
            gui2.GraphicColor = value;
        });

        f3.addColor(gui2, "StrokeColor")
            .onChange(function (value) {
            gui2.StrokeColor = value;
        });

        f3.add(gui2, 'strokeWidth', 1, 100); // Min and max

        // 
        var customContainer = $('.moveGUI').append($(gui2.domElement));
};
