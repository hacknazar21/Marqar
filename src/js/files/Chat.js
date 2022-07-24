export class Chat {
    constructor(form) {
        this.form = form
        this.input = form.querySelector('input')
        this.submit = form.querySelector('button[type="submit"]')
        this.frame = this.form.parentElement.parentElement.querySelector('[data-frame]')
        console.log()
        this.currentValue = ''
        this.form.addEventListener("submit", (event) => {
            event.preventDefault()
            if (this.input.value != '') {
                this.currentValue = this.input.value
                this.showMessage('client', this.currentValue)
                this.showMessage('target', this.catchServerMessage())
            }
        })

    }
    get datetime() {
        const daysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        var date = new Date()
        var hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0)
        var minutes = (date.getMinutes() + 1) < 9 ? `0${date.getMinutes() + 1}` : (date.getMinutes() + 1)
        var period = date.getHours() >= 12 ? 'PM' : 'AM'
        const dateTemplate = `${daysNames[date.getDay()]} ${hour}:${minutes} ${period}`
        return dateTemplate
    }
    buildMessageTemplate(messageText, from) {
        return `
        <div class="chat__message ${from}">
            <div class="chat__message-text">${messageText}</div>
            <div class="chat__message-date">${this.datetime}</div>
        </div>
        `
    }
    catchServerMessage() {
        return this.currentValue
    }
    showMessage(type = 'client', messageTarget) {
        let template = this.buildMessageTemplate(messageTarget, `from-${type}`)

        this.frame.insertAdjacentHTML('beforeend', template)

        this.frame.parentElement.scrollTop = this.frame.parentElement.scrollHeight
        this.clearInput()
    }
    clearInput() {
        this.input.value = ''
    }
}