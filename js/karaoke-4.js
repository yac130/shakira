var dates4 = []; // Lyrics timing
var startSeconds4; // Start time
var linesCount4; // Number of Lyric lines
var updateTimeout4; // To keep track of the current update timeout

function karaoke4() {
    var xhttp4 = new XMLHttpRequest(); // Load lyrics
    xhttp4.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var text4 = xhttp4.responseText;
            var lines4 = text4.split("\n");
            linesCount4 = lines4.length;
            for (var i = 0; i < lines4.length; i++) {
                if (lines4[i] != "") {
                    var lyricText4 = lines4[i].replace(/ *\[[^)]*\] */g, ""); // Read lyric text
                    var timing4 = lines4[i].match(/\[([^)]+)\]/)[1]; // Read lyric timing
                    var time4 = timing4.split(':');
                    var date4 = new Date();
                    date4.setMinutes(time4[0]);
                    var subTime4 = time4[1].split('.');
                    date4.setSeconds(subTime4[0]);
                    date4.setMilliseconds(subTime4[1] * 10);
                    dates4[i] = date4;
                    var style4 = (i == 0) ? "highlight4" : "plain4";
                    document.getElementById("lyrics4").innerHTML += "<div class=\"" + style4 + "\" id=\"lyrics4-" + i + "\">" + lyricText4 + "</div>"; // Add lyric to page
                }
            }
        }
    };
    xhttp4.open("GET", "https://d1ts5g4ys243sh.cloudfront.net/proyectos_especiales_prod/especiales-multimedia/shakira/letras/cazador-de-amor.lrc?v5", true);
    xhttp4.send();
}

function start4() {
    var player4 = document.getElementById("player4");

    // Pausar otros audios si están reproduciéndose
    var otherAudios = document.querySelectorAll('audio');
    otherAudios.forEach(audio => {
        if (audio !== player4) {
            audio.pause(); // Pausa cualquier otro audio
        }
    });

    startSeconds4 = new Date().getTime(); // Song just started

    // Clear previous lyrics highlight if any
    var lyricsDivs4 = document.querySelectorAll("#lyrics4 > div");
    lyricsDivs4.forEach(function(div) {
        div.className = "plain4";
    });

    // Schedule first lyric update
    var nextTime4 = dates4[0].getMinutes() * 60000 + dates4[0].getSeconds() * 1000 + dates4[0].getMilliseconds();
    updateTimeout4 = setTimeout(function() { update4(0, linesCount4) }, nextTime4); 
}

function update4(current4, last4) {
    if (current4 < last4) {
        document.getElementById("lyrics4-" + current4).className = "highlight4"; // Update current lyric style
        if (current4 != 0) {
            document.getElementById("lyrics4-" + (current4 - 1)).className = "plain4"; // Update previous lyric style
        }
        var currentSeconds4 = new Date().getTime();
        var passedSeconds4 = currentSeconds4 - startSeconds4;
        var nextTime4 = dates4[current4].getMinutes() * 60000 + dates4[current4].getSeconds() * 1000 + dates4[current4].getMilliseconds() - passedSeconds4;
        
        // Clear previous update timeout
        if (updateTimeout4) {
            clearTimeout(updateTimeout4);
        }

        // Schedule next lyric update
        updateTimeout4 = setTimeout(function() { update4(current4 + 1, last4) }, nextTime4); 
    }
}

window.addEventListener('load', function() {
    karaoke4(); // Inicializa la primera función de karaoke
});
