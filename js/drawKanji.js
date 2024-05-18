
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
    meanings.innerHTML = '';
    onReading.innerHTML = '';
    kunReading.innerHTML = '';
    kanjiWrapper.innerHTML = '';
}

function findKanji(str) {
    var kanjiRegex = /[\u4e00-\u9faf]/g;
    var kanjiMatches = str.match(kanjiRegex);
    if (!kanjiMatches) {
        return [];
    }
    return kanjiMatches;
}

 function cardKanji(kanji) {
    kanjiWrapper.innerHTML = `<div class="card" style="width: 18rem;">
    <div id="sekai-card" class="text-center"></div>
    <div class="card-body text-center">
    <button class="btn bg-danger" id="ss">STOP</button>
    <button class="btn bg-warning" id="pp">BACK</button>
    <button class="btn bg-success" id="nn">NEXT</button>
    <button class="btn bg-primary" id="rr">RESET</button>
    <button class="btn bg-info" id="gg">PLAY</button>
        <h5 class="card-title">Card title</h5>
        <div class="row">
        <div class="col px-1 on"></div>
        <div class="col px-1 kun"></div>
        </div>
    </div>
    </div>`;
    let dm = new Dmak(kanji, { 'element': "sekai-card", "stroke": { "attr": { "stroke": "#FF0000" } }, "uri": "https://kanjivg.tagaini.net/kanjivg/kanji/" });
    var p = kanjiWrapper.getElementsByClassName("bg-warning")[0];
    p.onclick = function () {
        dm.eraseLastStrokes(1);
    };
    var s = kanjiWrapper.getElementsByClassName("bg-danger")[0];
    s.onclick = function () {
        dm.pause();
    };
    var g = kanjiWrapper.getElementsByClassName("bg-info")[0];
    g.onclick = function () {
        dm.render();
    };
    var n = kanjiWrapper.getElementsByClassName("bg-success")[0];
    n.onclick = function () {
        dm.renderNextStrokes(1);
    };
    var r = kanjiWrapper.getElementsByClassName("bg-primary")[0];
    r.onclick = function () {
        dm.erase();
    };
    axios.get(url + word + kanji).then((response)=>{
        const data = response.data;
        kanjiWrapper.querySelector(".on").innerHTML = '<h5>音読み - onyomi</h5>' + data.kun_readings.map(element => {
            return `<div>${element}</div>`;
        }).join('');
        axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=jp&tl=vi&hl=hl&q=${encodeURIComponent(data.heisig_en)}`)
        .then(res => {
            const data = res.data;
            kanjiWrapper.querySelector(".card-title").innerHTML += `<div>${data[0][0][0]}</div>`;
        });
        kanjiWrapper.querySelector(".card-title").innerHTML = '<h2>意味 - Nghĩa: </h2>';

        kanjiWrapper.querySelector(".kun").innerHTML = '<h5>訓読み - kunyomi</h5>' + data.on_readings.map(element => {
            return `<div>${element}</div>`;
        }).join('');
    });
   

    

   
}