$(function(){
    var canvas = $('#board');
    var ctx = canvas[0].getContext('2d');

	// Generate an unique ID
	var id = Math.round($.now()*Math.random());

    // the variables for the user
    var cColor = '#000';
    var cLineWidth = 1;
	var cDrawing = false;
    var cLastEmit = $.now();

	var clients = {};
	var cursors = {};

	var socket = io.connect();

	socket.on('moving', function (data) {
        // not current user and new? create a cursor
		if(id !== data.id && !(data.id in clients)){
			cursors[data.id] = jQuery('.cursor').appendTo('#cursors');

            // Move the mouse pointer
            cursors[data.id].css({
                'left' : data.x,
                'top' : data.y
            });
		}

		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			draw(clients[data.id], data, data.color, data.lineWidth);
		}

		// Save the last data state
		clients[data.id] = data;
	});

    socket.on('left', function (id) {
        cursors[id].remove();
    });

    // set cDrawing to true
	canvas.on('mousedown',function(e){
		e.preventDefault();
		cDrawing = true;
	});

    // not drawing anymore
	canvas.on('mouseup mouseleave',function(){
		cDrawing = false;
	});


    // send the current state to the server if the time difference from last emit is big enough
	canvas.on('mousemove',function(e){
        var cPos = {x: e.pageX, y: e.pageY};
		if($.now() - cLastEmit > 30){
			socket.emit('mousemove',{
				'x': cPos.x,
				'y': cPos.y,
				'drawing': cDrawing,
				'id': id,
                'color': cColor,
                'lineWidth': cLineWidth
			});
			cLastEmit = $.now();
		}
	});


	function draw(from, to, color, w){
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.beginPath();
		ctx.moveTo(from.x, from.y);
		ctx.lineTo(to.x, to.y);
		ctx.stroke();
        ctx.closePath();
	}

    // Shortcuts
    // Color
    key('b,g,y,r', function(event,handler){
        switch(handler.shortcut) {
            case 'b':
                cColor = '#000';
                break;
            case 'g':
                cColor = '#0f0';
                break;
            case 'y':
                cColor = '#ff0';
                break;
            case 'r':
                cColor = '#f00';
                break;
        }
    });

    // LineWidth
    key('1,2,3,4,5,6,7,8,9', function(event,handler){
        cLineWidth = parseInt(handler.shortcut);
    });

    key('⌘+s, ctrl+s', function(e) {
        e.preventDefault();
        document.getElementById('board').toBlob(function(blob) {
            saveAs(blob, "whiteboard.png");
        });
    });


});
