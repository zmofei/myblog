// var links = document.getElementById('links');
// var width = links.clientWidth;

// var bgCtx = canvasGenrate();

// links.appendChild(bgCtx.canvas);
// var bgRadius = 40;

// bgCtx.lineWidth = 0.3;

// bgCtx.beginPath();
// drawCricle(bgCtx, width / 2, bgRadius + 80 * 4, bgRadius);
// drawCricle(bgCtx, width / 2, bgRadius + 80 * 4, bgRadius + 80);
// drawCricle(bgCtx, width / 2, bgRadius + 80 * 4, bgRadius + 80 * 2);
// bgCtx.strokeStyle = 'white';
// bgCtx.stroke();

// bgCtx.beginPath();
// drawCricle(bgCtx, width / 2, bgRadius + 80 * 4, bgRadius + 80 * 2.5);
// drawCricle(bgCtx, width / 2, bgRadius + 80 * 4, bgRadius + 80 * 3);
// bgCtx.strokeStyle = 'black';
// bgCtx.stroke();


// function drawCricle(ctx, x, y, radius) {
//     ctx.moveTo(x + radius, y)
//     ctx.arc(x, y, radius, 0, Math.PI * 2);
// }




// function canvasGenrate() {
//     var canvas = document.createElement('canvas');
//     var ctx = canvas.getContext('2d');
//     canvas.height = canvas.style.height = width * 1.618;
//     canvas.width = canvas.style.width = width;

//     var devicePixelRatio = window.devicePixelRatio || 1;
//     var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
//         ctx.mozBackingStorePixelRatio ||
//         ctx.msBackingStorePixelRatio ||
//         ctx.oBackingStorePixelRatio ||
//         ctx.backingStorePixelRatio || 1;
//     var ratio = devicePixelRatio / backingStoreRatio;

//     if (devicePixelRatio !== backingStoreRatio) {
//         var oldWidth = canvas.width;
//         var oldHeight = canvas.height;

//         canvas.width = oldWidth * ratio;
//         canvas.height = oldHeight * ratio;

//         canvas.style.width = oldWidth + 'px';
//         canvas.style.height = oldHeight + 'px';

//         ctx.scale(ratio, ratio);
//     }
//     return ctx;
// }
