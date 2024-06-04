//draw kanji
function drawKanji(kanji, element, btnList) {
    var dmak = new Dmak(kanji, { 'element': element, "stroke": { "attr": { "stroke": "#FF0000" } }, "uri": "https://kanjivg.tagaini.net/kanjivg/kanji/" });
    btnDmak(dmak,btnList);
    return dmak;
}

//button dmak
function btnDmak(dmak,btnList) {
    var p = document.getElementById(btnList.back);
    p.onclick = function () {
        dmak.pause();
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
        dmak.pause();
        dmak.renderNextStrokes(1);
    };
    var r = document.getElementById(btnList.reset);
    r.onclick = function () {
        dmak.pause();
        dmak.erase();
    };
}

//translate with GG-api
async function translate(q) {
    const tl = typeTrans ? 'vi' : 'ja';
    const sl = typeTrans ? 'ja' : 'vi';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=${sl}&tl=${tl}&hl=hl&q=${encodeURIComponent(q)}`;

    try {
        const response = await axios.get(url);
        flagTrans = null;

        return response.data;
    } catch (error) {
        console.error('Error:', error);
        flagTrans = null;

        return null;
    }

}

//find kanji in string
function findKanji(str) {
    var kanjiRegex = /[\u4e00-\u9faf]/g;
    var kanjiMatches = str.match(kanjiRegex);
    if (!kanjiMatches) {
        return [];
    }
    return kanjiMatches;
}

function isSubstringOfAnyOtherWord(word, data) {
    return data.some(item => item.word !== word && item.word.includes(word));
}

//get hiragana of string
function getTalkingWord(input) {
    // Lọc các đối tượng có words xuất hiện trong input
    let filteredData = wordDataJSON.filter(item => input.includes(item.word));
    // Lọc các đối tượng có words không phải là một phần của từ khác
    filteredData = filteredData.filter(item => !isSubstringOfAnyOtherWord(item.word, filteredData));

    let replacedInput = input;
    filteredData.forEach(item => {
        const regex = new RegExp(item.word, 'g'); // Tạo biểu thức chính quy để thay thế tất cả các lần xuất hiện
        replacedInput = replacedInput.replace(regex, item.phonetic);
    });

    return replacedInput.replace('.', '');
}

//get mean kanji and show
function meanKanji(kanji) {
    kanjiWrapper.style.display = "block";
    drawKanjiWord.innerHTML = '';
    dmakKanji = drawKanji(kanji, "draw-kanji", btnListKanji);
    dmakKanji.options.step = speedDmarkKanji.value;
    let _kanjiDetail = findDetailKanji(kanji);
    kanjiMean.innerHTML = "";
    kanjiMean.innerHTML = _kanjiDetail.mean ? _kanjiDetail.mean.map(item => `<div>${item}</div>`).join(' ') : "";
    kanjiOnyomi.innerHTML = "";
    kanjiOnyomi.innerHTML = _kanjiDetail.on ? _kanjiDetail.on.map(item => `<div>${item}</div>`).join(' ') : "";
    kanjiKunyomi.innerHTML = "";
    kanjiKunyomi.innerHTML = _kanjiDetail.kun ? _kanjiDetail.kun.map(item => `<div>${item}</div>`).join(' ') : "";
    kanjiDetail.innerHTML = "";
    kanjiDetail.innerHTML = _kanjiDetail.detail ? _kanjiDetail.detail.split('##').map(item => `<div class="ps-2 text-start"> - ${item}</div>`).join(' ') : "";
}

//find detail of kanji
function findDetailKanji(kanji) {
    return kanjiDataJSON.find(item => item.kanji == kanji);
}

function textToSpeech() {
    const text = typeTrans ? inputJp.value : vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', '');
    const msg = new SpeechSynthesisUtterance();
    msg.text = getTalkingWord(text);

    // Chọn giọng nói phù hợp với ngôn ngữ (nếu có)
    const voices = window.speechSynthesis.getVoices();
    for (let voice of voices) {
        if (voice.lang === "ja-JP") {
            msg.voice = voice;
            break;
        }
    }

    window.speechSynthesis.speak(msg);
}

function removeDuplicatesByItem1(array) {
    const uniqueItems = [];
    const checker = new Set();

    array.forEach(item => {
        const item1 = item[1];
        const key = JSON.stringify(item1);
        if (!checker.has(key)) {
            checker.add(key);
            uniqueItems.push(item);
        }
    });

    return uniqueItems;
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

//translate input and show
async function translateInView() {
    if (inputJp.value) {
        japaneseWrapper.innerHTML = "";
        kanjiWrapper.style.display = "none";
        findInput = inputJp.value;
        const regex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]|[0-9!.,:;ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz、。！]/g
        flagTrans = flagTrans ? flagTrans : await translate(findInput);
        let data = flagTrans[0];
        japaneseReading.innerHTML = `<div class="ps-1 text-start"> - ${data.slice(-1).pop().slice(-1).pop()}</div>`;
        vietnameseMean.innerHTML = `<div class="ps-1 text-start vnst"> - ${data.filter(item => item[1] != null).map(item => item[0]).join(' ')}</div>`;
        japaneseReadingHira.innerHTML = `<div class="ps-1 text-start"> - ${typeTrans ? getTalkingWord(findInput) : getTalkingWord(vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', ''))}</div>`;
        let drawInput = typeTrans ? chuyenSo(findInput).match(regex).join('') : vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', '');
        dmakWord = drawKanji(drawInput, "japanese-wrapper", btnListJapanese);
        dmakWord.options.step = speedDmarkWord.value;
        drawJp = typeTrans ? findInput : vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', '');
        loading.style.display = "none";
        flagTrans = null;
    } else {
        japaneseReading.innerHTML = "";
        vietnameseMean.innerHTML = "";
        japaneseReadingHira.innerHTML = "";
        japaneseWrapper.innerHTML = "";
        loading.style.display = "none";
    }
}

//change another number to the word number
function chuyenSo(str) {
    return str.replace(/[０-９]/g, function (match) {
        return String.fromCharCode(match.charCodeAt(0) - 65248);
    });
}

//change the language translation
function toggleTrans() {
    loading.style.display = "block";
    typeTrans = $(this).prop('checked');
    langFrom.innerHTML = typeTrans ? "日本語 - Tiếng Nhật" : "ベトナム語 - Tiếng Việt";
    langTo.innerHTML = typeTrans ? "ベトナム語 - Tiếng Việt" : "日本語 - Tiếng Nhật";

    let txtFrom = vietnameseMean.querySelector(".vnst") ? vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', '') : '';

    vietnameseMean.innerHTML = '';
    japaneseReading.innerHTML = '';
    japaneseReadingHira.innerHTML = '';
    inputJp.value = txtFrom;
    findInput = txtFrom;
    translateInView();
}