class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.title = '';
        this.text = '';
        this.id = '';

        this.$formContainer = document.querySelector(".form-container")
        this.$form = document.querySelector(".input-form")
        this.$formBtn = document.querySelector(".form-buttons")
        this.$formCloseBtn = document.querySelector(".form-close-btn")
        this.$formTitle = document.querySelector(".form-title")
        this.$formText = document.querySelector(".form-text")
        this.$formSubmit = document.querySelector(".form-submit-btn")
        this.$modal = document.querySelector(".modal")
        this.$modalTitle = document.querySelector(".modal-title")
        this.$modalText = document.querySelector(".modal-text")
        this.$modalCloseBtn = document.querySelector(".modal-close-button")
        this.$notes = document.querySelector(".notes")
        this.$toolbarColor = document.querySelector(".toolbar-color")
        this.$toolbarDelete = document.querySelector(".toolbar-delete")
        this.$colorToolTip = document.querySelector(".color-tooltip")
        this.addEventListener()
    }

    addEventListener() {
        this.render()
        document.body.addEventListener("click", event => {
            this.handleFormClick(event)
            this.selectNote(event)
            this.openModal(event)
            this.deleteNote(event)
        })

        document.body.addEventListener("mouseover", event => {
            this.openTool(event)
        })

        document.body.addEventListener("mouseout", event => {
            this.closeTool(event)
        })

        this.$colorToolTip.addEventListener("mouseover", function() {
            this.style.display = "flex"
        })

        this.$colorToolTip.addEventListener("mouseout", function() {
            this.style.display = "none"
        })

        this.$colorToolTip.addEventListener("click", event=>{
            const color = event.target.dataset.color
            if(color) {
                this.editNoteColor(color)
            }
        })

        this.$formSubmit.addEventListener("click", event => {
            event.preventDefault()
            const title = this.$formTitle.value;
            const text = this.$formText.value
            const hasNote = title || text
            if(hasNote) {
                this.addNote({title, text})
            }
        })
        this.$modalCloseBtn.addEventListener("click", (event)=>{
            this.closeModal(event)
        })

        this.$formCloseBtn.addEventListener("click", event => {
            const title = this.$formTitle.value
            const text = this.$formText.value
            const hasNote = title || text
            if(hasNote) {
                this.addNote({title, text})
            }
            this.closeForm()            
        })
    }

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target)
        const title = this.$formTitle.value
        const text = this.$formText.value
        const hasNote = title || text
        if(isFormClicked) {
            this.openForm()
        } else if(hasNote) {
            this.addNote({title, text})
        }
        else {
            this.closeForm()
        }
    }

    openForm() {
        this.$formTitle.style.display = "block";
        this.$formBtn.style.display = "block"
        this.$formContainer.classList.add("form-open")
    }

    closeForm() {
        this.$formTitle.style.display = "none";
        this.$formBtn.style.display = "none"
        this.$formContainer.classList.remove("form-open")
        this.$formTitle.value = ""
        this.$formText.value = ""
    }

    openModal(event) {
        if(event.target.matches(".toolbar-delete")) return
        console.log("event")
        if(event.target.closest(".note")) {
            this.$modal.classList.toggle("open-modal")
            this.$notes.classList.toggle("notes-hide")
            this.$modalTitle.value = this.title
            this.$modalText.value = this.text
        }

    }

    closeModal(event) {
        this.editNote()
        this.$modal.classList.toggle("open-modal")
        this.$notes.classList.toggle("notes-hide")
    }

    openTool(event) {
        if(!event.target.matches(".toolbar-color")) return
        this.id = event.target.dataset.id;
        const noteCoords = event.target.getBoundingClientRect();
        const horizontal = noteCoords.left;
        const vertical = noteCoords.bottom;
        console.log("scroll ", window.scrollY, " vertical ", noteCoords.bottom)
        this.$colorToolTip.style.transform = `translate(${horizontal}px, ${vertical}px)`
        this.$colorToolTip.style.display = "flex"
    }

    closeTool(event) {
        if(!event.target.matches(".toolbar-color")) return;
        this.$colorToolTip.style.display = "none"
    }

    editNoteColor(color) {
        this.notes = this.notes.map(note => 
            note.id === Number(this.id) ? {...note, color} : note
        )
        this.render()
    }

    selectNote(event) {
        const $selectedNote = event.target.closest(".note")
        if(!$selectedNote) return;
        const [$noteTitle, $noteText] = $selectedNote.children
        this.title = $noteTitle.textContent
        this.text = $noteText.textContent
        this.id = $selectedNote.dataset.id
    }

    editNote() {
        const title = this.$modalTitle.value
        const text = this.$modalText.value
        
        this.notes = this.notes.map(note => 
            note.id === Number(this.id) ? {...note, title, text} : note  
        )
        this.render()
    }

    addNote({title, text}) {
        const newNote = {
            title,
            text,
            color: "white",
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id+1 : 1
        }

        this.notes = [...this.notes, newNote]
        this.render()
        this.closeForm()
    }

    deleteNote(event) {
        event.stopPropagation()
        if(!event.target.matches(".toolbar-delete"))  return
        const id = event.target.dataset.id
        this.notes = this.notes.filter(note => note.id !== +id)
        this.render()
    }

    render() {
        this.saveNote()
        this.displayNote()
    }

    saveNote() {
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }

    displayNote() {
        this.$notes.innerHTML = this.notes.map(note => (
            `<div style="background: ${note.color};" class="note" data-id="${note.id}">
                <div class="${note.title && "note-title"}">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <i data-id=${
                            note.id
                        } class="fas fa-palette toolbar-color"></i>
                        <i data-id=${
                            note.id
                        } class="fas fa-trash toolbar-delete"></i>
                    </div>
                </div>
            </div>
            `
        )).join("")
    }
}

new App()