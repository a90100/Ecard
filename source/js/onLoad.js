// 將後端傳來的字串轉 html 做換行
const content = document.querySelectorAll('.content');
content.forEach(function(text) {
    text.innerText = text.innerText.replace(/↵/g, '<br>');
    text.innerText = text.innerText.replace(/&nbsp/g, ' ');
    text.innerHTML = text.innerText;
})