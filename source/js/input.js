const formContent = document.getElementById('formContent');

formContent.addEventListener('keyup', function(e) {
    if(e.key === 'Enter') {
        formContent.value += '↵';
    }
})