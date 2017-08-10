var last_clicked = 0;
var downTimer;
var lastKey;
var controller = {
    init: function () {
            document.onkeydown = function(e) {
    // if not still the same key, stop the timer
    if (e.which !== lastKey) {
        if (downTimer) {
            clearInterval(downTimer);
            downTimer = null;
        }
    }
    // remember previous key
    lastKey = e.which;
    if (!downTimer) {
        // start timer
        downTimer = setInterval(function() {
            if([37,38,39,40].indexOf(e.keyCode) > -1) {controller.keyboard(e.keyCode)} else {clearInterval(downTimer);
        downTimer = null;
        lastKey = 0;}
        }, 2);
    }
}
            document.onkeyup = function(){ // stop timer
    if (downTimer) {
        clearInterval(downTimer);
        downTimer = null;
        lastKey = 0;
    }
            }
    },
    keyboard: function (keyCode) {
        if(Date.now() - last_clicked > 200) {
            last_clicked = Date.now();
        var keydirection;
        var unicode = keyCode
        switch (unicode) {
        case 37:
            keydirection = "left"
            break;
        case 38:
            keydirection = "up"    
        break;
        case 39:
            keydirection = "right"
            break;
        case 40:
            keydirection = "down"
            break;
        }
        console.log(keydirection);
        console.log("moved " + keydirection);
        character.move(keydirection);
        } else {
            return
        }
    },
    touch: function () {

    },
    handler: function () {

    }
}