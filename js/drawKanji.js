function drawKanji(kanji, element, btnList) {
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

    return dmak;
}

async function translate(q) {
    const tl = 'vi';
    const sl = 'auto';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=${sl}&tl=${tl}&hl=hl&q=${encodeURIComponent(q)}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

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

function meanKanji(kanji) {
    kanjiWrapper.style.display = "block";
    drawKanjiWord.innerHTML = '';
    drawKanji(kanji, "draw-kanji", btnListKanji);
    let _kanjiDetail = findDetailKanji(kanji);
    kanjiMean.innerHTML = _kanjiDetail.mean.map(item => `<div>${item}</div>`).join(' ');
    kanjiOnyomi.innerHTML = _kanjiDetail.on.map(item => `<div>${item}</div>`).join(' ');
    kanjiKunyomi.innerHTML = _kanjiDetail.kun.map(item => `<div>${item}</div>`).join(' ');
    kanjiDetail.innerHTML = _kanjiDetail.detail.split('##').map(item => `<div class="ps-2 text-start"> - ${item}</div>`).join(' ');
}

function findDetailKanji(kanji) {
    return kanjiDataJSON.find(item => item.kanji == kanji);
}

function textToSpeech() {
    const text = inputJp.value;
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