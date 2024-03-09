// Déplacement de la barre verticale
function deplacementBarreVerticale(event) {
	var largeurDemiEcran = Math.round(window.innerWidth/2);
	var positionActuelle = event.clientX;
	var positionDansLaDiv = positionActuelle - largeurDemiEcran + (localStorage.getItem("largeurImage")/2);
	//On vérifie que le pointeur souris est bien dans le cadre
	if ((positionDansLaDiv<=localStorage.getItem("largeurImage")) && (positionDansLaDiv>=0)) {
		// On déplace la barre verticale
		barreVerticale.style.left = positionDansLaDiv - 4 + 'px';
		// On adapte la largeur de l'image filtrée
		imageDeplacement.style.width = localStorage.getItem("largeurImage") - positionDansLaDiv + 'px';
	}
}

// Fonction permettant de récupérer une image déposée en drag-and-drop
function deposeImage(ev){
	ev.preventDefault();
	// Cas où on dépose plus d'un fichier
	if (ev.dataTransfer.files.length>1) {
		messageDerreur.innerHTML = "Veuillez ne déposer qu'un seul fichier !";
		messageDerreur.style.visibility = 'visible';
		containerDepotFichier.style.backgroundColor='#fff';
		var icone = document.getElementById('icone_depose_fichier');
		icone.style.fontSize='48px';
		icone.style.lineHeight='48px';
	}
	else {
		var typeFichier = ev.dataTransfer.files[0].type;
		// On vérifie que le fichier est bien un format d'image accepté
		if (typeFichier=='image/jpeg' || typeFichier=='image/png' || typeFichier=='image/gif') {
			// On récupère les informations concernant l'image transmise par l'utilisateur : URL, largeur, hauteur, 
			var ImageEnvoyee = ev.dataTransfer.files[0];
			var CheminFichierLocalImage = window.URL.createObjectURL(ImageEnvoyee);
			var typeLocalImage = ImageEnvoyee.type;
			var tailleLocalImage =  ImageEnvoyee.size;
			var img = new Image();
			img.src = CheminFichierLocalImage;
			// On charge l'image
			img.onload = function() {
				var largeurImage = this.naturalWidth;
				var hauteurImage = this.naturalHeight;
				// On refuse les images trop grandes
				if ((largeurImage>4000) || (hauteurImage>4000)) {
					messageDerreur.innerHTML = 'La taille de votre image dépasse la taille autorisée.';
					messageDerreur.style.visibility = 'visible';
					containerDepotFichier.style.backgroundColor='#fff';
					var icone = document.getElementById('icone_depose_fichier');
					icone.style.fontSize='48px';
					icone.style.lineHeight='48px';
				}
				else {
					// Ne plus avoir le message d'erreur dans le cas d'une réussite à la suite d'une erreur
					messageDerreur.style.visibility = 'hidden';
					// Dimensionner le cadre pour la nouvelle image, récupérer les informations dans les données locales pour les utiliser par la suite, afficher l'image
					var dimensionsCadre = calculeDimensionsCadre(largeurImage,hauteurImage);
					localStorage.setItem("largeurImageOrigine",largeurImage);
					localStorage.setItem("hauteurImageOrigine",hauteurImage);
					localStorage.setItem("largeurImage",dimensionsCadre[0]);
					localStorage.setItem("hauteurImage",dimensionsCadre[1]);
					localStorage.setItem("cheminImage",CheminFichierLocalImage);
					localStorage.setItem("typeImage",typeLocalImage);
					localStorage.setItem("tailleImage",tailleLocalImage);
					redimensionnerCadre(dimensionsCadre[0],dimensionsCadre[1]);
					containerDepotFichier.style.visibility = 'hidden';
					imageOrigine.style.width = dimensionsCadre[0];
					imageOrigine.style.height = dimensionsCadre[1];
					imageOrigine.style.backgroundImage = 'url(' + CheminFichierLocalImage + ')';
					imageOrigine.style.backgroundSize = dimensionsCadre[0] + 'px ' + dimensionsCadre[1] + 'px';
					imageOrigine.style.visibility = 'visible';
					zoneFiltres.style.visibility = 'visible';
					zoneFiltres.style.opacity = '0.9';
					reinitialiserAppli.style.visibility = 'visible';
					reinitialiserAppli.style.left = '6%';
					// On place l'image dans le canvas pour pouvoir l'utiliser ultérieurement
					var canvas = document.getElementById('canvas');
					canvas.width = largeurImage;
					canvas.height = hauteurImage;
					var context = canvas.getContext('2d');
					var img = new Image();
					img.src = CheminFichierLocalImage;
					img.onload = function() {
						context.drawImage(img,0,0);
					};
					localStorage.setItem("nomEtape","imageOrigineChargee");
				}
			}
		}
	}
}

