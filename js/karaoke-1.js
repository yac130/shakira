    
  
    var dates = []; // Lyrics timing
        var startSeconds; // Start time
        var linesCount; // Number of Lyric lines
        var updateTimeout; // To keep track of the current update timeout

        function karaoke() {
            var xhttp = new XMLHttpRequest(); // Load lyrics
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var text = xhttp.responseText;
                    var lines = text.split("\n");
                    linesCount = lines.length;
                    for (var i = 0; i < lines.length; i++) {
                        if (lines[i] != "") {
                            var lyricText = lines[i].replace(/ *\[[^)]*\] */g, ""); // Read lyric text
                            var timing = lines[i].match(/\[([^)]+)\]/)[1]; // Read lyric timing
                            var time = timing.split(':');
                            var date = new Date();
                            date.setMinutes(time[0]);
                            var subTime = time[1].split('.');
                            date.setSeconds(subTime[0]);
                            date.setMilliseconds(subTime[1] * 10);
                            dates[i] = date;
                            var style = (i == 0) ? "highlight" : "plain";
                            document.getElementById("lyrics").innerHTML += "<div class=\"" + style + "\" id=\"" + i + "\">" + lyricText + "</div>"; // Add lyric to page
                        }
                    }
                }
            };
            xhttp.open("GET", "https://yac130.github.io/shakira/letras/te-dejo-madrid.lrc?v3", true);
            xhttp.send();
        }

        function start() {
            var player = document.getElementById("player");
            // Ensure player controls are visible
            // player.controls = true;

            // Pausar otros audios si están reproduciéndose
            var otherAudios = document.querySelectorAll('audio');
            otherAudios.forEach(audio => {
                if (audio !== player) {
                    audio.pause(); // Pausa cualquier otro audio
                }
            });

            startSeconds = new Date().getTime(); // Song just started

            // Clear previous lyrics highlight if any
            var lyricsDivs = document.querySelectorAll("#lyrics > div");
            lyricsDivs.forEach(function(div) {
                div.className = "plain";
            });

            // Schedule first lyric update
            var nextTime = dates[0].getMinutes() * 60000 + dates[0].getSeconds() * 1000 + dates[0].getMilliseconds();
            updateTimeout = setTimeout(function() { update(0, linesCount) }, nextTime); 
        }

        function update(current, last) {
            if (current < last) {
                document.getElementById(current).className = "highlight"; // Update current lyric style
                if (current != 0) {
                    document.getElementById(current - 1).className = "plain"; // Update previous lyric style
                }
                var currentSeconds = new Date().getTime();
                var passedSeconds = currentSeconds - startSeconds;
                var nextTime = dates[current].getMinutes() * 60000 + dates[current].getSeconds() * 1000 + dates[current].getMilliseconds() - passedSeconds;
                
                // Clear previous update timeout
                if (updateTimeout) {
                    clearTimeout(updateTimeout);
                }

                // Schedule next lyric update
                updateTimeout = setTimeout(function() { update(current + 1, last) }, nextTime); 
            }
        }


        window.addEventListener('load', function() {
            karaoke(); // Inicializa la primera función de karaoke
        });