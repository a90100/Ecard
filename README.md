# Imitate Dcard
模仿 Dcard 部分功能製作出的網站，可讓人建立帳號發表文章
## Demo
https://imitate-dcard.herokuapp.com/index

## 部分畫面功能截圖
### 開始畫面
![](https://i.imgur.com/miD6HRK.png)

## 登入與註冊
![](https://i.imgur.com/za9JJlN.png)

## 個人資訊頁
![](https://i.imgur.com/dYrsYC5.png)

## 單篇文章
![](https://i.imgur.com/sHvOvbf.png)

## 編輯文章
![](https://i.imgur.com/rC0239C.png)

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

## 注意
由於這個公開 side project 不包括 firebase 金鑰等重要資訊，所以 clone 下來不會順利運作，主要是放給面試官看程式碼用

## 解決 firebase 重複 register:
"firebase": "^6.4.1",
"firebase-admin": "^8.1.0",

firebase 版本改成6.4.1