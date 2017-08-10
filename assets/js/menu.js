window.onload = function() {

    container = document.body;
    title = "Cloud Nine"
    nsc = document.getElementById("nsc");
    mC = document.getElementById("mC");
    start.init()
    start.parse();

};

var start = {
    openSub:function(place,name){
        console.log(name);
        if(start[name].open == true) {
            while(document.getElementsByClassName('submenu')[0]) {
                document.getElementsByClassName('submenu')[0].parentNode.removeChild(document.getElementsByClassName('submenu')[0]);
            }
            start[name].open = false;
        }
        else
        {
        var block = document.getElementById("mB");
        function item (button) {
            if(button.type == "heading") {
                console.log("cheese");
                var DButton = document.createElement("button");
                DButton.className = "button mainmenu";
                block.appendChild(DButton);
                DButton.innerHTML = button.display;
                DButton.setAttribute("onclick", button.click);
                DButton.className += " heading"
                
            } else {
                console.log("bacon");
                var DButton = document.createElement("button");
                DButton.className = "button mainmenu";
                block.appendChild(DButton);
                DButton.innerHTML = button.display;
                DButton.setAttribute("onclick", button.click);
            }
            DButton.className += " submenu"

        };
        for (var key in place) {
                console.log(key);
                item(place[key]);
            };
        start[name].open = true}
    },
        createGeneric:function(){
            var mC = document.createElement("div");
            mC.id = "mC"
            
            mC.appendChild(document.createElement("h1")).innerHTML = title;
            mC.appendChild(document.createElement("div")).id = "mB";
            var newstagecon = document.createElement("div");
            newstagecon.id = "nsc";
            var nscContainer = document.createElement("div");
            nscContainer.id = "nscContainer";
            var filter = document.createElement("div");
            filter.className = "filter filtermain"
            filter.appendChild(document.createElement("div")).id = "stage";
            newstagecon.appendChild(filter);
            nscContainer.appendChild(newstagecon);
            container.appendChild(nscContainer);
            container.appendChild(mC).id;
        },
        newgame: function() {
            var mC = document.getElementById("mC");
            var nsc = document.getElementById("nsc");


            nsc.style.opacity = 1;
            mC.style.opacity = 0;
            nsc.style['pointer-events'] = "auto";
            controller.init();
            document.getElementById("nscContainer").style.transform = "";
        },
        continuegame: function() {},
        init: function() {
            debug.loggerOff(true);
            start.createGeneric();
            genload();
            character.create.main(2, 4, 1);
            blocks.loadFromArray(levels.chapter1_0.l02, "#stage");
            var nscCon = document.getElementById("nscContainer");
            nscCon.style.transform = "translateX(calc(50% - 0vmin)) translateY(10vmin)";
            level.createThumbs()
                //blocks.create.block(1,1)
                //character.createNew.main(1,1,1)
        },

        parse: function() {
            var block = document.getElementById("mB");

            function item(key) {
                var button = document.createElement("button");
                button.className = "button mainmenu";
                block.appendChild(button);
                button.innerHTML = menu[key].display;
                button.setAttribute("onclick", menu[key].click);
                if (menu[key].sub) {
                    button.setAttribute("onclick","start.openSub(menu." + menu[key].name + ".sub,'" + menu[key].name + "')");
                    start[menu[key].name] = {};
                    start[menu[key].name]['open'] = false;
                };
                return key
            }
            for (var key in menu) {
                console.log(key);
                item(key);
            };
           
        },
    };


    var menu = {
        item_1: {
            display: "Start Demo",
            click: "start.newgame()"
        },
        item_2: {
            display: "I'm a button",
            click: "start.continuegame()"

        },
        item_3: {
            display: "Options (This button does something)",
            name:"item_3",
            sub: {
                item_3_1:{
                    display:"(Experimental Feature) WORLDS",
                    type:"heading",
                },
                item_3_2: {
                    display: "Dark",
                    click: "effects.color.changeAll('black')"

                },
                item_3_3: {
                    display: "Grassland",
                    click: "effects.color.changeAll('cyan')"

                }
            }
        }
    };