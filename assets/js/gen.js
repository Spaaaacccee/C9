var genload = function() {
    stage = document.getElementById("stage");

    function initThumbs(name) {
        var div = document.createElement("div");
        var filter = document.createElement("div");
        div.className = "thumb";
        div.id = name;
        filter.className = "filter";
        filter.id = "filter" + name;
        filter.appendChild(div);
        document.getElementById("nsc").appendChild(filter);
    }
    initThumbs("thumbTop");
    initThumbs("thumbLeft");
    initThumbs("thumbRight");
    initThumbs("thumbDown");
};
var currentFolder = "chapter1_0";
var context;
var currentLevel = {}; //Memory
var currentMapName;
var currentMapCoords = function() {
    var x = Number(currentMapName.substring(1, 2));
    var y = Number(currentMapName.substring(2, 3));
    return [x, y]
}
var traversable = [0, 0, 0, 0] //up down left right
var thumbs = {};
var effects = {
    color:{
        changeAll:function(color){
            if(effects.color.currentColor == color) {return;}
            else {
            var style = document.createElement("link");
            style.setAttribute("rel","stylesheet");
            style.setAttribute("href","assets/resources/colors/" + color + ".css");
            style.id = "color";
                if(document.getElementById("color")){
                    document.getElementById("color").parentNode.removeChild(document.getElementById("color"));
                }
            document.head.appendChild(style)
            effects.color.currentColor = color;}
        },
        currentColor:"gray",
    },
    obscure:function(object,time){
        object.style.opacity = 0;
        setTimeout(function(){object.style.opacity = 1},time)
    },
    ambience: function(where) {
        //loop through all of stage named cube
        var cubes = document.querySelector(where).querySelectorAll(".cube");
        console.log(cubes);
        for (i = 0; i < cubes.length; i++) {
            var blockInfo = JSON.parse("[" + cubes[i].dataset.blockInfo + "]");
            var actualCube = cubes[i];
            if (blockInfo[3] === 1) {
                //test if value of z = 1, then it is on ground;

                //apply ambience to each visible face;
                var shadowDiv = document.createElement("div");
                shadowDiv.className = "BABottom";
                var shadowDiv2 = shadowDiv.cloneNode(true);
                actualCube.childNodes[1].appendChild(shadowDiv);
                actualCube.childNodes[2].appendChild(shadowDiv2);
            } else {
                //test for each (12) possible places of ambience
            }


        }
        //if found apply the ambience
    },
    cleanup: function(where) {
        console.log("cleanup is called");
        var cubes = document.querySelector(where).querySelectorAll(".cube");
        for (i = 0; i < cubes.length; i++) {
            var blockInfo = JSON.parse("[" + cubes[i].dataset.blockInfo + "]"); //x,y,z,accumulated
            var actualCube = cubes[i];
            //test if left is visible
            console.log(where + '[data-block-info*="' + blockInfo[0] + "," + (blockInfo[1] + 1) + "," + blockInfo[2] + "," + blockInfo[3] + '"]')
            if (document.querySelector(where + ' [data-block-info*="' + blockInfo[0] + "," + (blockInfo[1] + 1) + "," + blockInfo[2] + "," + blockInfo[3] + '"]')) {

                actualCube.removeChild(actualCube.childNodes[1]);
            };
            if (document.querySelector(where + ' [data-block-info*="' + (blockInfo[0] + 1) + "," + blockInfo[1] + "," + blockInfo[2] + "," + blockInfo[3] + '"]')) {
                actualCube.removeChild(document.querySelector(where + ' [data-block-info*="' + blockInfo[0] + "," + blockInfo[1] + "," + blockInfo[2] + "," + blockInfo[3] + '"]' + " .right"));

            }
            if (document.querySelector(where + ' [data-block-info*="' + (blockInfo[0]) + "," + blockInfo[1] + "," + (blockInfo[2]) + "," + (blockInfo[3] + 1) + '"]')) {
                actualCube.removeChild(document.querySelector(where + ' [data-block-info*="' + blockInfo[0] + "," + blockInfo[1] + "," + blockInfo[2] + "," + blockInfo[3] + '"]' + " .top"));
            };
        }
    },
};
var level = {
    needReorder:1,
    reorder:function(){
        var top = document.getElementById("filterthumbTop");
        var down = document.getElementById("filterthumbDown");
        var left = document.getElementById("filterthumbLeft");
        var right = document.getElementById("filterthumbRight");
        var nsc = document.getElementById("nsc");
        nsc.insertBefore(right,nsc.firstChild);
        nsc.insertBefore(down,nsc.firstChild);
        nsc.insertBefore(left,nsc.firstChild);
        nsc.insertBefore(top,nsc.firstChild);
        nsc.insertBefore(stage.parentNode,nsc.firstChild);
    },
    clearThumbs: function(name) {
        console.log("clearthumb is called")


            var thumb = document.getElementById("thumb" + name);
            console.log(thumb)
            while (thumb.firstChild) {
                thumb.removeChild(thumb.firstChild);
            }
        
    },
    createThumbs: function() {
        //get current coords
        var currentX = currentMapCoords()[0];
        var currentY = currentMapCoords()[1];


        function gen(x, y, literal, no) {
            var currentLevelCache = currentLevel;
            //test if x - placement is negative; then test if such map exists;
            var d = "#" + "thumb" + literal;
            while (document.querySelector(d).firstChild) {
                document.querySelector(d).removeChild(document.querySelector(d).firstChild);
            }
            if (currentX + x < 0 || currentY + y < 0) {
                //maps are smaller than zero
                traversable[no] = 0;
                return
            } else {
                console.log("targetxy: " + [(currentX + x), (currentY + y)])
                    //load map into placement
                if (levels[currentFolder]["l" + (currentX + x) + (currentY + y)]) {
                    var loadLevel = levels[currentFolder]["l" + (currentX + x) + (currentY + y)];
                    traversable[no] = 1;
                } else {
                    traversable[no] = 0;
                    return
                };
                console.log(loadLevel);
                var target = "#" + "thumb" + literal;
                console.log("target: " + target)
                    //	loadFromArray:function(theArray,clear/*0,1*/,where/*querySelector*/){

                blocks.loadFromArray(loadLevel, target)
            }
            thumbs[literal] = currentLevel;
            currentLevel = currentLevelCache;
        }
        gen(-1, 0, "Left", 2);
        gen(1, 0, "Right", 3);
        gen(0, -1, "Down", 1);
        gen(0, 1, "Top", 0);
    },
    stepInto: function(mapName) {
        charMain.DOMObject.style.transition = "all 0.7s ease-in-out";
        charMain.freeze = true;
        setTimeout(function() {
            charMain.DOMObject.style.transition = "";
            charMain.freeze = false
        }, 700)
        switch (mapName) {
            case "top":
                if(traversable[0]) {
                level.clearThumbs("Left");
                    level.clearThumbs("Right")
                    //remove old thumbdown;
                    var oldFilterThumbDown = document.getElementById("filterthumbDown").parentNode.removeChild(document.getElementById("filterthumbDown"));
                    var oldFilterThumbTop = document.getElementById("filterthumbTop");
                    var oldStage = stage.parentNode;
                    console.log(oldFilterThumbDown);
                    oldFilterThumbDown.id = "filterthumbTop";
                    oldFilterThumbDown.class = "filter";
                    oldFilterThumbDown.firstChild.id = "thumbTop";
                    oldFilterThumbDown.firstChild.className = "thumb";
                    document.getElementById("nsc").insertBefore(oldFilterThumbDown,document.getElementById("nsc").firstChild);
                    //get top, transform into stage;
                    
                    oldFilterThumbTop.id = "";
                    oldFilterThumbTop.className = "filter filterMain";
                    oldFilterThumbTop.firstChild.id = "stage";
                    oldFilterThumbTop.firstChild.className = "";
                    //get stage, transform into down
                    
                    oldStage.className = "filter";
                    oldStage.id = "filterthumbDown";
                    oldStage.firstChild.id = "thumbDown";
                    oldStage.firstChild.className = "thumb";
                    charMain.currentPos[1] = 10;
                    charMain.DOMObject.style.transform = "translateY(" + charMain.currentPos[1] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateX(" + charMain.currentPos[0] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateZ(" + charMain.currentPos[2] * 10 + "vmin)";
                    console.log(currentMapName)
                    currentMapName = "l" + currentMapCoords()[0] + (currentMapCoords()[1] + 1);

                    stage = document.getElementById("stage");
                    console.log(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]])
                    blocks.loadFromArray(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]], "#stage");
                    //recalculate traversables, thumbs
                    effects.obscure(document.getElementById("filterthumbTop"),700);
                    effects.obscure(document.getElementById("filterthumbLeft"),700);
                    effects.obscure(document.getElementById("filterthumbRight"),700);
                    setTimeout(level.createThumbs, 700)
                }
                break;
            case "bottom":
                if (traversable[1]) {
                level.clearThumbs("Left");
                    level.clearThumbs("Right")
                    //remove old thumbTop;
                    var oldFilterThumbTop = document.getElementById("filterthumbTop").parentNode.removeChild(document.getElementById("filterthumbTop"));
                    var oldFilterThumbDown = document.getElementById("filterthumbDown");
                    var oldStage = stage.parentNode;
                    console.log(oldFilterThumbTop);
                    oldFilterThumbTop.id = "filterthumbDown";
                    oldFilterThumbTop.class = "filter";
                    oldFilterThumbTop.firstChild.id = "thumbDown";
                    oldFilterThumbTop.firstChild.className = "thumb";
                    document.getElementById("nsc").insertBefore(oldFilterThumbTop,document.getElementById("nsc").firstChild);
                    //get down, transform into stage;
                    
                    oldFilterThumbDown.id = "";
                    oldFilterThumbDown.className = "filter filterMain";
                    oldFilterThumbDown.firstChild.id = "stage";
                    oldFilterThumbDown.firstChild.className = "";
                    //get stage, transform into up
                    
                    oldStage.className = "filter";
                    oldStage.id = "filterthumbTop";
                    oldStage.firstChild.id = "thumbTop";
                    oldStage.firstChild.className = "thumb";
                    charMain.currentPos[1] = -1;
                    charMain.DOMObject.style.transform = "translateY(" + charMain.currentPos[1] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateX(" + charMain.currentPos[0] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateZ(" + charMain.currentPos[2] * 10 + "vmin)";
                    console.log(currentMapName)
                    currentMapName = "l" + currentMapCoords()[0] + (currentMapCoords()[1] - 1);

                    stage = document.getElementById("stage");
                    console.log(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]])
                    blocks.loadFromArray(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]], "#stage");
                    //recalculate traversables, thumbs
                    effects.obscure(document.getElementById("filterthumbDown"),700);
                    effects.obscure(document.getElementById("filterthumbLeft"),700);
                    effects.obscure(document.getElementById("filterthumbRight"),700);
                    
                    setTimeout(level.createThumbs, 700)
                }
                break;
            case "left":
                if(traversable[2]) {
                level.clearThumbs("Top");
                    level.clearThumbs("Down")
                    //remove old thumbright;
                    var oldFilterThumbRight = document.getElementById("filterthumbRight").parentNode.removeChild(document.getElementById("filterthumbRight"));
                    var oldFilterThumbLeft = document.getElementById("filterthumbLeft");
                    var oldStage = stage.parentNode;
                    console.log(oldFilterThumbRight);
                    oldFilterThumbRight.id = "filterthumbLeft";
                    oldFilterThumbRight.class = "filter";
                    oldFilterThumbRight.firstChild.id = "thumbLeft";
                    oldFilterThumbRight.firstChild.className = "thumb";
                    document.getElementById("nsc").insertBefore(oldFilterThumbRight,document.getElementById("nsc").firstChild);
                    //get right, transform into stage;
                    
                    oldFilterThumbLeft.id = "";
                    oldFilterThumbLeft.className = "filter filterMain";
                    oldFilterThumbLeft.firstChild.id = "stage";
                    oldFilterThumbLeft.firstChild.className = "";
                    //get stage, transform into left
                    
                    oldStage.className = "filter";
                    oldStage.id = "filterthumbRight";
                    oldStage.firstChild.id = "thumbRight";
                    oldStage.firstChild.className = "thumb";
                    charMain.currentPos[0] = 10;
                    charMain.DOMObject.style.transform = "translateY(" + charMain.currentPos[1] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateX(" + charMain.currentPos[0] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateZ(" + charMain.currentPos[2] * 10 + "vmin)";
                    console.log(currentMapName)
                    currentMapName = "l" + (currentMapCoords()[0]-1) + (currentMapCoords()[1]);

                    stage = document.getElementById("stage");
                    console.log(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]])
                    blocks.loadFromArray(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]], "#stage");
                    //recalculate traversables, thumbs
                    effects.obscure(document.getElementById("filterthumbTop"),700);
                    effects.obscure(document.getElementById("filterthumbDown"),700);
                    effects.obscure(document.getElementById("filterthumbLeft"),700);
                    setTimeout(level.createThumbs, 700)
                }
                break;
                case "right":
                if(traversable[3]) {
                level.clearThumbs("Top");
                    level.clearThumbs("Down")
                    //remove old thumbleft;
                    var oldFilterThumbLeft = document.getElementById("filterthumbLeft").parentNode.removeChild(document.getElementById("filterthumbLeft"));
                    var oldFilterThumbRight = document.getElementById("filterthumbRight");
                    var oldStage = stage.parentNode;
                    console.log(oldFilterThumbRight);
                    oldFilterThumbLeft.id = "filterthumbRight";
                    oldFilterThumbLeft.class = "filter";
                    oldFilterThumbLeft.firstChild.id = "thumbRight";
                    oldFilterThumbLeft.firstChild.className = "thumb";
                    document.getElementById("nsc").insertBefore(oldFilterThumbLeft,document.getElementById("nsc").firstChild);
                    //get right, transform into stage;
                    
                    oldFilterThumbRight.id = "";
                    oldFilterThumbRight.className = "filter filterMain";
                    oldFilterThumbRight.firstChild.id = "stage";
                    oldFilterThumbRight.firstChild.className = "";
                    //get stage, transform into left
                    
                    oldStage.className = "filter";
                    oldStage.id = "filterthumbLeft";
                    oldStage.firstChild.id = "thumbLeft";
                    oldStage.firstChild.className = "thumb";
                    charMain.currentPos[0] = -1;
                    charMain.DOMObject.style.transform = "translateY(" + charMain.currentPos[1] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateX(" + charMain.currentPos[0] + 5 + "vmin) ";
                    charMain.DOMObject.style.transform += "translateZ(" + charMain.currentPos[2] * 10 + "vmin)";
                    console.log(currentMapName)
                    currentMapName = "l" + (currentMapCoords()[0]+1) + (currentMapCoords()[1]);

                    stage = document.getElementById("stage");
                    console.log(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]])
                    blocks.loadFromArray(levels[currentFolder]["l" + currentMapCoords()[0] + currentMapCoords()[1]], "#stage");
                    //recalculate traversables, thumbs
                    effects.obscure(document.getElementById("filterthumbTop"),700);
                    effects.obscure(document.getElementById("filterthumbDown"),700);
                    effects.obscure(document.getElementById("filterthumbRight"),700);
                    setTimeout(level.createThumbs, 700)
                }
                break;
        };
        setTimeout(function(){level.needReorder = 1;},1400);

    },

}

