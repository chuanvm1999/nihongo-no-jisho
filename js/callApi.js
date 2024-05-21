
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

async function translate(q) {
    const tl = 'vi';
    const sl = 'auto';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=${sl}&tl=${tl}&hl=hl&q=${encodeURIComponent(q)}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        meanings.innerHTML = '<h2>意味 - Nghĩa: </h2>' + data[5][0][2].map(element => {
            return `<div>${element[0]}</div>`;
        }).join('');
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

async function callApiKanjiReading(wordFind) {
    try {
        const response = await axios.get(url + word + wordFind)
        const data = response.data
        kunReading.innerHTML = '<h5>音読み - onyomi</h5>' + data.kun_readings.map(element => {
            return `<div>${element}</div>`;
        }).join('');

        meanings.innerHTML = '<h2>意味 - Nghĩa: </h2>';

        const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&sl=jp&tl=vi&hl=hl&q=${encodeURIComponent(data.heisig_en)}`)
        const trans_data = res.data;
        meanings.innerHTML += `<div>${trans_data[0][0][0]}</div>`;

        onReading.innerHTML = '<h5>訓読み - kunyomi</h5>' + data.on_readings.map(element => {
            return `<div>${element}</div>`;
        }).join('');

    } catch (error) {
        console.log(error)
    }
}

async function callApiWordKanji(wordFind) {
    try {
        let kanjiList = findKanji(wordFind);
        let arr2 = [];
        let cardKanji = [];
        for (let j = 0; j < kanjiList.length; j++) {
            arr2.push(axios.get(url + word + kanjiList[i])
                .then(res => {

                }));
        }

        Promise.all([...arr2]).then(() => {
            kanjiWrapper.innerHTML = '';
        })

    } catch (error) {
        console.log(error)
    }
}