// Effet lors du passage d'un fichier au-dessus de la zone de dépot
function survoleZone(ev) {
	ev.preventDefault();
	containerDepotFichier.style.backgroundColor='#eee';
	var icone = document.getElementById('icone_depose_fichier');
	icone.style.fontSize='60px';
	icone.style.lineHeight='60px';
}

// Retour à la normale lorsqu'on quitte la zone de dépot
function quitteZone(ev) {
	ev.preventDefault();
	containerDepotFichier.style.backgroundColor='#fff';
	var icone = document.getElementById('icone_depose_fichier');
	icone.style.fontSize='48px';
	icone.style.lineHeight='48px';
}

// On redimensionne et on recentre le cadre selon la largeur et la hauteur du cadre interne
function redimensionnerCadre(largeurCadre,hauteurCadre) {
	var lg = parseInt(largeurCadre) + 24;
	var ht = parseInt(hauteurCadre) + 24;
	containercadre.style.width = lg + 'px';
	containercadre.style.height = ht + 'px';
	containercadre.style.top = 'calc(50% - ' + Math.round(hauteurCadre/2) + 'px + 50px - 20px);';
	containercadre.style.left = 'calc(50% - ' + Math.round(largeurCadre/2) + 'px - 20px)';
}

// On calcule les dimensions maximales du cadre affiché
// en prévoyant une taille maximale par défaut de 800 par 450 au format 16/9
function calculeDimensionsCadre(largeurImg,hauteurImg) {
	if (largeurImg < 800 && hauteurImg < 450) {
		localStorage.setItem("largeurImage", largeurImg);
		localStorage.setItem("hauteurImage", hauteurImg);
		return [largeurImg,hauteurImg];
	}
	else {
		if (16/9 < largeurImg/hauteurImg ) {
			return [800,Math.round(800*hauteurImg/largeurImg)];
		}
		else {
			return [Math.round(450*largeurImg/hauteurImg),450];
		}
	}
}

//On affiche l'aide dans un cadre de 800 par 450 en format 16/9 pour recouvrir tous les autres cadres si nécessaire
function afficheLaide() {
	redimensionnerCadre(800,450);
	document.getElementById('zone_aide').style.visibility = 'visible';
}

//On ferme l'aide en redimensionnant à la taille précédente sauvegardée localement
function fermeLaide() {
	var dimensionsCadre = calculeDimensionsCadre(localStorage.getItem("largeurImage"),localStorage.getItem("hauteurImage"));
	redimensionnerCadre(dimensionsCadre[0],dimensionsCadre[1]);
	document.getElementById('zone_aide').style.visibility = 'hidden';
}