var debug = {
    platformer:function(perspective){
        switch(perspective) {
            case "front":
                document.getElementById("nsc").style.transform = "rotateX(90deg) rotateZ(0deg)";
                var style = document.createElement("style");
                style.innerHTML = "# filterthumbDown {display:none}";
                document.head.appendChild(style);
                break;
            case "right":
                break;
        }
    },
    log:{},
    loggerOff:function(bool){
        switch(bool){
            case true:
                if(debug.log.alreadyOn) {
                    return
                }
                else {
                    debug.log['oldCL'] = console.log;
                    console.log = function() {};
                    debug.log['alreadyOn'] = true;
                };
                break;
            case false:
                if(debug.log.alreadyOn) {
                    console.log = debug.log.oldCL;
                }
                else {return}
                break;
        }
    },
    godView: function(amount) {
        if (amount) {
            document.getElementById("nsc").style.transform = "scale(" + amount + ")"
        } else {
            document.getElementById("nsc").style.transform = "scale(0.5)"
        }
    },
    printAll: function() {
        var n = "\n";

        function strong(string) {
            return "%c" + string + "%c"
        }
        console.log(
            strong("Character:") + n + "bearing: " + charMain.bearing + n + "currentPos: " + charMain.currentPos, "font-weight:bold", "font-weight:normal"
        )
        console.log(
            strong("Level: ") + n + "currentFolder: " + currentFolder + n + "currentLevel: " + currentLevel + n + "currentMapName: " + currentMapName + n + "traversable: " + traversable, "font-weight:bold", "font-weight:normal")
    },
}

