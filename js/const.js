const btnListKanji = {
    play: "draw-kanji-p",
    stop: "draw-kanji-s",
    next: "draw-kanji-n",
    back: "draw-kanji-b",
    reset: "draw-kanji-r",
}

const btnListJapanese = {
    play: "japanese-wrapper-p",
    stop: "japanese-wrapper-s",
    next: "japanese-wrapper-n",
    back: "japanese-wrapper-b",
    reset: "japanese-wrapper-r",
}

const japaneseWrapper = document.getElementById("japanese-wrapper");
const japaneseSearch = document.getElementById("japanese-search");
const japaneseSearchDraw = document.getElementById("japanese-search-draw");
const japaneseJLPT = document.getElementById("japanese-jlpt");
const inputJp = document.getElementById("input-Jp");
const japaneseReading = document.getElementById("japanese-reading");
const vietnameseMean = document.getElementById("vietnamese-mean");
const selectJLPT = document.getElementById("select-jlpt");
const kanjiMean = document.getElementById("kanji-mean");
const kanjiDetail = document.getElementById("kanji-detail");
const kanjiKunyomi = document.getElementById("kanji-kunyomi");
const kanjiOnyomi = document.getElementById("kanji-onyomi");
const kanjiWrapper = document.getElementById("kanji-wrapper");
const formSubmit = document.getElementById("form-submit");
const drawKanjiWord = document.getElementById("draw-kanji");
const API_KEY = "AIzaSyDDYQkYgdCzI58jiyTjfAJnL5mKRLXVTmA";
const inputReading = document.getElementById("reading");
const japaneseReadingHira = document.getElementById("japanese-reading-hira");
const langFrom = document.getElementById("sl");
const langTo = document.getElementById("tl");
const loading = document.getElementById("loading");
const speedDmarkWord = document.getElementById("speed-dmark-word");
const speedDmarkKanji = document.getElementById("speed-dmark-kanji");
const mazii = document.getElementById("mazii");
const geminiModalLabel = document.getElementById("geminiModalLabel");
const geminiContent = document.getElementById("geminiContent");
const gemini = document.getElementById("gemini");

let findInput="日本語";
let readingJapanese;
let typeTrans = true;
let drawJp;
let flagTrans = null;
let dmakWord = null;
let dmakKanji = null;