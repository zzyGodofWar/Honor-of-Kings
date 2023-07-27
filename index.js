var SearchBox =  document.querySelector("#in-text");
var SearchBtn =  document.querySelector("#btn-text");
var DivContent = document.getElementsByClassName("content-box")[0];
var HeroList = new Array();
var HeroSet = {};

const defaultCardDOMData = '<p class="hname"></p><p class="hskin"></p><input class="btn-switch" type="button" value="看牛"/><input class="btn-switch" type="button"/ value="看菜"><img src="" />'

class HeroData{
	constructor(name){
		this.name = name;
		this.skinList = new Array();
	}
	
	addSkin(skin,season,idx){
		let obj = new Object();
		obj.skin = skin;
		obj.season = season;
		obj.idx = idx;
		if(null == skin){
			this.skinList.unshift(obj);
		}else{
			this.skinList.push(obj);
		}
	}
}

function InitImageData(){
	var tmpList;
	var idx=0;
	var tname,tskin;
	for(let fi=0;fi<pic_name_data.length;fi++){
		tmpList = pic_name_data[fi].split("/");
		for(let fn=0;fn<tmpList.length;fn++){
			//console.log(GetHeroName(tmpList[fn])+" - " + GetHeroSkin(tmpList[fn]));
			tname = GetHeroName(tmpList[fn]);
			tskin = GetHeroSkin(tmpList[fn]);
			if(undefined == HeroSet[tname]){
				HeroList.push(new HeroData(tname));
				HeroSet[tname] = idx++;
			}
			HeroList[HeroSet[tname]].addSkin(tskin,fi+1,fn+1);
		}
	}
	
	for(let fi=0;fi<HeroList.length;fi++){
		//console.log(HeroList[fi]);
	}
	
}

function GetHeroName(htext){
	if(htext.indexOf("-")==-1){
		return htext;
	}
	return htext.slice(0,htext.indexOf("-"));
}

function GetHeroSkin(htext){
	if(htext.indexOf("-")==-1){
		return null;
	}
	return htext.slice(htext.indexOf("-")+1);
}

function SearchHero(tname){
	let rdata = new Array();
	let fullmatch = -1;
	let cnt;
	if(undefined != HeroSet[tname]){
		fullmatch = HeroSet[tname];
		rdata.push(fullmatch);
	}
	for(let fi=0;fi<HeroList.length;fi++){
		cnt = HeroList[fi].name.indexOf(tname);
		if(cnt!=-1 && fi != fullmatch){
			rdata.push(fi);
		}
	}
	return rdata;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function SwitchBackground(idx){
	if(idx == -1 || undefined == idx){
		idx = getRndInteger(1,pic_background_count);
	}
	let bgDiv = document.querySelector(".web-background");
	bgDiv.style.backgroundImage = 'url("./image/background/' + idx + '.jpg")';
}

function UIAddNewCard(heroidx,heroskin){
	if(!(heroidx>=0 && heroidx < HeroList.length)){
		return;
	}
	if(heroskin == null || heroskin == undefined){
		heroskin = 0;
	}
	if(!(heroskin>=0 && heroskin < HeroList[heroidx].skinList.length)){
		return;
	}
	
	let tmp = document.createElement("div");
	let tsdata = HeroList[heroidx].skinList[heroskin];
	
	tmp.className="showbox";
	tmp.setAttribute("data", heroidx+"-"+tsdata.season+"-"+tsdata.idx);
	tmp.innerHTML = defaultCardDOMData;
	DivContent.appendChild(tmp);
	let nodechild = tmp.childNodes;
	nodechild[0].innerHTML = HeroList[heroidx].name;
	nodechild[1].innerHTML = tsdata.skin == null?"初始":tsdata.skin;
	nodechild[2].addEventListener("click",EventNiu);
	nodechild[3].addEventListener("click",EventCai);
	nodechild[4].src = "./image/" + tsdata.season + "/"+ tsdata.season +"-"+ tsdata.idx +"-1.jpg";
}

function UIAddHeroAllCard(heroidx){
	if(!(heroidx>=0 && heroidx < HeroList.length)){
		return;
	}
	
	
	for(let heroskin=0;heroskin<HeroList[heroidx].skinList.length;heroskin++){
		let tmp = document.createElement("div");
		let tsdata = HeroList[heroidx].skinList[heroskin];
	
		tmp.className="showbox";
		tmp.setAttribute("data", heroidx+"-"+tsdata.season+"-"+tsdata.idx);
		tmp.innerHTML = defaultCardDOMData;
		DivContent.appendChild(tmp);
		let nodechild = tmp.childNodes;
		nodechild[0].innerHTML = HeroList[heroidx].name;
		nodechild[1].innerHTML = tsdata.skin == null?"初始":tsdata.skin;
		nodechild[2].addEventListener("click",EventNiu);
		nodechild[3].addEventListener("click",EventCai);
		nodechild[4].src = "./image/" + tsdata.season + "/"+ tsdata.season +"-"+ tsdata.idx +"-1.jpg";
		
	}
}

function EventNiu(){
	let data = this.parentNode.getAttribute("data");
	data = data.split("-");
	if(data.length!=3){
		return;
	}
	let nodechild = this.parentNode.childNodes;
	nodechild[4].src = "./image/" + data[1] + "/"+ data[1] +"-"+ data[2] +"-1.jpg";
}

function EventCai(){
	let data = this.parentNode.getAttribute("data");
	data = data.split("-");
	if(data.length!=3){
		return;
	}
	let nodechild = this.parentNode.childNodes;
	nodechild[4].src = "./image/" + data[1] + "/"+ data[1] +"-"+ data[2] +"-2.jpg";
}

var lastSearch = "";
SearchBtn.onclick = function(){
	let stext = SearchBox.value.replace(/ /g, "");
	if(lastSearch == stext){
		return;
	}
	lastSearch = stext;
	DivContent.innerHTML = "";
	if(stext == ""){
		for(let fi=0;fi<HeroList.length;fi++){
			UIAddHeroAllCard(fi);
		}
		return;
	}
	let sresult = SearchHero(stext);
	if(sresult.length == 0){
		DivContent.innerHTML = "<h2>没有找到对应的结果！</h2>";
		return;
	}
	for(let fi=0;fi<sresult.length;fi++){
		UIAddHeroAllCard(sresult[fi]);
	}
}


console.log(HeroList.length);

SwitchBackground();
InitImageData();


for(let fi=0;fi<HeroList.length;fi++){
	UIAddHeroAllCard(fi);
}