var blocks = { //format:{b10:[[x,y,height of block,accumulativestack]]}
    pm: function(x, y, height, cube) {
        //find whether blocks should stack

        if (!currentLevel["b" + x + y]) {
            //if current level does not have a block on this coordinate
            currentLevel["b" + x + y] = [];
            z = height;
            //this block must have a z of 1
        } else {

            //check accumulated value
            z = currentLevel["b" + x + y][currentLevel["b" + x + y].length - 1][3] + height;
        }
        //add self to list
        currentLevel["b" + x + y].push([x, y, height, z]);
        cube.dataset.blockInfo = [x, y, height, z];
        return z

    },
    create: {

        generic: function() {
            function cf(cube, name) {
                var face = document.createElement("div");
                face.className = name;
                cube.appendChild(face);
                return cube;
            }
            var cube = document.createElement("div");
            cube.className = "cube";

            cube = cf(cube, "top");
            cube = cf(cube, "left");
            cube = cf(cube, "right");

            context.appendChild(cube);
            return cube;
        },
        block: function(x, y) {

            var cube = blocks.create.generic();
            cube.style.top = (y * 10 + 5) + "vmin";
            cube.style.left = (x * 10 + 5) + "vmin";
            //Purpose of PM: find Z value of block, add current block to list
            //PM takes in current x,y, and block height
            var z = blocks.pm(x, y, 1, cube);
            z = z - 1;
            cube.style.transform = cube.style.transform + "translateZ(5vmin) rotateY(-0deg) translateX(-10vmin) translateY(-10vmin) translateZ(" + (z * 10) + "vmin)"
        }
    },
    addFromArray: function(theArray, where /*querySelector*/ ) {
        context = document.querySelector(where);

        for (i = 0; i < theArray[0].length; i++) {
            switch (theArray[0][i][0]) {
                case "b":
                    blocks.create.block(theArray[0][i][1], theArray[0][i][2]);
                    break;
                case "s":
                    break;
            }
        };
        if (where == "#stage") {
            currentMapName = theArray[1];
        }
    },
    loadFromArray: function(theArray, where /*querySelector*/ ) {
        context = document.querySelector(where);
        while (context.firstChild) {
            context.removeChild(context.firstChild);
        }
        currentLevel = {}
        for (i = 0; i < theArray[0].length; i++) {
            switch (theArray[0][i][0]) {
                case "b":
                    blocks.create.block(theArray[0][i][1], theArray[0][i][2]);
                    break;
                case "s":
                    break;
            }
        };
        effects.ambience(where);
        effects.cleanup(where);
        if (where == "#stage") {
            currentMapName = theArray[1];

        }
    },
    loadFromMemory: function() {
        while (stage.firstChild) {
            stage.removeChild(stage.firstChild);

        }
    },

}