/*
Copyright 2024 Filip Młodzik <mlodzikfilip@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

mousePos = {
    "x": 0,
    "y": 0
}

escapee =false

mouseButtons = {
    "left": false,
    "right": false,
    "middle": false,
    "justClickedLeft": false,
    "justClickedRight": false,
    "justClickedMiddle": false,
    "justReleasedLeft": false,
    "justReleasedRight": false,
    "justReleasedMiddle": false,
}

drawables = []

ctx = null;

function createRect(x, y, width, height, color){
    return ({
        "type": "rect",
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "color": color
    });
}

function drawImage(image, x, y, width, height){
    drawables.push({
        "type": "image",
        "image": image,
        "x": x,
        "y": y,
        "width": width,
        "height": height,
    })
}

function drawRect(x, y, width, height, color){
    drawables.push(createRect(x,y,width,height,color));
}


function drawText(text, x, y, color, size = 10, align = "left", baseline = "middle", font = "Jaldi"){
    drawables.push(
        {
            "type": "text",
            "text": text,
            "x": x,
            "y": y,
            "color": color,
            "size": size,
            "align": align,
            "baseline": baseline,
            "font": font
        }
    )
}


function pointInsideRect(rect, x, y){
    return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
}

function doRectanglesCollide(rect1, rect2) {
    const rect1Right = rect1.x + rect1.width;
    const rect1Bottom = rect1.y + rect1.height;
    const rect2Right = rect2.x + rect2.width;
    const rect2Bottom = rect2.y + rect2.height;

    if (rect1.x >= rect2Right || rect2.x >= rect1Right) {
        return false;
    }
    if (rect1.y >= rect2Bottom || rect2.y >= rect1Bottom) {
        return false;
    }

    return true;
}

function isRectangleInside(rect1, rect2) {
    const rect1Right = rect1.x + rect1.width;
    const rect1Bottom = rect1.y + rect1.height;
    const rect2Right = rect2.x + rect2.width;
    const rect2Bottom = rect2.y + rect2.height;

    const isInside = (
        rect1.x >= rect2.x &&
        rect1Right <= rect2Right &&
        rect1.y >= rect2.y &&
        rect1Bottom <= rect2Bottom
    );

    return isInside;
}

function mouseInsideRect(rect){
    return pointInsideRect(rect, mousePos.x, mousePos.y);
}

const MAX_TRIES = 1000;

function createRandomRect(rects, width, height, color = "red"){
    let i = 0;
    doesntColide = false;
    windowRect = createRect(0,0,ctx.canvas.width, ctx.canvas.height);
    while(!doesntColide){
        if(i > MAX_TRIES) return null;
        let x = Math.random()*ctx.canvas.width;
        let y = Math.random()*ctx.canvas.height;
        rect = createRect(x, y, width, height, color)
        if(!isRectangleInside(rect, windowRect)){
            doesntColide = false;
            i++;
            continue;
        }
        doesntColide = true;
        rects.forEach((other) => {
            if(!doesntColide) return;
            if(doRectanglesCollide(rect,other)){
                doesntColide = false;
                return;
            }
        })
        if(!doesntColide){
            continue;
            i++;
        }
        return rect;
    }
}

function randomRect(rects, width, height, color){
    rect = createRandomRect(rects, width, height, color);
    if(rect != null){
        rects.push(rect);
    }
}

function drawLine(x1, y1, x2, y2, color, width){
    drawables.push({
        "type": "line",
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2,
        "color": color,
        "width": width,
    })
}
function drawLineGradient(x1, y1, x2, y2, color1, color2, width){
    drawables.push({
        "type": "lineGradient",
        "x1": x1,
        "y1": y1,
        "x2": x2,
        "y2": y2,
        "color1": color1,
        "color2": color2,
        "width": width,
    })
}

function drawCircle(x, y, radius, color){
    drawables.push({
        "type": "circle",
        "x": x,
        "y": y,
        "radius": radius,
        "color": color,
    })
}

async function loadImage(url) {
    const image = new Image();
    image.src = url;
    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
}

const ALL_LETTERS = [
    "fA",
    "fB",
    "fD",
    "fE1",
    "fE2",
    "fF",
    "fG",
    "fH1",
    "fH2",
    "fI",
    "fJ",
    "fK",
    "fL",
    "fM",
    "fN",
    "fNG1",
    "fNG2",
    "fNG3",
    "fO",
    "fP",
    "fR",
    "fS1",
    "fS2",
    "fT",
    "fTH",
    "fU1",
    "fU2",
    "fW",
    "fZ",
    "eA",
    "eB",
    "eD",
    "eE",
    "eE",
    "eF",
    "eG",
    "eH",
    "eH",
    "eI",
    "eJ",
    "eK",
    "eL",
    "eM",
    "eN",
    "eNG",
    "eNG",
    "eNG",
    "eO",
    "eP",
    "eR",
    "eS",
    "eS",
    "eT",
    "eTH",
    "eU",
    "eU",
    "eW",
    "eZ",
];

function createParticleAtPos(x, y, color){
    return {
        "x": x,
        "y": y,
        "color": color,
        "vel_x": Math.cos(Math.random()*2*Math.PI),
        "vel_y": Math.sin(Math.random()*2*Math.PI),
        "timer": 0
    }
}

func = (async () =>{
    //////////////// Setup //////////////////////////////
    const canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    if(ctx == null) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    document.addEventListener('contextmenu', event => event.preventDefault());
    /////////////////////////////////////////////////////
    
    ///////////////// Loading Screen ///////////////////////////////////////
    let initial_text = "Loading Assets...";
    ctx.font = `${(canvas.width - 40) * 2 / initial_text.length}px Serif`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial_text, canvas.width/2, canvas.height/2);
    ////////////////////////////////////////////////////////////////////////

    ///////////////// Assets //////////////////
    const [
        elderFuthark_A,
        elderFuthark_B,
        elderFuthark_D,
        elderFuthark_E1,
        elderFuthark_E2,
        elderFuthark_F,
        elderFuthark_G,
        elderFuthark_H1,
        elderFuthark_H2,
        elderFuthark_I,
        elderFuthark_J,
        elderFuthark_K,
        elderFuthark_L,
        elderFuthark_M,
        elderFuthark_N,
        elderFuthark_NG1,
        elderFuthark_NG2,
        elderFuthark_NG3,
        elderFuthark_O,
        elderFuthark_P,
        elderFuthark_R,
        elderFuthark_S1,
        elderFuthark_S2,
        elderFuthark_T,
        elderFuthark_TH,
        elderFuthark_U1,
        elderFuthark_U2,
        elderFuthark_W,
        elderFuthark_Z,

        white_elderFuthark_A,
        white_elderFuthark_B,
        white_elderFuthark_D,
        white_elderFuthark_E1,
        white_elderFuthark_E2,
        white_elderFuthark_F,
        white_elderFuthark_G,
        white_elderFuthark_H1,
        white_elderFuthark_H2,
        white_elderFuthark_I,
        white_elderFuthark_J,
        white_elderFuthark_K,
        white_elderFuthark_L,
        white_elderFuthark_M,
        white_elderFuthark_N,
        white_elderFuthark_NG1,
        white_elderFuthark_NG2,
        white_elderFuthark_NG3,
        white_elderFuthark_O,
        white_elderFuthark_P,
        white_elderFuthark_R,
        white_elderFuthark_S1,
        white_elderFuthark_S2,
        white_elderFuthark_T,
        white_elderFuthark_TH,
        white_elderFuthark_U1,
        white_elderFuthark_U2,
        white_elderFuthark_W,
        white_elderFuthark_Z,

        english_A,
        english_B,
        english_D,
        english_E,
        english_F,
        english_G,
        english_H,
        english_I,
        english_J,
        english_K,
        english_L,
        english_M,
        english_N,
        english_NG,
        english_O,
        english_P,
        english_R,
        english_S,
        english_T,
        english_TH,
        english_U,
        english_W,
        english_Z,

        white_english_A,
        white_english_B,
        white_english_D,
        white_english_E,
        white_english_F,
        white_english_G,
        white_english_H,
        white_english_I,
        white_english_J,
        white_english_K,
        white_english_L,
        white_english_M,
        white_english_N,
        white_english_NG,
        white_english_O,
        white_english_P,
        white_english_R,
        white_english_S,
        white_english_T,
        white_english_TH,
        white_english_U,
        white_english_W,
        white_english_Z,

        headline
    ] = await Promise.all([
        loadImage("assets/elderfuthark/A.svg"),
        loadImage("assets/elderfuthark/B.svg"),
        loadImage("assets/elderfuthark/D.svg"),
        loadImage("assets/elderfuthark/E1.svg"),
        loadImage("assets/elderfuthark/E2.svg"),
        loadImage("assets/elderfuthark/F.svg"),
        loadImage("assets/elderfuthark/G.svg"),
        loadImage("assets/elderfuthark/H1.svg"),
        loadImage("assets/elderfuthark/H2.svg"),
        loadImage("assets/elderfuthark/I.svg"),
        loadImage("assets/elderfuthark/J.svg"),
        loadImage("assets/elderfuthark/K.svg"),
        loadImage("assets/elderfuthark/L.svg"),
        loadImage("assets/elderfuthark/M.svg"),
        loadImage("assets/elderfuthark/N.svg"),
        loadImage("assets/elderfuthark/NG1.svg"),
        loadImage("assets/elderfuthark/NG2.svg"),
        loadImage("assets/elderfuthark/NG3.svg"),
        loadImage("assets/elderfuthark/O.svg"),
        loadImage("assets/elderfuthark/P.svg"),
        loadImage("assets/elderfuthark/R.svg"),
        loadImage("assets/elderfuthark/S1.svg"),
        loadImage("assets/elderfuthark/S2.svg"),
        loadImage("assets/elderfuthark/T.svg"),
        loadImage("assets/elderfuthark/TH.svg"),
        loadImage("assets/elderfuthark/U1.svg"),
        loadImage("assets/elderfuthark/U2.svg"),
        loadImage("assets/elderfuthark/W.svg"),
        loadImage("assets/elderfuthark/Z.svg"),

        loadImage("assets/white_elderfuthark/A.svg"),
        loadImage("assets/white_elderfuthark/B.svg"),
        loadImage("assets/white_elderfuthark/D.svg"),
        loadImage("assets/white_elderfuthark/E1.svg"),
        loadImage("assets/white_elderfuthark/E2.svg"),
        loadImage("assets/white_elderfuthark/F.svg"),
        loadImage("assets/white_elderfuthark/G.svg"),
        loadImage("assets/white_elderfuthark/H1.svg"),
        loadImage("assets/white_elderfuthark/H2.svg"),
        loadImage("assets/white_elderfuthark/I.svg"),
        loadImage("assets/white_elderfuthark/J.svg"),
        loadImage("assets/white_elderfuthark/K.svg"),
        loadImage("assets/white_elderfuthark/L.svg"),
        loadImage("assets/white_elderfuthark/M.svg"),
        loadImage("assets/white_elderfuthark/N.svg"),
        loadImage("assets/white_elderfuthark/NG1.svg"),
        loadImage("assets/white_elderfuthark/NG2.svg"),
        loadImage("assets/white_elderfuthark/NG3.svg"),
        loadImage("assets/white_elderfuthark/O.svg"),
        loadImage("assets/white_elderfuthark/P.svg"),
        loadImage("assets/white_elderfuthark/R.svg"),
        loadImage("assets/white_elderfuthark/S1.svg"),
        loadImage("assets/white_elderfuthark/S2.svg"),
        loadImage("assets/white_elderfuthark/T.svg"),
        loadImage("assets/white_elderfuthark/TH.svg"),
        loadImage("assets/white_elderfuthark/U1.svg"),
        loadImage("assets/white_elderfuthark/U2.svg"),
        loadImage("assets/white_elderfuthark/W.svg"),
        loadImage("assets/white_elderfuthark/Z.svg"),

        loadImage("assets/english/A.svg"),
        loadImage("assets/english/B.svg"),
        loadImage("assets/english/D.svg"),
        loadImage("assets/english/E.svg"),
        loadImage("assets/english/F.svg"),
        loadImage("assets/english/G.svg"),
        loadImage("assets/english/H.svg"),
        loadImage("assets/english/I.svg"),
        loadImage("assets/english/J.svg"),
        loadImage("assets/english/K.svg"),
        loadImage("assets/english/L.svg"),
        loadImage("assets/english/M.svg"),
        loadImage("assets/english/N.svg"),
        loadImage("assets/english/NG.svg"),
        loadImage("assets/english/O.svg"),
        loadImage("assets/english/P.svg"),
        loadImage("assets/english/R.svg"),
        loadImage("assets/english/S.svg"),
        loadImage("assets/english/T.svg"),
        loadImage("assets/english/TH.svg"),
        loadImage("assets/english/U.svg"),
        loadImage("assets/english/W.svg"),
        loadImage("assets/english/Z.svg"),

        loadImage("assets/white_english/A.svg"),
        loadImage("assets/white_english/B.svg"),
        loadImage("assets/white_english/D.svg"),
        loadImage("assets/white_english/E.svg"),
        loadImage("assets/white_english/F.svg"),
        loadImage("assets/white_english/G.svg"),
        loadImage("assets/white_english/H.svg"),
        loadImage("assets/white_english/I.svg"),
        loadImage("assets/white_english/J.svg"),
        loadImage("assets/white_english/K.svg"),
        loadImage("assets/white_english/L.svg"),
        loadImage("assets/white_english/M.svg"),
        loadImage("assets/white_english/N.svg"),
        loadImage("assets/white_english/NG.svg"),
        loadImage("assets/white_english/O.svg"),
        loadImage("assets/white_english/P.svg"),
        loadImage("assets/white_english/R.svg"),
        loadImage("assets/white_english/S.svg"),
        loadImage("assets/white_english/T.svg"),
        loadImage("assets/white_english/TH.svg"),
        loadImage("assets/white_english/U.svg"),
        loadImage("assets/white_english/W.svg"),
        loadImage("assets/white_english/Z.svg"),

        loadImage("assets/headline.svg"),
    ]);

    getCard = ((letter, white) => {
        switch(letter){
            case "fA": if(white){return white_elderFuthark_A} else{return elderFuthark_A}
            case "fB": if(white){return white_elderFuthark_B} else{return elderFuthark_B}
            case "fD": if(white){return white_elderFuthark_D} else{return elderFuthark_D}
            case "fE1": if(white){return white_elderFuthark_E1} else{return elderFuthark_E1}
            case "fE2": if(white){return white_elderFuthark_E2} else{return elderFuthark_E2}
            case "fF": if(white){return white_elderFuthark_F} else{return elderFuthark_F}
            case "fG": if(white){return white_elderFuthark_G} else{return elderFuthark_G}
            case "fH1": if(white){return white_elderFuthark_H1} else{return elderFuthark_H1}
            case "fH2": if(white){return white_elderFuthark_H2} else{return elderFuthark_H2}
            case "fI": if(white){return white_elderFuthark_I} else{return elderFuthark_I}
            case "fJ": if(white){return white_elderFuthark_J} else{return elderFuthark_J}
            case "fK": if(white){return white_elderFuthark_K} else{return elderFuthark_K}
            case "fL": if(white){return white_elderFuthark_L} else{return elderFuthark_L}
            case "fM": if(white){return white_elderFuthark_M} else{return elderFuthark_M}
            case "fN": if(white){return white_elderFuthark_N} else{return elderFuthark_N}
            case "fNG1": if(white){return white_elderFuthark_NG1} else{return elderFuthark_NG1}
            case "fNG2": if(white){return white_elderFuthark_NG2} else{return elderFuthark_NG2}
            case "fNG3": if(white){return white_elderFuthark_NG3} else{return elderFuthark_NG3}
            case "fO": if(white){return white_elderFuthark_O} else{return elderFuthark_O}
            case "fP": if(white){return white_elderFuthark_P} else{return elderFuthark_P}
            case "fR": if(white){return white_elderFuthark_R} else{return elderFuthark_R}
            case "fS1": if(white){return white_elderFuthark_S1} else{return elderFuthark_S1}
            case "fS2": if(white){return white_elderFuthark_S2} else{return elderFuthark_S2}
            case "fT": if(white){return white_elderFuthark_T} else{return elderFuthark_T}
            case "fTH": if(white){return white_elderFuthark_TH} else{return elderFuthark_TH}
            case "fU1": if(white){return white_elderFuthark_U1} else{return elderFuthark_U1}
            case "fU2": if(white){return white_elderFuthark_U2} else{return elderFuthark_U2}
            case "fW": if(white){return white_elderFuthark_W} else{return elderFuthark_W}
            case "fZ": if(white){return white_elderFuthark_Z} else{return elderFuthark_Z}
            case "eA": if(white){return white_english_A} else{return english_A}
            case "eB": if(white){return white_english_B} else{return english_B}
            case "eD": if(white){return white_english_D} else{return english_D}
            case "eE": if(white){return white_english_E} else{return english_E}
            case "eF": if(white){return white_english_F} else{return english_F}
            case "eG": if(white){return white_english_G} else{return english_G}
            case "eH": if(white){return white_english_H} else{return english_H}
            case "eI": if(white){return white_english_I} else{return english_I}
            case "eJ": if(white){return white_english_J} else{return english_J}
            case "eK": if(white){return white_english_K} else{return english_K}
            case "eL": if(white){return white_english_L} else{return english_L}
            case "eM": if(white){return white_english_M} else{return english_M}
            case "eN": if(white){return white_english_N} else{return english_N}
            case "eNG": if(white){return white_english_NG} else{return english_NG}
            case "eO": if(white){return white_english_O} else{return english_O}
            case "eP": if(white){return white_english_P} else{return english_P}
            case "eR": if(white){return white_english_R} else{return english_R}
            case "eS": if(white){return white_english_S} else{return english_S}
            case "eT": if(white){return white_english_T} else{return english_T}
            case "eTH": if(white){return white_english_TH} else{return english_TH}
            case "eU": if(white){return white_english_U} else{return english_U}
            case "eW": if(white){return white_english_W} else{return english_W}
            case "eZ": if(white){return white_english_Z} else{return english_Z}
        }
    })
    ///////////////////////////////////////////
    

    /////////////////// Window Events ////////////////////////
    window.onresize = ((ev) =>{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })

    window.onmousemove = ((ev) => {
        mousePos.x = ev.clientX;
        mousePos.y = ev.clientY;
    })

    window.onmousedown = ((ev) => {
        if(ev.which == 1){
            mouseButtons.left = true;
            mouseButtons.justClickedLeft = true;
        }
        if(ev.which == 2){
            mouseButtons.middle = true;
            mouseButtons.justClickedMiddle = true;
            ev.preventDefault();
        }
        if(ev.which == 3){
            mouseButtons.right = true;
            mouseButtons.justClickedRight = true;
        }
    })

    window.onmouseup = ((ev) => {
        if(ev.which == 1){
            mouseButtons.left = false;
            mouseButtons.justReleasedLeft = true;
        }
        if(ev.which == 2){
            mouseButtons.middle = false;
            mouseButtons.justReleasedMiddle = true;
        }
        if(ev.which == 3){
            mouseButtons.right = false;
            mouseButtons.justReleasedRight = true;
        }
    })

    window.onkeydown = ((ev) => {
        if(ev.keyCode == 27){
            escapee = true;
        }
    })
    //////////////////////////////////////////////////////////

    
    let s = canvas.width / 16;
    cards = []
    for(i = 0; i < ALL_LETTERS.length; i++){randomRect(cards, s*english_A.width / english_A.height, s, "");}

    ///////////////// Screen Size ///////////////////////////////////////
    if(cards.length < ALL_LETTERS.length){
        ctx.fillStyle = "#181818";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        let initial_text = "Screen to small for game "+cards.length + " " + ALL_LETTERS.length;
        ctx.font = `${(canvas.width - 40) * 2 / initial_text.length}px Serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initial_text, canvas.width/2, canvas.height/2);
        return
    }
    ////////////////////////////////////////////////////////////////////////

    cards.map((it, i) => {
        it.color = ALL_LETTERS[i];
        return it;
    })

    cardColor = (letter) => {
        if(letter.startsWith("e")) return "#FFCB00";
        return "#66BFFF";
    }

    cardType = (letter) => {
        if(letter.startsWith("e")) return 1;
        return 0;
    }
        
    connections = []

    let prevTimestamp = 0;
    goToMouse = null;
    mouseOver = null;
    dragging = null;

    particles = []

    misses = 0;
    done = 0;

    gameStarted = false;

    frame = ((timestamp) => {
        //////////////// computing delta time //////////////////////
        const deltaTime = (timestamp - prevTimestamp)/1000;
        const time = timestamp/1000;
        prevTimestamp = timestamp;
        ////////////////////////////////////////////////////////////

        //////////////// clearing screen ///////////////////////////
        ctx.fillStyle = "#181818";
        ctx.fillRect(0,0,canvas.width, canvas.height);

        
        ////////////////////////////////////////////////////////////
        
        // drawRect(0, 0, 600, 200, "gray");
        // text = "F1L1Pv2 Młodzik";
        // drawText(text, 20, 100, "white", (600 - 20) / text.length * 2);
        // size = 500;
        // drawImage(english_A, canvas.width/2 - size /2 , canvas.height/2 - size/2, size, size);
        // drawImage(elderFuthark_A, 0, canvas.height - size/2, size/2, size/2);
        
        if(!gameStarted){
            let scale = s;
            let size = [headline.width/headline.height * s, s]
            drawImage(headline, canvas.width/2 - size[0] / 2 - s/10, size[1] / 2, size[0], size[1]);

            drawText("Press Left Click To Start!", canvas.width/2, canvas.height / 2, "white", s/2, "center");
            drawText("Left Mouse Button Connects Cards", canvas.width/2, canvas.height / 2 + s/2, "#A0A0A0", s/4, "center");
            drawText("Right Mouse Button Moves Cards", canvas.width/2, canvas.height / 2 + s*.85, "#A0A0A0", s/4, "center");
            drawText("Press Escape To give up", canvas.width/2, canvas.height / 2 + s*1.2, "#A0A0A0", s/4, "center")

            drawText("© Copyright 2024 F1L1Pv2", canvas.width/2, canvas.height - s/10, "#555555", s/5, "center", "bottom")
            if(mouseButtons.justClickedLeft){
                gameStarted = true;
                misses = 0;
                done = 0;
            }
        }
        
        else{

        if(cards.length == 0){
            let scale = s;
            let size = [headline.width/headline.height * s, s]
            drawImage(headline, canvas.width/2 - size[0] / 2 - s/10, size[1] / 2, size[0], size[1]);
            drawText("© Copyright 2024 F1L1Pv2", canvas.width/2, canvas.height - s/10, "#555555", s/5, "center", "bottom")

            // drawLineGradient(rects[0].x + rects[0].width / 2, rects[0].y + rects[0].height / 2, rects[1].x + rects[1].width / 2, rects[1].y + rects[1].height / 2, "red", "blue", 10);
            // drawRect(mousePos.x - 50, mousePos.y - 50, 100, 100, "#FFFFFF44");
            // drawCircle(mousePos.x, mousePos.y, 100, "#FFFFFF44");
            
            // drawText(`(${mousePos.x}, ${mousePos.y})`, mousePos.x, mousePos.y, "white", 20);
            drawText(`You Did: ${done}/29`, canvas.width/2, canvas.height/2 - s/2, "white", s/2,"center");
            drawText(`You missed: ${misses} times`, canvas.width/2, canvas.height/2, "white", s/2,"center");
            drawText(`Press Left Button to restart`, canvas.width/2, canvas.height/2 + s/2, "#A0A0A0", s/4,"center");
            if(mouseButtons.justClickedLeft){
                misses = 0;
                done = 0;
                let s = canvas.width / 16;
                for(i = 0; i < ALL_LETTERS.length; i++){randomRect(cards, s*english_A.width / english_A.height, s, "");}
                cards.map((it, i) => {
                    it.color = ALL_LETTERS[i];
                    return it;
                })
            }
        }else{
            drawText("© Copyright 2024 F1L1Pv2", canvas.width/2, canvas.height - s/10, "#555555", s/5, "center", "bottom")
            if(escapee){
                cards = [];
            }
            mouseOver = null;
            cards.forEach((card) => {            
                if(mouseInsideRect(card)){
                    exists = false;
                    connections.forEach((it) => {
                        if(exists) return;
                        if(it.start == card){
                            exists = true;
                            return;
                        }
                        if(it.end == card){
                            exists = true;
                            return;
                        }
                    })
    
    
                    if(mouseButtons.justClickedRight){
                        goToMouse = card;
                    }
                    if(mouseButtons.justClickedLeft){
                        if(!exists){
                            dragging = card;
                        }
                    }
                    if(!exists){
                        mouseOver = card;
                    }
                }
    
                let image = getCard(card.color, mouseOver == card);
                drawImage(image, card.x, card.y, card.width, card.height);
                // if(goToMouse == card || mouseOver == card){
                //     drawText(`${card.color}`,mousePos.x + 5, mousePos.y, "red", 30)
                // }
            });
            
            
            if(goToMouse != null){
                goToMouse.x = mousePos.x - goToMouse.width/2;
                goToMouse.y = mousePos.y - goToMouse.height/2;
            }
    
            if(dragging != null){
                drawLineGradient(dragging.x + dragging.width / 2, dragging.y  + dragging.height / 2, mousePos.x, mousePos.y, cardColor(dragging.color), "white", s / 15)
            }
    
            if(mouseButtons.justReleasedRight){
                goToMouse = null;
            }
    
            const maxParticleTime = 0.5;
    
            if(mouseButtons.justReleasedLeft){
                if(dragging != null && mouseOver != null && mouseOver != dragging && cardType(dragging.color) != cardType(mouseOver.color)){
                    exists = false;
                    connections.forEach((it) => {
                        if(exists) return;
                        if(it.start == mouseOver){
                            exists = true;
                            return;
                        }
                        if(it.end == mouseOver){
                            exists = true;
                            return;
                        }
                    })
                    
                    if(!exists){
                        connections.push({"start": dragging, "end": mouseOver, "timer": maxParticleTime})
                    }
                }
                dragging = null;
            }
    
            connections.forEach((connection) => {
                let start = connection.start;
                let end = connection.end;
                if(start != null && end != null){
                    let pureColor1 = start.color.substring(1).replace(/\d/g, '');
                    let pureColor2 = end.color.substring(1).replace(/\d/g, '');
                    if(pureColor1 == pureColor2){
                        startColor = cardColor(start.color);
                        endColor = cardColor(end.color);
                        for(i = 0; i < 30; i++){
                            particles.push(createParticleAtPos(start.x + start.width / 2, start.y  + start.height / 2, startColor));
                            particles.push(createParticleAtPos(end.x + end.width / 2, end.y  + end.height / 2, endColor));
                        }
                        start.color = "a";
                        end.color = "a";
                        connection.start = null;
                        connection.end = null;
                        done += 1;
                    }else{
                        let color1 = (() => {if(mouseOver == start) {return "white"} else {return cardColor(start.color)}})();
                        let color2 = (() => {if(mouseOver == end)   {return "white"} else {return cardColor(end.color)}})();
                        
                        drawLineGradient(start.x + start.width / 2, start.y  + start.height / 2, end.x + end.width / 2, end.y  + end.height / 2, color1, color2, s / 15)
                        connection.timer += deltaTime;
                        if(connection.timer >= 0.25){
                            misses += 1;
                        }
                    }
                }
    
    
            })
            cards = cards.filter((it) => {return it.color != "a"});
            connections = connections.filter((it) => {return it.timer < 0.25})
    
            particles.forEach((it) => {
                it.x += it.vel_x * deltaTime * s*10;
                it.y += it.vel_y * deltaTime * s*10;
                it.timer += deltaTime;
    
                let alpha = Math.floor(255 - it.timer*255/maxParticleTime).toString(16);
    
                drawCircle(it.x, it.y, s/10, it.color+alpha);
            })
            particles = particles.filter((it) => {return it.timer < maxParticleTime})
            
        }

    }

        ////////////////////// render logic ////////////////////////////////////////////////////
        drawables.forEach(item => {
            if(item.type == "rect"){
                ctx.fillStyle = item.color;
                if(mouseOver == item || goToMouse == item){
                    ctx.fillStyle = "white";
                }
                ctx.fillRect(item.x,item.y,item.width, item.height);
                return;
            }
            if(item.type == "line"){
                ctx.beginPath();
                ctx.moveTo(item.x1, item.y1);
                ctx.lineTo(item.x2, item.y2);
                ctx.strokeStyle = item.color;
                ctx.lineWidth = item.width;
                ctx.stroke();
                return;
            }
            if(item.type == "lineGradient"){
                let grad= ctx.createLinearGradient(item.x1, item.y1, item.x2, item.y2);
                grad.addColorStop(0, item.color1);
                grad.addColorStop(1, item.color2);
                ctx.beginPath();
                ctx.moveTo(item.x1, item.y1);
                ctx.lineTo(item.x2, item.y2);
                ctx.strokeStyle = grad;
                ctx.lineWidth = item.width;
                ctx.stroke();
                return;
            }
            if(item.type == "text"){
                ctx.font = `${item.size}px ${item.font}`;
                ctx.fillStyle = item.color;
                ctx.textAlign = item.align;
                ctx.textBaseline = item.baseline;
                ctx.fillText(item.text, item.x, item.y);
                return;
            }
            if(item.type == "image"){
                ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
                return;
            }
            if(item.type == "circle"){
                ctx.beginPath(); // Start a new path
                ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2); // Create the circle path
                ctx.fillStyle = item.color; // Set the fill color
                ctx.fill(); // Fill the circle with the specified color
                ctx.closePath(); // Close the path
            }
        });
        ///////////////////////////////////////////////////////////////////////////////////////

        /////////////// cleanup /////////////////////
        drawables = [];
        mouseButtons.justClickedLeft = false;
        mouseButtons.justClickedRight = false;
        mouseButtons.justClickedMiddle = false;
        mouseButtons.justReleasedLeft = false;
        mouseButtons.justReleasedRight = false;
        mouseButtons.justReleasedMiddle = false;
        requestAnimationFrame(frame);
        escapee = false;
        /////////////////////////////////////////////
    });

    /////// first frame (needed for first delta time) ///////
    requestAnimationFrame((timestamp) => {
        prevTimestamp = timestamp;
        requestAnimationFrame(frame);
    });
    ////////////////////////////////////////////////////////
})

func()