(function() {
    // selecting the Canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var rstbutn = document.getElementById("resetsign");
    var hiddeninput = document.getElementById("hiddeninput");

    // Variables
    var canvasx = $(canvas).offset().left;
    var canvasy = $(canvas).offset().top;
    var mousedown = false;
    let initialPos;
    let nextPos;
    let signData;

    $(canvas).on("mousedown", function(e) {
        mousedown = true;
        initialPos = [e.pageX - canvasx, e.pageY - canvasy];
    });

    $(canvas).on("touchstart", function(e) {
        mousedown = true;
        initialPos = [
            e.originalEvent.touches[0].pageX - canvasx,
            e.originalEvent.touches[0].pageY - canvasy
        ];
    });

    $(canvas).on("mouseup", function() {
        mousedown = false;
        signData = canvas.toDataURL();
        $(hiddeninput).val(signData);
    });

    $(canvas).on("touchend", function() {
        mousedown = false;
        signData = canvas.toDataURL();
        $(hiddeninput).val(signData);
    });

    $(canvas).on("mousemove", function(e) {
        nextPos = [e.pageX - canvasx, e.pageY - canvasy];
        if (mousedown) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(initialPos[0], initialPos[1]);
            ctx.lineTo(nextPos[0], nextPos[1]);
            ctx.stroke();
            initialPos = nextPos;
        }
    });

    $(canvas).on("touchmove", function(e) {
        e.preventDefault();
        nextPos = [
            e.originalEvent.touches[0].pageX - canvasx,
            e.originalEvent.touches[0].pageY - canvasy
        ];
        if (mousedown) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(initialPos[0], initialPos[1]);
            ctx.lineTo(nextPos[0], nextPos[1]);
            ctx.stroke();
            initialPos = nextPos;
        }
    });

    $(rstbutn).on("click", function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    });
})();
