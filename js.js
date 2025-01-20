const canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');
canvas.width = 550; 
canvas.height = 550;
var rgbcolor = 'black';
var myfont = 'Courier New'; 
var fontsize = '36';
var transparent = 0.5;
let hue = 0; //rainbow pen's color
let which_funct = '';
let isDrawing = false;
let dragging = false; 
let screenShot; //for shape print
let dragStartPosi_x; 
let dragStartPosi_y; 
let lastX = 0; //position of mouse on canvas 
let lastY = 0;


//palette
//=======================================================================================================
const colorful = document.getElementById("palette"); 
let colorctx = colorful.getContext('2d'); 
colorful.width = 320; 
colorful.height = 190;
var gradient = colorctx.createLinearGradient(0, 0, colorful.width-30, 0);
gradient.addColorStop(0,    "rgb(255,   0,   0)");
gradient.addColorStop(0.15, "rgb(255,   0, 255)");
gradient.addColorStop(0.33, "rgb(0,     0, 255)");
gradient.addColorStop(0.49, "rgb(0,   255, 255)");
gradient.addColorStop(0.67, "rgb(0,   255,   0)");
gradient.addColorStop(0.84, "rgb(255, 255,   0)");
gradient.addColorStop(1,    "rgb(255,   0,   0)");
colorctx.fillStyle = gradient;
colorctx.fillRect(0, 0, colorful.width-30, colorful.height);

gradient = colorctx.createLinearGradient(0, 0, 0, colorful.height);
gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
colorctx.fillStyle = gradient;
colorctx.fillRect(0, 0, colorful.width-30, colorful.height);

let moving = false;
colorful.addEventListener("mousedown", function(e) {
    moving = true;
    selectColor(e);
});
colorful.addEventListener("mouseup", function(e) {
    selectColor(e);
    moving = false;
});
colorful.addEventListener("mousemove", function(e) { if(moving) selectColor(e); });
colorful.addEventListener("mouseout", function(e) {
    moving = false;
});
//=======================================================================================================


let tmp1 = '0'; //save my choosing color on palette
let tmp2 = '0';
let tmp3 = '0';
function selectColor(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    var imageData = colorctx.getImageData(x, y, 1, 1).data;
    tmp1 = imageData[0];
    tmp2 = imageData[1];
    tmp3 = imageData[2];
    rgbcolor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',' + transparent + ')';
    colorctx.fillStyle = rgbcolor;
    colorctx.fillRect(colorful.width-20, 0, colorful.width, colorful.height); //display what color you choose
}


//font type
function print_value() {
	myfont = document.getElementById("wordtype").value;
}

//line cap
ctx.lineCap = 'round';
function handleClick(myRadio) {
    ctx.lineCap = myRadio.value;
}


//brush size
var slider = document.getElementById("myRange");
ctx.lineWidth = slider.value; 
slider.oninput = function() {
    ctx.lineWidth = this.value;
}

//font size
var slider2 = document.getElementById("fontsize");
fontsize = slider2.value; 
slider2.oninput = function() {
    fontsize = this.value;
}

//opacity
var slider3 = document.getElementById("transparent");
transparent = slider3.value; 
slider3.oninput = function() {
    transparent = this.value;
    rgbcolor = 'rgba(' + tmp1 + ',' + tmp2+ ',' + tmp3 + ',' + transparent + ')';
}


//undo redo
let undoStack = [];
let redoStack = [];
function saveDraw() {
  redoStack = [];
  undoStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
};


//finish texting
function Enter(e) {
    var keyCode = e.keyCode;
    if (keyCode == 13) {
        ctx.fillStyle = rgbcolor;
        ctx.font = fontsize + 'px ' + myfont;
        ctx.fillText(this.value, lastX, lastY+5);
        document.body.removeChild(this);
    }
}


//mouse listener
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", function(e) {
    lastX = e.offsetX;
    lastY = e.offsetY;
    saveDraw(); 

    if(which_funct == 'pencil' || which_funct == 'eraser' || which_funct == 'rainbow') {
        isDrawing = true;
    }
    else if(which_funct == 'bucket'){
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = rgbcolor;
        ctx.fill();
    }
    else if(which_funct == 'input') {
        ctx.globalCompositeOperation = "source-over";
          
        var input = document.createElement('input');

        input.type = 'text';
        input.style.position = 'fixed';
        input.style.left = (lastX+575) + 'px';
        input.style.top = (lastY+190) + 'px';
        input.style.fontSize = fontsize + 'px';
        input.style.color = rgbcolor;
        input.style['font-family'] = myfont;

        document.body.appendChild(input);
        input.onkeydown = Enter;    
    }
    else if(which_funct == 'circle' || which_funct == 'rectangle' || which_funct == 'triangle') {
        dragging = true;
        dragStartPosi_x = lastX;
        dragStartPosi_y = lastY;
        screenShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
});
canvas.addEventListener("mouseup", function(e) {
    if(which_funct == 'pencil' || which_funct == 'eraser' || which_funct == 'rainbow') isDrawing = false;
    else if(which_funct == 'circle') {
        var tmpx = e.offsetX;
        var tmpy = e.offsetY;
        dragging = false;
        ctx.putImageData(screenShot, 0, 0);
        shape(tmpx,tmpy);
    }
    else if(which_funct == 'rectangle') {
        var tmpx = e.offsetX;
        var tmpy = e.offsetY;
        dragging = false;
        ctx.putImageData(screenShot, 0, 0);
        shape(tmpx,tmpy);
    }
    else if(which_funct == 'triangle') {
        var tmpx = e.offsetX;
        var tmpy = e.offsetY;
        dragging = false;
        ctx.putImageData(screenShot, 0, 0);
        shape(tmpx,tmpy);
    }
});
canvas.addEventListener("mouseout", function() { 
    if(which_funct == 'pencil' || which_funct == 'eraser' || which_funct == 'rainbow') isDrawing = false;
    else if(which_funct == 'triangle' || which_funct == 'rectangle' || which_funct == 'circle') dragging = false;
});


