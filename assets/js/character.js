var character = {
    create: {
        generic: function () {
            //creates character only
            var filter = document.createElement("div")
            filter.className = "characterFilter";
            var rotation = document.createElement("div")
            rotation.className = "characterRotation";
            var character = document.createElement("div")
            character.className = "character";
            var face1 = document.createElement("div")
            face1.className = "characterFace1";
            var face2 = document.createElement("div")
            face2.className = "characterFace2";
            var face3 = document.createElement("div")
            face3.className = "characterFace3";
            var face4 = document.createElement("div")
            face4.className = "characterFace4";
            character.appendChild(face1);
            character.appendChild(face2);
            character.appendChild(face3);
            character.appendChild(face4);
            rotation.appendChild(character);
            filter.appendChild(rotation);
            return filter;
        },
        main: function(x, y, z /*optional*/ ) {
            if(typeof charMain == 'undefined') {
            var char = character.create.generic();
            char.style.transform = "translateY(" + y + 5 + "vmin) ";
            char.style.transform += "translateX(" + x + 5 + "vmin) ";
            if (z) {
                char.style.transform += "translateZ(" + z + "0vmin)"
            }
            stage.parentNode.parentNode.insertBefore(char, stage.parentNode.parentNode.firstChild);
            charMain = {
                uuid:Math.random()*100000000000000000,
                currentPos:[x,y,z],
                DOMObject:char,
                facing:"up",
                bearing:0,
                freeze:false
            }
            } else {
                console.log("Main character already created at :" + charMain[0] + charMain[1]);
            }
        }
    },
    moveToCurrentPos:function(){
        charMain.DOMObject.style.transform = "translateY(" + charMain.currentPos[1] + 5 + "vmin) ";
            charMain.DOMObject.style.transform += "translateX(" +  charMain.currentPos[0] + 5 + "vmin) ";
            charMain.DOMObject.style.transform += "translateZ(" +  charMain.currentPos[2]*10 + "vmin)"
    },
    move:function(moveDirection) {
        if (!charMain.freeze) {
        var rotationLayer = charMain.DOMObject.childNodes[0];
        
        console.log(rotationLayer);
        console.log(character);
        if(moveDirection === charMain.facing) {
        switch(moveDirection){
            case "up":
                var targetX = 0;
                var targetY = -1;
                break;
            case "down":
                var targetX = 0;
                var targetY = 1;
                break;
            case "left":
                var targetX = -1;
                var targetY = 0;
                break;
            case "right":
                var targetX = 1;
                var targetY = 0;
                break;
        }
        
        var targetBlock = [charMain.currentPos[0]+targetX,charMain.currentPos[1]+targetY,charMain.currentPos[2],charMain.currentPos[2]];
        var targetIndex = [charMain.currentPos[0]+targetX,charMain.currentPos[1]+targetY,charMain.currentPos[2],charMain.currentPos[2]];
        var persTarget = null;
        function findPersMatch() {
            persTarget = null;
            switch(moveDirection) {
                case "right":
                case "down":
            while(targetIndex[0] < 10 && targetIndex[1] < 10) {
                var tX = targetIndex[0]+1;
                var tY = targetIndex[1]+1;
                var tH = 1;
                var tZ = targetIndex[3]+1;
                if(document.querySelector("#stage .cube[data-block-info*='" + tX + "," + tY + "," + tH + "," + tZ + "']")) {
                    console.log(document.querySelector("#stage .cube[data-block-info*='" + tX + "," + tY + "," + tH + "," + tZ + "']"));
                    persTarget = document.querySelector("#stage .cube[data-block-info*='" + tX + "," + tY + "," + tH + "," + tZ + "']");
                    targetIndex[0]++;
                    targetIndex[1]++;
                    targetIndex[3]++;
                } else {
                    targetIndex[0]++;
                    targetIndex[1]++;
                    targetIndex[3]++;
                    
                }
            };
                    break;
                case "up":
                case "left":
            while(targetIndex[0] > 0 && targetIndex[1] > 0) {
                var tX = targetIndex[0]-1;
                var tY = targetIndex[1]-1;
                var tH = 1;
                var tZ = targetIndex[3]-1;
                if(document.querySelector("#stage .cube[data-block-info*='" + tX + "," + tY + "," + tH + "," + tZ + "']")) {
                    console.log(document.querySelector("#stage .cube[data-block-info*='" + tX + "," + tY + "," + tH + "," + tZ + "']"));
                    persTarget = document.querySelector("#stage .cube[data-block-info*='" + tX + "," + tY + "," + tH + "," + tZ + "']");
                    targetIndex[0]--;
                    targetIndex[1]--;
                    targetIndex[3]--;
                } else {
                    targetIndex[0]--;
                    targetIndex[1]--;
                    targetIndex[3]--;
                    
                }
            };
                    break;
            }
            if (persTarget === null) {
                return false;
            } else {
                return true;
            }
        }
        function logic(x,y,z) {
            //format:{b10:[[x,y,height of block,accumulativestack]]}
            if(findPersMatch()) {
                console.log("persmatch!");
                console.log(persTarget);
                if(level.needReorder == 1) {
                level.needReorder = 0;
                level.reorder();
            
        }
                var parsed = JSON.parse("[" + persTarget.dataset.blockInfo + "]");
                charMain.currentPos[0] = parsed[0];
                charMain.currentPos[1] = parsed[1];
                charMain.currentPos[2] = parsed[3];
                character.moveToCurrentPos();
                return;
            };
            
        console.log("b" + (x + targetX) + (y + targetY))
            if(targetX + x === 10 || targetY + y === 10 || targetX + x === -1 || targetY + y === -1){
            //if near edge and there is valid block on the other side
            switch(moveDirection){
            case "up":
                var targetMap = "thumbTop";
                if(targetY + y == -1 && traversable[0]) {
                    var edge = "top"
                } 
                break;
            case "down":
                var targetMap = "thumbDown"
                
                    if(targetY + y == 10 && traversable[1]) {
                    var edge = "bottom"
                } 
                break;
            case "left":
                var targetMap = "thumbLeft"
                if(targetX + x == -1 && traversable[2]) {
                    var edge = "left"
                } 
                break;
            case "right":
                var targetMap = "thumbRight";
                if(targetX + x == 10 && traversable[3]) {
                    var edge = "right"
                } 
                break;
        };
            if(edge) {
                level.stepInto(edge);
                console.log(moveDirection)
                return [moveDirection];
            }
        }
            

        else if(typeof currentLevel["b" + (x + targetX) + (y + targetY)] == 'undefined') {
            console.log("target undefined, logic false");
            return ["none"];
        } 
        else if(currentLevel["b" + (x + targetX) + (y + targetY)][currentLevel["b" + (x + targetX) + (y + targetY)].length - 1][3] == charMain.currentPos[2]) {
            console.log("logic true");
            
            return [moveDirection]//[[direction],[direction]]
        }}
        function step(x,y,z) {
            charMain.DOMObject.style.transform = "translateY(" + y + 5 + "vmin) ";
            charMain.DOMObject.style.transform += "translateX(" + x + 5 + "vmin) ";
            charMain.DOMObject.style.transform += "translateZ(" + z*10 + "vmin)"
        };
       
        var steps = logic(charMain.currentPos[0],charMain.currentPos[1],charMain.currentPos[2]);
         console.log(steps)
        if(steps) {
         for(i=0;i<steps.length;i++) {
            switch(steps[i]){
            case "up":
                charMain.currentPos[1] = charMain.currentPos[1] - 1;
                break;
            case "down":
                charMain.currentPos[1] = charMain.currentPos[1] + 1;
                break;
            case "left":
                charMain.currentPos[0] = charMain.currentPos[0] - 1;
                break;
            case "right":
                charMain.currentPos[0] = charMain.currentPos[0] + 1;
                break;
            case "none":
                break;
        }
            step(charMain.currentPos[0],charMain.currentPos[1],charMain.currentPos[2])
        }} else {
            
        }}
        else {
            switch(moveDirection){
            case "up":
                console.log("now must face up");
                switch(charMain.facing){
                    case "down":
                        charMain.bearing += 180;
                        break;
                    case "left":
                        charMain.bearing += 90;
                        break;
                    case "right":
                        charMain.bearing -= 90;
                        break;
                };
                break;
            case "down":
                    console.log("now must face down");
                    switch(charMain.facing){
                    case "up":
                        charMain.bearing += 180;
                        break;
                    case "left":
                        charMain.bearing -= 90;
                        break;
                    case "right":
                        charMain.bearing += 90;
                        break;
                }
                break;
            case "left":
                    console.log("now must face left");
                    switch(charMain.facing){
                    case "down":
                        charMain.bearing += 90;
                        break;
                    case "up":
                        charMain.bearing -= 90;
                        break;
                    case "right":
                        charMain.bearing += 180;
                        break;
                }
                break;
            case "right":
                console.log("now must face right");
                     switch(charMain.facing){
                    case "down":
                        charMain.bearing -= 90;
                        break;
                    case "up":
                        charMain.bearing += 90;
                        break;
                    case "left":
                        charMain.bearing += 180;
                        break;
                }
                break;
        };
            charMain.facing = moveDirection;
            rotationLayer.style.transform = "rotateZ(" + charMain.bearing + "deg" + ")"
        }
    }}
}