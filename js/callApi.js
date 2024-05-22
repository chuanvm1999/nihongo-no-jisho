
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


async function fetchData(wordFind) {
  const requestData = {
    dict: 'javi',
    type: 'word',
    query: wordFind,
    limit: 20,
    page: 1
  };

  try {
    const response = await axios.post('https://mazii.net/api/search', requestData, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'vi,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7,en;q=0.6',
        'Content-Type': 'application/json',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Cookie': 'Your-Cookie-Value', // Thay bằng giá trị cookie thực tế của bạn
        'Referer': 'https://mazii.net/vi-VN/search/word/javi/%E8%A1%8C%E5%8B%95%E5%8A%9B%E5%9F%BA%E6%9C%AC%E5%8B%95%E4%BD%9C',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });

    console.log('Dữ liệu đã được nhận:',response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu:', error);
  }
}
