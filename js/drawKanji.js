function drawKanji(kanji, element,btnList) {
    var dmak = new Dmak(kanji, { 'element': element, "stroke": { "attr": { "stroke": "#FF0000" } }, "uri": "https://kanjivg.tagaini.net/kanjivg/kanji/" });

    var p = document.getElementById(btnList.back);
    p.onclick = function () {
        dmak.eraseLastStrokes(1);
    };
    var s = document.getElementById(btnList.stop);
    s.onclick = function () {
        dmak.pause();
    };
    var g = document.getElementById(btnList.play);
    g.onclick = function () {
        dmak.render();
    };
    var n = document.getElementById(btnList.next);
    n.onclick = function () {
        dmak.renderNextStrokes(1);
    };
    var r = document.getElementById(btnList.reset);
    r.onclick = function () {
        dmak.erase();
    };
}