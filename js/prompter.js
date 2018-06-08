
class Prompter{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.TTL = -1;
        this.x = 400;
        this.y = 64;
        this.textPrompt = null;
        this.style = { font: "24px Times New Roman", fill: "#ffffff", align: "center"};
    }

    drawToScreen(text, TTL, color = '#ffffff'){
        this.TTL = TTL;
        this.style.fill = color;
        if (this.textPrompt) this.textPrompt.destroy();
        this.textPrompt = this.Perseus.game.add.text(this.x, this.y, text, this.style);
        this.textPrompt.fixedToCamera = true;
        this.Perseus.gui.add(this.textPrompt);
    }

    clearText(){
        if (this.textPrompt)
            this.textPrompt.destroy();
        this.TTL = -1;
    }

    update(){
        if (this.TTL == 0) {
            this.clearText();
        }
        else if (this.TTL > 0){
            this.TTL--;
        }
    }
}
export {Prompter}
