/*global $*/
$(window).load(function () {

    (function () {
        var mode = 0;
        $(".projectButton").click(function () {
            if (mode == 0) {
                $("#projectsBox").fadeIn();
                $(".darkerOverlay").fadeIn();
                $('.container').isotope(); //relay the grid out when we open it. ot sure why it does not like hidden divs.
                mode = 1;
            } else {
                $("#projectsBox").fadeOut();
                $(".darkerOverlay").fadeOut();
                mode = 0;
            }


        });

        $('#myAudio').prop("volume", 0.3);

        var $animate, $container, $message, $paragraph, MESSAGES, animate, initialise, scramble;
        MESSAGES = [];
        MESSAGES.push({
            delay: 0,
            text: 'ERIC GOLDE'
        });

        MESSAGES.push({
            delay: 800,
            text: ' —  Developer.'
        });
        MESSAGES.push({
            delay: 1800,
            text: ' —  Creator.'
        });
        MESSAGES.push({
            delay: 3200,
            text: ' —  Maker.'
        });
        MESSAGES.push({
            delay: 4800,
            text: ' '
        });
        $container = $('#container');
        $message = $('#message');
        $animate = $('#animate');
        $paragraph = null;
        scramble = function (element, text, options) {
            var $element, addGlitch, character, defaults, ghostCharacter, ghostCharacters, ghostLength, ghostText, ghosts, glitchCharacter, glitchCharacters, glitchIndex, glitchLength, glitchProbability, glitchText, glitches, i, k, letter, object, order, output, parameters, ref, results, settings, shuffle, target, textCharacters, textLength, wrap;
            defaults = {
                probability: 0.2,
                glitches: '-|/\\',
                blank: '',
                duration: text.length * 40,
                ease: 'easeInOutQuad',
                delay: 0
            };
            $element = $(element);
            settings = $.extend(defaults, options);
            shuffle = function () {
                if (Math.random() < 0.5) {
                    return 1;
                } else {
                    return -1;
                }
            };
            wrap = function (text, classes) {
                return '<span class="' + classes + '">' + text + '</span>';
            };
            glitchText = settings.glitches;
            glitchCharacters = glitchText.split('');
            glitchLength = glitchCharacters.length;
            glitchProbability = settings.probability;
            glitches = function () {
                var j, len, results;
                results = [];
                for (j = 0, len = glitchCharacters.length; j < len; j++) {
                    letter = glitchCharacters[j];
                    results.push(wrap(letter, 'glitch'));
                }
                return results;
            }();
            ghostText = $element.text();
            ghostCharacters = ghostText.split('');
            ghostLength = ghostCharacters.length;
            ghosts = function () {
                var j, len, results;
                results = [];
                for (j = 0, len = ghostCharacters.length; j < len; j++) {
                    letter = ghostCharacters[j];
                    results.push(wrap(letter, 'ghost'));
                }
                return results;
            }();
            textCharacters = text.split('');
            textLength = textCharacters.length;
            order = function () {
                results = [];
                for (var j = 0; 0 <= textLength ? j < textLength : j > textLength; 0 <= textLength ? j++ : j--) {
                    results.push(j);
                }
                return results;
            }.apply(this).sort(this.shuffle);
            output = [];
            for (i = k = 0, ref = textLength; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
                glitchIndex = Math.floor(Math.random() * (glitchLength - 1));
                glitchCharacter = glitches[glitchIndex];
                ghostCharacter = ghosts[i] || settings.blank;
                addGlitch = Math.random() < glitchProbability;
                character = addGlitch ? glitchCharacter : ghostCharacter;
                output.push(character);
            }
            object = {
                value: 0
            };
            target = {
                value: 1
            };
            parameters = {
                duration: settings.duration,
                ease: settings.ease,
                step: function () {
                    var index, l, progress, ref1;
                    progress = Math.floor(object.value * (textLength - 1));
                    for (i = l = 0, ref1 = progress; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
                        index = order[i];
                        output[index] = textCharacters[index];
                    }
                    return $element.html(output.join(''));
                },
                complete: function () {
                    return $element.html(text);
                }
            };
            return $(object).delay(settings.delay).animate(target, parameters);
        };
        animate = function () {
            var data, element, index, j, len, options;
            for (index = j = 0, len = MESSAGES.length; j < len; index = ++j) {
                data = MESSAGES[index];
                element = $paragraph.get(index);
                element.innerText = '';
                options = {
                    delay: data.delay
                };
                scramble(element, data.text, options);
            }
        };
        initialise = function () {
            var index, j, len, text;
            $animate.click(animate);
            for (index = j = 0, len = MESSAGES.length; j < len; index = ++j) {
                text = MESSAGES[index];
                $message.append('<p id="bigFont">');
            }
            $paragraph = $container.find('p');
            animate();
        };
        initialise();
    }.call(this));

    var container = $('.container');
    var dataArray = [];

    $.when(doAjaxGitRequest(1), doAjaxGitRequest(2)).done(function (a1, a2) {

        console.log("Finished all ajax requests: " + dataArray.length);

        dataArray.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        for (var i = 0; i < dataArray.length; i++) {
            //console.log(dataArray[i].name);
            addDatasetToViewableContent(dataArray[i]);
        }
        
        loadSearchableItems();
        
    });


    function doAjaxGitRequest(page) {
        return $.ajax({
            url: "https://api.github.com/users/egold555/repos?per_page=100&page=" + page,
            /*method: "GET",*/
            dataType: "json",
            success: function (data) {
                $.each(data, function (i, item) {

                    dataArray.push(data[i]);
                });

            }
        });
    }

    function addDatasetToViewableContent(item) {
        var content = '<div class="project">\n';
        content = content + '<img src="images/' + getImage(item.name) + '.png">\n';
        content = content + '<h2 class="header">' + getDisplayName(item.name) + '</h2>\n';
        content = content + '<p class="description">' + getDescription(item.description) + '</p>\n';
        content = content + '<a class="btn" href="' + item.html_url + '" title="View Project">View Project</a>\n';
        content = content + '</div>';
        container.append(content);
    }


    //TODO: Find a better way of doing this
    function getImage(name) {
        if (name == "ForgeScratch" || name == "TheSpookReturns") {
            return name;
        } if (name.includes("PLU") || name.includes("Pacific Luthern Univercity")) {
            return "PLU";
        } else if (name.startsWith("5619") || name == "Social-Innovations" || name == "SchoologyReloaded" || name.startsWith("Redshift")) {
            return "SAAS";
        } else if (name.startsWith("Cydia--")) {
            return "Cydia";
        } else if (name.startsWith("CorpseReborn") || name.startsWith("UrlToBlock") || name == "ImageFirewoksReborn") {
            return "Spigot";
        } else if (name == "Comet" || name == "VixenSequences") {
            return "Comet";
        } else if (name == "AltPumpBot" || name == "ForgeScratch-OLD") {
            return "JAVA";
        } else if (name == "DieWebsiteDIE" || name == "EditThatSite" || name == "SchoologyReloaded" || name == "SkypeFormatter" || name == "THREE.js-Tunnel-Thingy" || name == "eric.golde.org") {
            return "HTML";
        } else if (name == "DesktopSlider" || name == "illuminati" || name == "YouAreAnIdiot" || name == "SSHMusicPlayer" || name == "spotifydownloader" || name == "SSHMusicPlayer" || name == "EricsFakeVirusJoke" || name == "relocateWindow") {
            return "C-SHARP";
        } else if (name == "AtseUHC" || name == "BetterCreative" || name == "Cluster" || name == "Crotus-Issues" || name == "EricsBetterClientMod" || name == "Forge-1.11-Base-With-Helpers" || name == "Gulp" || name == "KlawScoreboard" || name == "OroUhcPlugins" || name == "Project-Cicada" || name == "RedHCF" || name == "ReflectionHelper" || name == "ReplaceModsWithForgeCSVMappingsGUI" || name == "TempestsBox") {
            return "Minecraft";
        } else {
            return "GitHub";
        }
    }

    function getDisplayName(name) {

        if (name === "ForgeScratch") {
            return "ScratchForge";
        }

        name = name.replace(/([A-Z])/g, ' $1').trim();

        return name;
    }

    function getDescription(desc) {
        if (desc === null) {
            return "No Description Available 🙁";
        }
        if (desc.length >= 100) {
            return desc.slice(0, 100) + " . . .";
        }
        return desc;
    }



    function loadSearchableItems() {
        //Search bar for projects
        // quick search regex
        var qsRegex;

        // init Isotope
        var $grid = $('.container').isotope({
            itemSelector: '.project',
            layoutMode: 'fitRows',
            filter: function () {
                return qsRegex ? $(this).text().match(qsRegex) : true;
            }
        });

        // use value of search field to filter
        var $quicksearch = $('.quicksearch').keyup(debounce(function () {
            qsRegex = new RegExp($quicksearch.val(), 'gi');
            $grid.isotope();
            console.log("Search method being called");
        }, 200));

        // debounce so filtering doesn't happen every millisecond
        function debounce(fn, threshold) {
            var timeout;
            threshold = threshold || 100;
            return function debounced() {
                clearTimeout(timeout);
                var args = arguments;
                var _this = this;

                function delayed() {
                    fn.apply(_this, args);
                }
                timeout = setTimeout(delayed, threshold);
            };
        }
    }




});