// On affiche un exemple
function MontreUnExemple() {
	localStorage.setItem("largeurTemporaire",localStorage.getItem("largeurImage"));
	localStorage.setItem("hauteurTemporaire",localStorage.getItem("hauteurImage"));
	localStorage.setItem("largeurImage",800);
	localStorage.setItem("hauteurImage",450);
	redimensionnerCadre(800,450);
	imageOrigine.style.backgroundImage = 'url(./images/exemple.png)';
	imageDeplacement.style.backgroundImage = 'url(./images/exemple_filtre_gris.png)';
	imageOrigine.style.zIndex = 1001;
	imageOrigine.style.backgroundSize = '800px 450px';
	imageDeplacement.style.zIndex = 1002;
	imageDeplacement.style.backgroundSize = '800px 450px';
	imageOrigine.style.width = '800px';
	imageOrigine.style.height = '450px';
	imageDeplacement.style.width = '400px';
	imageDeplacement.style.height = '450px';
	imageOrigine.style.visibility = 'visible';
	imageDeplacement.style.visibility = 'visible';
	barreVerticale.style.left = '396px';
	barreVerticale.style.visibility = 'visible';
	document.getElementById('fermeture_exemple').style.visibility = 'visible';
	barreVerticale.style.zIndex = 1003;
	document.getElementById('texte_exemple').style.visibility = 'visible';
}

// On ferme l'exemple, il faut retrouver l'étape précédente et la restaurer
function fermeLexemple() {
	localStorage.setItem("largeurImage",localStorage.getItem("largeurTemporaire"));
	localStorage.setItem("hauteurImage",localStorage.getItem("hauteurTemporaire"));
	imageOrigine.style.zIndex = 1;
	imageDeplacement.style.zIndex = 2;
	barreVerticale.style.zIndex = 4;
	document.getElementById('fermeture_exemple').style.visibility = 'hidden';
	document.getElementById('texte_exemple').style.visibility = 'hidden';
	redimensionnerCadre(localStorage.getItem("largeurImage"),localStorage.getItem("hauteurImage"));
	switch (localStorage.getItem("nomEtape")) {
		case "depart":
			imageOrigine.style.visibility = 'hidden';
			imageDeplacement.style.visibility = 'hidden';
			barreVerticale.style.visibility = 'hidden';
		break;
		case "imageOrigineChargee":
			var canvas = document.getElementById('canvas');
			var context = canvas.getContext('2d');
			var img = new Image();
			img.src = canvas.toDataURL('image/png');
			img.onload = function (){
				imageOrigine.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
				imageOrigine.style.backgroundSize = localStorage.getItem("largeurImage") + 'px ' + localStorage.getItem("hauteurImage") + 'px';
				imageOrigine.style.width = localStorage.getItem("largeurImage") + 'px';
				imageOrigine.style.height = localStorage.getItem("hauteurImage") + 'px';
			}
			imageDeplacement.style.visibility = 'hidden';
			barreVerticale.style.visibility = 'hidden';
		break;
		case "deuxImages":
			var canvas = document.getElementById('canvas');
			var context = canvas.getContext('2d');
			var img = new Image();
			img.src = canvas.toDataURL('image/png');
			img.onload = function (){
				imageOrigine.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
				imageOrigine.style.width = localStorage.getItem("largeurImage") + 'px';
				imageOrigine.style.height = localStorage.getItem("hauteurImage") + 'px';
				imageOrigine.style.backgroundSize = localStorage.getItem("largeurImage") + 'px ' + localStorage.getItem("hauteurImage") + 'px';
			}
			var canvasfiltre = document.getElementById('canvasfiltre');
			var contextfiltre = canvasfiltre.getContext('2d');
			var imgfiltre = new Image();
			imgfiltre.src = canvasfiltre.toDataURL('image/png');
			imgfiltre.onload = function (){
				imageDeplacement.style.backgroundImage = 'url(' + canvasfiltre.toDataURL('image/png') + ')';
				imageDeplacement.style.backgroundSize = localStorage.getItem("largeurImage") + 'px ' + localStorage.getItem("hauteurImage") + 'px';
				imageDeplacement.style.width = Math.round(localStorage.getItem("largeurImage")/2) + 'px';
				imageDeplacement.style.height = localStorage.getItem("hauteurImage") + 'px';
			}
			barreVerticale.style.left = 'calc(50% - 4px)';
		break;
		default:
		break;
	}
}

