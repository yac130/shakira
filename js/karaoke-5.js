var dates5 = []; // Lyrics timing
var startSeconds5; // Start time
var linesCount5; // Number of Lyric lines
var updateTimeout5; // To keep track of the current update timeout

function karaoke5() {
    var xhttp5 = new XMLHttpRequest(); // Load lyrics
    xhttp5.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var text5 = xhttp5.responseText;
            var lines5 = text5.split("\n");
            linesCount5 = lines5.length;
            for (var i = 0; i < lines5.length; i++) {
                if (lines5[i] != "") {
                    var lyricText5 = lines5[i].replace(/ *\[[^)]*\] */g, ""); // Read lyric text
                    var timing5 = lines5[i].match(/\[([^)]+)\]/)[1]; // Read lyric timing
                    var time5 = timing5.split(':');
                    var date5 = new Date();
                    date5.setMinutes(time5[0]);
                    var subTime5 = time5[1].split('.');
                    date5.setSeconds(subTime5[0]);
                    date5.setMilliseconds(subTime5[1] * 10);
                    dates5[i] = date5;
                    var style5 = (i == 0) ? "highlight5" : "plain5";
                    document.getElementById("lyrics5").innerHTML += "<div class=\"" + style5 + "\" id=\"lyrics5-" + i + "\">" + lyricText5 + "</div>"; // Add lyric to page
                }
            }
        }
    };
    xhttp5.open("GET", "https://yac130.github.io/shakira/letras/tqg.lrc?v5", true);
    xhttp5.send();
}

function start5() {
    var player5 = document.getElementById("player5");

    // Pausar otros audios si están reproduciéndose
    var otherAudios = document.querySelectorAll('audio');
    otherAudios.forEach(audio => {
        if (audio !== player5) {
            audio.pause(); // Pausa cualquier otro audio
        }
    });

    startSeconds5 = new Date().getTime(); // Song just started

    // Clear previous lyrics highlight if any
    var lyricsDivs5 = document.querySelectorAll("#lyrics5 > div");
    lyricsDivs5.forEach(function(div) {
        div.className = "plain5";
    });

    // Schedule first lyric update
    var nextTime5 = dates5[0].getMinutes() * 60000 + dates5[0].getSeconds() * 1000 + dates5[0].getMilliseconds();
    updateTimeout5 = setTimeout(function() { update5(0, linesCount5) }, nextTime5); 
}

function update5(current5, last5) {
    if (current5 < last5) {
        document.getElementById("lyrics5-" + current5).className = "highlight5"; // Update current lyric style
        if (current5 != 0) {
            document.getElementById("lyrics5-" + (current5 - 1)).className = "plain5"; // Update previous lyric style
        }
        var currentSeconds5 = new Date().getTime();
        var passedSeconds5 = currentSeconds5 - startSeconds5;
        var nextTime5 = dates5[current5].getMinutes() * 60000 + dates5[current5].getSeconds() * 1000 + dates5[current5].getMilliseconds() - passedSeconds5;
        
        // Clear previous update timeout
        if (updateTimeout5) {
            clearTimeout(updateTimeout5);
        }

        // Schedule next lyric update
        updateTimeout5 = setTimeout(function() { update5(current5 + 1, last5) }, nextTime5); 
    }
}

window.addEventListener('load', function() {
    karaoke5(); // Inicializa la primera función de karaoke
});
