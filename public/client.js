document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded');
    const outputElem = document.querySelector('.output');
    console.log(outputElem);

    if (outputElem.innerHTML !== '') {
        setTimeout(() => {
            outputElem.innerHTML = '';
        }, 6000);
    }
});
