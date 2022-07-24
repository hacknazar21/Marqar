export class Copy {
    constructor(el) {
        this.hideArea = document.createElement('textarea')
        this.hideArea.style.opacity = '0'
        this.hideArea.style.position = 'absolute'
        el.insertAdjacentElement('beforeend', this.hideArea)
        this.copyBtn = el.querySelector('[button]')
        this.ref = el.querySelector('[ref]').innerText
        this.copyBtn.addEventListener('click', (event) => {
            this.hideArea.value = this.link
            this.hideArea.focus()
            this.hideArea.select()
            if (navigator.clipboard) {
                navigator.clipboard.writeText(this.hideArea.value)
                    .then(() => {
                        this.copySuccess()
                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    });
            }
            else {
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                    this.copySuccess()
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
            }
        })
    }
    get link() {
        return `${window.location.origin + this.ref}`
    }
    copySuccess() {
        const svg = this.copyBtn.innerHTML
        setTimeout(() => {
            this.copyBtn.innerHTML = svg
        }, 500)
        this.copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.75 4.75L4.75 8C4.75 8.41421 4.41421 8.75 4 8.75C3.58579 8.75 3.25 8.41421 3.25 8L3.25 4.66667C3.25 3.88426 3.88426 3.25 4.66667 3.25L11.3333 3.25C12.1157 3.25 12.75 3.88426 12.75 4.66667V11.3333C12.75 12.1157 12.1157 12.75 11.3333 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H11.25V4.75H4.75Z" fill="#0B2137"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.75 4.75V11.25L11.25 11.25V4.75H4.75ZM4.66667 3.25L11.3333 3.25C12.1157 3.25 12.75 3.88426 12.75 4.66667V11.3333C12.75 12.1157 12.1157 12.75 11.3333 12.75L4.66667 12.75C3.88426 12.75 3.25 12.1157 3.25 11.3333L3.25 4.66667C3.25 3.88426 3.88426 3.25 4.66667 3.25Z" fill="#0B2137"/>
            </svg>
        `
    }
}