//On affiche les crédits dans un cadre de 800 par 450 en format 16/9 pour recouvrir tous les autres cadres si nécessaire
function MontreLesCredits() {
	redimensionnerCadre(800,450);
	document.getElementById('zone_credit').style.visibility = 'visible';
}

//On ferme les crédits en redimensionnant à la taille précédente sauvegardée localement
function fermeLecredit() {
	var dimensionsCadre = calculeDimensionsCadre(localStorage.getItem("largeurImage"),localStorage.getItem("hauteurImage"));
	redimensionnerCadre(dimensionsCadre[0],dimensionsCadre[1]);
	document.getElementById('zone_credit').style.visibility = 'hidden';
}

//On réinitialise l'application en rechargeant la page
function reinitialiserApp() {
	window.location.reload();
}

// On ouvre ou on ferme la liste des filtres couleurs
function ouvrefermeCouleurs() {
	if (localStorage.getItem("ouvrefermecouleurs") == 'ferme') {
		localStorage.setItem("ouvrefermemiroir",'ferme');
		blocFiltreMiroir.classList.remove('voir');
		blocFiltreMiroir.classList.add('cacher');
		titreFiltreMiroir.innerHTML="<span class='icomoon'>&#xe900;</span> Miroir";
		localStorage.setItem("ouvrefermeflou",'ferme');
		blocFiltreAutres.classList.remove('voir');
		blocFiltreAutres.classList.add('cacher');
		titreFiltreAutres.innerHTML="<span class='icomoon'>&#xe900;</span> Autres";
		localStorage.setItem("ouvrefermecouleurs",'ouvert');
		blocFiltreCouleurs.classList.remove('cacher');
		blocFiltreCouleurs.classList.add('voir');
		titreFiltreCouleurs.innerHTML="<span class='icomoon'>&#xe901;</span> Couleurs";
	}
	else {
		localStorage.setItem("ouvrefermecouleurs",'ferme');
		blocFiltreCouleurs.classList.remove('voir');
		blocFiltreCouleurs.classList.add('cacher');
		titreFiltreCouleurs.innerHTML="<span class='icomoon'>&#xe900;</span> Couleurs";
	}
}

// On ouvre ou on ferme la liste des filtres miroir
function ouvrefermeMiroir() {
	if (localStorage.getItem("ouvrefermemiroir") == 'ferme'){
		localStorage.setItem("ouvrefermecouleurs",'ferme');
		blocFiltreCouleurs.classList.remove('voir');
		blocFiltreCouleurs.classList.add('cacher');
		titreFiltreCouleurs.innerHTML="<span class='icomoon'>&#xe900;</span> Couleurs";
		localStorage.setItem("ouvrefermeflou",'ferme');
		blocFiltreAutres.classList.remove('voir');
		blocFiltreAutres.classList.add('cacher');
		titreFiltreAutres.innerHTML="<span class='icomoon'>&#xe900;</span> Autres";
		localStorage.setItem("ouvrefermemiroir",'ouvert');
		blocFiltreMiroir.classList.remove('cacher');
		blocFiltreMiroir.classList.add('voir');
		titreFiltreMiroir.innerHTML="<span class='icomoon'>&#xe901;</span> Miroir";
	}
	else {
		localStorage.setItem("ouvrefermemiroir",'ferme');
		blocFiltreMiroir.classList.remove('voir');
		blocFiltreMiroir.classList.add('cacher');
		titreFiltreMiroir.innerHTML="<span class='icomoon'>&#xe900;</span> Miroir";
	}
}

