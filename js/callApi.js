const url = 'https://kanjiapi.dev/v1';
const grade = [
    '/kanji/grade-1',
    '/kanji/grade-2',
    '/kanji/grade-6',
    '/kanji/grade-3',
    '/kanji/grade-4',
    '/kanji/grade-5',
];
const word = '/kanji/';
function callApiKanjiList(gradeNumber) {
    axios.get(url + grade[gradeNumber - 1])
        .then(function (response) {
            const data = response.data;
            alert(data);
        })
        .catch(function (error) {
            console.log(error);
        })
}
function translate(q) {
    const tl = 'vi'; // Assuming 'en' is the default language
    const sl = 'auto';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=${sl}&tl=${tl}&hl=hl&q=${encodeURIComponent(q)}`;

    return axios.get(url)
        .then(response => {
            const data = response.data;
            document.getElementById("meanings").innerHTML = '<h2>Nghĩa: </h2>' +data[0][0][0];
            return data ? data[0][0][0] : null;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

function callApiKanjiReading(wordFind) {
    axios.get(url + word + wordFind)
        .then(function (response) {
            const data = response.data;
            console.log(response.data.kun_readings);
            document.getElementById('kun_readings').innerHTML = '<h2>on yomi</h2>' + data.kun_readings.map(element => {
                console.log(element);
                return `<div>${element}</div>`;
            });
            document.getElementById('on_readings').innerHTML = '<h2>kun yomi</h2>' +  data.on_readings.map(element => {
                return `<div>${element}</div>`;
            });
        })
        .catch(function (error) {
            console.log(error);
        })
}