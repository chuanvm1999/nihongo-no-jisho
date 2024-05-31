japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth / 235) * 109}px;`);

$(window).resize(function () {
    japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth / 235) * 109}px;`);
});

function translateInView() {
    if (inputJp.value) {
        japaneseWrapper.innerHTML = "";
        kanjiWrapper.style.display = "none";
        findInput = inputJp.value;
        const regex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]|[0-9!.,:;ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz、。！]/g
        findInput = typeTrans ? chuyenSo(findInput).match(regex).join('') : findInput;
        translate(findInput).then((res) => {
            let data = removeDuplicatesByItem1(res[0]);
            japaneseReading.innerHTML = `<div class="ps-1 text-start"> - ${data.slice(-1).pop().slice(-1).pop()}</div>`;
            vietnameseMean.innerHTML = `<div class="ps-1 text-start vnst"> - ${data.filter(item => item[1] != null).map(item => item[0]).join(' ')}</div>`;
            japaneseReadingHira.innerHTML = `<div class="ps-1 text-start"> - ${typeTrans ? getTalkingWord(findInput) : getTalkingWord(vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', ''))}</div>`;
            drawKanji(typeTrans ? findInput : vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', ''), "japanese-wrapper", btnListJapanese);
            drawJp = typeTrans ? findInput : vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', '');
        });
    } else {
        japaneseReading.innerHTML = "";
        vietnameseMean.innerHTML = "";
        japaneseReadingHira.innerHTML = "";
        japaneseWrapper.innerHTML = "";
    }
}

inputJp.addEventListener("input", debounce(translateInView, 300));

//JLPT
selectJLPT.addEventListener("change", function () {
    japaneseJLPT.innerHTML = "";
    let jlpt = selectJLPT.value;
    if (jlpt > 0) {
        kanjiWrapper.style.display = "none";
        japaneseJLPT.innerHTML = '';
        japaneseJLPT.style.display = "block";
        japaneseSearch.style.display = "none";
        japaneseSearchDraw.style.display = "none";

        let data = kanjiDataJSON.filter(item => item.level && item.level.includes(`N${jlpt}`)).map(item => `<h5 class="kanji border">${item.kanji}</h5>`).join('');
        japaneseJLPT.innerHTML = data;
        japaneseJLPT.querySelectorAll('.kanji').forEach(item => {
            item.addEventListener('click', () => {
                kanjiWrapper.style.display = "block";
                meanKanji(item.innerHTML);
                findInput = item.innerHTML;
                drawKanjiWord.innerHTML = "";
            });
        });
    } else {
        japaneseJLPT.style.display = "none";
        japaneseSearch.style.display = "block";
        japaneseSearchDraw.style.display = "block";
        japaneseWrapper.style.display = "block";
        translateInView();
    }
});


window.speechSynthesis.onvoiceschanged = function () {
    window.speechSynthesis.getVoices();
};

//Đọc
inputReading.addEventListener('click', () => { textToSpeech() });

inputJp.focus();

function toggleTrans() {
    typeTrans = $(this).prop('checked');
    langFrom.innerHTML = typeTrans ? "日本語 - Tiếng Nhật" : "ベトナム語 - Tiếng Việt";
    langTo.innerHTML = typeTrans ? "ベトナム語 - Tiếng Việt" : "日本語 - Tiếng Nhật";

    let txtFrom = vietnameseMean.querySelector(".vnst") ? vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ', '') : '';

    vietnameseMean.innerHTML =  '';
    japaneseReading.innerHTML = '';
    japaneseReadingHira.innerHTML = '';
    inputJp.value = txtFrom;
    findInput = txtFrom;
    translateInView();
}

$(function () {
    $('#toggle-trans').change(debounce(toggleTrans, 300))
})



function chuyenSo(str) {
    return str.replace(/[０-９]/g, function (match) {
        return String.fromCharCode(match.charCodeAt(0) - 65248);
    });
}


