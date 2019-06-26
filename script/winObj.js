win=function(){
    //this._name_reg = form_1.name_reg;
    //this._links = form_1.link_reg;
};
win.prototype={
    set msg(str) {
            Mytitle.innerHTML=str;
    },
    get msg() {
            return Mytitle.innerHTML;
    },
    set html(str) {
            form_1.txt1.value=str;
    },
    get html() {
            return form_1.txt1.value;
    },
    set name(str) {
            form_1.novel_name.value=str;
    },
    get name() {
            return form_1.novel_name.value;
    },
    set url(str) {
            form_1.list_url.value=str;
    },
    get url() {
            return form_1.list_url.value;
    },
    set newPage(str) {
            form_1.new_page.value=str;
    },
    get newPage() {
            return form_1.new_page.value;
    },
    set oldPage(str) {
            form_1.old_page.value=str;
    },
    get oldPage() {
            return form_1.old_page.value;
    },
    set start(str) {
            form_1.start.value=str;
    },
    get start() {
            return form_1.start.value;
    },
    set end(str) {
            form_1.end.value=str;
    },
    get end() {
            return form_1.end.value;
    },
    set index(str) {
            form_1.index.value=str;
    },
    set progress(str) {
            form_1.progress.value=str;
    }
}
win=new win();