var dates2 = []; // Lyrics timing
var startSeconds2; // Start time
var linesCount2; // Number of Lyric lines
var updateTimeout2; // To keep track of the current update timeout

function karaoke2() {
    var xhttp2 = new XMLHttpRequest(); // Load lyrics
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var text2 = xhttp2.responseText;
            var lines2 = text2.split("\n");
            linesCount2 = lines2.length;
            for (var i = 0; i < lines2.length; i++) {
                if (lines2[i] != "") {
                    var lyricText2 = lines2[i].replace(/ *\[[^)]*\] */g, ""); // Read lyric text
                    var timing2 = lines2[i].match(/\[([^)]+)\]/)[1]; // Read lyric timing
                    var time2 = timing2.split(':');
                    var date2 = new Date();
                    date2.setMinutes(time2[0]);
                    var subTime2 = time2[1].split('.');
                    date2.setSeconds(subTime2[0]);
                    date2.setMilliseconds(subTime2[1] * 10);
                    dates2[i] = date2;
                    var style2 = (i == 0) ? "highlight2" : "plain2";
                    document.getElementById("lyrics2").innerHTML += "<div class=\"" + style2 + "\" id=\"lyrics2-" + i + "\">" + lyricText2 + "</div>"; // Add lyric to page
                }
            }
        }
    };
    xhttp2.open("GET", "https://yac130.github.io/shakira/letras/cut-me-deep.lrc?v12", true);
    xhttp2.send();
}

function start2() {
    var player2 = document.getElementById("player2");

    // Pausar otros audios si están reproduciéndose
    var otherAudios = document.querySelectorAll('audio');
    otherAudios.forEach(audio => {
        if (audio !== player2) {
            audio.pause(); // Pausa cualquier otro audio
        }
    });

    startSeconds2 = new Date().getTime(); // Song just started

    // Clear previous lyrics highlight if any
    var lyricsDivs2 = document.querySelectorAll("#lyrics2 > div");
    lyricsDivs2.forEach(function(div) {
        div.className = "plain2";
    });

    // Schedule first lyric update
    var nextTime2 = dates2[0].getMinutes() * 60000 + dates2[0].getSeconds() * 1000 + dates2[0].getMilliseconds();
    updateTimeout2 = setTimeout(function() { update2(0, linesCount2) }, nextTime2); 
}

function update2(current2, last2) {
    if (current2 < last2) {
        document.getElementById("lyrics2-" + current2).className = "highlight2"; // Update current lyric style
        if (current2 != 0) {
            document.getElementById("lyrics2-" + (current2 - 1)).className = "plain2"; // Update previous lyric style
        }
        var currentSeconds2 = new Date().getTime();
        var passedSeconds2 = currentSeconds2 - startSeconds2;
        var nextTime2 = dates2[current2].getMinutes() * 60000 + dates2[current2].getSeconds() * 1000 + dates2[current2].getMilliseconds() - passedSeconds2;
        
        // Clear previous update timeout
        if (updateTimeout2) {
            clearTimeout(updateTimeout2);
        }

        // Schedule next lyric update
        updateTimeout2 = setTimeout(function() { update2(current2 + 1, last2) }, nextTime2); 
    }
}

window.addEventListener('load', function() {
    karaoke2(); // Inicializa la primera función de karaoke
});
