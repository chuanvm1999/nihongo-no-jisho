
function drawKanji(kanji) {
    var dmak = new Dmak(kanji, { 'element': "sekai", "stroke": { "attr": { "stroke": "#FF0000" } }, "uri": "https://kanjivg.tagaini.net/kanjivg/kanji/" });
    var p = document.getElementById("p");
    p.onclick = function () {
        dmak.eraseLastStrokes(1);
    };
    var s = document.getElementById("s");
    s.onclick = function () {
        dmak.pause();
    };
    var g = document.getElementById("g");
    g.onclick = function () {
        dmak.render();
    };
    var n = document.getElementById("n");
    n.onclick = function () {
        dmak.renderNextStrokes(1);
    };
    var r = document.getElementById("r");
    r.onclick = function () {
        dmak.erase();
    };    
}

function removeKanji() {
    document.getElementById('sekai').innerHTML = '';
}