// On ouvre ou on ferme la liste des autres filtres
function ouvrefermeAutres() {
	if (localStorage.getItem("ouvrefermeflou") == 'ferme'){
		localStorage.setItem("ouvrefermecouleurs",'ferme');
		blocFiltreCouleurs.classList.remove('voir');
		blocFiltreCouleurs.classList.add('cacher');
		titreFiltreCouleurs.innerHTML="<span class='icomoon'>&#xe900;</span> Couleurs";
		localStorage.setItem("ouvrefermemiroir",'ferme');
		blocFiltreMiroir.classList.remove('voir');
		blocFiltreMiroir.classList.add('cacher');
		titreFiltreMiroir.innerHTML="<span class='icomoon'>&#xe900;</span> Miroir";
		localStorage.setItem("ouvrefermeflou",'ouvert');
		blocFiltreAutres.classList.remove('cacher');
		blocFiltreAutres.classList.add('voir');
		titreFiltreAutres.innerHTML="<span class='icomoon'>&#xe901;</span> Autres";
	}
	else {
		localStorage.setItem("ouvrefermeflou",'ferme');
		blocFiltreAutres.classList.remove('voir');
		blocFiltreAutres.classList.add('cacher');
		titreFiltreAutres.innerHTML="<span class='icomoon'>&#xe900;</span> Autres";
	}
}

//Juste pour faire apparaitre la tache noire au démarrage et poser les variables locales
function afficheBlocAide() {
	containerAide.style.opacity = '0.8';
	localStorage.setItem("etape", 0);
	localStorage.setItem("nomEtape", "depart");
	localStorage.setItem("largeurImage", 600);
	localStorage.setItem("hauteurImage", 450);
	localStorage.setItem("largeurImageOrigine", 600);
	localStorage.setItem("hauteurImageOrigine", 450);
	localStorage.setItem("ouvrefermecouleurs", "ferme");
	localStorage.setItem("ouvrefermemiroir", "ferme");
	localStorage.setItem("ouvrefermeflou", "ferme");
}

