const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

const app = express()

axios.get('https://www.ruyile.com/xuexiao/?a=3120')
    .then((response) => {
        let $ = cheerio.load(response.data)
        let a = $('.zys').text() //获取总页数
        return a
    })
    .then(a => {
        //遍历每一页
        for (let i = 1; i <= a; i++) {
            axios.get('https://www.ruyile.com/xuexiao/?a=3120&p=' + i)
                .then((res) => {
                    let school = []
                    let $ = cheerio.load(res.data) //获取当前页的html内容
                    $('.xxlb div h4').each((i, ele) => {
                        school.push($(ele).text()) //遍历每个h4标签后存入预先定义好的数组中
                    })
                    return school
                })
                .then((school) => {
                    //将每一次遍历得到的数组存入txt文件里
                    fs.appendFile('a.txt', '\n' + school + '\n', 'utf8', (err) => {
                        if (err) {
                            console.log('err')
                        }
                    })
                })
        }
    })


app.listen(3000, () => {
    console.log('server running...')
})