japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth / 235) * 109}px;`);

$(window).resize(function () {
    japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth / 235) * 109}px;`);
});

//search
formSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    japaneseWrapper.innerHTML = "";
    kanjiWrapper.style.display = "none";
    findInput = inputJp.value;
    japaneseReadingHira.innerHTML = `<div class="ps-1 text-start"> - ${getTalkingWord(findInput)}</div>`;

    translate(findInput).then((res) => {
        // vietnameseMean.innerHTML = res[5][0][2].map(element => {
        //     return `<div class="ps-1 text-start"> - ${element[0]}</div>`;
        // }).join('');
        let data = removeDuplicatesByItem1(res[0]);
        // console.log(data);
        // vietnameseMean.innerHTML = `<div class="ps-1 text-start"> - ${res[0][0][0]}</div>`;
        japaneseReading.innerHTML = `<div class="ps-1 text-start"> - ${data.slice(-1).pop().slice(-1).pop()}</div>`;
        vietnameseMean.innerHTML = `<div class="ps-1 text-start vnst"> - ${data.filter(item => item[1] != null).map(item => item[0]).join(' ')}</div>`;
        drawKanji(typeTrans ? findInput : vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ',''), "japanese-wrapper", btnListJapanese);
    });
});

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
        japaneseWrapper.innerHTML = '';
    }
});


window.speechSynthesis.onvoiceschanged = function () {
    window.speechSynthesis.getVoices();
};

//Đọc
inputReading.addEventListener('click', () => { textToSpeech() });

inputJp.focus();

$(function() {
    $('#toggle-trans').change(function() {
        typeTrans = $(this).prop('checked');
        langFrom.innerHTML = typeTrans ? "日本語 - Tiếng Nhật" : "ベトナム語 - Tiếng Việt";
        langTo.innerHTML = typeTrans ? "ベトナム語 - Tiếng Việt" : "日本語 - Tiếng Nhật";

        let txtFrom = vietnameseMean.querySelector(".vnst").innerHTML.replace(' - ','');
        let txtTo = inputJp.value;

        vietnameseMean.innerHTML = `<div class="ps-1 text-start vnst"> - ${txtTo}</div>`;
        inputJp.value = txtFrom;
        btnFormSubmit.click();
    })
  })