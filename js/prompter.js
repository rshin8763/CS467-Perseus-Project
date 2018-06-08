
class Prompter{
    constructor(Perseus){
        this.Perseus = Perseus;
        this.TTL = 0;
        this.x = 400;
        this.y = 64;
        this.textPrompt = null;
        this.style = { font: "24px Times New Roman", fill: "#ffffff", align: "center"};
    }

    drawToScreen(text, TTL, color = '#ffffff'){
        this.TTL = TTL;
        this.style.fill = color;
        this.textPrompt = this.Perseus.game.add.text(this.x, this.y, text,
                this.style);
        this.textPrompt.fixedToCamera = true;
        this.Perseus.gui.add(this.textPrompt);
    }

    update(){
        if (this.TTL == 0) {
            this.textPrompt.destroy();
        }
        else {
            this.TTL--;
        }
    }
}
export {Prompter}
