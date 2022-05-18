require('dotenv').config()
if (!process.env.MONGO_URI || !process.env.DB_NAME) {
    throw new Error('Please fill env variables')
}

const axios = require('axios').default;
const cheerio = require('cherio')
const Url = require('url-parse');
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connect() {
    await client.connect();
    await client.db(process.env.DB_NAME).command({ ping: 1 });
}

async function doLoop(index) {
    const res = await axios.get(`https://myanimelist.net/topanime.php?limit=${index}`)
    const $ = cheerio.load(res.data)
    const datas = $('#content div.pb12 table.top-ranking-table tbody')
        .children('.ranking-list')
        .map((i, e) => {
            const ranking = $(e).find('.rank span').text()
            const data = $($(e).find('.title .detail').children().get(1)).find('h3 a')
            const thumb = $(e).find('.title a img').attr('data-src');
            const link = data.attr('href')
            const title = data.text()
            const id = new Url(link).pathname.split('/')[2]
            const imagePath = new Url(thumb).pathname.split('/').reverse()
            const image = `https://cdn.myanimelist.net/images/anime/${imagePath[1]}/${imagePath[0]}`
            return { link, title, thumb, ranking, _id: id, image }
        }).get()
    console.log('data = ', datas.length);
    const db = client.db(process.env.DB_NAME)
    for (const data of datas) {
        const { _id, ...setData } = data;
        await db.collection('anime').updateOne({
            _id
        }, {
            $set: setData,

        }, {
            upsert: true
        })

    }
}



async function main() {
    let index = 0
    while (index <= 20200) {
        console.log('Doing index = ' + index);
        await doLoop(index)
        index += 50
    }
    await client.close()
    process.exit(0)
}


connect().then(() => {
    main()
})