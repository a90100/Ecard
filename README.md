# Imitate Dcard
模仿 Dcard 部分功能製作出的網站，可讓人建立帳號發表文章
## Demo
https://imitate-dcard.herokuapp.com/index

## 畫面功能截圖
### 開始畫面，點擊左側欄可選擇分類文章，在上方搜尋欄可用關鍵字搜尋文章標題
![](https://i.imgur.com/mN3bW9w.png)

## 登入與註冊
登入

![](https://i.imgur.com/bkAY8Gi.png)

註冊

![](https://i.imgur.com/mK8Rtkx.png)

## 個人資訊頁，可編輯和刪除文章
![](https://i.imgur.com/SPd4rcH.png)

## 單篇文章，包含留言板
![](https://i.imgur.com/BsaJmfD.png)

## 編輯和發布文章
![](https://i.imgur.com/vxvBR54.png)

## 功能
1. 可註冊及登入帳號
2. 可發表/編輯/刪除自己的文章
3. 可對文章進行留言
4. 左側欄可以觀看特定類別文章
5. 可利用標題搜尋特定文章

## 本作品使用主要技術
* Pug
* Sass
* Bootstrap
* Node.js
* Express.js
* Firebase

## command
啟動應用程式: npm start
啟動 gulp: gulp watch

## 解決 firebase 重複 register:
"firebase": "^6.4.1",
"firebase-admin": "^8.1.0",

firebase 版本改成6.4.1
