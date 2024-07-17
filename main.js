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


function drawText(text, x, y, color, size = 10, align = "left", baseline = "middle", font = "serif"){
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

const MAX_TRIES = 1000*1000;

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

async function loadImage(url) {
    const image = new Image();
    image.src = url;
    return new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = reject;
    });
}

(async () =>{
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
    const [test, test2] = await Promise.all([
        loadImage("https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"),
        loadImage("https://cdn.discordapp.com/attachments/760143672624152578/1263250194733203556/yo.png?ex=66998cec&is=66983b6c&hm=e3f000f91cd72433177a4e9c48656443dcf9fb269f19f4d54c4eca1e26658108&")
    ]);
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
        console.log(ev)
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
        console.log(ev)
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
    //////////////////////////////////////////////////////////

    
    rects = [
        createRect(0,0, 100, 100, "red"),
        createRect(250, 250, 100, 100, "blue"),
    ]
    for(i = 0; i < 20; i++){randomRect(rects, 100, 100, "green");}

    goToMouse = null;
    mouseOver = null;
    
    let prevTimestamp = 0;
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

        drawRect(0, 0, 600, 200, "gray");
        text = "F1L1Pv2 Młodzik";
        drawText(text, 20, 100, "white", (600 - 20) / text.length * 2);
        size = 500;
        drawImage(test, canvas.width/2 - size /2 , canvas.height/2 - size/2, size, size);
        drawImage(test2, 0, canvas.height - size/2, size/2, size/2);
        
        mouseOver = null;
        rects.forEach((rect) => {
            if(mouseInsideRect(rect)){
                if(mouseButtons.justClickedMiddle){
                    goToMouse = rect;
                }
                mouseOver = rect;
            }
            drawables.push(rect)
        });
        
        
        if(goToMouse != null){
            goToMouse.x = mousePos.x - goToMouse.width/2;
            goToMouse.y = mousePos.y - goToMouse.height/2;
        }

        if(mouseButtons.justReleasedMiddle){
            goToMouse = null;
        }
        
        
        drawLine(rects[0].x + rects[0].width / 2, rects[0].y + rects[0].height / 2, rects[1].x + rects[1].width / 2, rects[1].y + rects[1].height / 2, "yellow", 1);
        drawRect(mousePos.x - 50, mousePos.y - 50, 100, 100, "#FFFFFF44");
        drawText(`(${mousePos.x}, ${mousePos.y})`, mousePos.x, mousePos.y, "white", 20);

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
        /////////////////////////////////////////////
    });

    /////// first frame (needed for first delta time) ///////
    requestAnimationFrame((timestamp) => {
        prevTimestamp = timestamp;
        requestAnimationFrame(frame);
    });
    ////////////////////////////////////////////////////////
})()