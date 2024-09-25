var dates3 = []; // Lyrics timing
var startSeconds3; // Start time
var linesCount3; // Number of Lyric lines
var updateTimeout3; // To keep track of the current update timeout

function karaoke3() {
    var xhttp3 = new XMLHttpRequest(); // Load lyrics
    xhttp3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var text3 = xhttp3.responseText;
            var lines3 = text3.split("\n");
            linesCount3 = lines3.length;
            for (var i = 0; i < lines3.length; i++) {
                if (lines3[i] != "") {
                    var lyricText3 = lines3[i].replace(/ *\[[^)]*\] */g, ""); // Read lyric text
                    var timing3 = lines3[i].match(/\[([^)]+)\]/)[1]; // Read lyric timing
                    var time3 = timing3.split(':');
                    var date3 = new Date();
                    date3.setMinutes(time3[0]);
                    var subTime3 = time3[1].split('.');
                    date3.setSeconds(subTime3[0]);
                    date3.setMilliseconds(subTime3[1] * 10);
                    dates3[i] = date3;
                    var style3 = (i == 0) ? "highlight3" : "plain3";
                    document.getElementById("lyrics3").innerHTML += "<div class=\"" + style3 + "\" id=\"lyrics3-" + i + "\">" + lyricText3 + "</div>"; // Add lyric to page
                }
            }
        }
    };
    xhttp3.open("GET", "https://yac130.github.io/shakira/letras/when-a-woman.lrc?v4", true);
    xhttp3.send();
}

function start3() {
    var player3 = document.getElementById("player3");

    // Pausar otros audios si están reproduciéndose
    var otherAudios = document.querySelectorAll('audio');
    otherAudios.forEach(audio => {
        if (audio !== player3) {
            audio.pause(); // Pausa cualquier otro audio
        }
    });

    startSeconds3 = new Date().getTime(); // Song just started

    // Clear previous lyrics highlight if any
    var lyricsDivs3 = document.querySelectorAll("#lyrics3 > div");
    lyricsDivs3.forEach(function(div) {
        div.className = "plain3";
    });

    // Schedule first lyric update
    var nextTime3 = dates3[0].getMinutes() * 60000 + dates3[0].getSeconds() * 1000 + dates3[0].getMilliseconds();
    updateTimeout3 = setTimeout(function() { update3(0, linesCount3) }, nextTime3); 
}

function update3(current3, last3) {
    if (current3 < last3) {
        document.getElementById("lyrics3-" + current3).className = "highlight3"; // Update current lyric style
        if (current3 != 0) {
            document.getElementById("lyrics3-" + (current3 - 1)).className = "plain3"; // Update previous lyric style
        }
        var currentSeconds3 = new Date().getTime();
        var passedSeconds3 = currentSeconds3 - startSeconds3;
        var nextTime3 = dates3[current3].getMinutes() * 60000 + dates3[current3].getSeconds() * 1000 + dates3[current3].getMilliseconds() - passedSeconds3;
        
        // Clear previous update timeout
        if (updateTimeout3) {
            clearTimeout(updateTimeout3);
        }

        // Schedule next lyric update
        updateTimeout3 = setTimeout(function() { update3(current3 + 1, last3) }, nextTime3); 
    }
}

window.addEventListener('load', function() {
    karaoke3(); // Inicializa la primera función de karaoke
});