//rectangle circle triangle
function shape(x,y) {
    if(which_funct == 'circle') {
        var radius = Math.sqrt(Math.pow((dragStartPosi_x - x), 2) + Math.pow((dragStartPosi_y - y), 2));
        ctx.beginPath();
        ctx.arc(dragStartPosi_x, dragStartPosi_y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = rgbcolor;
        ctx.fill();
    }
    else if(which_funct == 'rectangle') {
        ctx.beginPath();
        ctx.rect(dragStartPosi_x, dragStartPosi_y, x-dragStartPosi_x, y-dragStartPosi_y);
        ctx.fillStyle = rgbcolor;
        ctx.fill();
    }
    else if(which_funct == 'triangle') {
        var radius = Math.sqrt(Math.pow((dragStartPosi_x - x), 2) + Math.pow((dragStartPosi_y - y), 2));
        ctx.beginPath();
        ctx.moveTo(dragStartPosi_x, dragStartPosi_y);
        ctx.lineTo(dragStartPosi_x-radius/2-15, dragStartPosi_y+radius);
        ctx.lineTo(dragStartPosi_x+radius/2+15, dragStartPosi_y+radius);
        ctx.lineTo(dragStartPosi_x, dragStartPosi_y);
        ctx.closePath();
        ctx.fillStyle = rgbcolor;
        ctx.fill();
    }
}


//draw function
function draw(e) {
    if(isDrawing) {
        if(which_funct == 'pencil') {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = rgbcolor;
        }
        else if(which_funct == 'rainbow') {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = 'hsl(' + hue + ',' + '100%, 50%)';
            if (hue >= 360) hue = 0;
            hue++;
        }
        else if(which_funct == 'eraser') {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = 'rgba(0,0,0,1.0)';
        }
        ctx.beginPath() 
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();    
    }
    else if(dragging) {
        ctx.globalCompositeOperation = "source-over";
        ctx.putImageData(screenShot, 0, 0);
        shape(lastX , lastY);
    }
    lastX = e.offsetX;  //needs to be put here or it will affact shape
    lastY = e.offsetY;    
}


//reset
function reset() {
    saveDraw();
    ctx.clearRect(0 , 0 , canvas.width , canvas.height);
}


//upload
document.getElementById('btn_file').addEventListener('change', function(e) {
    ctx.globalCompositeOperation = "source-over";
    if(e.target.files) {
        let imageFile = e.target.files[0]; 
        var reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = function (e) {
            var myImage = new Image(); 
            myImage.src = e.target.result; 
            myImage.onload = function() {
                ctx.drawImage(myImage,0,0); 
            }
        }
    }
    saveDraw();
});


//download
download_img = function(el) {
    var image = canvas.toDataURL("image/png");
    el.href = image;
};


//main functoin
function clickfun(x) {
    var cursor = document.getElementById("myCanvas");
    switch(x) {
        case 'pencil':
            cursor.style.cursor = "url('./img/cursor_pencil.png') 0 40, auto";
            which_funct = 'pencil';
            break;
        case 'rainbow':
            cursor.style.cursor = "url('./img/cursor_rainbow.png') 0 40, auto";
            which_funct = 'rainbow';
            break;
        case 'eraser':
            cursor.style.cursor = "url('./img/cursor_eraser.png') 0 40, auto";
            which_funct = 'eraser';
            break;
        case 'reset':
            reset();
            break;
        case 'undo':
            if (undoStack.length > 0) {
                redoStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
                const imageData = undoStack.shift();
                ctx.putImageData(imageData, 0, 0);
            }
            break;
        case 'redo':
            if (redoStack.length > 0) {
                undoStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
                const imageData = redoStack.shift();
                ctx.putImageData(imageData, 0, 0);
            }
            break;
        case 'upload':
            document.getElementById("btn_file").click();
            break;
        case 'input':
            alert("step:\n1. press on the canvas.\n2. focus on the textbox.\n3. input your words.\n4. press \"ENTER\" directly after finishing.");
            cursor.style.cursor = "url('./img/cursor_typing.png') 0 40, auto";
            which_funct = 'input';
            break;
        case 'circle':
            cursor.style.cursor = "url('./img/cursor_circle.png') 25 25, auto";
            which_funct = 'circle';
            break;
        case 'rectangle':
            cursor.style.cursor = "url('./img/cursor_rectangle.png') 13 13, auto";
            which_funct = 'rectangle';
            break;
        case 'triangle':
            cursor.style.cursor = "url('./img/cursor_triangle.png') 38 15, auto";
            which_funct = 'triangle';
            break;
        case 'bucket':
            cursor.style.cursor = "url('./img/cursor_bucket.png') 0 0, auto";
            which_funct = 'bucket';
            break;
        default:
            console.log('Sorry');
            break;
    }
}