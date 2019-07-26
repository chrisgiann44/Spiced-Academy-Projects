(function() {
    var currentPlayer = "player1";

    /* ------ switchPlayers---------*/

    var single;

    $(".single").on("click", function() {
        if (single != true) {
            single = true;
            $(".single button")
                .html("Single Player Activated")
                .css({
                    color: "red",
                    opacity: "0.6",
                    fontWeight: "bold"
                });
        } else {
            $(".single button")
                .html("Activate Single Player!")
                .css({
                    color: "white",
                    opacity: "1",
                    fontWeight: "normal"
                });
            single = false;
        }
    });

    function switchPlayers() {
        if (currentPlayer == "player1") {
            $(".keyhole").addClass("player2");
            $(".movingSlot").addClass("on");
            currentPlayer = "player2";
            $(".pl1").removeClass("on");
            $(".pl2").addClass("on");
            if (single == true) {
                setTimeout(function() {
                    pcPlays();
                }, 2000);
            }
        } else {
            currentPlayer = "player1";
            $(".keyhole").removeClass("player2");
            $(".keyhole").addClass("player1");
            $(".pl2").removeClass("on");
            $(".pl1").addClass("on");
            $(".movingSlot").removeClass("on");
        }
    }

    /* ------ ADD EVENT ON CLICK ---------*/

    $(".column").on("click", function(e) {
        /* ------ FIND SHOTS IN COLUMN ---------*/
        $(".movingSlot").css({
            visibility: "visible"
        });
        $(".movingSlot").addClass("fall");

        setTimeout(function() {
            $(".movingSlot").removeClass("fall");
        }, 900);

        $(".keyhole").removeClass("on");

        var slotsInColumn = $(e.currentTarget).find(".slot");

        /* ------ add shots ---------*/

        for (var i = 5; i >= 0; i--) {
            if (
                !slotsInColumn.eq(i).hasClass("player1") &&
                !slotsInColumn.eq(i).hasClass("player2")
            ) {
                slotsInColumn.eq(i).addClass(currentPlayer);
                break;
            }
        }
        /* ------ case column is full ---------*/

        if (i == -1) {
            return;
        }

        /* ------ FIND SHOTS IN COLUMN ---------*/

        var slotsInRow = $(".row" + i);

        /* ------ FIND SHOTS DG ---------*/

        var yYy = i;
        var xXx = $(e.currentTarget).index();

        /* DIAG LEFT*/
        var slotsDiagLeft = [];

        /* LEFT UP*/

        for (var w = 0; w <= 5; w++) {
            if (xXx - w < 0 || yYy - w < 0) {
                break;
            }
            slotsDiagLeft.push(
                $(".board")
                    .children()
                    .eq(xXx - w)
                    .find(".slot")
                    .eq(yYy - w)
            );
        }

        /* RIGHT DOWN*/
        for (var w = 1; w <= 5; w++) {
            if (xXx + w > 6 || yYy + w > 5) {
                break;
            }
            slotsDiagLeft.unshift(
                $(".board")
                    .children()
                    .eq(xXx + w)
                    .find(".slot")
                    .eq(yYy + w)
            );
        }

        /* DIAG RIGHT*/

        var slotsDiagRight = [];

        /* RIGHT UP*/
        /* LEFT DOWN*/

        for (var w = 0; w <= 5; w++) {
            if (xXx + w > 6 || yYy - w < 0) {
                break;
            }
            slotsDiagRight.push(
                $(".board")
                    .children()
                    .eq(xXx + w)
                    .find(".slot")
                    .eq(yYy - w)
            );
        }

        for (var w = 1; w <= 5; w++) {
            if (xXx - w < 0 || yYy + w > 5) {
                break;
            }
            slotsDiagRight.unshift(
                $(".board")
                    .children()
                    .eq(xXx - w)
                    .find(".slot")
                    .eq(yYy + w)
            );
        }

        /* ------ checking for checkForVictory ---------*/

        if (checkForVictory(slotsInColumn)) {
            $(".pl").removeClass("on");
            $(".column").off("click");
            $("body").off("keydown");
            if (currentPlayer == "player1") {
                $(".winner").addClass("on");
                $(".winneris p").html(
                    "VERTICAL WIN!" + "<br>" + "And the Winner is: PLAYER 1!!"
                );
            } else {
                $(".winner").addClass("on");
                $(".winneris p").html(
                    "VERTICAL WIN!" + "<br>" + "And the Winner is: PLAYER 2!!"
                );
            }
        } else if (checkForVictory(slotsInRow)) {
            $(".pl").removeClass("on");
            $(".column").off("click");
            $("body").off("keydown");
            if (currentPlayer == "player1") {
                $(".winner").addClass("on");
                $(".winneris p").html(
                    "HORIZONTAL WIN!" + "<br>" + "And the Winner is: PLAYER 1!!"
                );
            } else {
                $(".winner").addClass("on");
                $(".winneris p").html(
                    "HORIZONTAL WIN!" + "<br>" + "And the Winner is: PLAYER 2!!"
                );
            }
        } else if (chVicDg(slotsDiagRight) || chVicDg(slotsDiagLeft)) {
            $(".pl").removeClass("on");
            $(".column").off("click");
            $("body").off("keydown");
            if (currentPlayer == "player1") {
                $(".winner").addClass("on");
                $(".winneris p").html(
                    "DIAGONAL WIN!" + "<br>" + "And the Winner is: PLAYER 1!!"
                );
            } else {
                $(".winner").addClass("on");
                $(".winneris p").html(
                    "DIAGONAL WIN!" + "<br>" + "And the Winner is: PLAYER 2!!"
                );
            }
        } else {
            switchPlayers();
        }
    });

    /* ------ function to check for checkForVictory ---------*/

    function checkForVictory(slot) {
        var count = 0;
        for (var i = 0; i < slot.length; i++) {
            if (slot.eq(i).hasClass(currentPlayer)) {
                count++;
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    /* ------ function to check for checkForVictory DIAGN---------*/

    function chVicDg(slot) {
        var count = 0;
        for (var i = 0; i < slot.length; i++) {
            if (slot[i].hasClass(currentPlayer)) {
                count++;
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
    }

    /* ------ Reset Button ---------*/

    $(".startbt").click(function(e) {
        location.reload();
        e.preventDefault();
    });

    /* ------ Moving slot ---------*/

    $(".container").on("mousemove", function(e) {
        $(".movingSlot").css({
            left: e.pageX - 50 + "px",
            top: e.pageY - 50 + "px"
        });
    });

    /* ------ Key Functions ---------*/

    $("body").on("keydown", function(e) {
        $(".movingSlot").css({
            visibility: "hidden"
        });
        if (e.keyCode == 37 /*ArrowLeft*/) {
            if (!$(".keyhole").hasClass("on")) {
                $(".keyhole")
                    .eq(-1)
                    .addClass("on");
            } else {
                for (var i = 1; i <= $(".keyhole").length; i++) {
                    if (
                        $(".keyhole")
                            .eq(i)
                            .hasClass("on")
                    ) {
                        $(".keyhole")
                            .eq(i)
                            .removeClass("on");
                        $(".keyhole")
                            .eq(i - 1)
                            .addClass("on");
                    }
                }
            }
        } else if (e.keyCode == 39 /*keyRight*/) {
            if (!$(".keyhole").hasClass("on")) {
                $(".keyhole")
                    .eq(0)
                    .addClass("on");
            } else {
                for (var z = 0; z < $(".keyhole").length - 1; z++) {
                    if (
                        $(".keyhole")
                            .eq(z)
                            .hasClass("on")
                    ) {
                        $(".keyhole")
                            .eq(z)
                            .removeClass("on");
                        $(".keyhole")
                            .eq(z + 1)
                            .addClass("on");
                        break;
                    }
                }
            }
        } else if (e.keyCode == 13 /*enter*/) {
            $(".keyhole").addClass("fall");

            setTimeout(function() {
                $(".keyhole").removeClass("fall");
            }, 700);
            var parentColumn = $(".keyhole.on")
                .parent()
                .parent()
                .find(".slot");
            for (var p = 5; p >= 0; p--) {
                if (
                    !parentColumn.eq(p).hasClass("player1") &&
                    !parentColumn.eq(p).hasClass("player2")
                ) {
                    parentColumn.eq(p).addClass(currentPlayer);
                    break;
                }
            }

            if (p == -1) {
                return;
            }
            var slotY = p;
            var columnX = $(".keyhole.on")
                .parent()
                .parent()
                .index();

            var holesInColumn = $(".keyhole.on")
                .parent()
                .parent()
                .find(".slot");

            var holesInRow = $(".row" + p);

            /* DIAG LEFT*/

            var slotsDiagLeftK = [];

            /* LEFT UP*/

            for (var w = 0; w <= 5; w++) {
                if (columnX - w < 0 || slotY - w < 0) {
                    break;
                }
                slotsDiagLeftK.push(
                    $(".board")
                        .children()
                        .eq(columnX - w)
                        .find(".slot")
                        .eq(slotY - w)
                );
            }

            /* RIGHT DOWN*/

            for (var m = 1; m <= 5; m++) {
                if (columnX + m > 6 || slotY + m > 5) {
                    break;
                }
                slotsDiagLeftK.unshift(
                    $(".board")
                        .children()
                        .eq(columnX + m)
                        .find(".slot")
                        .eq(slotY + m)
                );
            }

            /* DIAG RIGHT*/

            var slotsDiagRightK = [];

            /* RIGHT UP*/
            /* LEFT DOWN*/

            for (var n = 0; n <= 5; n++) {
                if (columnX + n > 6 || slotY - n < 0) {
                    break;
                }
                slotsDiagRightK.push(
                    $(".board")
                        .children()
                        .eq(columnX + n)
                        .find(".slot")
                        .eq(slotY - n)
                );
            }

            for (var o = 1; o <= 5; o++) {
                if (columnX - o < 0 || slotY + o > 5) {
                    break;
                }
                slotsDiagRightK.unshift(
                    $(".board")
                        .children()
                        .eq(columnX - o)
                        .find(".slot")
                        .eq(slotY + o)
                );
            }

            if (checkForVictory(holesInColumn)) {
                $(".pl").removeClass("on");
                $("body").off("keydown");
                $(".column").off("click");
                if (currentPlayer == "player1") {
                    $(".winner").addClass("on");
                    $(".winneris p").html(
                        "VERTICAL WIN!" +
                            "<br>" +
                            "And the Winner is: PLAYER 1!!"
                    );
                } else {
                    $(".winner").addClass("on");
                    $(".winneris p").html(
                        "VERTICAL WIN!" +
                            "<br>" +
                            "And the Winner is: PLAYER 2!!"
                    );
                }
            } else if (checkForVictory(holesInRow)) {
                $(".pl").removeClass("on");
                $("body").off("keydown");
                $(".column").off("click");
                if (currentPlayer == "player1") {
                    $(".winner").addClass("on");
                    $(".winneris p").html(
                        "HORIZONTAL WIN!" +
                            "<br>" +
                            "And the Winner is: PLAYER 1!!"
                    );
                } else {
                    $(".winner").addClass("on");
                    $(".winneris p").html(
                        "HORIZONTAL WIN!" +
                            "<br>" +
                            "And the Winner is: PLAYER 2!!"
                    );
                }
            } else if (chVicDg(slotsDiagLeftK) || chVicDg(slotsDiagRightK)) {
                $(".pl").removeClass("on");
                $("body").off("keydown");
                $(".column").off("click");
                if (currentPlayer == "player1") {
                    $(".winner").addClass("on");
                    $(".winneris p").html(
                        "DIAGONAL WIN!" +
                            "<br>" +
                            "And the Winner is: PLAYER 1!!"
                    );
                } else {
                    $(".winner").addClass("on");
                    $(".winneris p").html(
                        "DIAGONAL WIN!" +
                            "<br>" +
                            "And the Winner is: PLAYER 2!!"
                    );
                }
            } else {
                switchPlayers();
            }
        } else {
            return;
        }
    });

    $("#coln").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if ($(e.target).text() == 7) {
            $(".board .column:nth-child(-n+3)").addClass("optional");
        } else if ($(e.target).text() == 8) {
            $(".board .option1").addClass("optional");
            $(".board .option2").addClass("optional");
            $(".board .option3").removeClass("optional");
        } else if ($(e.target).text() == 9) {
            $(".board .option1").addClass("optional");
            $(".board .option3").removeClass("optional");
            $(".board .option2").removeClass("optional");
        } else if ($(e.target).text() == 10) {
            $(".board .option3").removeClass("optional");
            $(".board .option2").removeClass("optional");
            $(".board .option1").removeClass("optional");
        } else {
            return;
        }
        for (var i = 0; i <= $(".column").length; i++) {
            if (
                !$(".column")
                    .eq(i)
                    .hasClass("optional")
            ) {
                $(".column")
                    .eq(i)
                    .find(".slot")
                    .eq(0)
                    .css({
                        borderTopLeftRadius: 20 + "px"
                    });
                $(".column")
                    .eq(i)
                    .find(".slot")
                    .eq(-1)
                    .css({
                        borderBottomLeftRadius: 20 + "px"
                    });
                $(".column")
                    .eq(i + 1)
                    .find(".slot")
                    .eq(0)
                    .css({
                        borderTopLeftRadius: 0 + "px"
                    });
                $(".column")
                    .eq(i + 1)
                    .find(".slot")
                    .eq(-1)
                    .css({
                        borderBottomLeftRadius: 0 + "px"
                    });

                break;
            }
        }
    });

    /* ------ PLAYING WITH PC ---------*/

    function getRandomNumber(num) {
        return Math.floor(Math.random() * num);
    }

    function pcPlays() {
        var freeColumns = 0;

        for (var i = 0; i < $(".column").length; i++) {
            if (
                !$(".column")
                    .eq(i)
                    .hasClass("optional")
            ) {
                freeColumns++;
            }
        }
        var rNum = getRandomNumber(-freeColumns);

        for (var q = 5; q >= 0; q--) {
            if (
                !$(".column")
                    .eq(rNum)
                    .find(".slot")
                    .eq(q)
                    .hasClass("player1") &&
                !$(".column")
                    .eq(rNum)
                    .find(".slot")
                    .eq(q)
                    .hasClass("player2")
            ) {
                console.log($(".column").eq(rNum));
                $(".column")
                    .eq(rNum)
                    .find(".slot")
                    .eq(q)
                    .addClass(currentPlayer);
                break;
            }
        }
        switchPlayers();
    }

    /* ------ END ---------*/
})();
