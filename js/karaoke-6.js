var dates6 = []; // Lyrics timing
var startSeconds6; // Start time
var linesCount6; // Number of Lyric lines
var updateTimeout6; // To keep track of the current update timeout

function karaoke6() {
    var xhttp6 = new XMLHttpRequest(); // Load lyrics
    xhttp6.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var text6 = xhttp6.responseText;
            var lines6 = text6.split("\n");
            linesCount6 = lines6.length;
            for (var i = 0; i < lines6.length; i++) {
                if (lines6[i] != "") {
                    var lyricText6 = lines6[i].replace(/ *\[[^)]*\] */g, ""); // Read lyric text
                    var timing6 = lines6[i].match(/\[([^)]+)\]/)[1]; // Read lyric timing
                    var time6 = timing6.split(':');
                    var date6 = new Date();
                    date6.setMinutes(time6[0]);
                    var subTime6 = time6[1].split('.');
                    date6.setSeconds(subTime6[0]);
                    date6.setMilliseconds(subTime6[1] * 10);
                    dates6[i] = date6;
                    var style6 = (i == 0) ? "highlight6" : "plain6";
                    document.getElementById("lyrics6").innerHTML += "<div class=\"" + style6 + "\" id=\"lyrics6-" + i + "\">" + lyricText6 + "</div>"; // Add lyric to page
                }
            }
        }
    };
    xhttp6.open("GET", "https://d1ts5g4ys243sh.cloudfront.net/proyectos_especiales_prod/especiales-multimedia/shakira/letras/ultima.lrc?v8", true);
    xhttp6.send();
}

function start6() {
    var player5 = document.getElementById("player6");

    // Pausar otros audios si están reproduciéndose
    var otherAudios = document.querySelectorAll('audio');
    otherAudios.forEach(audio => {
        if (audio !== player6) {
            audio.pause(); // Pausa cualquier otro audio
        }
    });

    startSeconds6 = new Date().getTime(); // Song just started

    // Clear previous lyrics highlight if any
    var lyricsDivs6 = document.querySelectorAll("#lyrics6 > div");
    lyricsDivs6.forEach(function(div) {
        div.className = "plain6";
    });

    // Schedule first lyric update
    var nextTime6 = dates6[0].getMinutes() * 60000 + dates6[0].getSeconds() * 1000 + dates6[0].getMilliseconds();
    updateTimeout6 = setTimeout(function() { update6(0, linesCount6) }, nextTime6); 
}

function update6(current6, last6) {
    if (current6 < last6) {
        document.getElementById("lyrics6-" + current6).className = "highlight6"; // Update current lyric style
        if (current6 != 0) {
            document.getElementById("lyrics6-" + (current6 - 1)).className = "plain6"; // Update previous lyric style
        }
        var currentSeconds6 = new Date().getTime();
        var passedSeconds6 = currentSeconds6 - startSeconds6;
        var nextTime6 = dates6[current6].getMinutes() * 60000 + dates6[current6].getSeconds() * 1000 + dates6[current6].getMilliseconds() - passedSeconds6;
        
        // Clear previous update timeout
        if (updateTimeout6) {
            clearTimeout(updateTimeout6);
        }

        // Schedule next lyric update
        updateTimeout6 = setTimeout(function() { update6(current6 + 1, last6) }, nextTime6); 
    }
}

window.addEventListener('load', function() {
    karaoke6(); // Inicializa la primera función de karaoke
});
