window.onload = function() {

    window.brush = null;

    var canvas = new fabric.Canvas('canvas', {
        isDrawingMode: true,
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
            gui.ObjectRemove();
        }
    });

    // GUIの初期値
    function setupBrush(brushName, opt) {
        canvas.freeDrawingBrush = new fabric[brushName](canvas, opt || {});
    }

    // 初期設定
    var gui = new dat.GUI();

    // Canvas
    gui.BackgroundColor = "#FFFFFF";
    gui.Zoomrate = 100;

    // Brush
    gui.brushType = "InkBrush";
    gui.brushWidth = 30;
    gui.brushOpacity = 1;
    gui.inkAmount = 7;
    gui.brushColor = "#000000";

    // Objdrawing
    gui.objbrushType = "Pencil";
    gui.Linecolor = "#000000";
    gui.Linewidth = 1;
    gui.Shadowcolor = "#000000";
    gui.Shadowwidth = 1;
    gui.Shadowoffset = 1;
       
    // Text
    gui.text = "Text";
    gui.TextColor = "#000000";
    gui.fontweight = "normal";
    gui.textDecoration = "normal";
    gui.fontFamily = "arial";
    gui.TextSize = 50;
    gui.textstroke = "#000000";
    gui.textstrokeWidth = 1;
    gui.textAlign = "left";

    // Graphic
    gui.GraphicColor = "#000000";
    gui.StrokeColor = "#000000";
    gui.strokeWidth = 3;
    gui.radius = 5;

    // Brushの初期化
    setupBrush(gui.brushType, {
        width: gui.brushWidth,
        opacity: gui.brushOpacity,
        inkAmount: gui.inkAmount,
        color: gui.brushColor,
    });

    // フリードローイング
    gui.FreeDrawing = function () {
        canvas.isDrawingMode = !canvas.isDrawingMode;
    }

    // Canvasのクリア
    gui.Clear = function () {
        canvas.isDrawingMode = false;
        if (confirm('本当にクリアしますか？')) {
            canvas.clearContext(canvas.contextTop);
            canvas.clear();
        }
    }

    // Canvasを保存する
    gui.save = function () {
        canvas.isDrawingMode = false;
        var dataURL = canvas.contextTop.canvas.toDataURL("image/png");
        window.open(dataURL);
    }

    // テキストの追加
    gui.text_input = function () {
        canvas.isDrawingMode = false;

        if (canvas.getContext) {
            var context = canvas.getContext('2d');
        }

        var size, textcolor;
        var mouse_pos = { x: 0, y: 0 };

        canvas.observe('mouse:down', function (e) {

            mouse_pos = canvas.getPointer(e.e);
            size = parseInt(size, 10);

            canvas.add(new fabric.Text(gui.text, {
                fontSize: gui.TextSize,
                left: mouse_pos.x,
                top: mouse_pos.y,
                textAlign: gui.textAlign,
                fontWeight: gui.fontweight,
                fontFamily: gui.fontFamily,
                textDecoration: gui.textDecoration,
                fill: gui.TextColor,
                stroke: gui.textstroke,
                strokeWidth: gui.textstrokeWidth,
            }));

            canvas.off('mouse:down');
            canvas.renderAll();
            canvas.calcOffset();
        });
    }

    // 図形
    gui.rect = function () {
        var mouse_pos = { x: 0, y: 0 };
        canvas.isDrawingMode = false;
        canvas.observe('mouse:down', function (e) {
            mouse_pos = canvas.getPointer(e.e);
            canvas.add(new fabric.Rect({
                left: mouse_pos.x,
                top: mouse_pos.y,
                width: 75,
                height: 50,
                fill: gui.GraphicColor,
                stroke: gui.StrokeColor,
                strokeWidth: gui.strokeWidth,
                padding: gui.radius
            }));
            canvas.off('mouse:down');
        });
    }

    // 円を追加する
    gui.circle = function () {
        var mouse_pos = { x: 0, y: 0 };
        canvas.isDrawingMode = false;
        canvas.observe('mouse:down', function (e) {
            mouse_pos = canvas.getPointer(e.e);
            canvas.add(new fabric.Circle({
                left: mouse_pos.x,
                top: mouse_pos.y,
                radius: gui.radius,
                fill: gui.GraphicColor,
                stroke: gui.StrokeColor,
                strokeWidth: gui.strokeWidth,
            }));
            canvas.off('mouse:down');
        });
    }

    // 楕円を追加する
    gui.ellipse = function () {
        var mouse_pos = { x: 0, y: 0 };

        canvas.isDrawingMode = false;

        canvas.observe('mouse:down', function (e) {
            mouse_pos = canvas.getPointer(e.e);
            canvas.add(new fabric.Ellipse({
                rx: 45,
                ry: 25,
                fill: gui.GraphicColor,
                stroke: gui.StrokeColor,
                strokeWidth: gui.strokeWidth,
                left: mouse_pos.x,
                top: mouse_pos.y
            }));
            canvas.off('mouse:down');
        });
    }

    // 直線を引く
    gui.line = function () {
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
                canvas.add(new fabric.Line([startX, startY, mouse.x, mouse.y], { stroke: gui.StrokeColor, strokeWidth: gui.strokeWidth }));
                canvas.renderAll();
                canvas.calcOffset();
                started = false;
                canvas.off('mouse:up');
            }
        }
    }

    // バッグクラウンドカラー
    gui.backgroundcolor = function () {
        var backgroundcolor;
        backgroundcolor = $('#backgroundcolor').val();
        canvas.setBackgroundColor(backgroundcolor);
        canvas.renderAll();
        canvas.calcOffset();
    }

    // Canvasを別ウィンドウで開く
    gui.Save = function () {
        canvas.isDrawingMode = false;
        var dataURL = canvas.toDataURL("image/png");
        window.open(dataURL);
    }

    // オブジェクトを削除する
    gui.ObjectRemove = function () {
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
    {
        var file = gui.addFolder("File");
        file.add(gui, "Clear");
        file.add(gui, "Save");
    }

    // Canvasメニュー
    {
        var f1 = gui.addFolder("Canvas");
        f1.add(gui, 'Zoomrate', 1, 200).onChange(function (value) {
            if (value > 100) {
                canvas.setZoom(value/ 100);
            } else if (value < 100) {
                canvas.setZoom(value / 100);
            }
        });

        f1.add(gui, "ObjectRemove");
        f1.addColor(gui, "BackgroundColor")
            .onChange(function (value) {
                canvas.setBackgroundColor(value);
                canvas.renderAll();
            });
    }

    // メニュー
    {
        var f0 = gui.addFolder('Free drawing');
        f0.add(gui, "FreeDrawing");
        f0.add(gui, "brushType", ["CrayonBrush", "InkBrush", "MarkerBrush", "SprayBrush"]).onFinishChange(setupBrush);
        f0.add(gui, "brushWidth", 1, 100).step(1)
            .onChange(function (value) {
                canvas.freeDrawingBrush.width = value;
            });

        // Colorの選択
        f0.addColor(gui, "brushColor")
            .onChange(function (value) {
                canvas.freeDrawingBrush.changeColor(value);
            });

        // brushOpacity
        f0.add(gui, "brushOpacity", 0.1, 1).step(0.1)
            .onChange(function (value) {
                canvas.freeDrawingBrush.changeOpacity(value);
            });

        // inkAmount
        f0.add(gui, "inkAmount", 1, 10).step(0.1)
              .onChange(function (value) {
                  canvas.freeDrawingBrush.inkAmount = value;
              });
    }

    // オブジェクトドローイング
    {
        var ojbdr = gui.addFolder("ObjectModeDrawing");
        ojbdr.add(gui, "objbrushType", ["Pencil", "Circle"]).onChange(function (value) {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric[value + 'Brush'](canvas);
        });

        ojbdr.add(gui, 'Linewidth', 1, 100).onChange(function (value) {
            canvas.freeDrawingBrush.width = value;
        });

        ojbdr.addColor(gui, "Linecolor")
            .onChange(function (value) {
                canvas.freeDrawingBrush.color = value;
            });
    }

    // Add:Text
    {
        var f2 = gui.addFolder('Text');
            f2.add(gui, "text_input");
            f2.add(gui, 'text');
            f2.add(gui, 'TextSize', 1, 100);
            f2.add(gui, "fontFamily", ["arial", "helvetica", "myriad pro", "delicious", "verdana", "georgia", "courier", "comic sans ms", "impact", "monaco", "optima", "hoefler text", "plaster", "engagement"])
            f2.addColor(gui, "TextColor")
                .onChange(function (value) {
                gui.TextColor = value;
                });
            f2.add(gui, "fontweight", ["normal", "Bold", "Italic"])
            f2.add(gui, "textDecoration", ["normal", "underline", "line-through", "overline"])

            f2.addColor(gui, "textstroke")
                .onChange(function (value) {
                    gui.textstroke = value;
                });
            f2.add(gui, 'textstrokeWidth', 1, 100);
            f2.add(gui, "textAlign", ["left", "center", "right"])
    }

    // Graphic
    {
        var f3 = gui.addFolder('Graphic');
            f3.add(gui, 'rect');
            f3.add(gui, 'circle');
            f3.add(gui, 'ellipse');
            f3.add(gui, 'line');
            f3.addColor(gui, "GraphicColor")
                .onChange(function (value) {
                gui.GraphicColor = value;
            });

            f3.addColor(gui, "StrokeColor")
                .onChange(function (value) {
                gui.StrokeColor = value;
            });

            f3.add(gui, 'strokeWidth', 1, 100);
            f3.add(gui, 'radius', 1, 100);
    }
};
