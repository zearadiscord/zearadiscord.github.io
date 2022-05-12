function getParamList(){
    const obj = {};
    if(!location.search) return obj;
    location.search.slice(1).split('&').forEach(v=>{
        const a = v.split('=');
        obj[a[0]] = a[1];
    });
    return obj;
}
function encode(v){
    return encodeURIComponent(v);
}
function decode(v){
    return decodeURIComponent(v);
}
var h = $("<div>").appendTo($("body").css({
    "text-align": "center"
}));
$("<h1>",{text:"discord webhooker"}).appendTo(h);
var vvv = getParamList().v;
var input_webhook = addInput({
    ttl: "Webhook URL",
    placeholder: "https://discordapp.com/api/webhooks/000000000000000000/aaaaaaaaaaaaaaaaaaaaaaaaa",
    val: vvv ? decode(vvv) : null
});
var input_username = addInput({
    ttl: "名前",
    val: "captain hook"
});
var input_avatar = addInput({
    ttl: "アバター画像",
    val: ""
});
var input_text = addTextarea("発言内容");
$.get("sample.txt", function(r){
    input_text.val(r);
});
h.append("<br>");
var input_tts = addBtnToggle("tts(読み上げ)");
h.append("<br>");
addBtn("発言",function(){
    var data = {
        "username": input_username.val(),
        "avatar_url": input_avatar.val(),
        content: input_text.val(),
        tts: input_tts()
    };
    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', input_webhook.val() );
    xhr.setRequestHeader( "content-type", "application/json" );
    xhr.send(JSON.stringify(data));
});
h.append("<br><br>");
addBtn("共有リンクを作成",function(){
    var url = location.origin + location.pathname + '?v=' + encode(input_webhook.val())
    var elm = $("<input>").appendTo(output.empty()).val(url).attr({
        readonly: true
    }).on("click",function(){
        copy(elm.val());
        elm.select();
    }).css({
        backgroundColor: "#e9e9e9",
        tabIndex: -1,
        cursor: "pointer"
    });
});
var output = $("<div>").appendTo(h);
function addTextarea(placeholder){
    function shape(){
        var text = t.val();
        t.height((text.split('\n').length + 2) + "em");
    }
    var t = $("<textarea>", {
        placeholder: placeholder
    }).appendTo(h).keyup(shape).click(shape).css({
        width: "70%",
        height: "3em"
    });
    return t;
}
function addInput({ttl, val, placeholder}){
    return $("<input>").attr({
        placeholder: placeholder
    }).val(val).appendTo($("<div>",{text: ttl + ':'}).appendTo(h));
}
function addBtn(ttl, func){
    return $("<button>",{text:ttl}).click(func).appendTo(h);
}
function addBtnToggle(ttl){
    var flag = false;
    var elm = addBtn(ttl,function(){
        flag = !flag;
        check.prop("checked", flag);
        setColor();
    });
    var check = $("<input>",{type:"checkbox"}).prependTo(elm);
    function setColor(){
        elm.css("background-color", flag ? "orange" : "gray");
    }
    setColor();
    return function(){
        return flag;
    }
}
function copy(str){
    var e = document.createElement("textarea");
    e.textContent = str;
    document.body.appendChild(e);
    e.select();
    document.execCommand('copy');
    document.body.removeChild(e);
    return true;
}