//On applique un des filtres
function filtreApplique(filtre) {
	// On cache la zone de sélection des filtres et on affiche les deux boutons valider ou refuser le filtre
	zoneFiltres.style.opacity = '0';
	boutonRefusFiltre.classList.remove('cacher');
	boutonRefusFiltre.classList.add('voir');
	boutonValideFiltre.classList.remove('cacher');
	boutonValideFiltre.classList.add('voir');

	// On se place dans les 2 canvas : image d'origine et création de l'image filtrée
	var canvas = document.getElementById('canvas');
	var canvasfiltre = document.getElementById('canvasfiltre');
	canvasfiltre.width = localStorage.getItem('largeurImageOrigine');
	canvasfiltre.height = localStorage.getItem('hauteurImageOrigine');
	
	// On récupère le contexte 2d du canvas et du canvas filtré
	var context = canvas.getContext('2d');
	var contextfiltre = canvasfiltre.getContext('2d');
	
	// On récupère les datas du canvas
	var imageData = context.getImageData(0, 0,canvas.width,canvas.height);
	var data = imageData.data;
	switch (filtre) {
		case 'gris':
			for (var i = 0; i < data.length; i += 4) {
				var moy = (data[i] + data[i + 1] + data[i + 2]) / 3;
				data[i]     = moy; // rouge
				data[i + 1] = moy; // vert
				data[i + 2] = moy; // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'sepia':
			for (var i = 0; i < data.length; i += 4) {
				rouge = 0.393 * data[i] + 0.769 * data[i + 1] + 0.189 * data[i + 2];
				vert = 0.349 * data[i] + 0.686 * data[i + 1] + 0.168 * data[i + 2];
				bleu = 0.272 * data[i] + 0.534 * data[i + 1] + 0.131 * data[i + 2];
				if (rouge > 255) {data[i] = 255;} else {data[i] = rouge} // rouge
				if (vert > 255) {data[i + 1] = 255;} else {data[i + 1] = vert} // vert
				if (bleu > 255) {data[i + 2] = 255;} else {data[i + 2] = bleu} // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'rouge':
			for (var i = 0; i < data.length; i += 4) {
				data[i + 1] = 0; // vert
				data[i + 2] = 0; // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'vert':
			for (var i = 0; i < data.length; i += 4) {
				data[i] = 0; // rouge
				data[i + 2] = 0; // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'bleu':
			for (var i = 0; i < data.length; i += 4) {
				data[i] = 0; // rouge
				data[i + 1] = 0; // vert
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'rose':
			for (var i = 0; i < data.length; i += 4) {
				data[i] = 255; // rouge
				data[i + 2] = 255; // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'inversion':
			for (var i = 0; i < data.length; i += 4) {
				data[i] = 255 - data[i]; // rouge
				data[i + 1] = 255 - data[i + 1]; // vert
				data[i + 2] = 255 - data[i + 2]; // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'horizontal':
			var monImage = new Image();
			monImage.src = canvas.toDataURL('image/png');
			monImage.onload = function() {
				contextfiltre.scale(-1, 1);
				contextfiltre.translate(-canvas.width,0);
				contextfiltre.drawImage(monImage, 0, 0);
			}
		break;
		case 'vertical':
			var monImage = new Image();
			monImage.src = canvas.toDataURL('image/png');
			monImage.onload = function() {
				contextfiltre.scale(1, -1);
				contextfiltre.translate(0,-canvas.height);
				contextfiltre.drawImage(monImage, 0, 0);
			}
		break;
		case 'floufaible':
			/**
			// Script personnel initial fonctionnel mais trop gourmand en ressources : beaucoup trop lent
			var mesCoordonees = coordoneesData(data,canvas.width,canvas.height);
			for (var x=0; x<canvas.width-1; x++){
				for (var y=0; y<canvas.height-1; y++){
					var rouge = 0;
					var vert = 0;
					var bleu= 0;
					var transparence = 0;
					var decompte =0;
					for (var xpixel=x-1; xpixel<x+1; xpixel++){
						for (var ypixel=y-1; ypixel<y+1; ypixel++){
							if (xpixel>=0 && xpixel<canvas.width && ypixel>=0 && ypixel<canvas.height) {
								rouge += mesCoordonees[xpixel][ypixel][0];
								vert += mesCoordonees[xpixel][ypixel][1];
								bleu += mesCoordonees[xpixel][ypixel][2];
								transparence += mesCoordonees[xpixel][ypixel][3];
								decompte++;
							}
						}
					}
				data[y*canvas.width*4+x*4] = rouge/decompte;
				data[y*canvas.width*4+x*4+1] = vert/decompte;
				data[y*canvas.width*4+x*4+2] = bleu/decompte;
				data[y*canvas.width*4+x*4+3] = transparence/decompte;
				}
			}
			**/
			var monImageFloue = new Image();
			monImageFloue.src = canvas.toDataURL('image/png');
			monImageFloue.onload = function() {
				contextfiltre.filter = 'blur(2px)';
				contextfiltre.drawImage(monImageFloue, 0, 0);
			}			
		break;
		case 'flouaccentue':
			var monImageAccent = new Image();
			monImageAccent.src = canvas.toDataURL('image/png');
			monImageAccent.onload = function() {
				contextfiltre.filter = 'blur(6px)';
				contextfiltre.drawImage(monImageAccent, 0, 0);
			}	
		break;
		case 'pixellisation':
			var cotePixel = 40;
			var mesCoordonees = coordoneesData(data,canvas.width,canvas.height);
			var zoneLargeur = canvas.width/cotePixel;
			var zoneHauteur = canvas.height/cotePixel;
			var zoneCote = Math.round(Math.min(zoneLargeur,zoneHauteur));
			var x =0;
			while (x<canvas.width){
				var y =0;
				while (y<canvas.height){
					var rouge = 0;
					var vert = 0;
					var bleu= 0;
					var transparence = 0;
					var i = 0;
					for (var xZone = x ; xZone<x+zoneCote ; xZone++){
						for (var yZone = y ; yZone<y+zoneCote ; yZone++){
							if (xZone<canvas.width-1 && yZone<canvas.height-1) {
								rouge += mesCoordonees[xZone][yZone][0];
								vert += mesCoordonees[xZone][yZone][1];
								bleu += mesCoordonees[xZone][yZone][2];
								transparence += mesCoordonees[xZone][yZone][3];
								i++;
							}
						}
					}
					contextfiltre.fillStyle = 'rgba(' + Math.round(rouge/i) + ',' + Math.round(vert/i) + ',' + Math.round(bleu/i) + ',' + Math.round(transparence/i) + ')';
					contextfiltre.fillRect(x,y,zoneCote,zoneCote);
					y = y + zoneCote;
				}
			x = x + zoneCote;
			}
		break;
		case 'assombrir':
			for (var i = 0; i < data.length; i += 4) {
				data[i]     = Math.round(data[i]*0.8); // rouge
				data[i + 1] = Math.round(data[i + 1]*0.8); // vert
				data[i + 2] = Math.round(data[i + 2]*0.8); // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		case 'eclaircir':
			for (var i = 0; i < data.length; i += 4) {
				data[i]     = Math.round(Math.min(data[i]*1.15,255)); // rouge
				data[i + 1] = Math.round(Math.min(data[i + 1]*1.15,255)); // vert
				data[i + 2] = Math.round(Math.min(data[i + 2]*1.15,255)); // bleu
			}
			contextfiltre.putImageData(imageData, 0, 0);
		break;
		default:
		break;
	}
	
	
	var imgfiltree = new Image();
	// Reprendre les datas du canvas filtre
	imgfiltree.src = canvasfiltre.toDataURL('image/png');
	imgfiltree.onload = function() {
		// Effet d'apparition des deux boutons par opacity qui passe de 0 à 1
		boutonRefusFiltre.style.opacity = '1';
		boutonValideFiltre.style.opacity = '1';
		// On cache la zone des filtres
		zoneFiltres.style.visibility = 'hidden';
		
		// Passer sur le canvas filtré
		imageDeplacement.style.backgroundImage = 'url(' + canvasfiltre.toDataURL('image/png') + ')';
		// On affiche la demi-image filtrée à droite du cadre
		imageDeplacement.style.width = localStorage.getItem("largeurImage")/2 + 'px';
		imageDeplacement.style.height = localStorage.getItem("hauteurImage") + 'px';
		// La dimension de l'image de fond doit être égale à celle du cadre
		imageDeplacement.style.backgroundSize = localStorage.getItem("largeurImage") + 'px ' + localStorage.getItem("hauteurImage") + 'px';
		imageDeplacement.style.visibility = 'visible';
		// On affiche la barre verticale au milieu
		barreVerticale.style.left = 'calc(50% - 4px)';
		barreVerticale.style.visibility = 'visible';
		// On affiche le bouton de téléchargement
		boutonEnregistreImage.style.transition = 'opacity 1.5s ease';
		boutonEnregistreImage.style.opacity = '0';
		boutonEnregistreImage.classList.remove('voir');
		boutonEnregistreImage.classList.add('cacher');
		localStorage.setItem("nomEtape","deuxImages");
	}
}

// On crée un tableau en trois dimensions dans lequel on met les valeurs colorimetriques des pixels selon leurs coordonnées
function coordoneesData(data,largeur,hauteur) {
	coordonees_data = new Array(largeur-1);
	for (var x = 0; x<largeur-1; x++){
		coordonees_data[x] = new Array(hauteur-1);
		for (var y=0; y<hauteur-1; y++) {
			coordonees_data[x][y] = [data[y*largeur*4+x*4],data[y*largeur*4+x*4+1],data[y*largeur*4+x*4+2],data[y*largeur*4+x*4+3]];
		}
	}
	return coordonees_data;
}

// On refuse le filtre et revient a l'étape ou l'on séléctionne un filtre
function refuserFiltre(){
	barreVerticale.style.visibility = 'hidden';
	imageDeplacement.style.visibility = 'hidden';
	zoneFiltres.style.visibility = 'visible';
	boutonRefusFiltre.style.opacity = '0';
	boutonValideFiltre.style.opacity = '0';
	zoneFiltres.style.opacity = '1';
	boutonRefusFiltre.classList.remove('voir');
	boutonRefusFiltre.classList.add('cacher');
	boutonValideFiltre.classList.remove('voir');
	boutonValideFiltre.classList.add('cacher');
	// On affiche ou pas le bouton de téléchargement
	if (localStorage.getItem("etape")==1){
		boutonEnregistreImage.classList.remove('cacher');
		boutonEnregistreImage.classList.add('voir');
		boutonEnregistreImage.style.transition = 'opacity 1.5s ease';
		boutonEnregistreImage.style.opacity = '1';
	}
	localStorage.setItem("nomEtape","imageOrigineChargee");
}

// On valide le filtre
function validerFiltre(){
	// On met le canvas filtré à la place du canvas d'origine
	var canvas = document.getElementById('canvas');
	var canvasfiltre = document.getElementById('canvasfiltre');
	var context = canvas.getContext('2d');
	var contextfiltre = canvasfiltre.getContext('2d');
	var imageData = contextfiltre.getImageData(0, 0,canvasfiltre.width,canvasfiltre.height);
	context.putImageData(imageData, 0, 0);
	var img = new Image();
	img.src = canvas.toDataURL('image/png');
	img.onload = function (){
		imageOrigine.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
	}
	// On revient à l'étape où l'on peut séléctionner un filtre
	barreVerticale.style.visibility = 'hidden';
	imageDeplacement.style.visibility = 'hidden';
	zoneFiltres.style.visibility = 'visible';
	boutonRefusFiltre.style.opacity = '0';
	boutonValideFiltre.style.opacity = '0';
	zoneFiltres.style.opacity = '1';
	boutonRefusFiltre.classList.remove('voir');
	boutonRefusFiltre.classList.add('cacher');
	boutonValideFiltre.classList.remove('voir');
	boutonValideFiltre.classList.add('cacher');
	// On affiche le bouton de téléchargement
	boutonEnregistreImage.classList.remove('cacher');
	boutonEnregistreImage.classList.add('voir');
	boutonEnregistreImage.style.transition = 'opacity 1.5s ease';
	boutonEnregistreImage.style.opacity = '1';
	localStorage.setItem("etape",1);
	localStorage.setItem("nomEtape","imageOrigineChargee");
}

function enregistrerFichier() {
    // nom du fichier pour l'enregistrement
    const nomFile = "image.png";
    // récup. de l'élément <canvas>
    const canvas = document.getElementById('canvas');
    let dataImage;
    // pour IE et Edge c'est simple !!!
    // https://technet.microsoft.com/en-us/windows/hh771732(v=vs.60)
    if (canvas.msToBlob) {
      // crée un objet blob contenant le dessin du canvas
      dataImage = canvas.msToBlob();
      // affiche l'invite d'enregistrement
      window.navigator.msSaveBlob(dataImage, nomFile);
    }
    else {
      // création d'un lien HTML5 download
      const lien = document.createElement("A");
      // récup. des data de l'image
      dataImage = canvas.toDataURL("image/png");
      // affectation d'un nom à l'image
      lien.download = nomFile;
      // modifie le type de données
      dataImage = dataImage.replace("image/png", "image/octet-stream");
      // affectation de l'adresse
      lien.href = dataImage;
      // ajout de l'élément
      document.body.appendChild(lien);
      // simulation du click
      lien.click();
      // suppression de l'élément devenu inutile
      document.body.removeChild(lien);
    }
}
