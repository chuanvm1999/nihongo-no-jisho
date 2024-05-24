japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth /235) * 109}px;`);

$(window).resize(function () {
    japaneseWrapper.setAttribute("style", `width: ${Math.floor(window.innerWidth / 235) * 109}px;`);
});
drawKanji("私", "draw-kanji", btnListKanji);
drawKanji("今朝も私12", "japanese-wrapper", btnListJapanese);