function normalgoUrl() {
    var oBtn = document.getElementById("normal-kensaku-btn");
    var oTxt = document.getElementById("normal-txt");
    var myValue = oTxt.value;
    myValue = myValue.replace(/\s+/g, "-");
    myValue = myValue.replace(
        /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
    myValue = myValue.replace(/\-+/g, "-");
    if (myValue == null || myValue == "") {
        url = "/";
        window.location.href = url;
    } else {
        url = "/en/search/" + myValue;
        window.location.href = url;
    }
};

function normalgetKey(e) {
    var oBtn = document.getElementById("normal-kensaku-btn");
    var oTxt = document.getElementById("normal-txt");
    var myValue = oTxt.value;
    myValue = myValue.replace(/\s+/g, "-");
    myValue = myValue.replace(
        /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
    myValue = myValue.replace(/\-+/g, "-");
    var keynum;
    if (window.event) {
        keynum = e.keyCode
    } else {
        if (e.which) {
            keynum = e.which
        }
    }
    if (keynum == 13) {
        if (myValue == null || myValue == "") {
            url = "/";
            window.location.href = url;
        } else {
            url = "/en/search/" + myValue;
            window.location.href = url;
        }
    }
};